# gamecam.se

This is the GameCam marketing site built with Vite + React + Tailwind and deployed on Vercel.

## Order form → Google Sheet

We now use the Google Sheets API with a Google Cloud service account (kept in Vercel env vars). No Apps Script is required. The form calls `/api/order`, which appends a row to your sheet.

### Option A: Google Sheets API (recommended)

1. Google Cloud setup
   - Create a project in Google Cloud Console.
   - Enable the "Google Sheets API" for the project.
   - Create a Service Account (IAM & Admin → Service Accounts) and create a key (JSON).
   - Note the service account email and private key from the JSON.

2. Share your Google Sheet
   - Create a Google Sheet with a header row, e.g.: `timestamp, product, name, type, companyName, taxNumber, deliveryAddress, phone, email, quantity, message, unitPrice, subtotal, total, currency, userAgent`.
   - Share the sheet with the service account email (Editor access).
   - Copy the Spreadsheet ID (from the URL) and the sheet/tab name (default is `Sheet1`).

3. Configure Vercel environment variables
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` → the service account email
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` → the private key (replace newlines with \n)
   - `GOOGLE_SHEETS_SPREADSHEET_ID` → your spreadsheet ID
   - `GOOGLE_SHEETS_SHEET_NAME` → optional, defaults to `Sheet1`

4. Deploy
   - After setting env vars, redeploy. The function `api/order.ts` will append rows directly to your sheet using the official Google Sheets API (via `googleapis`).

### Option B: Apps Script Web App (legacy fallback)

- If you prefer Apps Script instead, set `GSHEET_WEBAPP_URL` in Vercel and the serverless function will forward payloads to that Web App automatically (no code changes). The client also supports a direct Apps Script endpoint in local dev via `VITE_GSHEET_ENDPOINT`.

### Local development (optional)

For local testing without Google Cloud credentials, you can set a direct Apps Script endpoint in a local `.env` file:

```
VITE_GSHEET_ENDPOINT=https://script.google.com/macros/s/xxxx/exec
```

The client will try the serverless proxy `/api/order` first (Sheets API), then fall back to `VITE_GSHEET_ENDPOINT` (Apps Script), and finally open an email as a last resort.

## Deploy configuration

- `vercel.json` preserves `/api/*` routes and rewrites all other paths to the SPA index.
- Build with `npm run build`.

## Pricing Update (2025-11-07)

Current pricing reflected in the order form:

- GAMETRAQ subscription: €300/month or €3,000/year (plan toggle added to `OrderFormPage.tsx`).
- SHOTGUN ball machine: one-time purchase €3,450 + shipping.

The serverless function (`api/order.ts`) now writes a `plan` column (monthly | yearly | one-time) for downstream reporting. The legacy sheet header should be updated to include this column if not already present.
