import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-brand-blue/20 bg-brand-blue/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-brand-blue sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-brand-white p-1 shadow shadow-brand-blue/20">
            <img src="/assets/gamecam_icon.png" alt="Gamecam icon" className="h-full w-full object-contain" />
          </span>
          <div>
            <p className="font-semibold text-brand-blue">CAA1 AB</p>
            <p className="text-xs text-brand-blue/70">Built in Sweden for the global padel community.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link className="hover:text-brand-pink" to="/support">
            Support
          </Link>
          <Link className="hover:text-brand-pink" to="/about-us">
            About Us
          </Link>
          <a className="hover:text-brand-pink" href="mailto:support@gamecam.se">
            support@gamecam.se
          </a>
          <span className="text-xs text-brand-blue/60">© {new Date().getFullYear()} CAA1 AB</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
