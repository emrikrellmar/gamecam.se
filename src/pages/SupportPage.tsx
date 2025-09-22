const faqs = [
  {
    question: 'What lead times should we expect for the first production run?',
    answer:
      'We are currently quoting 8-10 weeks from order confirmation.'
  },
  {
    question: 'Do you offer installation services for GAMETRAQ?',
    answer:
      'Yes. Our team we can offer installation services for nordic countries. For other regions we coordinate with certified partners or support your in-house technicians with remote guidance.'
  },
  {
    question: 'Does your products have warranty?',
    answer:
      'Absolutely. All products come with a one year warranty.'
  }
];

function SupportPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Support</p>
        <h1 className="text-4xl font-bold text-brand-blue">Get help from our support team </h1>
        <p className="max-w-2xl text-neutral-700">
          Need help with installation and onboarding? The Gamecam support team is on hand to make sure
          your club never misses a beat. Reach out through the portal or contact us directly.
        </p>
      </section>

      <h2 className="text-2xl font-semibold text-brand-blue">Support information</h2>
      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card md:grid-cols-3">
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Contact</h2>
          <p>support@gamecam.se</p>
          <p>Or</p>
          <p>Book google meet</p>
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Service windows</h2>
          <p>Monday - Friday</p>
          <p>08:00-12:00, 13-17:00 CET</p>          
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Resources</h2>
          <ul className="space-y-2">
            <li>GAMETRAQ Installation manual (PDF)</li>
            <li>SHOTGUN manual (PDF)</li>
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
