import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

routeLoader$

export default component$(() => {
  return <div>
    <h1>Thanks for your order!</h1>
    <p>
      We appreciate your business!
      If you have any questions, please email
      <a href="mailto:orders@example.com">orders@gardenai.com</a>.
    </p>
  </div>
});