import { useCallback } from 'react';

interface CheckoutButtonProps {
  // I can override the target URL when I want a custom destination.
  href?: string;
  label?: string;
  className?: string;
}

const defaultClassName =
  'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-pink to-brand-cyan px-6 py-3 text-sm font-semibold text-brand-white shadow-lg shadow-brand-blue/40 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-70';

function CheckoutButton({ href, label = 'Contact sales', className = defaultClassName }: CheckoutButtonProps) {
  const handleCheckout = useCallback(async () => {
    const target = href || '/support';
    // I open the target in a new tab so visitors stay on the site.
    window.open(target, '_blank', 'noopener,noreferrer');
  }, [href]);

  return (
    <button onClick={handleCheckout} className={className}>
      {label}
    </button>
  );
}

export default CheckoutButton;
