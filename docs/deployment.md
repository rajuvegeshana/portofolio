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

## 3. GitHub Pages Deployment
1. **GitHub Repository:** Ensure your repository is initialized and pushed to GitHub.
2. **Build for Production:** `npm run build`
3. **Configure Pages:** Go to repository settings > Pages > select branch (e.g., `main`) and root directory `/`.
4. **Deploy:** The site will be published to `https://<username>.github.io/<repository-name>/`.
5. **Verify:** Check the production URL after the deployment action completes.
