const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function goToStripeCheckout({
  type,
  product,
  price,
  description,
  returnUrl,
  customerDetails,
  validFrom,
  passDefId,
  userId,
  scheduleId,
}) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/customer/create-stripe-session`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data: {
            product,
            price,
            description,
            returnUrl,
            metadata: {
              userId,
              scheduleId,
              passDefId,
              validFrom,
              customerDetails: JSON.stringify(customerDetails),
            },
          },
        }),
      }
    );

    const result = await res.json();

    if (result.confirmation === 1) {
      window.location.href = result.url; // redirects to Stripe Checkout
    } else {
      console.error('Stripe session failed', result.message);
    }
  } catch (err) {
    console.error('Error in goToStripeCheckout', err);
  }
}
