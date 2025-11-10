import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import CheckoutButton from '../components/CheckoutButton';
import VideoPlayer from '../components/VideoPlayer';
import LogoMarquee from '../components/LogoMarquee';
import { products } from '../data/products';

const stats = [
  { label: 'Products installed in countries', value: '15' },
  { label: 'Products installed in clubs globally', value: '200+' },
  { label: 'AI analyzed games', value: '44,000+' }
];

const customerLogos = [
  { name: 'Nordic Wellness Padel', image: '/assets/images/nordicwellnespadel.webp' },
  { name: 'Padel Sense', image: '/assets/images/padelsense.webp' },
  { name: 'Padel Zenter', image: '/assets/images/padelzenter.webp' },
  { name: 'PDL Padel', image: '/assets/images/PDL.webp' },
  { name: 'Stiga Padel', image: '/assets/images/stigapadel.webp' },
  { name: 'Taktika Padel', image: '/assets/images/taktikapadel.webp' }
];

// I moved away from multiple demo cards and instead feature a single hero demo below
const GAMETRAQ_VIDEO = '/assets/videos/GAMETRAQ.mov';

function HomePage() {
  return (
    <div className="space-y-16" id="main-content" role="main" aria-label="Main content">
      <SEO
        title="GameCam │ AI-powered padel hardware"
        description="GameCam builds intelligent padel hardware: GAMETRAQ AI match camera and SHOTGUN training machine. Capture, analyze, and improve."
        canonical="/"
        image="/assets/images/court_with_gametraq.png"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GameCam',
            url: '/',
            logo: '/assets/images/gamecam_icon.png'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How quickly can we get started?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Most clubs are up and running within 1–2 weeks after ordering. We guide installation and calibration, then your first matches start streaming and generating analytics.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do we need a specialist to install?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No special contractor is required. We provide a simple mounting kit and step‑by‑step guidance. Our support can assist live if needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What support and warranty are included?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Standard 1‑year limited warranty plus weekday live support. Replacement units can be sent quickly to minimise downtime.'
                }
              }
            ]
          }
        ]}
      />
  {/* I preload the hero image here to win LCP on the home route */}
      <Helmet>
        <link rel="preload" as="image" href="/assets/images/court_with_gametraq.png" />
      </Helmet>
      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="mb-14 text-4xl font-bold leading-tight text-brand-blue sm:text-5xl">
            GameCam hardware for padel clubs
          </h1>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-neutral-700">
              GAMETRAQ is the smart AI Camera for Padel that transforms your court into a smart court, the all-in-one AI camera system that records every match in 4K, live streams to your YouTube channel, and delivers instant player analytics.
            </p>
            <p className="text-lg leading-relaxed text-neutral-700">
              Players can replay their best rallies on the club TV, for venues, it means higher engagement, premium rental prices, and a tech-powered experience that keeps players coming back. Record. Analyze. Stream. Improve.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-white p-4 shadow-card">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/assets/images/court_with_gametraq.png"
                alt="Gamecam hardware on court"
                className="h-full w-full rounded-2xl object-cover"
                decoding="async"
                width={1600}
                height={900}
                fetchPriority="high"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
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

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Trusted by</p>
            <h2 className="text-2xl font-semibold text-brand-blue">Leading padel clubs in Europe</h2>
          </div>
        </div>
        <div className="mt-6">
          <LogoMarquee logos={customerLogos} />
        </div>
      </section>

      {/* GAMETRAQ demo: autoplay on scroll, muted until click, rounded like other boxes (no poster/placeholder) */}
      <section className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Product demo</p>
            <h2 className="text-2xl font-semibold text-brand-blue">Watch GAMETRAQ in action</h2>
          </div>
        </div>
        <div className="mt-6">
          <VideoPlayer
            src={GAMETRAQ_VIDEO}
            preload="metadata"
            autoPlayWhenVisible
            startMuted
            unmuteOnClick
            showControlsOnPlay={false}
            startAtSeconds={1}
            className="aspect-video w-full rounded-3xl object-cover"
          />
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
                  View product page
                </Link>
                <CheckoutButton
                  href={`/order/${product.slug}`}
                  label={`Order ${product.name}`}
                  className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink"
                />
              </div>
            </div>
          </article>
        ))}
      </section>

{/* Testimonials to boost trust and conversions */}
      <section className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Testimonials</p>
            <h2 className="text-2xl font-semibold text-brand-blue">What others are saying</h2>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <article className="relative h-full rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
            <div className="pointer-events-none absolute -top-4 left-4 text-6xl text-brand-blue/10">“</div>
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/roryovide.png"
                alt="Rory Ovide"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement; img.onerror = null; img.src = '/assets/images/gamecam_icon.png';
                }}
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-sm font-semibold text-brand-blue">Rory Ovide</p>
                <p className="text-xs text-brand-blue/70">Pro Coach</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-800">
              Tool for all strategies of players. Beginners enjoy the stats for added fun in their games. Intermediate use stats to track progress and improve. Pros analyze opponents strengths and weaknesses for a competitive edge.
            </p>
          </article>
          {/* Card 2 */}
          <article className="relative h-full rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
            <div className="pointer-events-none absolute -top-4 left-4 text-6xl text-brand-blue/10">“</div>
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/carljohanblum.png"
                alt="Carl‑Johan Blum"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement; img.onerror = null; img.src = '/assets/images/emrik.png';
                }}
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-sm font-semibold text-brand-blue">Carl‑Johan Blum</p>
                <p className="text-xs text-brand-blue/70">Club Manager, PDL Center Sweden</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-800">
              GAMETRAQ has transformed our venue by offering a unique and enjoyable experience for players.
            </p>
          </article>
          {/* Card 3 */}
          <article className="relative h-full rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
            <div className="pointer-events-none absolute -top-4 left-4 text-6xl text-brand-blue/10">“</div>
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/rickard holmström.png"
                alt="Rickard Holmström"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement; img.onerror = null; img.src = '/assets/images/morten.png';
                }}
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-sm font-semibold text-brand-blue">Rickard Holmström</p>
                <p className="text-xs text-brand-blue/70">Padel and Tennis Coach</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-800">
              As a club manager I get a lot of good feedback from players using the GAMETRAQ system.
            </p>
          </article>
        </div>
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

