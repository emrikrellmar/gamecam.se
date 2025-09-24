import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-blue/15 bg-white">
      <div className="relative w-full px-4 py-8 text-sm text-brand-blue sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-brand-blue/15 bg-white shadow-inner">
              <img src="/assets/images/gamecam_icon.png" alt="Gamecam icon" className="h-8 w-8 object-contain" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">GameCam</p>
              <p className="text-[0.7rem] text-brand-blue/60">Built in Sweden for the global padel community.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-brand-blue/70">
            <Link className="transition hover:text-brand-pink" to="/support">
              Support
            </Link>
            <Link className="transition hover:text-brand-pink" to="/about-us">
              About Us
            </Link>
            <a className="transition hover:text-brand-pink" href="mailto:support@gamecam.se">
              support@gamecam.se
            </a>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1 text-[0.7rem] text-brand-blue/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span>Metallgatan 11</span>
            <span className="hidden sm:inline">|</span>
            <span>262 72 Ängelholm, Sweden</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span>VAT SE559202258501</span>
            <span className="hidden sm:inline">|</span>
            <span>{year} CAA1 AB</span>
          </div>
        </div>
        <div className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.35em] text-brand-blue/70">
          Stay curious. Be hungry. Act friendly.
        </div>
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
      </div>
    </footer>
  );
}

export default Footer;
