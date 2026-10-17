# Local Admin & Static Architecture Proposal

To fulfill the requirement that Harikrishna can update his portfolio without editing source code, we propose a **Local-First Static Architecture with a Node.js Content Admin API**.

---

## 1. Architecture Stack
- **Frontend:** React 18 + Vite + Tailwind CSS (modular design tokens supporting all 3 themes).
- **Routing:** React Router (HashRouter or BrowserRouter with fallback for GitHub Pages).
- **Content Format:** Structured Markdown (`.md` / `.mdx`) and JSON files stored locally in `content/`.
- **Local Admin Panel:** A built-in local web dashboard (`/admin`) running via a lightweight Express.js local server (`server/index.js`).
- **Deployment:** Static HTML/JS bundle compiled via Vite and hosted on GitHub Pages.

---

## 2. How the Local Admin Works
1. When Harikrishna wants to update his portfolio, he runs `npm run admin` in his terminal.
2. This launches a secure local Express server on `http://localhost:3001` bound strictly to `127.0.0.1`.
3. The React app connects to this local API to read/write JSON and Markdown files inside the project repository.
4. He can update projects, add case studies, reorder experience entries, and manage media files visually through the browser.
5. Changes are saved directly to local files in the repository.
6. Harikrishna reviews the git diff, commits, and pushes to GitHub to publish.
7. The public website is 100% static and runs independently without needing the admin server.

---

## 3. Security & Boundaries
- The local server only accepts requests from `127.0.0.1` / `localhost`.
- File write operations are strictly sandboxed to `content/` and `public/images/`.
- No database is required. Everything is version-controlled via Git.
