# Gamecam.se

Marketing site for Gamecam hardware products built with React, TypeScript, Vite, TailwindCSS, and Stripe Checkout.

## Getting started

1. Install dependencies:
   `ash
   npm install
   `
2. Copy the environment template and set your Stripe keys:
   `ash
   cp .env.example .env
   # Fill in VITE_STRIPE_* values
   `
3. Run the development server:
   `ash
   npm run dev
   `

## Stripe configuration

- VITE_STRIPE_PUBLISHABLE_KEY: Publishable key from your Stripe dashboard.
- VITE_STRIPE_PRICE_GAMETRAQ and VITE_STRIPE_PRICE_SHOTGUN: Price IDs configured for each product (mode payment).
- VITE_STRIPE_SUCCESS_URL and VITE_STRIPE_CANCEL_URL: Redirect URLs after checkout (optional, defaults provided).

## Project structure

- src/pages: Top-level route pages (Home, Our Story, Product pages, Support, About, 404).
- src/components: Shared layout, navigation, and checkout components.
- src/data/products.ts: Central product copy and configuration for GAMETRAQ and SHOTGUN.
- 	ailwind.config.ts: Tailwind theme extensions for Gamecam branding.

## Available scripts

- 
pm run dev: Start Vite dev server.
- 
pm run build: Type-check and build production assets.
- 
pm run preview: Preview the production build locally.

## Next steps

- Integrate your preferred CMS or data source if product copy needs to be managed by non-developers.
- Connect webhooks or a backend function to fulfill Stripe checkout sessions.

