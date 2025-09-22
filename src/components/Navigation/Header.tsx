import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/products/gametraq', label: 'GAMETRAQ' },
  { to: '/products/shotgun', label: 'SHOTGUN' },
  { to: '/support', label: 'Support' },
  { to: '/about-us', label: 'About Us' }
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand-blue/10 bg-white/95 text-brand-blue backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/assets/gamecam_logo_horizontal_black.png"
            alt="Gamecam AI Sport Analytics"
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-base font-medium text-brand-blue/80 lg:flex">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors hover:text-brand-blue ${isActive ? 'text-brand-pink' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/gamecam.se/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gamecam on Instagram"
            className="hidden lg:inline-flex"
          >
            <img src="/assets/instagram_logo.png" alt="Instagram" className="h-8 w-8" />
          </a>
          <Link
            to="/products"
            className="hidden rounded-full bg-gradient-to-r from-brand-pink to-brand-cyan px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 transition hover:opacity-90 md:inline-flex"
          >
            Shop Now
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-brand-blue/20 text-brand-blue lg:hidden"
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
              <img src="/assets/instagram_logo.png" alt="Instagram" className="h-6 w-6" />
              Instagram
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
