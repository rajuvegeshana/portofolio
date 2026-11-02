# Deployment

## Local preview

Run `npm ci` and `npm run dev`. The local site reads the hosted Supabase content through `public/api-config.json`. It does not maintain a local content database.

## Content and images

Use the live `/admin` page to edit projects, experience, About content, the protected-case access key, and private case studies. Changes save in Supabase and appear without rebuilding. Upload approved public image exports to the public `portfolio-images` Storage bucket and paste the resulting public URL into the project image fields. Keep confidential images out of the public bucket. The public résumé PDF lives in the separate `portfolio-documents` bucket. Admin → About controls its download URL; the `?download=filename.pdf` query makes the browser save the file.

## Static site release

1. Run `npm ci` and `npm run build` on reviewed source.
2. Publish the contents of `dist/` to the existing `gh-pages` branch.
3. Check the homepage, `/about`, project pages, images, admin login, and protected-case unlock at [the live site](https://rajuvegeshana.github.io/portofolio/).

The site code and build assets remain on GitHub Pages. Editable content and project image exports are served by Supabase. Rebuild only when site code or `public/api-config.json` changes.

## Supabase service

The `portfolio-api` Edge Function in `supabase/functions/portfolio-api/index.ts` reads and writes the Postgres tables created by `supabase/migrations/20261029_portfolio_content.sql`. It must deploy with `verify_jwt = false` because public reads and access-key requests are allowed; the function performs its own authorization for administrative and protected endpoints. Supabase secret keys stay in the function environment and must never be copied into `public/` or client variables.

Supabase Auth users become portfolio admins only when their IDs are added to `portfolio_admin_users`. The public Storage bucket is for approved portfolio images only. Keep protected case studies in `portfolio_private_projects`.

Older public Git commits may still contain protected text. The owner chose to leave that history unchanged.
