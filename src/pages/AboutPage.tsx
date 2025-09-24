interface TeamContact {
  label: string;
  href: string;
  display: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  contacts?: TeamContact[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'Developer Collective',
    role: 'Engineering Team',
    image: '/assets/images/developers.png',
    bio: 'A squad of 6+ software engineers, computer vision specialists, and embedded developers who push updates weekly, maintain our AI stack, and turn product ideas into reliable on-court experiences.',
  },
  {
    name: 'Magnus Jansson',
    role: 'CEO',
    image: '/assets/images/magnus.png',
    bio: 'Magnus sets the product vision and keeps GameCam pioneering new ways to merge camera innovation with intelligent analytics.',
    contacts: [
            {
        label: 'WhatsApp',
        href: 'https://wa.me/46701984567',
        display: '+46 70 198 45 67'
      },
      {
        label: 'Email',
        href: 'mailto:magnus@gamecam.se',
        display: 'magnus@gamecam.se'
      }
    ]
  },
  {
    name: 'Morten Wiegandt',
    role: 'Sales, Partnerships & Customer Relationships',
    image: '/assets/images/morten.png',
    bio: 'Morten leads commercial strategy and builds long-term relationships with clubs, federations, and partners across our key markets.',
    contacts: [
      {
        label: 'WhatsApp',
        href: 'https://wa.me/46701984567',
        display: '+46 70 198 45 67'
      },
      {
        label: 'Email',
        href: 'mailto:morten@gamecam.se',
        display: 'morten@gamecam.se'
      }
    ]
  },
  {
    name: 'Emrik Rellmar',
    role: 'Project Lead',
    image: '/assets/images/emrik.png',
    bio: 'Emrik coordinates teams across tech, product, and business so every deployment hits milestones and delivers the right experience for players.',
    contacts: [
      {
        label: 'Email',
        href: 'mailto:emrik@gamecam.se',
        display: 'emrik@gamecam.se'
      }
    ]
  },
  {
    name: 'Eloisa Laass',
    role: 'Administration & Support',
    image: '/assets/images/eloisa.png',
    bio: 'Eloisa looks after day-to-day operations and ensures every club receives timely, friendly support before, during, and after installation.',
    contacts: [
      {
        label: 'Email',
        href: 'mailto:eloisa@gamecam.se',
        display: 'admin@gamecam.se'
      }
    ]
  },
  {
    name: 'Vivek Sangari',
    role: 'Head of Tech & Support',
    image: '/assets/images/vivek.png',
    bio: 'Vivek leads our engineering and support squads, turning customer feedback into rock-solid firmware, edge compute, and service tooling.',
    contacts: [
      {
        label: 'Email',
        href: 'mailto:support@gamecam.se',
        display: 'support@gamecam.se'
      }
    ]
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
                {member.contacts && (
                  <ul className="space-y-1 pt-3 text-sm">
                    {member.contacts.map((contact) => (
                      <li key={`${member.name}-${contact.label}`}> 
                        <a
                          href={contact.href}
                          target={contact.href.startsWith('http') ? '_blank' : undefined}
                          rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
                        >
                          <span>{contact.label}</span>
                          <span className="font-normal tracking-normal text-neutral-700">{contact.display}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
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

