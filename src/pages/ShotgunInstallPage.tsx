import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Content derived from ShotgunSetupPage.tsx
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

const steps = [
  { title: 'Preparations' },
  { title: 'Troubleshooting' },
  { title: 'Maintenance' },
  { title: 'Training drills' }
];

function StepProgress({ current, onGoto }: { current: number; onGoto: (idx: number) => void }) {
  return (
    <ol className="mb-6 grid grid-cols-4 gap-2">
      {steps.map((s, idx) => {
        const active = idx === current;
        const done = idx < current;
        return (
          <li key={s.title} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGoto(idx)}
              aria-current={active ? 'step' : undefined}
              aria-label={`Go to step ${idx + 1}: ${s.title}`}
              className={
                `flex h-8 w-8 flex-none items-center justify-center rounded-full border text-sm font-semibold leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-brand-pink/40 ` +
                (done
                  ? 'border-brand-blue bg-brand-blue text-white'
                  : active
                  ? 'border-brand-pink bg-white text-brand-pink'
                  : 'border-brand-blue/30 bg-white text-brand-blue/60 hover:border-brand-pink hover:text-brand-pink')
              }
            >
              {idx + 1}
            </button>
            <span className={`hidden text-xs font-semibold sm:block ${active ? 'text-brand-blue' : 'text-brand-blue/70'}`}>{s.title}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function ShotgunInstallPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const stepIndex = Math.max(0, Math.min(steps.length - 1, (params.step ? parseInt(params.step, 10) - 1 : 0) || 0));

  const go = (idx: number) => navigate(idx <= 0 ? '/install/shotgun' : `/install/shotgun/${idx + 1}`);
  const next = () => go(Math.min(steps.length - 1, stepIndex + 1));
  const prev = () => go(Math.max(0, stepIndex - 1));

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [stepIndex]);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Install</p>
        <h1 className="text-4xl font-bold text-brand-blue">SHOTGUN Setup Guide</h1>
        <p className="max-w-3xl text-lg text-neutral-700">Step {stepIndex + 1} of {steps.length}</p>
      </section>

      <StepProgress current={stepIndex} onGoto={go} />

      {stepIndex === 0 && (
        <section className={`space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition-all duration-300 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Step 1</p>
            <h2 className="text-2xl font-semibold text-brand-blue">Preparations</h2>
          </div>
          <ul className="space-y-2 text-sm text-neutral-700">
            {preparations.map((item) => (
              <li key={item} className="relative pl-6">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-brand-pink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="overflow-hidden rounded-3xl border border-brand-blue/15 bg-neutral-50 p-4">
            <img
              src="/assets/images/products/ShotgunOverview.png"
              alt="SHOTGUN ball machine overview"
              className="w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={prev} disabled className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-5 py-3 text-sm font-semibold text-brand-blue opacity-50">Back</button>
            <button onClick={next} className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink">Next</button>
          </div>
        </section>
      )}

      {stepIndex === 1 && (
        <section className={`space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition-all duration-300 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Step 2</p>
            <h2 className="text-2xl font-semibold text-brand-blue">Troubleshooting</h2>
          </div>
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
          <div className="mt-4 flex items-center justify-between">
            <button onClick={prev} className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-5 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink">Back</button>
            <button onClick={next} className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink">Next</button>
          </div>
        </section>
      )}

      {stepIndex === 2 && (
        <section className={`space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition-all duration-300 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Step 3</p>
            <h2 className="text-2xl font-semibold text-brand-blue">Maintenance</h2>
          </div>
          <p className="text-sm text-neutral-700">
            Sand and debris reduce shot quality over time. Clean the feed wheels every 5 hours of play to keep the SHOTGUN operating at peak performance. The warranty does not cover damage caused by skipped maintenance.
          </p>
          <div className="rounded-2xl border border-brand-blue/15 bg-neutral-50 p-5">
            <h3 className="text-base font-semibold text-brand-blue">Clean the wheels</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-neutral-700">
              {maintenanceSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={prev} className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-5 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink">Back</button>
            <button onClick={next} className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink">Next</button>
          </div>
        </section>
      )}

      {stepIndex === 3 && (
        <section className={`space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition-all duration-300 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Step 4</p>
            <h2 className="text-2xl font-semibold text-brand-blue">Training drills</h2>
          </div>
          <div className="space-y-4 text-sm text-neutral-700">
            <p>
              Use the built-in training programs to guide players through targeted shot and movement routines. Each program can be adjusted for power, ball height, and feed frequency to suit every skill level.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl bg-neutral-50 p-4">
            <img
              src="/assets/images/products/ShotgunDrills.png"
              alt="SHOTGUN training drills overview"
              className="w-full rounded-2xl object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={prev} className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-5 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink">Back</button>
            <a
              href="https://calendar.app.google/nNe8TWDQWeGDM7GbA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink"
            >
              Book support & onboarding call
            </a>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-sm text-neutral-700">
        <h2 className="text-lg font-semibold text-brand-blue">Need more help?</h2>
        <p className="mt-2">
          Message <a href="mailto:support@gamecam.se" className="font-semibold text-brand-pink transition hover:text-brand-blue">support@gamecam.se</a>{' '}
          or book a support slot via{' '}
          <a
            href="https://calendar.app.google/nNe8TWDQWeGDM7GbA"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-pink transition hover:text-brand-blue"
          >
            our tech support calendar
          </a>
          .
        </p>
      </section>
    </div>
  );
}
