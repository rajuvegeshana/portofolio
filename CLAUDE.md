# Project architecture

This is a static React/Vite portfolio. GitHub Pages hosts the built site.

- **Content:** Public content is in Supabase `portfolio_documents`; protected case studies are in `portfolio_private_projects`.
- **Admin:** The live `/admin` page uses Supabase Auth and the `portfolio-api` Edge Function.
- **Images:** Approved public project exports are in the Supabase `portfolio-images` Storage bucket.
- **Design system:** Tailwind CSS with CSS variables for theme switching.

## Rules

- Edit portfolio content through the admin panel or a reviewed Supabase migration. Keep protected content out of public listings and static bundles.
- Keep Supabase secret keys out of client code and `public/`.
- Read `docs/` for architecture and deployment decisions.
