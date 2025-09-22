import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-11 rounded-3xl border border-brand-blue/15 bg-white p-10 text-center shadow-card">
      <img src="/assets/gamecam_logo_horizontal_black.png" alt="Gamecam" className="h-40 w-auto" />
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue/70">404</p>
      <h1 className="text-3xl font-bold text-brand-blue">We could not find that page. 😔</h1>
      <p className="max-w-md text-sm text-neutral-700">
        You might have mistyped the address or followed a stale link. Head back to the homepage to continue exploring
        Gamecam and all of our products.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
      >
        Return home
      </Link>
    </div>
  );
}

export default NotFoundPage;
