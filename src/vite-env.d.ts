/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_SUCCESS_URL?: string;
  readonly VITE_STRIPE_CANCEL_URL?: string;
  readonly VITE_STRIPE_PRICE_GAMETRAQ?: string;
  readonly VITE_STRIPE_PRICE_SHOTGUN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
