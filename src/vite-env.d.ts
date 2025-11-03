/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Google Sheets (Apps Script) Web App endpoint for order form submissions
  readonly VITE_GSHEET_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
