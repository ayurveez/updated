
# Ayurveez - BAMS Learning Platform

Ayurveez is an AI-powered learning platform designed for BAMS (Bachelor of Ayurvedic Medicine and Surgery) students. It features course management, study scheduling, wellness resources, and AI companions (GuruJi & Sathi) powered by Google's Gemini API.

## Features

- **Courses**: Professional year-wise breakdown of subjects (1st, 2nd, 3rd Proff).
- **AI Chat**: 
  - **GuruJi**: General Ayurvedic queries.
  - **Sathi**: Personalized dashboard assistant for clinical doubts.
- **Study Scheduler**: AI-generated study routines based on student lifestyle.
- **Wellness Zone**: Ayurvedic tips for exam stress and anxiety.
- **Admin Dashboard**: Content management and Student Access Code generation.

Supabase-backed Access Codes
--------------------------------
- New serverless API: `api/codes` (create/list/validate/delete/toggle-block) backed by Supabase Postgres.
- Migration SQL at `db/migrations/001_create_assigned_codes.sql` to create the `assigned_codes` table.
- Additional migration `db/migrations/002_add_encryption_columns.sql` adds encrypted code support (`code_encrypted`, `code_enc_iv`, `is_encrypted`).
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables (see `.env.example`).

Environment variables for encrypted admin reveal (optional):
- `ACCESS_CODE_ENCRYPTION_KEY` — base64-encoded 32-byte AES-256-GCM key used to encrypt plaintext codes server-side.
- `ADMIN_DECRYPT_SECRET` — shared secret that admins must provide (via `x-admin-secret` header) to call `/api/codes/decrypt` and reveal a code once.

Client realtime (optional but recommended):
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — required for client-side realtime subscriptions so Admin dashboards automatically update when codes are added/changed from any device. Add these to your Vercel (or other host) environment as `VITE_` prefixed variables so they're available in the browser build.


Notes on hashing and optional admin reveal:
- Generated codes are stored hashed-only in the database. The server hashes codes and does not keep plaintext in DB or metadata unless you enable encrypted storage (see the environment variables above).
- By default, the admin UI shows plaintext only once immediately after generation; after that the list shows a masked indicator ("HASHED").
- Optional admin reveal: If `ACCESS_CODE_ENCRYPTION_KEY` is set, the server will encrypt the plaintext (AES-256-GCM) and store `code_encrypted`. Admins can reveal a specific code in the Admin Dashboard by entering `ADMIN_DECRYPT_SECRET` (sent in `x-admin-secret` header). Revealed plaintext is shown only once and is not stored in plaintext in the DB.


Migration (import existing local codes):
1. Export your local codes into a JSON file matching the `AccessCode` shape (array of objects). Save it as `local_codes.json` next to the repo root.
2. Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in your environment.
3. Run:

```bash
npm run migrate-local-codes -- ./local_codes.json
```

This creates hashed-only rows in Supabase (no plaintext stored).

Local fallback: the app still supports localStorage for offline/demo usage when Supabase is not configured.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ayurveez.git
    cd ayurveez
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
        - Create a `.env` file in the root directory or copy `.env.example`.
        - Add your Gemini API Key (recommended name):
            ```
            VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
            ```
            *(You can also use `VITE_API_KEY` as a fallback.) Note: Vite embeds `import.meta.env.*` at build time — if you change or add these values you must re-run `npm run build` and redeploy the generated `docs/` (or whatever your build output) for the changes to appear on the live site.*

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

This project can be easily deployed to Vercel, Netlify, or GitHub Pages.

**Vercel (recommended) — serverless proxy setup**

- Vercel has a generous free tier suitable for hobby projects and small apps.
- This repo includes a serverless proxy at `api/gemini/index.ts` that securely calls Google Gemini using a server-side environment variable `GEMINI_API_KEY` (so the API key is not exposed in client bundles).

How to deploy and update the API key on Vercel:

1. Import the repository into Vercel (https://vercel.com/new)
2. In the Vercel dashboard for your project, go to **Settings → Environment Variables**.
   - Add `GEMINI_API_KEY` with your API key and set it for `Production` (and `Preview` if you want testing builds to have access).
3. Trigger a redeploy (push a commit or use the Vercel Dashboard "Deploy").

To rotate or update the API key later:

- Go to **Settings → Environment Variables** in your Vercel project, update the value for `GEMINI_API_KEY`, and redeploy the site. The serverless proxy will immediately use the new secret on the next deployment.

Security note: If you previously embedded keys into static builds (e.g., `VITE_GEMINI_API_KEY` in `.env`), rotate those keys in Google Cloud to avoid leaks. Using the serverless `GEMINI_API_KEY` keeps your key private on Vercel.


## Credits

Created by **Dr. Ravi Shankar Sharma**
