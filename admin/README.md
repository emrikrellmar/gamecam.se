# Admin Dashboard

This is the admin dashboard for GameCam, located at [admin.gamecam.io](https://admin.gamecam.io).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase
- **Hosting**: Vercel

## Deployment Instructions

1.  **Vercel Project**: Create a new project in Vercel.
2.  **Root Directory**: When importing the repository, change the **Root Directory** to `admin`.
3.  **Environment Variables**: Add the following variables in Vercel Project Settings:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4.  **Domain**: Add `admin.gamecam.io` to the Domains section in Vercel.

## Local Development

To run locally, you need to create a `.env.local` file in this directory with the Supabase keys.

```bash
npm run dev
```
