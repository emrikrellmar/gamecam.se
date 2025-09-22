const teamMembers = [
  {
    name: 'Developer Collective',
    role: 'Engineering Team',
    image: '/assets/developers.png',
    bio: 'A squad of 6+ software engineers, computer vision specialists, and embedded developers who push updates weekly, maintain our AI stack, and turn product ideas into reliable on-court experiences.'
  },
  {
    name: 'Magnus Jansson',
    role: 'CEO',
    image: '/assets/magnus.png',
    bio: 'Magnus sets the product vision and keeps GameCam pioneering new ways to merge camera innovation with intelligent analytics for padel clubs.'
  },
  {
    name: 'Morten Wiegandt',
    role: 'Sales, Partnerships & Customer Relationships',
    image: '/assets/morten.png',
    bio: 'Morten leads commercial strategy and builds long-term relationships with clubs, federations, and partners across our key markets.'
  },
  {
    name: 'Emrik Rellmar',
    role: 'Project Lead',
    image: '/assets/emrik.png',
    bio: 'Emrik coordinates teams across tech, product, and business so every deployment hits milestones and delivers the right experience for players.'
  },
  {
    name: 'Eloisa Laass',
    role: 'Administration & Support',
    image: '/assets/eloisa.png',
    bio: 'Eloisa looks after day-to-day operations and ensures every club receives timely, friendly support before, during, and after installation.'
  },
  {
    name: 'Vivek S',
    role: 'Head of Tech & Support',
    image: '/assets/vivek.png',
    bio: 'Vivek leads our engineering and support squads, turning customer feedback into rock-solid firmware, edge compute, and service tooling.'
  }
];

function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">About Us</p>
        <h1 className="text-4xl font-bold text-brand-blue">The people powering GameCam.</h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          We are a hands-on team of technologists, operators, and padel obsessives. Based in the city Ängelholm in Sweden,
          we prototype hardware, refine computer vision models, and support clubs every single week.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand-blue">Meet the team</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="group space-y-4 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex h-72 items-end justify-center overflow-visible rounded-2xl border border-brand-blue/10 bg-gradient-to-br from-white via-brand-blue/5 to-brand-pink/10 p-4 pb-0">
                <div className="pointer-events-none absolute -inset-16 rounded-[36px] bg-gradient-to-r from-brand-blue/40 via-brand-purple/30 to-brand-pink/40 opacity-0 blur-3xl transition duration-700 group-hover:opacity-60" />
                <img
                  src={member.image}
                  alt={`${member.name} portrait`}
                  className="relative z-10 mx-auto max-h-64 w-full max-w-[260px] object-contain object-bottom drop-shadow-[0_18px_35px_rgba(37,99,235,0.25)] transition duration-500 group-hover:translate-y-[-6px] group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 text-neutral-700">
                <h3 className="text-xl font-semibold text-brand-blue">{member.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">{member.role}</p>
                <p className="text-sm leading-relaxed">{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-blue">How we work</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-brand-blue/10 bg-neutral-50 p-6 text-sm text-neutral-700">
            <h3 className="mb-3 text-lg font-semibold text-brand-blue">Precision</h3>
            <p>Every installation is field-tested with coaches and operators so data, video, and support feel seamless on match day.</p>
          </article>
          <article className="rounded-3xl border border-brand-blue/10 bg-neutral-50 p-6 text-sm text-neutral-700">
            <h3 className="mb-3 text-lg font-semibold text-brand-blue">Partnership</h3>
            <p>We co-design roadmaps with our clubs, keeping communication open from first conversation to live deployment.</p>
          </article>
          <article className="rounded-3xl border border-brand-blue/10 bg-neutral-50 p-6 text-sm text-neutral-700">
            <h3 className="mb-3 text-lg font-semibold text-brand-blue">Sustainability</h3>
            <p>Modular hardware, responsible sourcing, and refurbishment programs extend the life of every GameCam unit.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;





