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
              <CheckoutButton priceEnvKey={gametraq.priceEnvKey} checkoutUrl={gametraq.checkoutUrl} label="Buy GAMETRAQ" />
              <Link
                to={`/products/${gametraq.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
              >
                View product page
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
                Pro coach Pro Rodry Ovide shares tactical frameworks that shape how
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
              <CheckoutButton priceEnvKey={shotgun.priceEnvKey} checkoutUrl={shotgun.checkoutUrl} label="Buy SHOTGUN" />
              <Link
                to={`/products/${shotgun.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
              >
                View product page
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-5 text-center shadow-card">
              <img src={shotgun.image} alt={shotgun.name} className="mx-auto h-56 w-auto object-contain" />
            </div>
            <div className="rounded-3xl border border-brand-blue/15 bg-brand-pink/5 p-5 text-sm text-brand-blue">
              <p className="font-semibold">Train like never before</p>
              <p className="mt-2 text-neutral-700">
                Train with AI powered drills to perfect your game and get better than your opponents
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2">
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
