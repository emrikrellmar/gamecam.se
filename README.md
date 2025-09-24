# GameCam Website

A responsive marketing site for GameCam hardware, featuring product overviews, setup guides, and support resources for padel clubs adopting the platform.

## Features
- **Product catalogue** – Detail pages for GAMETRAQ and SHOTGUN with specs, media, pricing, and direct purchase / demo actions.
- **Support hub** – Quick access to GAMETRAQ and SHOTGUN setup guides, FAQs, and scheduling links for the GameCam team.
- **Story & team pages** – Timeline, team bios, and company values to introduce the brand.
- **Asset organisation** – Images, videos, and PDFs grouped in `public/assets/images`, `public/assets/videos`, and `public/assets/pdfs` for simpler management.

## Tech stack
- [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and builds.
- [Tailwind CSS](https://tailwindcss.com/) utility classes for styling.
- [React Router](https://reactrouter.com/) for page routing.

## Getting started
```bash
npm install
npm run dev
```
Visit http://localhost:5173 (default Vite port) to develop locally. Use `npm run build` for production assets.

## Support setup guides
- `/support/gametraq-setup` – Step-by-step installation for the GAMETRAQ camera system.
- `/support/shotgun-setup` – Preparation, troubleshooting, and maintenance for the SHOTGUN ball machine.

## Deployment
Built for static hosting (e.g., Vite preview, Netlify, Vercel). Ensure environment variables for Stripe/checkout pages are configured before deploying.
