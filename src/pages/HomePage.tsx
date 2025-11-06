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
const GAMETRAQ_POSTER = '/assets/images/gametraq.png';

function HomePage() {
  return (
    <div className="space-y-16">
      <SEO
        title="GameCam │ AI-powered padel hardware"
        description="GameCam builds intelligent padel hardware: GAMETRAQ AI match camera and SHOTGUN training machine. Capture, analyze, and improve."
        canonical="/"
        image="/assets/images/court_with_gametraq.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'GameCam',
          url: '/',
          logo: '/assets/images/gamecam_icon.png'
        }}
      />
  {/* I preload the hero image here to win LCP on the home route */}
      <Helmet>
        <link rel="preload" as="image" href="/assets/images/court_with_gametraq.png" />
      </Helmet>
      <section className="grid gap-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <h1 className="text-4xl font-bold leading-tight text-brand-blue sm:text-5xl">
            GameCam hardware for padel clubs
          </h1>
          <p className="text-lg leading-relaxed text-neutral-700">
            Capture matches, turn rallies into highlights, and give coaches instant insights. Explore how GameCam fits your club’s roadmap.
          </p>

          <div className="flex flex-col gap-2 sm:gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-brand-blue/10 bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90 sm:px-6 sm:py-4 lg:px-12 lg:py-5"
            >
              View all of our products
            </Link>
            <a
              href="https://calendly.com/magnus-gamecam/new-meeting?month=2025-09"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-brand-blue/25 px-4 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-blue/40 sm:px-6 sm:py-4 lg:px-8 lg:py-5"
            >
              Book a demo
            </a>
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

      {/* I showcase the GAMETRAQ demo right under the hero in a stylized container */}
      <section className="relative overflow-hidden rounded-3xl border border-brand-blue/15 bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-brand-pink/10 p-4 shadow-card">
        <div className="pointer-events-none absolute left-[-20%] top-[-25%] h-40 w-40 rounded-full bg-white/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-35%] right-[-15%] h-48 w-48 rounded-full bg-brand-pink/20 blur-3xl" />
        <div className="relative rounded-2xl border border-brand-blue/10 bg-white/80 p-3 backdrop-blur-sm">
          <VideoPlayer
            src={GAMETRAQ_VIDEO}
            poster={GAMETRAQ_POSTER}
            preload="metadata"
            className="aspect-video w-full rounded-xl object-cover"
          />
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

      {/* I removed the multi-card demo section per request */}

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

