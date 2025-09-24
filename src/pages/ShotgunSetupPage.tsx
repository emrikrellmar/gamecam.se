import { Link } from 'react-router-dom';

const preparations = [
  'Unpack the ball machine carefully and keep the box for future shipping if service is needed.',
  'Remove the white plastic bands that secure the feeding unit during transport.',
  'Insert two AAA batteries into the remote control.',
  'Fully charge the ball machine for 6 hours before the first use. Keep the main switch in “MODE II” while charging.',
  'Print, laminate, and include the Training Drills manual with every rental.',
  'Refill the hopper with approximately 90 balls (one box). The maximum capacity is 150 balls.'
];

const troubleshooting = [
  {
    issue: 'Ball is stuck inside the machine',
    solutions: [
      'Turn off the machine. Slide your wrist down the side of the feed wheels and remove the ball.',
      'If the ball cannot be removed, carefully puncture it with a knife to release the pressure and pull it out.',
      'If the jam persists, open the hood with an Allen key (see the reference slide) and remove the obstruction.'
    ]
  },
  {
    issue: 'Machine does not launch balls',
    solutions: [
      'The battery may be undercharged. Charge the ball machine for at least 4 hours and test again.'
    ]
  },
  {
    issue: 'Balls remain inside after a session',
    solutions: [
      'Turn off the machine, unscrew the top lid, and remove the remaining balls manually.',
      'Vacuum the interior before closing to prevent future build-up.'
    ]
  },
  {
    issue: 'Audible alert / sensor warning',
    solutions: [
      'Reset the sensor following the instructions in the service guide.',
      'Restart the machine once the alert stops.'
    ]
  }
];

const maintenanceSteps = [
  'Verify the hopper is empty before any maintenance.',
  'Power on the ball machine so the feed wheels begin to spin.',
  'Apply a steel brush gently against both wheels to remove any plastic coating or debris.',
  'Finish by vacuuming and wiping down the interior surfaces.'
];

function ShotgunSetupPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Support</p>
        <h1 className="text-4xl font-bold text-brand-blue">SHOTGUN setup guide</h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          Follow this checklist to prepare, maintain, and troubleshoot your SHOTGUN ball machine. If you need further
          help, revisit the <Link to="/support" className="text-brand-pink transition hover:text-brand-blue">support hub</Link> or contact the GameCam team.
        </p>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-blue">Preparations</h2>
        <div className="space-y-5">
          <ul className="space-y-3 text-sm text-neutral-700">
            {preparations.map((item) => (
              <li key={item} className="relative pl-6">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-brand-pink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-4">
            <img
              src="/assets/images/ShotgunOverview.png"
              alt="SHOTGUN ball machine overview"
              className="w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-blue">Troubleshooting</h2>
        <div className="space-y-5">
          {troubleshooting.map((item) => (
            <article key={item.issue} className="space-y-3 rounded-2xl border border-brand-blue/15 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-blue">{item.issue}</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                {item.solutions.map((solution) => (
                  <li key={solution} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-brand-blue/60" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <h2 className="text-2xl font-semibold text-brand-blue">Maintenance</h2>
        <p className="text-sm text-neutral-700">
          Sand and debris reduce shot quality over time. Clean the feed wheels every 5 hours of play to keep the SHOTGUN
          operating at peak performance. The warranty does not cover damage caused by skipped maintenance.
        </p>
        <div className="rounded-2xl border border-brand-blue/15 bg-neutral-50 p-5">
          <h3 className="text-base font-semibold text-brand-blue">Clean the wheels</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-neutral-700">
            {maintenanceSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-blue">Training drills</h2>
          <p className="text-sm text-neutral-700">
            Use the built-in training programs to guide players through targeted shot and movement routines. Each program
            can be adjusted for power, ball height, and feed frequency to suit every skill level.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-4">
          <img
            src="/assets/images/ShotgunDrills.png"
            alt="SHOTGUN training drills overview"
            className="w-full rounded-2xl object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-sm text-neutral-700">
        <h2 className="text-lg font-semibold text-brand-blue">Need more help?</h2>
        <p className="mt-2">
          Message <a href="mailto:support@gamecam.se" className="font-semibold text-brand-pink transition hover:text-brand-blue">support@gamecam.se</a>{' '}
          or book a support slot via{' '}
          <a
            href="https://calendly.com/v---q3dy/tech-support?month=2025-09"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-pink transition hover:text-brand-blue"
          >
            our tech support calendar
          </a>
          . Our team is available during service hours to keep your ball machines running smoothly.
        </p>
      </section>
    </div>
  );
}

export default ShotgunSetupPage;
