import { useCallback, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import CheckoutButton from '../components/CheckoutButton';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import VideoPlayer from '../components/VideoPlayer';
import { getProductBySlug } from '../data/products';

function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProductBySlug(slug) : undefined;
  const specsRef = useRef<HTMLDivElement | null>(null);
  const isShotgun = product?.slug === 'shotgun';

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
            title: 'AI INSIGHTS',
            description:
              'Meter counting, ball possession, error shots, time in transit, and zone maps/heat-maps delivered for every game.'
          },
          {
            title: 'YOUTUBE LIVESTREAMING',
            description:
              'We set up live streaming so you can broadcast events and tournaments to your YouTube channel—just like the pros.'
          },
          {
            title: 'SAVE BALL RALLY BUTTON',
            description:
              'An included TV device converts your screen into a highlight hub with instant playback directly from the courts.'
          },
          {
            title: 'OVERVIEW SALES',
            description:
              'Add and monitor a new source of income for your club and watch your revenue grow.'
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

  const handleScrollToSpecs = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    specsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="space-y-16" id="main-content" role="main" aria-label="Main content">
      <SEO
        title={`${product.name} │ GameCam`}
        description={product.summary}
        canonical={`/products/${product.slug}`}
        image={product.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: typeof window !== 'undefined' ? `${window.location.origin}${product.image}` : `https://gamecam.io${product.image}`,
          brand: {
            '@type': 'Brand',
            name: 'GameCam'
          },
          offers: {
            '@type': 'Offer',
            price: '2950.00',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/PreOrder'
          }
        }}
      />
      {/* I preload the product hero image to improve perceived speed on product pages */}
      <Helmet>
        <link rel="preload" as="image" href={product.image} />
      </Helmet>
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
              {/* Inline product image on phones: plain background; smaller for SHOTGUN */}
              <div className="lg:hidden text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className={isShotgun ? 'mx-auto h-56 w-auto object-contain' : 'mx-auto h-72 w-auto object-contain'}
                  decoding="async"
                />
              </div>
              <p className="text-base leading-relaxed text-neutral-700">{product.description}</p>
            </div>
            {/* Place the stats directly under the main text */}
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

            <div className="flex flex-wrap items-center gap-3">
              <CheckoutButton
                href={`/order/${product.slug}`}
                label={`Order ${product.name}`}
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              />
              <a
                href="#specs"
                onClick={handleScrollToSpecs}
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
      
            </div>
            {/* Removed price label chip per request */}
          </div>
          <div className="grid gap-6">
            <div className="hidden lg:flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className={isShotgun ? 'mx-auto h-[26rem] w-auto object-contain' : 'mx-auto h-[32rem] w-auto object-contain'}
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {productVideo && (
        <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
          <div className="overflow-hidden rounded-[28px] border border-brand-blue/10 bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-brand-pink/10">
            <VideoPlayer
              src={productVideo}
              preload="metadata"
              className="aspect-video w-full max-h-[540px] rounded-[24px] object-cover"
            />
          </div>
      </section>
      )}

      {product.slug === 'gametraq' && (
        <section className="grid gap-10 rounded-[36px] border border-brand-blue/15 bg-white/95 p-8 shadow-card lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-5"> 
            <h2 className="text-3xl font-semibold text-brand-blue">Players get instant dashboards after every rally</h2>
            <p className="text-sm leading-relaxed text-neutral-700">
              GAMETRAQ pairs on-court capture with a mobile experience built for coaches and players. Open the app and
              review trends, filter highlights, and share progress before the next session even starts.
            </p>
            <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-700">
              <li className="marker:text-brand-pink">Shot charts, movement heat-maps, and serve data delivered moments after the match.</li>
              <li className="marker:text-brand-pink">Bookmark rallies, tag coaching notes, and send playlists to teammates in one tap.</li>
              <li className="marker:text-brand-pink">Syncs automatically with club dashboards so staff, players, and parents see the same story.</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-[28px]">
            <img
              src="/assets/images/app_screenshots.png"
              alt="GAMETRAQ mobile app dashboards"
              className="w-full object-contain"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {product.slug === 'shotgun' && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
            <div className="overflow-hidden rounded-[28px] bg-neutral-50 p-2">
              <img
                src="/assets/images/ShotgunOnCourt.webp"
                alt="SHOTGUN unit on a padel court"
                className="h-72 w-full rounded-[24px] object-cover md:h-80"
                loading="lazy"
              />
            </div>
          </section>
          <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
            <div className="overflow-hidden rounded-[28px] bg-neutral-50 p-2">
              <img
                src="/assets/images/ShotgunOnCourt2.jpg"
                alt="SHOTGUN ball machine close-up"
                className="h-72 w-full rounded-[24px] object-cover md:h-80"
                loading="lazy"
              />
            </div>
          </section>
        </div>
      )}

        <h2 className="text-2xl font-semibold text-brand-blue">What sets {product.name} apart</h2>
      <section className="space-y-6">
        <div className={`grid gap-5 ${product.slug === 'gametraq' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {keyFeatures.map((feature) => (
            <article key={feature.title} className="rounded-3xl border border-brand-blue/15 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-brand-blue">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

        <h2 className="text-2xl font-semibold text-brand-blue">{product.name} specifications</h2>
  <section id="specs" ref={specsRef} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-brand-blue">Technical highlights</h2>
          {product.slug === 'shotgun' ? (
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <>
                <li className="flex flex-col gap-1">
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Battery</span>
                  <span>Rechargeable battery that lasts between 4-6 hours. Recharge in roughly 3 hours.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Charger</span>
                  <span>Fast wall charger included for quick turnaround.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Remote control</span>
                  <span>User-friendly remote with six hot keys for the training drill programs.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Warranty</span>
                  <span>1-year limited warranty covering materials and workmanship under normal use.</span>
                </li>
              </>
            </ul>
          ) : product.slug === 'gametraq' ? (
            <ul className="mt-4 space-y-3 text-sm text-neutral-700">
              <>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Camera and mounting kit</span>
                  <span>4K capture with a mount to capture the game from the best angle.</span> 
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Edge compute</span>
                  <span>Integrated 12-TOPS AI module with over-the-air firmware updates.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Connectivity</span>
                  <span>Dual-band Wi-Fi 6 and Gigabit Ethernet for resilient streaming and uploads.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Streaming</span>
                  <span>Native RTMP output to YouTube and Instagram with portrait and landscape support.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-brand-blue">Analytics & storage</span>
                  <span>Cloud dashboards, SMS stat delivery, and secure video archive for coaches and players.</span>
                </li>
              </>
            </ul>
          ) : (
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-neutral-700">
              {product.technicalHighlights.map((item) => (
                <li key={item} className="marker:text-brand-pink">{item}</li>
              ))}
            </ul>
          )}
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
