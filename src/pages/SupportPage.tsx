const faqs = [
  {
    question: 'What lead times should we expect for the first production run?',
    answer:
      'We are currently quoting 8-10 weeks from order confirmation. Pilot partners receive prioritised assembly slots and can follow production milestones inside the Gamecam dashboard.'
  },
  {
    question: 'Do you offer installation services for GAMETRAQ?',
    answer:
      'Yes. Our field engineers cover the Nordics and Iberia. For other regions we coordinate with certified partners or support your in-house technicians with remote guidance.'
  },
  {
    question: 'Does SHOTGUN support battery hot-swaps during sessions?',
    answer:
      'Absolutely. The lithium battery sled can be swapped in under 30 seconds without rebooting the machine. Additional battery packs are available as accessories.'
  }
];

function SupportPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Support</p>
        <h1 className="text-4xl font-bold text-brand-blue">Get help from our support team </h1>
        <p className="max-w-2xl text-neutral-700">
          Need help with installation, onboarding, or API integration? The Gamecam support team is on hand to make sure
          your club never misses a beat. Reach out through the portal or contact us directly.
        </p>
      </section>

      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card md:grid-cols-3">
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Contact</h2>
          <p>support@gamecam.se</p>
          <p>+46 (0)40-123 456</p>
          <p>Slack Connect for enterprise customers.</p>
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Service windows</h2>
          <p>Weekdays 08:00 - 20:00 CET</p>
          <p>Weekend tournament hotline available on request.</p>
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Resources</h2>
          <ul className="space-y-2">
            <li>Installation manual (PDF)</li>
            <li>API quick start</li>
            <li>SHOTGUN maintenance checklist</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand-blue">Frequently asked questions</h2>
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
