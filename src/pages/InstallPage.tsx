import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Step = {
  title: string;
  subtitle?: string;
  sections: Array<{
    heading?: string;
    items?: string[];
    text?: string[];
    links?: Array<{ label: string; href: string }>;
    imagePlaceholder?: string; // key for future images
  }>;
};

const steps: Step[] = [
  {
    title: 'Checklist before you start',
    subtitle: 'Checklist to install GAMETRAQ',
    sections: [
      {
        heading: 'From GAMECAM shipment',
        items: [
          'AI camera with microphone and USB splitter',
          'CAT 6 cable',
          '2 USB to PoE adapters',
          'Camera mount, install on court to place AI camera',
          'Save ball rally button with USB cable, mount at the net post',
          'USB cable, from AI camera to the Save ball rally button',
          'GameCam TV device, connect to your venue TV',
          'QR poster, place outside the court for players to scan and pay'
        ]
      },
      {
        heading: 'What you need extra',
        items: [
          'Ladder or a lift, to set up the camera on the court',
          'CAT6 Short, from internet router to PoE switch',
          'CAT6 Long, from PoE switch to the GAMETRAQ AI camera on court',
          '1 × PoE Switch, recommended TP-Link PoE switch',
        ],
        links: [
          { label: 'Buy TP-Link PoE switch', href: 'https://amzn.eu/d/cuA9qTE' }
        ]
      }
    ]
  },
  {
    title: 'Pull the cable',
    sections: [
      {
        items: [
          'Locate your server room.',
          'Pull a short <span class="bg-red-500/20 px-1 rounded">CAT6 cable</span> from the your internet router to the PoE switch inside your server room.',
          'Install/pull a second <span class="bg-red-500/20 px-1 rounded">CAT6 cable</span> from the PoE switch to the court where the GAMETRAQ camera is installed.'
        ],
        imagePlaceholder: 'step2'
      }
    ]
  },
  {
    title: 'Mount camera on the court',
    sections: [
      {
        items: [
          'Place the <span class="bg-gray-300/40 px-1 rounded">GAMETRAQ</span> on the camera plate of the <span class="bg-gray-300/40 px-1 rounded">camera mount</span> using the screws.',
          'Attach the <span class="bg-gray-300/40 px-1 rounded">camera mount</span> to the padel court with strips.',
          'Connect the <span class="bg-red-500/20 px-1 rounded">CAT6 cable</span> that you pulled in the last step to the cameras ethernet port.',
        ],
        imagePlaceholder: 'step3'
      }
    ]
  },
  {
    title: 'Install the save ball rally button and cables',
    sections: [
      {
        items: [
          'Plug a <span class="bg-yellow-400/30 px-1 rounded">USB to PoE adapter</span> on the camera side.',
          'Run the 15m CAT6 cable along the court in the <span class="bg-blue-500/20 px-1 rounded">blue path</span> shown in the picture towards the where the button will be placed.',
          'Connetct one more <span class="bg-yellow-400/30 px-1 rounded">USB to PoE adapter</span> on the button side.',
          'Connect the USB button where the <span class="bg-green-500/20 px-1 rounded">green circle</span> is marked.',
          'Note that the <span class="bg-red-500/20 px-1 rounded">red path</span> is the CAT6 cable from the PoE switch to the camera.',
          'Cable-tie or tape slack so nothing hangs or becomes a trip hazard.',
       ],
        imagePlaceholder: 'step4'
      }
    ]
  },
  {
    title: 'Mount the QR Code Poster',
    sections: [
      {
        heading: 'Placement',
        items: [
          'Identify the side of the pitch where players enter or gather.',
          'Clean the surface to ensure good adhesion.',
          'Mount the poster at eye level (approx. 1.5m from the ground) for easy scanning.',
          'Ensure the QR code is clearly visible and not obstructed by nets or equipment.'
        ]
      },
      {
        heading: 'Function',
        items: [
          'This poster allows players to quickly scan and activate the camera system before their match.',
          'Instructions on the poster will guide players through the activation and payment process.'
        ],
        imagePlaceholder: 'step5'
      }
    ]
  },
  {
    title: 'Connect the GAMECAM TV',
    sections: [
      {
        items: [
          'Connect the GTV unit to a power socket (USB‑C power supply).',
          'Connect the GTV unit via HDMI to your TV.',
          'Select the correct HDMI source on the TV, a GAMECAM logo should appear.',
          'When new Highlights videos arrive, they will automatically play on the TV.'
        ],
        imagePlaceholder: 'step6'
      }
    ]
  },
  {
    title: 'Final camera settings',
    sections: [
      {
        heading: 'Check camera connectivity',
        items: [
          'Visit the live checker.',
          'Enter the 3‑digit camera number (printed on the side of the camera).',
          'Status Online: proceed to focus setup.',
          'Status Offline: check internet, verify PoE switch, try again. If it still fails, schedule a call with the tech team.'
        ],
        links: [
          { label: 'Open connectivity checker', href: 'https://install.gamecam.se/check.php' }
        ]
      },
      {
        heading: 'Set focus',
        items: [
          'Open the live feed.',
          'Enter the 3‑digit camera number and start the video feed.',
          'If off focus, rotate the lens ~45° and wait a few seconds for the feed to update.',
          'Adjust until the net area is clear and sharp. Note the delay between adjustment and the live view.'
        ],
        links: [
          { label: 'Open live feed', href: 'https://install.gamecam.se/live.php' }
        ]
      },
      {
        heading: 'Set angle',
        items: [
          'Use the same live feed to adjust the vertical angle so all 4 court corners are visible.',
          'Tilt slightly up/down so missing court parts are covered.'
        ],
        links: [
          { label: 'Open live feed', href: 'https://install.gamecam.se/live.php' }
        ]
      }
    ]
  },
  {
    title: 'Schedule an onboarding call',
    sections: [
      {
        heading: '🎉 Congratulations, your GAMETRAQ installation is complete! 🎉',
        text: [
          'You can now schedule an onboarding call with our tech team.',
          'In the call, our tech support check so everything is working and will then hand over your camera system.',
          'We will activate your QR code, show how to use the system as a player and club management, and help set up your YouTube channel for live streaming.'
        ]
      }
    ]
  }
];

function StepProgress({ current, onGoto }: { current: number; onGoto: (idx: number) => void }) {
  return (
    <ol className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {steps.map((s, idx) => {
        const active = idx === current;
        const done = idx < current;
        return (
          <li key={idx} className="flex items-center gap-2">
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
            <span className={`text-xs font-semibold leading-tight ${active ? 'text-brand-blue' : 'text-brand-blue/70'}`}>{s.title}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function InstallPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const stepIndex = Math.max(0, Math.min(steps.length - 1, (params.step ? parseInt(params.step, 10) - 1 : 0) || 0));
  const step = steps[stepIndex];

  const go = (idx: number) => navigate(idx <= 0 ? '/install' : `/install/${idx + 1}`);
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
        <h1 className="text-4xl font-bold text-brand-blue">GAMETRAQ Installation Guide</h1>
        <p className="max-w-3xl text-lg text-neutral-700">Step {stepIndex + 1} of {steps.length}</p>
      </section>

      <StepProgress current={stepIndex} onGoto={go} />

      <section className={`space-y-6 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card transition-all duration-300 ease-out ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Step {stepIndex + 1}</p>
          <h2 className="text-2xl font-semibold text-brand-blue">{step.title}</h2>
          {step.subtitle && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue/50">{step.subtitle}</p>
          )}
        </div>

        <div className="space-y-6">
          {step.sections.map((sec, i) => (
            <article key={i} className="space-y-3">
              {sec.heading && <h3 className="text-lg font-semibold text-brand-blue">{sec.heading}</h3>}
              {sec.text && (
                <div className="space-y-2 text-sm text-neutral-700">
                  {sec.text.map((t, idx) => (<p key={idx}>{t}</p>))}
                </div>
              )}
              {sec.items && (
                <ul className="space-y-2 text-sm text-neutral-700">
                  {sec.items.map((it) => (
                    <li key={it} className="relative pl-6">
                      <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-brand-pink" />
                      <span dangerouslySetInnerHTML={{ __html: it }} />
                    </li>
                  ))}
                </ul>
              )}
              {sec.links && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {sec.links.map((lnk) => (
                    <a
                      key={lnk.href}
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
                    >
                      <span>{lnk.label}</span>
                    </a>
                  ))}
                </div>
              )}
              {sec.imagePlaceholder && (
                <div className="rounded-2xl overflow-hidden border border-brand-blue/10">
                  <img 
                    src={`/assets/images/installation/${sec.imagePlaceholder}.png`} 
                    alt={sec.heading || step.title}
                    className="w-full h-auto"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-5 py-3 text-sm font-semibold text-brand-blue transition hover:border-brand-pink hover:text-brand-pink disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            {stepIndex < steps.length - 1 ? (
              <button
                onClick={next}
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink"
              >
                Next
              </button>
            ) : (
              <a
                href="https://calendar.app.google/nNe8TWDQWeGDM7GbA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-pink"
              >
                Book support & onboarding call
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-sm text-neutral-700">
        <h2 className="text-lg font-semibold text-brand-blue">Need more help?</h2>
        <p className="mt-2">
          Message <a href="mailto:support@gamecam.se" className="font-semibold text-brand-pink transition hover:text-brand-blue">support@gamecam.se</a> or book a dedicated support slot via{' '}
          <a
            href="https://calendar.app.google/nNe8TWDQWeGDM7GbA"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-pink transition hover:text-brand-blue"
          >
            our tech support calendar
          </a>.
        </p>
      </section>
    </div>
  );
}
