# Admin Panel & Content Architecture

The portfolio is a static React/Vite site with a small content server that reads and writes JSON in `content/`.
The admin dashboard is a screen in that same React app, reached at `/admin`.

---

## 1. Architecture Stack
- **Frontend:** React 18 + Vite + Tailwind CSS (design tokens supporting all 3 themes).
- **Routing:** React Router (`BrowserRouter` with a GitHub Pages fallback).
- **Content Format:** JSON files in `content/`.
- **Content API:** Express server (`server/index.js`), bound to `127.0.0.1` locally and to `0.0.0.0` when hosted.
- **Deployment:** Static bundle on GitHub Pages; the content server runs locally or on a host.

---

## 2. How the Admin Works
1. Start the content server: `npm run admin`.
2. Open `http://localhost:3000/admin` and sign in with the admin password.
3. Edit projects, experience entries, the access key and protected case studies.
4. Changes save directly to the local files.
5. Review the git diff, commit, and push to publish.

The dashboard has three tabs:

| Tab | What it edits |
| --- | --- |
| Projects | The public listing for every case study, plus the protect / make-public control. |
| Experience | Roles and clients. |
| Access Control | The access key, the full text of protected case studies, importing content, and the admin password. |

---

## 3. Protected Case Studies
A case study can be kept off the public site.

- **Public listing** — `content/projects.json` keeps a redacted stub: title, category, role, year, teaser, tags.
  The teaser can name the product; it must not name a confidential client or expose internal detail.
- **Full text** — `server/data/locked-projects.json`, served only after the access key is entered.
- **The key** — one key for all protected case studies, stored as a scrypt hash in `server/data/access.json`.
  The plain key is never persisted.
- **Sessions** — the admin panel and the unlocked state are signed cookies (`HttpOnly`, `SameSite=Lax` on the same
  origin, `SameSite=None; Secure` when the static site and the API are on different origins).

The private directory is git-ignored. It never belongs in the repository, and the public site bundle never contains
it. `public/api-config.json` tells the bundle where the content server lives.

---

## 4. Security & Boundaries
- Locally the server binds to `127.0.0.1` only. A host needs `HOST=0.0.0.0`, and then it is a public service with
  real authentication — the admin password and the access key are the only barriers, so the key must be a long,
  unguessable string and the admin password must be changed from its generated value.
- Credentialed cross-origin requests are restricted to `ALLOWED_ORIGINS`.
- Login and unlock attempts are rate limited to 12 per 15 minutes per IP.
- Writes are restricted to `content/`, `public/images/` and the private data directory.

## 5. A note on git history
Removing protected text from the working tree does not remove it from commits that already contain it. If a case
study was pushed to a public repository before it was protected, the old text stays readable in that repository's
history until it is rewritten. Purge the history before sharing a link to the repository.
