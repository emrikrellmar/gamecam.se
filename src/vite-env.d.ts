/// <reference types="vite/client" />

interface ImportMetaEnv {
  // I can point to a direct Apps Script Web App when I want to bypass the proxy
  readonly VITE_GSHEET_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
