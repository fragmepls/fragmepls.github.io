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
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── services/           # API and data fetching services
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

## TODO (Generated)

* Theme refinements
    * Add animated theme transitions, system sync and per-page theme metadata. Example files: src/styles/variables.css,
      src/hooks/useTheme.ts.
* **PWA & offline support**
    * Add public/manifest.json, a service worker (src/service-worker.ts) and caching strategies for assets and routes.
* Route-based code splitting
    * Lazy load pages and heavy components with React.lazy + Suspense and chunk naming in vite.config.ts.
* Image optimization & responsive images
    * Serve AVIF/WebP, use src/components/ResponsiveImage.tsx and preload critical images.
* **Accessibility improvements**
    * Add skip link, landmarks, keyboard focus styles, ARIA attributes and run automated checks with axe in CI.
* **SEO & metadata**
    * Dynamic meta tags per route, Open Graph, JSON-LD, sitemap.xml generator and robots.txt in public/.
* Search & filtering for projects
    * Client-side fuzzy search, tags, and filters. Component: src/components/ProjectList.tsx.
* Contact form + serverless endpoint
    * Add src/components/ContactForm.tsx and a Netlify/Vercel function or GitHub Action endpoint for submissions.
* CMS / content authoring
    * Add MDX blog support or headless CMS integration (Sanity/Contentful) and an admin workflow.
* **Tests & visual regression**
    * Unit tests (Jest/Testing Library), component snapshots, Storybook and visual tests (Chromatic or Percy).
* Performance budgets & CI checks
    * Lighthouse CI, build-time bundle analysis and automated performance regression alerts.
* Privacy-first analytics & consent
    * Integrate Plausible or self-hosted analytics behind a consent banner stored in localStorage.
* Error monitoring & observability
    * Add Sentry or similar for runtime errors, and Real User Monitoring (RUM) for performance.
* Resume/export & printable pages
    * Print-friendly styles and a PDF export endpoint or client-side generation.
* Developer experience
    * Husky pre-commit hooks, lint-staged, npm scripts for common tasks, and GitHub Actions for lint/test/build.
* Micro-interactions & accessibility-first animations
    * Subtle motion using CSS transform/opacity (prefers-reduced-motion aware) and animated background improvements in
      src/components/Background.tsx.
* Internationalization (i18n)
    * Add react-i18next and translation files under src/locales/ for localized content.
* Server-side rendering / prerendering for pages
    * Pre-render important pages for better SEO (Vite prerender plugin or static generation).
