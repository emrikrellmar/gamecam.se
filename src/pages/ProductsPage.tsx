import { Link } from 'react-router-dom';
import CheckoutButton from '../components/CheckoutButton';
import { products } from '../data/products';

const stats = [
  { label: 'Installed in countries', value: '15' },
  { label: 'Installed in clubs globally', value: '200+' },
  { label: 'AI analyzed games', value: '44,000+' }
];

function ProductsPage() {
  const gametraq = products.find((product) => product.slug === 'gametraq');
  const shotgun = products.find((product) => product.slug === 'shotgun');

  return (
    <div className="space-y-16">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card sm:p-10">
          <div className="space-y-5">
            <h1 className="text-4xl font-bold leading-tight text-brand-blue sm:text-5xl">
              Smart padel hardware for clubs that coach with data.
            </h1>
            <p className="text-lg leading-relaxed text-neutral-700">
              Gamecam unites intelligent video capture with adaptive training so every court session becomes a measurable,
              shareable experience. Power up match storytelling with GAMETRAQ and accelerate player development with
              SHOTGUN.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <CheckoutButton priceEnvKey="VITE_STRIPE_PRICE_GAMETRAQ" label="Pre-order GAMETRAQ" />
            <Link
              to="/products/gametraq"
              className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
            >
              Explore products
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-white p-4 shadow-card">
            <img
              src="/assets/court_with_gametraq.png"
              alt="GAMETRAQ installed on an indoor padel court"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
          <div className="grid gap-3 rounded-3xl border border-brand-blue/15 bg-white p-5 shadow-card sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/70">{item.label}</p>
                <p className="mt-3 text-2xl font-bold text-brand-blue">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {gametraq && (
        <section className="grid gap-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-pink">
              GAMETRAQ
            </div>
            <h2 className="text-3xl font-semibold text-brand-blue">{gametraq.tagline}</h2>
            <p className="text-base leading-relaxed text-neutral-700">{gametraq.summary}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {gametraq.features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-brand-blue/10 bg-neutral-50 p-4 shadow-card">
                  <h3 className="text-sm font-semibold text-brand-blue">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-700">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <CheckoutButton priceEnvKey={gametraq.priceEnvKey} label="Secure GAMETRAQ" />
              <Link
                to={`/products/${gametraq.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
              >
                View full specs
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-5 text-center shadow-card">
              <img src={gametraq.image} alt={gametraq.name} className="mx-auto h-56 w-auto object-contain" />
            </div>
            <div className="rounded-3xl border border-brand-blue/15 bg-brand-blue/5 p-5 text-sm text-brand-blue">
              <p className="font-semibold">Trusted by elite coaching</p>
              <p className="mt-2 text-neutral-700">
                Rodry Ovide | Pro Coach coaching Paquito Navarro at the moment shares tactical frameworks that shape how
                we build analyst tools for pros.
              </p>
            </div>
          </div>
        </section>
      )}

      {shotgun && (
        <section className="grid gap-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-pink">
              SHOTGUN
            </div>
            <h2 className="text-3xl font-semibold text-brand-blue">{shotgun.tagline}</h2>
            <p className="text-base leading-relaxed text-neutral-700">{shotgun.summary}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {shotgun.features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-brand-blue/10 bg-neutral-50 p-4 shadow-card">
                  <h3 className="text-sm font-semibold text-brand-blue">{feature.title}</h3>
                  <p className="mt-2 text-sm text-neutral-700">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <CheckoutButton priceEnvKey={shotgun.priceEnvKey} label="Reserve SHOTGUN" />
              <Link
                to={`/products/${shotgun.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-5 text-center shadow-card">
              <img src={shotgun.image} alt={shotgun.name} className="mx-auto h-56 w-auto object-contain" />
            </div>
            <div className="rounded-3xl border border-brand-blue/15 bg-brand-pink/5 p-5 text-sm text-brand-blue">
              <p className="font-semibold">Seamless with GAMETRAQ</p>
              <p className="mt-2 text-neutral-700">
                Sync drills with AI match data so coaches can prescribe sessions that reinforce tactical adjustments the
                moment analysis wraps.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
        <article className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-brand-blue">Unified data workflow</h3>
          <p className="mt-2 text-sm text-neutral-700">
            Sync insights from GAMETRAQ and SHOTGUN into your club stack with open APIs and automated reporting templates
            for coaches and managers.
          </p>
        </article>
        <article className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-brand-blue">Fast onboarding support</h3>
          <p className="mt-2 text-sm text-neutral-700">
            Our hardware specialists guide installation, calibration, and staff training. Reach support any day a match
            or camp is scheduled.
          </p>
          <Link
            to="/support"
            className="mt-3 inline-flex items-center text-sm font-semibold text-brand-pink transition hover:text-brand-blue"
          >
            Visit support {'->'}
          </Link>
        </article>
      </section>
    </div>
  );
}

export default ProductsPage;
