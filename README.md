# Portfolio — Adrian Arroyo Perez

Interactive developer portfolio with terminal-driven hero, 3D particle background, and AI-first narrative.

## Tech Stack

- **Astro 5** — Static site generator with island architecture
- **React** — Interactive components (Terminal, Particles)
- **Three.js** — 3D particle background with mouse parallax
- **Tailwind CSS v4** — Utility-first styling
- **TypeScript** — Type safety throughout

## Features

- Interactive terminal in the hero (type `help` to explore)
- 3D particle field with mouse interaction
- "Powered by AI" section showcasing AI-driven workflow
- Responsive design with mobile hamburger menu
- GitHub Pages deployment via GitHub Actions
- Can also be served via Caddy on a custom server

## Development

```bash
npm install
npm run dev      # Start dev server at localhost:4321
npm run build    # Build to ./dist/
npm run preview  # Preview production build
```

## Deployment

**GitHub Pages:** Push to `main` — GitHub Actions builds and deploys automatically.

**Custom server (Caddy):**
```bash
npm run build
caddy start --config /etc/caddy/Caddyfile
```

## Built With

Designed and developed by Adrian Arroyo Perez, powered by Claude Code.
