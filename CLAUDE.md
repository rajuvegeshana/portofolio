# CLAUDE.md

## Project Architecture
This is a static React/Vite portfolio.
- **Content:** Located in `content/*.json`.
- **Admin:** Local-only server at `server/index.js` running on `127.0.0.1:3001`.
- **Design System:** Tailwind CSS with CSS variables for theme switching.

## Rules
- Do not overwrite content files manually without checking if the admin panel needs updates.
- Keep the `server/` directory lightweight; it is for content persistence only.
- Ensure all public assets are in `public/images/`.
- Always respect the `docs/` folder for architectural decisions.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
