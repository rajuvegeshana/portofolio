# Admin and content

The React/Vite portfolio is hosted on GitHub Pages. Its content API is the Supabase `portfolio-api` Edge Function configured in `public/api-config.json`. Local preview and the live site use the same Supabase data.

## Editing

1. Open [the live admin panel](https://rajuvegeshana.github.io/portofolio/admin) and sign in with the approved Supabase Auth account.
2. Edit public projects, experience, About content, protected case studies, or the access key.
3. Save. Text changes appear on the live site without a Git commit or rebuild.

The Projects tab controls public listings and protection status. Its case-study editor includes a design process diagram field: enter one documented step per line as `Title || Description`. Protected case-study steps are edited separately under Access Control and remain private until a visitor unlocks that case study. Experience lets you add, edit, remove, and publish individual roles. About edits the site introduction, Skills & tools categories, and the public résumé PDF download URL. Access Control edits the protected-case key and private case-study bodies. Image fields accept the public URL of an asset in the Supabase `portfolio-images` bucket. Upload new approved images to that bucket through the Supabase dashboard, then paste their public URLs in the admin editor. The résumé is stored in the public `portfolio-documents` bucket, restricted to PDFs up to 5 MB. To replace it, open Admin → About, choose a PDF under 5 MB, and click Upload résumé PDF. The server validates and uploads it, then updates the public header and About download links. The existing PDF URL field remains available under the advanced option.

## Storage and access

Public projects, experience, and About data are in `portfolio_documents`. Full protected case studies are in `portfolio_private_projects`. The access key can be any non-empty text, including one character, and is stored as a scrypt hash in `portfolio_settings`. Short keys are easy to guess, so use a longer unique key when the case studies need privacy. Supabase Auth identifies admins, and `portfolio_admin_users` allowlists them. Browser sessions hold admin and unlock tokens in session storage.

The tables have RLS enabled and no direct browser grants. The Edge Function uses a server-side key and checks admin access before edits. Protected bodies are returned only after a valid access key or admin sign-in. Do not put protected details in the public listing or publish sensitive screenshots.

## Git history

Removing content from the current checkout and site bundle does not erase older published commits. The owner chose to leave Git history unchanged, so older commits may still contain protected text.
