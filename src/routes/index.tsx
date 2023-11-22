import { component$ } from "@builder.io/qwik";
import { server$, type DocumentHead } from "@builder.io/qwik-city";
import {Stripe} from 'stripe';
const createCheckoutSession = server$(async function() {
  const price = 10;
  const cust_email = 'customer_email@example.com'
  const stripe_key = this.env.get('STRIPE_KEY');
  if(stripe_key){
    const stripe = new Stripe(stripe_key);
    const session = await stripe.checkout.sessions.create({
      customer_email:cust_email,
      metadata:{email:cust_email},
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Product A',
            },
            unit_amount: price*100,
          },
          quantity: 1,
        },
      ],

      mode: 'payment',
      success_url: 'http://localhost:5173/payment/success',
      cancel_url: 'http://localhost:5173/payment/error',
    });
    return {code:200,message:"session created",data:{url:session.url}}
    
  }else{
    return {code:400,message:"server error"}
  }
})
export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <p>
        This is a simple example to use stripe with qwik-city app
        <br />
        <button onClick$={async()=> { 
          const resp = await createCheckoutSession() 
          if(resp.code === 200){
            window.location.href = resp.data?.url;
          }else{
            alert("Couldn't initiate the payment!, please try again!")
          }
          }}>Pay</button>
      </p>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
