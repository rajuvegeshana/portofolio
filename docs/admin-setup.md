# Admin Panel & Content Architecture

The portfolio is a static React/Vite site with an admin dashboard at `/admin`.
The deployed site uses a Supabase Edge Function and Postgres for content. Local development can still use the Express server and JSON files.

---

## 1. Architecture Stack
- **Frontend:** React 18 + Vite + Tailwind CSS (design tokens supporting all 3 themes).
- **Routing:** React Router (`BrowserRouter` with a GitHub Pages fallback).
- **Content Format:** JSON files in `content/`.
- **Content API:** Supabase Edge Function (`supabase/functions/portfolio-api/index.ts`) for the deployed site; Express (`server/index.js`) for local development.
- **Deployment:** Static bundle on GitHub Pages with Supabase as the hosted content store.

---

## 2. How the Admin Works
1. Create a Supabase Auth user in the project dashboard and add its user ID to `public.portfolio_admin_users`.
2. Open the live `/admin` page and sign in with that user's email and password.
3. Edit projects, experience entries, About content, the access key, and protected case studies.
4. Changes save to Supabase and appear on the live site without a Git commit. Images in `public/images/` still require a site build and deployment.

For local JSON editing, run `npm run admin` and open `http://localhost:3000/admin`. The local Express server accepts its existing password; the email field is only used by Supabase Auth.

The dashboard has four tabs:

| Tab | What it edits |
| --- | --- |
| Projects | The public listing for every case study, plus the protect / make-public control. |
| Experience | Roles and clients. |
| About | Homepage and About page copy. |
| Access Control | The access key, the full text of protected case studies, importing content, and the admin password. |

---

## 3. Protected Case Studies
A case study can be kept off the public site.

- **Public listing** — `content/projects.json` keeps a redacted stub: title, category, role, year, teaser, tags.
  The teaser can name the product; it must not name a confidential client or expose internal detail.
- **Full text** — stored in `portfolio_private_projects` on Supabase if explicitly imported, or in `server/data/locked-projects.json` locally. The Edge Function returns it only after an access key is accepted.
- **The key** — one key for all protected case studies, stored only as a scrypt hash. The plain key is never persisted on the server.
- **Sessions** — Supabase Auth verifies admin accounts; the browser keeps the admin and unlock tokens in session storage for the current tab.

The private directory is git-ignored. It never belongs in the repository, and the public site bundle never contains it. `public/api-config.json` tells the bundle where the Edge Function lives.

---

## 4. Security & Boundaries
- Supabase tables have RLS enabled and no direct browser grants. The Edge Function uses a server-side key, checks the Auth user against `portfolio_admin_users`, and never sends the server key to the browser.
- Browser calls are restricted to the portfolio origin and local development origins.
- Login and unlock attempts are rate limited to 12 per 15 minutes per IP.
- Locally, the Express server binds to `127.0.0.1` and writes only to the content and private data directories.

## 5. A note on git history
Removing protected text from the working tree does not remove it from commits that already contain it. If a case
study was pushed to a public repository before it was protected, the old text stays readable in that repository's
history until it is rewritten. Purge the history before sharing a link to the repository.
