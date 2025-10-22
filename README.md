# Personal Portfolio Website

This project is a personal portfolio website built with React and Vite, showcasing various projects and skills. It
features an interactive block background and is designed to be deployed as a static site on GitHub Pages.

[fragmepls.dev](https://fragmepls.dev/)

## Project Structure

```
/
├── public/                 # Static assets
├── src/                    # Source files
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── styles/             # Global and component-specific styles
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point of the application
├── eslint.config.js        # ESLint configuration
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite configuration
```

## Deployment

This site is configured for continuous deployment to GitHub Pages using GitHub Actions.

1. **Workflow**: A GitHub Actions workflow automatically builds and deploys the site on every push to the `master`
   branch.
2. **Process**: The workflow installs dependencies, runs `npm run build` to create a production build, and deploys the
   contents of the `/dist` directory.
3. **Hosting**: GitHub Pages is configured to serve the static files, enabling automated and seamless updates to the
   live site.
4. **Client-Side Routing**: A `404.html` file in the `public` directory handles redirects for the single-page
   application's routing, ensuring that direct navigation to subpages works correctly on GitHub Pages.
5. **Custom Domain**: A `CNAME` file is present in the `public` directory to map the deployment to a custom domain.

## Technologies Used

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)

## TODO

* ~~**Theme toggle** (light/dark) that updates styles/variables.css, persists in localStorage, and syncs with OS preference.~~ Done
* **PWA support:** add public/manifest.json, service worker, and offline caching for assets and pages.
* **Route-based** code splitting / lazy loading for pages and heavy components (use React.lazy + Suspense).
* **Image and asset** optimization / responsive images (srcset, lazy loading, modern formats).
* **Accessibility improvements:** skip link, focus outlines, ARIA roles, semantic landmarks, color contrast checks.
* **Keyboard navigation** and keyboard shortcuts for common actions (toggle theme, skip to work).
* **Consent banner** and privacy‑first analytics (Plausible or self‑hosted) with opt-in.
* **Contact form** with validation and spam protection (reCAPTCHA or serverless form endpoint via Netlify/Vercel/API).
* **SEO and metadata:** dynamic meta tags, Open Graph, sitemap.xml and robots.txt in public/.
* **Progressive reveal** / scroll animations using src/hooks/useIntersectionObserver.ts for performance and engagement; respect prefers-reduced-motion.
* **Tests and CI:** unit tests for components and hooks, Storybook for UI, and GitHub Actions for lint/test/build deploy.
* **CMS** or headless content source for projects/blog posts (MDX, Contentful, Sanity) and an admin workflow.
* **Resume export** / print stylesheet and a downloadable PDF generator endpoint.
* **Live previews** or embeds (code sandbox / GitHub gist) and a copy-to-clipboard button for code samples.
* **Performance monitoring** & Lighthouse audits integrated into CI and report generation.
