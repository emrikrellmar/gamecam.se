import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What lead times should we expect for the first production run?',
    answer: 'We are currently quoting 8-10 weeks from order confirmation.'
  },
  {
    question: 'Do you offer installation services for GAMETRAQ?',
    answer:
      'Yes. Our team offers installation services for Nordic countries. For other regions we coordinate with certified partners or support your in-house technicians with remote guidance.'
  },
  {
    question: 'Do your products include a warranty?',
    answer: 'Absolutely. All products come with a one-year warranty.'
  }
];

function SupportPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Support</p>
        <h1 className="text-4xl font-bold text-brand-blue">Get help from our support team</h1>
        <p className="max-w-2xl text-neutral-700">
          Need help with installation and onboarding? The GameCam support team is on hand to make sure your club never
          misses a beat. Reach out through the portal or contact us directly.
        </p>
      </section>

      <h2 className="text-2xl font-semibold text-brand-blue">General support</h2>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/support/gametraq-setup"
          className="group rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-pink/50 hover:shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Installation</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-blue">View the GAMETRAQ installation guide</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Follow the step-by-step checklist to prepare cabling, mount the unit, focus the optics, and get your first
            live stream online.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-pink transition group-hover:text-brand-blue">
            Open guide {'->'}
          </span>
        </Link>
        <Link
          to="/support/shotgun-setup"
          className="group rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-pink/50 hover:shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Installation</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-blue">View the SHOTGUN setup guide</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Prepare, maintain, and troubleshoot the SHOTGUN ball machine with a dedicated step-by-step checklist.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-pink transition group-hover:text-brand-blue">
            Open guide {'->'}
          </span>
        </Link>
        <a
          href="https://calendly.com/v---q3dy/tech-support?month=2025-09"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-brand-pink/50 hover:shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Support</p>
          <h2 className="mt-2 text-xl font-semibold text-brand-blue">Schedule support or onboarding call</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Pick a time that suits your schedule to walk through dashboards, QR posters, and streaming workflows with our support engineers.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-pink transition group-hover:text-brand-blue">
            Schedule now {'->'}
          </span>
        </a>
      </section>

      <h2 className="text-2xl font-semibold text-brand-blue">Support information</h2>
      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card md:grid-cols-3">
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Contact</h2>
          <p>
            <a
              href="mailto:support@gamecam.se"
              className="text-brand-pink transition hover:text-brand-blue"
            >
              support@gamecam.se
            </a>
          </p>
          <p>or</p>
          <p>
            <a
              href="https://calendly.com/v---q3dy/tech-support?month=2025-09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-pink transition hover:text-brand-blue"
            >
              Book a support slot
            </a>
          </p>
          <p className="pt-1 text-sm font-semibold text-brand-blue">Need a product demo?</p>
          <p>
            <a
              href="https://calendly.com/magnus-gamecam/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-pink transition hover:text-brand-blue"
            >
              Book a demo
            </a>
          </p>
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Service windows</h2>
          <p>Monday - Friday</p>
          <p>08:00-12:00, 13:00-17:00 CET</p>
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Resources</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/support/gametraq-setup"
                className="text-brand-pink transition hover:text-brand-blue"
              >
                GAMETRAQ setup checklist
              </Link>
            </li>
            <li>
              <Link
                to="/support/shotgun-setup"
                className="text-brand-pink transition hover:text-brand-blue"
              >
                SHOTGUN setup checklist
              </Link>
            </li>
            <li>
              <a
                href="/assets/pdfs/GAMETRAQDECK.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pink transition hover:text-brand-blue"
              >
                GAMETRAQ product deck (PDF)
              </a>
            </li>
            <li>
              <a
                href="/assets/pdfs/SHOTGUNDECK.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pink transition hover:text-brand-blue"
              >
                SHOTGUN product deck (PDF)
              </a>
            </li>
          </ul>
        </div>
      </section>

      <h2 className="text-2xl font-semibold text-brand-blue">Frequently asked questions</h2>
      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-brand-blue">{faq.question}</h3>
              <p className="mt-2 text-sm text-neutral-700">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SupportPage;

