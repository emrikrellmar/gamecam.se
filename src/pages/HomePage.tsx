import { Link } from 'react-router-dom';
import CheckoutButton from '../components/CheckoutButton';
import AnimatedCounter from '../components/AnimatedCounter';
import { products } from '../data/products';

const stats = [
  { label: 'Products installed in countries', value: '15' },
  { label: 'Products installed in clubs globally', value: '200+' },
  { label: 'AI analyzed games', value: '44,000+' }
];

function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold leading-tight text-brand-blue sm:text-5xl">
            GameCam hardware built for every padel programme.
          </h1>
          <p className="text-lg leading-relaxed text-neutral-700">
            Combine match intelligence, automated storytelling, and adaptive training to give players and coaches
            actionable insights. Explore our products and discover how GameCam fits into your clubs roadmap.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-brand-blue/10 bg-brand-blue px-12 py-5 text-sm font-semibold text-white transition hover:bg-brand-pink"
            >
              View all of our products
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-8 py-5 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
            >
              Talk to our team
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-white p-4 shadow-card">
            <img
              src="/assets/court_with_gametraq.png"
              alt="Gamecam hardware on court"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
          <div className="grid gap-3 rounded-3xl border border-brand-blue/15 bg-white p-5 shadow-card sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue/70">{item.label}</p>
                <p className="mt-3 text-2xl font-bold text-brand-blue"><AnimatedCounter value={item.value} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {products.map((product) => (
          <article key={product.slug} className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-2xl border border-brand-blue/10 bg-neutral-50">
                <img
                  src={product.image}
                  alt={`${product.name} product photo`}
                  className="h-48 w-full bg-white object-contain p-4 sm:h-56"
                  loading="lazy"
                />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
                {product.name}
              </div>
              <h2 className="text-2xl font-semibold text-brand-blue">{product.tagline}</h2>
              <p className="text-sm leading-relaxed text-neutral-700">{product.summary}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/products/${product.slug}`}
                  className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
                >
                  Learn more
                </Link>
                <CheckoutButton
                  priceEnvKey={product.priceEnvKey}
                  label={`Buy ${product.name}`}
                  className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink"
                />
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <article className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-brand-blue">Why GameCam</h3>
          <p className="mt-2 text-sm text-neutral-700">
            Launch a connected experience across match streaming, analytics, and training. Our end-to-end platform is
            designed for clubs that value storytelling and measurable progress.
          </p>
        </article>
        <article className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h3 className="text-lg font-semibold text-brand-blue">Need a tailored rollout?</h3>
          <p className="mt-2 text-sm text-neutral-700">
            The Gamecam team can help with phased deployments, facility upgrades, and coach education so hardware and
            workflows stay aligned from day one.
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

export default HomePage;




