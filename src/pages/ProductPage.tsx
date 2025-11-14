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
            title: 'Live Stream',
            description:
              'Stream matches directly to your club\'s YouTube channel and let the world watch the action in real time. Build your brand, showcase your players, and bring your community to life.'
          },
          {
            title: 'Boost Your Court Revenue',
            description:
              'With GAMETRAQ 5 installed on the court, clubs simply add 5–10 € to their court rental. Players get full AI video analytics included, and clubs earn an additional 600–750 € per month per court.'
          },
          {
            title: 'Smarter Coaching',
            description:
              'Give your coaches the power of AI. Use player analytics to design personalized drills that target each player\'s strengths and weaknesses, turning every training into real progress.'
          },
          {
            title: 'Highlights',
            description:
              'With GAMETRAQ 5, players can instantly watch their best rallies and funniest fails right on the venue\'s TV free for everyone. Whether it\'s a perfect lob or a dramatic dive, the highlights are saved straight from the court.'
          }
        ]
      : product.slug === 'shotgun'
        ? [
            {
              title: 'NO THINKING NEEDED',
              description:
                'Equipped with six pre-programmed training modes, the SHOTGUN is designed to support players at every level from beginners refining their fundamentals to professionals seeking a high-intensity challenge. With adjustable speed and power settings, your training is fully customizable. Plus, its wireless design eliminates cable clutter, ensuring a safe and uninterrupted training experience.'
            },
            {
              title: 'UNPREDICTABLE BY DESIGN',
              description:
                'Think you can anticipate the next shot? SHOTGUN keeps the player engaged with randomized ball placement, simulating the unpredictability of real match play, minus the questionable line calls. Uniquely engineered to vary shot height within the same drill, it sharpens footwork, increases intensity, and removes idle moments.'
            },
            {
              title: 'BUILT TO LAST',
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
        imageAlt={`${product.name} product hero`}
        ogType="product"
        imageWidth={1200}
        imageHeight={900}
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
          sku: product.slug,
          offers: {
            '@type': 'Offer',
            price: product.slug === 'shotgun' ? '3450.00' : '0.00',
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
                  loading="lazy"
                  width={800}
                  height={600}
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
          </div>
          <div className="grid gap-6">
            <div className="hidden lg:flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className={isShotgun ? 'mx-auto h-[26rem] w-auto object-contain' : 'mx-auto h-[32rem] w-auto object-contain'}
                decoding="async"
                width={1200}
                height={900}
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
        <>
          <section className="grid gap-12 rounded-[36px] border border-brand-blue/15 bg-gradient-to-br from-brand-blue/5 via-white to-brand-purple/5 p-8 shadow-card lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div>
                <h2 className="text-3xl font-bold text-brand-blue mb-3">AI-Powered Analytics</h2>
                <p className="text-base text-neutral-600 mb-6">
                  State of the art AI camera tracking every shot and movement, creating highlight reels & game analysis. In real time - no wait after your game.
                </p>
              </div>
              
              <div className="space-y-4">
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/metercountericon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Running Distance Tracker</h3>
                    <p className="mt-1 text-sm text-neutral-700">See the total distance each player has run during the game.</p>
                  </div>
                </article>
                
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/ballpossesionicon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Ball Possession</h3>
                    <p className="mt-1 text-sm text-neutral-700">View the ball possession percentage for each player.</p>
                  </div>
                </article>
                
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/errorshoticon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Error Shot Counter</h3>
                    <p className="mt-1 text-sm text-neutral-700">Track how many mistakes or error shots each player makes.</p>
                  </div>
                </article>
              </div>
            </div>
            
            <div className="flex items-center justify-center order-1 lg:order-2">
              <img 
                src="/assets/images/app/app_screenshots.png" 
                alt="GAMETRAQ app heat maps and zone analysis" 
                className="w-full max-w-4xl drop-shadow-2xl"
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>

          <section className="grid gap-12 rounded-[36px] border border-brand-blue/15 bg-gradient-to-br from-brand-purple/5 via-white to-brand-pink/5 p-8 shadow-card lg:grid-cols-2 lg:items-center">
            <div className="flex items-center justify-center">
              <img 
                src="/assets/images/app/iphonemockup.png" 
                alt="GAMETRAQ app showing analytics" 
                className="w-full max-w-md drop-shadow-2xl"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-brand-blue mb-3">Smart Court Features</h2>
                <p className="text-base text-neutral-600 mb-6">
                  Visualize player movements with heat maps and zone analysis. Save highlight clips during play, watch replays on venue TV, and get full match recordings to share instantly.
                </p>
              </div>
              
              <div className="space-y-4">
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/zonemapicon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Zone Map</h3>
                    <p className="mt-1 text-sm text-neutral-700">Displays which players played more offensively or defensively throughout the match.</p>
                  </div>
                </article>
                
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/heatmapicon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Heat Map</h3>
                    <p className="mt-1 text-sm text-neutral-700">A graphical map showing the areas of the court each player covered the most.</p>
                  </div>
                </article>
                
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/tvicon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Watch on Venue TV</h3>
                    <p className="mt-1 text-sm text-neutral-700">Enjoy your saved rallies on the club's TV together with your friends right after the match.</p>
                  </div>
                </article>
                
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/pressbuttonicon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Save Highlights</h3>
                    <p className="mt-1 text-sm text-neutral-700">Press the button during the match to save a 30-second highlight clip of your best shots.</p>
                  </div>
                </article>
                
                <article className="flex items-center gap-4 rounded-xl bg-white/80 p-4 backdrop-blur-sm border border-brand-blue/10">
                  <img src="/assets/svg/videorecordingicon.svg" alt="" className="h-14 w-14 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-brand-blue">Full Match Recording</h3>
                    <p className="mt-1 text-sm text-neutral-700">Get the full match recorded, download the video or share it instantly on social media.</p>
                  </div>
                </article>
                
              </div>
            </div>
          </section>
        </>
      )}

      {product.slug === 'shotgun' && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
            <div className="overflow-hidden rounded-[28px] bg-neutral-50 p-2">
              <img
                src="/assets/images/products/ShotgunOnCourt.webp"
                alt="SHOTGUN unit on a padel court"
                className="h-72 w-full rounded-[24px] object-cover md:h-80"
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>
          <section className="rounded-[36px] border border-brand-blue/15 bg-white/95 p-6 shadow-card">
            <div className="overflow-hidden rounded-[28px] bg-neutral-50 p-2">
              <img
                src="/assets/images/products/ShotgunOnCourt2.jpg"
                alt="SHOTGUN ball machine close-up"
                className="h-72 w-full rounded-[24px] object-cover md:h-80"
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
