import { Link } from 'react-router-dom';

interface StepResource {
  label: string;
  href: string;
}

interface StepItem {
  number: number;
  heading: string;
  subheading: string;
  details: string[];
  resources?: StepResource[];
}

const steps: StepItem[] = [
  {
    number: 1,
    heading: 'BEFORE ARRIVAL OF THE GAMETRAQ UNIT',
    subheading: 'Cable layout preparation',
    details: [
      'Pull a CAT6/network cable from the server room (switch location) to the short side of the court where you want to mount the AI camera.',
      'Leave 2-3 extra meters of cable for flexibility.'
    ]
  },
  {
    number: 2,
    heading: 'UPON ARRIVAL OF THE GAMETRAQ UNIT',
    subheading: 'Initial setup',
    details: [
      'Check that your router supplies PoE+ (20 W) to power the camera. If you do not have PoE+, order a compatible injector.',
      'Cabling: Pull a CAT6/network cable from the server room (internet router) to the short side of the padel court where the AI camera will be mounted.',
      'Check connectivity: Connect the CAT6 cable between the internet router and the GAMETRAQ 4 unit.',
      'Camera ID: Locate the three-digit number on the side of the camera, add it to the live checker, and press CHECK CAMERA CONNECTION.',
      'Status: If the camera ID shows ONLINE you can proceed. If it shows OFFLINE, contact the GameCam WhatsApp group for troubleshooting before moving on.'
    ],
    resources: [
      {
        label: 'Buy TP-Link PoE+ injector',
        href: 'https://amzn.eu/d/0SVOt2G'
      },
      {
        label: 'Check camera connectivity',
        href: 'https://install.gamecam.se/check.php'
      }
    ]
  },
  {
    number: 3,
    heading: 'MOUNT THE CAMERA ON COURT',
    subheading: 'Set up the camera mount and camera',
    details: [
      'Assemble the Bird-View unit following the drawing provided at the end of the guide.',
      'Attach the camera to the camera plate on the Bird-View mount.',
      'Mount the Bird-View unit on the court structure with plastic strips and make sure it is secure.',
      'Connect the CAT6 cable to the camera.',
      'Plug in the USB microphone and clip the microphone to the grid construction.'
    ]
  },
  {
    number: 4,
    heading: 'SET CAMERA FOCUS',
    subheading: 'Adjustments',
    details: [
      'Go to the live feed page to view the camera stream from the court.',
      'Gently turn the camera optic a quarter turn clockwise or counter-clockwise.',
      'Wait 20 seconds to allow for video delay, then repeat adjustments until the far side of the court appears sharp and clear.'
    ],
    resources: [
      {
        label: 'Open live feed  ',
        href: 'https://install.gamecam.se/live.php'
      }
    ]
  },
  {
    number: 5,
    heading: 'SCHEDULE AN ONBOARDING CALL',
    subheading: 'Pick a time that suits your team',
    details: [
      'Get your QR poster and learn how to set it up courtside.',
      'Receive access to the club dashboard.',
      'Understand how players start the AI camera experience.',
      'Stay updated on new camera features and schedule YouTube streams together with the GameCam team.'
    ],
    resources: [
      {
        label: 'Book support & onboarding',
        href: 'https://calendly.com/v---q3dy/tech-support?month=2025-09'
      }
    ]
  },
  {
    number: 6,
    heading: 'SET UP THE QR CODE ON THE COURT',
    subheading: 'Actions to complete',
    details: [
      'Secure the QR poster on the court with plastic strips so it stays visible and easy to scan.',
      'Inform your coaches about the workflow so they can introduce it to every player.'
    ]
  },
  {
    number: 7,
    heading: 'LAUNCH AI CAMERAS TO YOUR PLAYERS',
    subheading: 'Instagram post',
    details: [
      'Create an Instagram Reel or post using the provided launch video and text.',
      'Tag @gamecam.se so we can re-share it across our channels.'
    ]
  }
];

function GametraqSetupPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Support</p>
        <h1 className="text-4xl font-bold text-brand-blue">GAMETRAQ installation guide</h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          Follow this step-by-step checklist to get your GAMETRAQ camera online, focused, and ready to delight players. If you run into any issues, head back to the <Link to="/support" className="text-brand-pink transition hover:text-brand-blue">support hub</Link> or reach out to the GameCam team directly.
        </p>
      </section>

      <section className="space-y-6">
        <div className="space-y-6">
          {steps.map((step) => (
            <article key={step.number} className="flex flex-col gap-4 rounded-3xl border border-brand-blue/15 bg-white p-6 shadow-card">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/70">Step {step.number}</p>
                <h2 className="mt-1 text-lg font-semibold text-brand-blue">{step.heading}</h2>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue/50">{step.subheading}</p>
              </div>
              <ul className="space-y-3 text-sm text-neutral-700">
                {step.details.map((detail) => (
                  <li key={detail} className="relative pl-6">
                    <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-pink" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              {step.resources && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {step.resources.map((resource) => (
                    <a
                      key={resource.href}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue transition hover:border-brand-pink hover:text-brand-pink"
                    >
                      <span>{resource.label}</span>
                      <span aria-hidden="true">-</span>
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-brand-blue/15 bg-white p-8 shadow-card text-sm text-neutral-700">
        <h2 className="text-lg font-semibold text-brand-blue">Need more help?</h2>
        <p className="mt-2">
          Message <a href="mailto:support@gamecam.se" className="font-semibold text-brand-pink transition hover:text-brand-blue">support@gamecam.se</a> or book a dedicated support slot via{' '}
          <a
            href="https://calendly.com/v---q3dy/tech-support?month=2025-09"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-pink transition hover:text-brand-blue"
          >
            our tech support calendar
          </a>. Our team is on standby during service hours to keep your installs on schedule.
        </p>
      </section>
    </div>
  );
}

export default GametraqSetupPage;



