import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products/gametraq', label: 'GAMETRAQ' },
  { to: '/products/shotgun', label: 'SHOTGUN' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/about-us', label: 'About Us' },
  { to: '/support', label: 'Support' }
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand-blue/10 bg-white/90 text-brand-blue backdrop-blur">
      <div className="relative w-full px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/assets/images/gamecam_logo_horizontal_black.png"
              alt="Gamecam AI Sport Analytics"
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium text-brand-blue/75 lg:flex">
            {links.map((item, index) => (
              <div key={item.to} className="flex items-center gap-3">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative inline-flex items-center gap-1 rounded-full px-4 py-2 transition ${
                      isActive
                        ? 'bg-brand-blue text-white shadow shadow-brand-blue/20'
                        : 'hover:bg-brand-blue/5 hover:text-brand-blue'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
                {(index === 0 || index === 2) && (
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-brand-blue/40">|</span>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/gamecam.se/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gamecam on Instagram"
              className="hidden rounded-full border border-brand-blue/20 p-2 text-brand-blue transition hover:border-brand-pink hover:text-brand-pink lg:inline-flex"
            >
              <img src="/assets/images/instagram_logo.png" alt="Instagram" className="h-10 w-10" />
            </a>
            <Link
              to="/products"
              className="hidden rounded-full bg-gradient-to-r from-brand-pink to-brand-cyan px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition hover:opacity-90 md:inline-flex"
            >
              Buy Now
            </Link>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-brand-blue/20 text-brand-blue transition hover:border-brand-pink hover:text-brand-pink lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
      </div>

      {open && (
        <nav className="lg:hidden">
          <ul className="space-y-2 border-t border-brand-blue/10 bg-white/96 px-4 py-6 text-sm text-brand-blue">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 transition hover:bg-brand-blue/5 hover:text-brand-blue ${
                      isActive ? 'bg-brand-blue/5 text-brand-pink' : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-brand-blue/10 bg-white/96 px-4 py-4">
            <a
              href="https://www.instagram.com/gamecam.se/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm font-semibold text-brand-blue transition hover:text-brand-pink"
            >
              <img src="/assets/images/instagram_logo.png" alt="Instagram" className="h-6 w-6" />
              Instagram
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
