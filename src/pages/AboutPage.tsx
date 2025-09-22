function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">About Gamecam</p>
        <h1 className="text-4xl font-bold text-brand-blue">We build tools that let padel clubs punch above their weight.</h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          Our multidisciplinary team blends broadcast engineering, computer vision, and sports coaching expertise. We are
          headquartered in Malmö with R&D satellites in Barcelona and Helsinki.
        </p>
      </section>

      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card md:grid-cols-3">
        <div className="text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Team DNA</h2>
          <p className="mt-3 text-sm">
            Former pro players, robotics engineers, and data scientists collaborating under one roof to reimagine the
            padel experience.
          </p>
        </div>
        <div className="text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Investors & advisors</h2>
          <p className="mt-3 text-sm">
            Backed by Nordic sports tech funds and advised by global tournament directors who keep us focused on real
            matchday demands.
          </p>
        </div>
        <div className="text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">Careers</h2>
          <p className="mt-3 text-sm">
            We are hiring for embedded firmware engineers, computer vision scientists, and partner success leads. Reach
            out at careers@gamecam.se.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-blue">Values</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-brand-blue/10 bg-neutral-50 p-6 text-sm text-neutral-700">
            <h3 className="mb-3 text-lg font-semibold text-brand-blue">Precision</h3>
            <p>Everything we ship is field-tested with elite coaches to ensure reliability in the heat of competitions.</p>
          </article>
          <article className="rounded-3xl border border-brand-blue/10 bg-neutral-50 p-6 text-sm text-neutral-700">
            <h3 className="mb-3 text-lg font-semibold text-brand-blue">Partnership</h3>
            <p>We co-create features with clubs and let data guide the roadmap, not vanity metrics.</p>
          </article>
          <article className="rounded-3xl border border-brand-blue/10 bg-neutral-50 p-6 text-sm text-neutral-700">
            <h3 className="mb-3 text-lg font-semibold text-brand-blue">Sustainability</h3>
            <p>Modular hardware and transparent sourcing keep our footprint low while extending product life cycles.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
