import { useCallback, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!publishableKey) {
    return null;
  }
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface CheckoutButtonProps {
  priceEnvKey?: string;
  checkoutUrl?: string;
  label?: string;
  className?: string;
  successUrlOverride?: string;
  cancelUrlOverride?: string;
}

const defaultClassName =
  'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-cyan px-6 py-3 text-sm font-semibold text-brand-white shadow-lg shadow-brand-blue/40 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70';

function CheckoutButton({
  priceEnvKey,
  checkoutUrl,
  label = 'Buy Now',
  className = defaultClassName,
  successUrlOverride,
  cancelUrlOverride
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (checkoutUrl) {
      setLoading(true);
      window.location.href = checkoutUrl;
      return;
    }

    if (!priceEnvKey) {
      window.console.warn('Missing Stripe price env key on CheckoutButton.');
      window.alert('Purchase configuration is not complete yet. Please contact support.');
      return;
    }

    if (!publishableKey) {
      window.alert('Stripe is not configured. Please add your publishable key.');
      return;
    }

    const env = import.meta.env as Record<string, string | undefined>;
    const priceId = env[priceEnvKey];

    if (!priceId) {
      window.console.warn(`Missing Stripe price id for env key ${priceEnvKey}`);
      window.alert('Purchase configuration is not complete yet. Please contact support.');
      return;
    }

    const stripe = await getStripe();

    if (!stripe) {
      window.alert('Stripe failed to load. Please refresh and try again.');
      return;
    }

    setLoading(true);

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      successUrl:
        successUrlOverride ||
        import.meta.env.VITE_STRIPE_SUCCESS_URL ||
        `${window.location.origin}/support?status=success`,
      cancelUrl:
        cancelUrlOverride ||
        import.meta.env.VITE_STRIPE_CANCEL_URL ||
        `${window.location.href}`
    });

    if (error) {
      window.console.error(error.message);
      window.alert('We could not redirect to checkout. Please try again.');
      setLoading(false);
    }
  }, [checkoutUrl, priceEnvKey, successUrlOverride, cancelUrlOverride]);

  return (
    <button onClick={handleCheckout} className={className} disabled={loading}>
      {loading ? 'Preparing checkout' : label}
    </button>
  );
}

export default CheckoutButton;
