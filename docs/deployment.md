# Deployment Guide

## 1. Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the development environment: `npm run dev`
4. Access the site at `http://localhost:3000`

## 2. Local Content Management (Admin)
1. Run the local content server: `npm run admin`
2. Access the Admin Panel at `http://localhost:3000/admin`
3. Use the dashboard to update projects, experience, and site content. All changes save directly to the `content/` folder.

The admin panel is password protected. The first run prints a generated password in the terminal; set
`ADMIN_PASSWORD` before starting to choose your own.

## 3. Protected Case Studies
Some case studies are confidential and are not part of the public site bundle. Their full text lives in
`server/data/locked-projects.json` (never committed) and the public site only carries a redacted stub.

- **Set the access key** — Admin → Access Control. One key unlocks every protected case study.
- **Protect a project** — Admin → Projects → “Protect with key”. The full text moves to the private store.
- **Edit protected content** — Admin → Access Control → “Edit content”.
- **Make it public again** — Admin → Projects → “Make public”.

The access key is stored as a scrypt hash. The plain key is never written to disk after saving.

## 4. GitHub Pages Deployment (static site)
1. Run `npm ci` and `npm run build` on the reviewed source.
2. Publish the contents of `dist/` to the existing `gh-pages` branch. GitHub Pages serves that branch.
3. Verify the site at `https://rajuvegeshana.github.io/portofolio/`, including direct links to `/about` and case studies.
4. When a content server is hosted, set `public/api-config.json` to its HTTPS origin, rebuild and republish. Until then, public content works from bundled JSON; protected case studies and admin editing require the local server.

The static bundle contains redacted stubs for protected case studies. Review the bundle before publishing. Earlier public Git commits may still contain protected text; replacing the live build does not erase that history.

## 5. Hosting the Content Server
The content server can also run as a hosted service, so the admin dashboard and protected case studies work from
any device. `render.yaml` describes a Render web service:

```bash
# Render reads render.yaml from the repo root.
```

Required environment variables:

| Variable | Purpose |
| --- | --- |
| `HOST` | `0.0.0.0` on a host, `127.0.0.1` locally. |
| `PORT` | Defaults to `3001`. |
| `DATA_DIR` | Persistent disk for private case studies, credentials, and editable public content. Mount a disk here. |
| `SESSION_SECRET` | Signs the session cookies. Generate a long random value. |
| `ADMIN_PASSWORD` | The admin dashboard password. Generated and printed in the log if left empty. |
| `ALLOWED_ORIGINS` | Comma separated origins allowed to make credentialed requests, e.g. `https://rajuvegeshana.github.io`. |
| `PUBLIC_MODE` | `1` on a host. Purely informational. |

The disk is what makes this work: without a persistent `DATA_DIR`, a redeploy wipes admin edits, protected content,
and the access key. On first boot, the server seeds editable public JSON from the repository. Later redeploys keep
the disk copy. The admin panel can import a backup of protected case studies if a disk is lost.

Once the server is up, point the static site at it by editing `public/api-config.json`:

```json
{ "apiUrl": "https://your-service.onrender.com" }
```

An empty `apiUrl` means “same origin”, which is what the local dev server and the self-hosted static site use.
