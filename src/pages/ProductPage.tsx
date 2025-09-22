import { Navigate, useParams } from 'react-router-dom';
import CheckoutButton from '../components/CheckoutButton';
import { getProductBySlug } from '../data/products';

function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">Gamecam Product</p>
            <h1 className="text-4xl font-bold text-brand-blue">{product.name}</h1>
            <p className="text-lg leading-relaxed text-neutral-700">{product.tagline}</p>
            <p className="text-base leading-relaxed text-neutral-700">{product.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CheckoutButton priceEnvKey={product.priceEnvKey} label="Buy now" />
            <a
              href="#specs"
              className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
            >
              View specifications
            </a>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">{product.priceLabel}</p>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-6 text-center shadow-card">
            <img src={product.image} alt={product.name} className="mx-auto h-72 w-auto object-contain" />
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            {product.stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-brand-blue/15 bg-white p-4 text-center shadow-card">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue/70">{item.label}</dt>
                <dd className="mt-2 text-xl font-bold text-brand-blue">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand-blue">What sets {product.name} apart</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {product.features.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-brand-blue/15 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-brand-blue">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="specs" className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-brand-blue">Technical highlights</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            {product.technicalHighlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-pink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-brand-blue">Ideal for</h2>
          <ul className="mt-4 space-y-3 text-sm text-neutral-700">
            {product.useCases.map((item) => (
              <li key={item} className="rounded-2xl border border-brand-blue/10 bg-neutral-50 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-brand-blue">Ready to deploy {product.name}?</h2>
            <p className="text-sm text-neutral-700">
              Early adopters gain direct access to the Gamecam product team, dedicated onboarding, and roadmap influence.
            </p>
          </div>
          <CheckoutButton priceEnvKey={product.priceEnvKey} label="Secure your unit" />
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
