# Implementation status

The public React/Vite portfolio, theme switcher, case-study pages, and local JSON editor are implemented. The site builds for GitHub Pages at `/portofolio/`. A hosted Express content server is prepared through `render.yaml`; when `DATA_DIR` is mounted, it persists edited public JSON, protected case studies, and credentials.

## Release status

The static build is published through the existing `gh-pages` branch. The current bundle contains redacted public stubs for protected projects. Earlier public commits still retain protected text because published Git history was left unchanged.

If protected case studies or remote admin editing are needed, deploy the content server with a persistent disk, set `ALLOWED_ORIGINS`, configure `public/api-config.json` to its HTTPS origin, then rebuild and republish. Without that server, the public portfolio remains available from bundled JSON and protected case studies remain unavailable online.

After each release, verify direct links, mobile navigation and keyboard access on the deployed site.
