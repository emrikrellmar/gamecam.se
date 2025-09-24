import { Navigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import CheckoutButton from '../components/CheckoutButton';
import { getProductBySlug } from '../data/products';

function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;
  const specsRef = useRef<HTMLDivElement | null>(null);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const heroGradient = product.heroGradient ?? 'from-brand-blue/10 via-brand-purple/10 to-brand-pink/10';
  const productVideo =
    product.slug === 'gametraq'
      ? '/assets/videos/GAMETRAQ.mov'
      : product.slug === 'shotgun'
        ? '/assets/videos/SHOTGUN.mov'
        : undefined;
  const productDeck =
    product.slug === 'gametraq'
      ? '/assets/pdfs/GAMETRAQDECK.pdf'
      : product.slug === 'shotgun'
        ? '/assets/pdfs/SHOTGUNDECK.pdf'
        : undefined;
  const keyFeatures: { title: string; description: string }[] =
    product.slug === 'gametraq'
      ? [
          {
            title: 'AI Data Analytics, Instantly',
            description:
              'Get automatic heat-maps, shot error stats, running distance, and zone control after every game, no manual tagging needed. Just play and get an SMS with a link to the insights. Share it with your coach so he can make personified drills for you.'
          },
          {
            title: 'New Revenue Stream For Your Club',
            description:
              'Turn gameplay into income. With every match, your club earns as players unlock powerful stats and video insights. Offer smarter training, attract data-driven players, and modernize your courts, all while growing your revenue.'
          },
          {
            title: 'Built-In Streaming to YouTube & Instagram',
            description:
              'Turn your court into a content channel. GAMETRAQ streams matches live in landscape or portrait directly to your clubs YouTube or Instagram, perfect for tournaments, league play, or daily games. Just schedule and go live with one click.'
          },
          {
            title: 'Save Ball Rally Button',
            description:
              'Hit the Ball Rally Button after a great rally, and replay it instantly on the club TV. The included device turns any screen into a highlight hub where players gather, laugh, and stay longer. Build community. Boost bar sales. Celebrate the game.'
          }
        ]
      : product.slug === 'shotgun'
        ? [
            {
              title: 'Pre-Made Training Drills, because Thinking is Overrated',
              description:
                'Equipped with six pre-programmed training modes, the SHOTGUN is designed to support players at every level from beginners refining their fundamentals to professionals seeking a high-intensity challenge. With adjustable speed and power settings, your training is fully customizable. Plus, its wireless design eliminates cable clutter, ensuring a safe and uninterrupted training experience.'
            },
            {
              title: 'Dynamic Ball Feeding, because Life is Unpredictable',
              description:
                'Think you can anticipate the next shot? The SHOTGUN keeps you engaged with randomized ball placement, simulating the unpredictability of real match play, minus the questionable line calls. Uniquely engineered to vary shot height within the same drill, it sharpens footwork, increases intensity, and removes idle moments.'
            },
            {
              title: 'Reliable Like Your Favorite Racket',
              description:
                'Built to last, the SHOTGUN runs for hours across 90-plus venues with zero breakdowns and zero hassle. And if an issue ever pops up, live support Monday to Friday plus replacement units keep your training on track.'
            }
          ]
        : product.features;

  return (
    <div className="space-y-16">
      <section
        className={`relative overflow-hidden rounded-[36px] border border-brand-blue/15 bg-gradient-to-br ${heroGradient} p-[1px] shadow-card`}
      >
        <div className="pointer-events-none absolute left-[-20%] top-[-25%] h-64 w-64 rounded-full bg-white/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-35%] right-[-15%] h-72 w-72 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="relative grid gap-12 rounded-[32px] bg-white/80 p-10 backdrop-blur-lg lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-8 text-neutral-800">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue">
                Gamecam Product
              </span>
              <h1 className="text-4xl font-bold text-brand-blue sm:text-5xl">{product.name}</h1>
              <p className="text-lg leading-relaxed text-neutral-700">{product.tagline}</p>
              <p className="text-base leading-relaxed text-neutral-700">{product.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CheckoutButton
                priceEnvKey={product.priceEnvKey}
                checkoutUrl={product.checkoutUrl}
                label="Buy now"
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              />
              <a
                href="#specs"
                className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
              >
                View specifications
              </a>
              {productDeck && (
                <a
                  href={productDeck}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
                >
                  Download product deck
                </a>
              )}
              <a
                href="https://calendly.com/magnus-gamecam/new-meeting?month=2025-09"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-brand-blue/25 bg-white/70 px-6 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
              >
                Book a demo
              </a>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/80">
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
              <span>{product.priceLabel}</span>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="relative flex items-center justify-center overflow-visible rounded-[28px] border border-brand-blue/15 bg-white/90 p-6 shadow-inner">
              <div className="pointer-events-none absolute inset-3 rounded-[22px] border border-brand-blue/10" />
              <img src={product.image} alt={product.name} className="relative z-10 mx-auto h-72 w-auto object-contain" />
            </div>
            <dl className="grid gap-4 sm:grid-cols-3">
              {product.stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-brand-blue/15 bg-white/80 p-4 text-center shadow-card backdrop-blur-sm"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue/70">{item.label}</dt>
                  <dd className="mt-2 text-xl font-bold text-brand-blue">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {productVideo && (
        <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
          <div className="overflow-hidden rounded-[28px] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-brand-pink/10">
            <video
              src={productVideo}
              controls
              preload="metadata"
              className="aspect-video w-full max-h-[540px] rounded-[24px] object-cover"
            />
          </div>
        </section>
      )}

      {product.slug === 'shotgun' && (
        <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
          <div className="overflow-hidden rounded-[28px] border border-brand-blue/10 bg-neutral-50">
            <img
              src="/assets/images/SHOTGUN_on_court.webp"
              alt="SHOTGUN unit on a padel court"
              className="h-full w-full rounded-[24px] object-cover"
              loading="lazy"
            />
          </div>
        </section>
      )}

        <h2 className="text-2xl font-semibold text-brand-blue">What sets {product.name} apart</h2>
      <section className="space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          {keyFeatures.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-brand-blue/15 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-brand-blue">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

        <h2 className="text-2xl font-semibold text-brand-blue">{product.name} specifications</h2>
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
    </div>
  );
}

export default ProductPage;
