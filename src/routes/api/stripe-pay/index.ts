import { type RequestHandler } from "@builder.io/qwik-city";
import {Stripe} from 'stripe';
export const onPost:RequestHandler = async(reqEvent)=>{  
    const stripe_key = reqEvent.env.get('STRIPE_KEY');
    const webhook_secret = reqEvent.env.get('WEBHOOK_SECRET');
    const stripe = new Stripe(stripe_key);
    const body = await reqEvent.request.body;
    const buffers = [];

    // node.js readable streams implement the async iterator protocol
    //@ts-ignore
    for await (const data of body) {
      buffers.push(data);
    }
    const finalBuffer = Buffer.concat(buffers);
    const sig = reqEvent.request.headers.get('stripe-signature');
    try {
        const event = stripe.webhooks.constructEvent(finalBuffer.toString(), sig, webhook_secret)

        if (event.type === 'checkout.session.completed') {
          console.log(event)
          //do some operation here like DB updation
        }
      } catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`)
        // res.status(400).send(`Webhook Error: ${err.message}`)
        return
    }
    reqEvent.send(200,"success")
}