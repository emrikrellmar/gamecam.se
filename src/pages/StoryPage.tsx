function StoryPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Our Story</p>
        <h1 className="text-4xl font-bold text-brand-blue">From local padel courts to an AI-native hardware lab.</h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          Gamecam started as a weekend project in Malmö when our founders wanted broadcast-quality footage for local
          tournaments without a TV crew. What began as a single smart camera has evolved into a full-stack hardware
          platform designed for padel clubs and professional teams worldwide.
        </p>
      </section>

      <section className="grid gap-8 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card md:grid-cols-3">
        <div className="space-y-3 text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">2022 · Prototype</h2>
          <p>
            Built the first ceiling-mounted prototype with off-the-shelf optics and open-source CV models. Recorded more
            than sixty hours of padel footage to train our rally detection pipeline.
          </p>
        </div>
        <div className="space-y-3 text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">2023 · Accelerator</h2>
          <p>
            Joined a sports tech accelerator, partnered with Swedish elite coaches, and spun up the hardware team to
            design production-ready enclosures and edge compute modules.
          </p>
        </div>
        <div className="space-y-3 text-neutral-700">
          <h2 className="text-lg font-semibold text-brand-blue">2024 · Expansion</h2>
          <p>
            Live pilots across the Nordics and Iberia. Introduced SHOTGUN to complement AI insights with adaptive
            training so clubs can monetise off-peak hours.
          </p>
        </div>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-5 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-neutral-700">
          <h2 className="text-2xl font-semibold text-brand-blue">Hardware + software in sync</h2>
          <p>
            We engineer the full stack—optics, compute, firmware, and cloud—to keep latency low and experiences sharp.
            Each iteration is co-developed with club partners who pressure-test every feature in real match conditions.
          </p>
          <ul className="space-y-3 text-sm">
            <li>Dedicated manufacturing line in Västerås with rapid prototyping capability.</li>
            <li>Firmware pushed over-the-air every month with opt-in beta channels.</li>
            <li>API-first philosophy so clubs can layer their own services on top of ours.</li>
          </ul>
        </div>
        <div className="space-y-5 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-neutral-700">
          <h2 className="text-2xl font-semibold text-brand-blue">Sustainability in focus</h2>
          <p>
            We source recycled aluminum, design for repairability, and operate a refurbishment program so every unit can
            enjoy a second life with community clubs.
          </p>
          <ul className="space-y-3 text-sm">
            <li>Hardware take-back program launching with the first production run.</li>
            <li>Scope 3 reporting for clubs that need ESG-ready footprints.</li>
            <li>Local assembly partners reduce shipping emissions across Europe.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default StoryPage;
