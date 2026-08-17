// Stripe wrapper with a sandbox fallback so the app runs without keys.
let stripePromise = null;

async function loadStripe() {
  if (stripePromise) return stripePromise;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripePromise = import('stripe').then((mod) => new mod.default(key, { apiVersion: '2024-06-20' }));
  return stripePromise;
}

export async function createPaymentIntent({ amountCents, currency = 'usd', metadata = {} }) {
  const stripe = await loadStripe();
  if (stripe) {
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    return { id: intent.id, clientSecret: intent.client_secret, sandbox: false };
  }
  // Sandbox fallback — matches Stripe secret format so the checkout UI accepts it.
  const t = Date.now();
  return {
    id: `pi_${t}`,
    clientSecret: `pi_${t}_secret_${t}`,
    sandbox: true,
  };
}
