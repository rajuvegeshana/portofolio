# Portfolio Redesign

A React/Vite portfolio hosted on GitHub Pages. Public content, protected case studies, access settings, and project image exports are hosted in Supabase.

## Stack

- React 18, Vite, Tailwind CSS
- Supabase Postgres, Auth, Storage, and Edge Functions
- GitHub Pages for the static site

## Local preview

Run `npm ci` and `npm run dev`, then open the Vite address. The preview reads the same hosted Supabase content as the live site. Edit content through [the live admin panel](https://rajuvegeshana.github.io/portofolio/admin); changes appear without rebuilding the site.

See `docs/admin-setup.md` for content editing and `docs/deployment.md` for release steps. Earlier public Git commits may still contain protected text; the owner chose to leave published history unchanged.
