# Portfolio Personal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (ES/EN) static portfolio website for Adrian Arroyo Perez, hosted on GitHub Pages, with dark mode theme and creative animations.

**Architecture:** Hybrid static site — landing page (scroll) + dedicated projects page. Vanilla HTML/CSS/JS with JSON-based i18n. Zero dependencies, zero build tools. Spanish text inline in HTML as fallback; i18n.js overlays translations from JSON files.

**Tech Stack:** HTML5, CSS3 (custom properties, @keyframes, Intersection Observer), JavaScript vanilla, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-03-23-portfolio-design.md`

---

## File Structure

```
portfolio/
├── index.html              # Landing page (all sections)
├── projects.html           # All 11 projects with filter
├── 404.html                # Simple redirect to landing
├── css/
│   └── styles.css          # All styles: theme, layout, components, animations, responsive
├── js/
│   ├── i18n.js             # Translation engine (fetch JSON, apply to DOM, persist lang)
│   ├── main.js             # Navbar scroll, hamburger menu, smooth scroll, scroll-reveal
│   └── particles.js        # Floating particle effect on canvas
├── i18n/
│   ├── es.json             # Spanish translations (complete)
│   └── en.json             # English translations (complete)
├── assets/
│   └── cv-adrian-arroyo.pdf # Downloadable CV
└── README.md
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `css/styles.css` (empty placeholder)
- Create: `js/i18n.js` (empty placeholder)
- Create: `js/main.js` (empty placeholder)
- Create: `js/particles.js` (empty placeholder)
- Create: `i18n/es.json` (empty placeholder)
- Create: `i18n/en.json` (empty placeholder)
- Create: `.gitignore`

- [ ] **Step 1: Initialize git and create directory structure**

```bash
cd /c/Users/aaperez/portfolio
git init
mkdir -p css js i18n assets
```

- [ ] **Step 2: Create .gitignore**

```
.superpowers/
.DS_Store
Thumbs.db
*.swp
```

- [ ] **Step 3: Create empty placeholder files**

```bash
touch css/styles.css js/i18n.js js/main.js js/particles.js i18n/es.json i18n/en.json
```

- [ ] **Step 4: Copy CV PDF to assets**

```bash
cp "/c/Users/aaperez/Downloads/CV Adrian Arroyo Perez.pdf" assets/cv-adrian-arroyo.pdf
```

If the file does not exist at that path, skip this step and copy it manually later.

- [ ] **Step 5: Create README.md**

```markdown
# Portfolio — Adrian Arroyo Perez

Personal portfolio website showcasing my professional experience, projects, and technical skills.

## Tech Stack

- HTML5 + CSS3 + JavaScript (vanilla)
- JSON-based i18n (ES/EN)
- GitHub Pages

## Local Development

Open `index.html` in a browser. For i18n to work via fetch, use a local server:

```bash
npx serve .
```

## Deployment

Hosted on GitHub Pages from the `main` branch.
```

- [ ] **Step 6: Create placeholder og-image.png**

Create a simple 1200x630 placeholder image for Open Graph. This can be replaced later with a proper design. For now, create a minimal SVG-based placeholder:

```bash
# Create a minimal placeholder (replace with a real image later)
echo "placeholder" > assets/og-image.png
```

Note: Replace `assets/og-image.png` with a real 1200x630 image before final deployment. Tools like Canva or Figma can generate one with your name and title.

- [ ] **Step 7: Commit scaffolding**

```bash
git add .gitignore css/ js/ i18n/ assets/ README.md
git commit -m "chore: scaffold project directory structure"
```

---

### Task 2: CSS Foundation

**Files:**
- Create: `css/styles.css`

All styles for the entire site: CSS custom properties, reset, layout, navbar, hero, sections, cards, timeline, contact, footer, animations, responsive breakpoints, prefers-reduced-motion, and utility classes.

- [ ] **Step 1: Write styles.css — CSS custom properties and reset**

```css
/* === CUSTOM PROPERTIES === */
:root {
  --bg-primary: #0a0a0f;
  --bg-card: rgba(255,255,255,0.03);
  --border-card: rgba(255,255,255,0.06);
  --border-hover: rgba(0,255,136,0.3);
  --text-primary: #e0e0e0;
  --text-secondary: #999;
  --text-muted: #666;
  --gradient-green: #00ff88;
  --gradient-blue: #00bbff;
  --gradient-purple: #8b5cf6;
  --gradient-primary: linear-gradient(135deg, var(--gradient-green), var(--gradient-blue));
  --gradient-full: linear-gradient(135deg, var(--gradient-green), var(--gradient-blue), var(--gradient-purple));
  --font-stack: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --nav-height: 72px;
  --max-width: 1100px;
}

/* === RESET === */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: calc(var(--nav-height) + 32px); }
body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-stack);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { font-family: inherit; cursor: pointer; }
img { max-width: 100%; display: block; }
```

- [ ] **Step 2: Write styles.css — Navbar**

```css
/* === NAVBAR === */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 40px; height: var(--nav-height);
  background: rgba(10,10,15,0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: background 0.3s;
}
.navbar.scrolled { background: rgba(10,10,15,0.95); }
.logo { font-size: 20px; font-weight: 800; }
.logo span { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.nav-links { display: flex; gap: 28px; }
.nav-links a { color: var(--text-secondary); font-size: 14px; transition: color 0.3s; }
.nav-links a:hover { color: var(--gradient-green); }
.nav-right { display: flex; align-items: center; gap: 16px; }
.lang-toggle {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  color: #fff; padding: 6px 16px; border-radius: var(--radius-full); font-size: 13px;
  transition: border-color 0.3s;
}
.lang-toggle:hover { border-color: var(--gradient-green); }
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; padding: 4px; cursor: pointer;
}
.hamburger span {
  display: block; width: 24px; height: 2px; background: var(--text-primary);
  transition: transform 0.3s, opacity 0.3s;
}
.hamburger[aria-expanded="true"] span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.hamburger[aria-expanded="true"] span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* Mobile nav overlay */
.nav-mobile {
  display: none; position: fixed; top: var(--nav-height); left: 0; right: 0; bottom: 0;
  background: rgba(10,10,15,0.98); flex-direction: column; align-items: center;
  justify-content: center; gap: 32px; z-index: 99;
}
.nav-mobile.open { display: flex; }
.nav-mobile a { color: var(--text-primary); font-size: 24px; transition: color 0.3s; }
.nav-mobile a:hover { color: var(--gradient-green); }
```

- [ ] **Step 3: Write styles.css — Hero section**

```css
/* === HERO === */
.hero {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: calc(var(--nav-height) + 40px) 40px 80px;
  position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(0,187,255,0.06) 0%, transparent 50%);
  animation: heroPulse 8s ease-in-out infinite alternate;
}
@keyframes heroPulse { from { opacity: 0.5; } to { opacity: 1; } }
.hero-content { position: relative; z-index: 1; max-width: 700px; }
.hero-tag {
  display: inline-block; padding: 6px 16px; border-radius: var(--radius-full); font-size: 13px;
  background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); color: var(--gradient-green);
  margin-bottom: 20px;
}
.hero h1 { font-size: 52px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
.hero h1 .gradient { background: var(--gradient-full); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero p { font-size: 18px; color: var(--text-secondary); margin-bottom: 32px; }
.hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: var(--radius-md); font-size: 15px; font-weight: 600;
  background: var(--gradient-primary); color: #000; border: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,255,136,0.2); }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: var(--radius-md); font-size: 15px; font-weight: 600;
  background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.15);
  transition: border-color 0.3s, transform 0.2s;
}
.btn-secondary:hover { border-color: var(--gradient-green); transform: translateY(-2px); }
```

- [ ] **Step 4: Write styles.css — Sections, About, Stack, Projects**

```css
/* === SECTIONS === */
.section { padding: 80px 40px; }
.section-inner { max-width: var(--max-width); margin: 0 auto; }
.section-title { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
.section-title span { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.section-subtitle { color: var(--text-muted); font-size: 16px; margin-bottom: 48px; }

/* === ABOUT === */
.about-text { font-size: 17px; color: var(--text-secondary); max-width: 720px; line-height: 1.8; }

/* === TECH STACK === */
.tech-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }
.tech-card {
  background: var(--bg-card); border: 1px solid var(--border-card);
  border-radius: var(--radius-lg); padding: 20px 16px; text-align: center;
  transition: border-color 0.3s, transform 0.2s;
}
.tech-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }
.tech-icon { font-size: 28px; margin-bottom: 8px; }
.tech-name { font-size: 13px; color: #ccc; }

/* === PROJECT CARDS === */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
.project-card {
  background: var(--bg-card); border: 1px solid var(--border-card);
  border-radius: var(--radius-lg); padding: 28px; position: relative; overflow: hidden;
  transition: border-color 0.3s, transform 0.2s;
}
.project-card:hover { border-color: var(--border-hover); transform: translateY(-4px); }
.project-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--gradient-primary); opacity: 0; transition: opacity 0.3s;
}
.project-card:hover::before { opacity: 1; }
.project-type {
  display: inline-block; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
}
.project-type--profesional { background: rgba(0,187,255,0.1); color: var(--gradient-blue); }
.project-type--personal { background: rgba(139,92,246,0.1); color: var(--gradient-purple); }
.project-card h3 { font-size: 18px; margin-bottom: 8px; }
.project-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
.project-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.project-tags span {
  padding: 4px 10px; border-radius: var(--radius-sm); font-size: 11px;
  background: rgba(255,255,255,0.05); color: #aaa;
}
.projects-cta { text-align: center; margin-top: 40px; }
```

- [ ] **Step 5: Write styles.css — Timeline, Contact, Footer**

```css
/* === TIMELINE === */
.timeline { position: relative; padding-left: 32px; max-width: 600px; }
.timeline::before {
  content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(180deg, var(--gradient-green), var(--gradient-blue), transparent);
}
.timeline-item { position: relative; margin-bottom: 40px; }
.timeline-dot {
  position: absolute; left: -28px; top: 4px; width: 12px; height: 12px;
  border-radius: 50%;
}
.timeline-dot--work { background: var(--gradient-green); box-shadow: 0 0 12px rgba(0,255,136,0.4); }
.timeline-dot--education { background: var(--gradient-blue); box-shadow: 0 0 12px rgba(0,187,255,0.4); }
.timeline-dot--other { background: var(--gradient-purple); box-shadow: 0 0 12px rgba(139,92,246,0.4); }
.timeline-date { font-size: 13px; color: var(--gradient-green); margin-bottom: 4px; }
.timeline-item h3 { font-size: 18px; margin-bottom: 4px; }
.timeline-place { font-size: 14px; color: var(--text-secondary); }

/* === CONTACT === */
.contact-links { display: flex; gap: 20px; flex-wrap: wrap; }
.contact-link {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 24px; border-radius: var(--radius-lg);
  background: var(--bg-card); border: 1px solid var(--border-card);
  color: #ccc; font-size: 14px; transition: border-color 0.3s, color 0.3s;
}
.contact-link:hover { border-color: var(--gradient-green); color: #fff; }

/* === FOOTER === */
.footer {
  text-align: center; padding: 40px; color: #444; font-size: 13px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

/* === PROJECT FILTER (projects.html) === */
.filter-bar { display: flex; gap: 12px; margin-bottom: 40px; flex-wrap: wrap; }
.filter-btn {
  padding: 8px 20px; border-radius: var(--radius-full); font-size: 13px;
  background: var(--bg-card); border: 1px solid var(--border-card);
  color: var(--text-secondary); transition: all 0.3s;
}
.filter-btn:hover { border-color: var(--border-hover); color: #fff; }
.filter-btn.active {
  background: var(--gradient-primary); color: #000; border-color: transparent; font-weight: 600;
}
.back-link {
  display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary);
  font-size: 14px; margin-bottom: 32px; transition: color 0.3s;
}
.back-link:hover { color: var(--gradient-green); }
```

- [ ] **Step 6: Write styles.css — Animations (scroll reveal) and reduced motion**

```css
/* === SCROLL REVEAL === */
.reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* === PARTICLES CANVAS === */
#particles-canvas {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
}

/* === REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal { opacity: 1; transform: none; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 7: Write styles.css — Responsive breakpoints**

```css
/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .projects-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .tech-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
}

@media (max-width: 768px) {
  .navbar { padding: 0 20px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .section { padding: 60px 20px; }
  .hero { padding: calc(var(--nav-height) + 20px) 20px 60px; }
  .hero h1 { font-size: 32px; }
  .hero p { font-size: 16px; }
  .hero-buttons { flex-direction: column; }
  .hero-buttons .btn-primary,
  .hero-buttons .btn-secondary { width: 100%; justify-content: center; }
  .section-title { font-size: 26px; }
  .projects-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
  .contact-links { flex-direction: column; }
  .contact-link { width: 100%; }
  .filter-bar { justify-content: center; }
}
```

- [ ] **Step 8: Verify styles.css renders correctly**

Open a minimal HTML file in the browser that links to `css/styles.css` and verify the dark background and font load.

- [ ] **Step 9: Commit**

```bash
git add css/styles.css
git commit -m "feat: add complete stylesheet with dark theme, components, and responsive"
```

---

### Task 3: i18n Translation Files

**Files:**
- Create: `i18n/es.json`
- Create: `i18n/en.json`

- [ ] **Step 1: Write es.json — complete Spanish translations**

```json
{
  "nav.about": "Sobre mi",
  "nav.stack": "Stack",
  "nav.projects": "Proyectos",
  "nav.experience": "Experiencia",
  "nav.contact": "Contacto",
  "hero.tag": "Desarrollador Fullstack",
  "hero.title": "Hola, soy <span class=\"gradient\">Adrian Arroyo</span>",
  "hero.description": "Desarrollador fullstack especializado en Java, Spring Boot y tecnologias web. Apasionado por la automatizacion CI/CD, la calidad del codigo y las soluciones que escalan.",
  "hero.btn.cv": "Descargar CV",
  "hero.btn.projects": "Ver proyectos",
  "about.title": "Sobre <span>mi</span>",
  "about.text": "Soy Adrian, ingeniero informatico y desarrollador fullstack con experiencia en entornos universitarios. Trabajo con Java, Spring Boot, ZK Framework y tecnologias cloud, desarrollando y manteniendo aplicaciones web que dan servicio a la comunidad academica. Me apasiona la automatizacion de procesos, la integracion continua y explorar como la IA puede mejorar los flujos de trabajo de desarrollo.",
  "stack.title": "Mi <span>Stack</span>",
  "stack.subtitle": "Tecnologias con las que trabajo dia a dia",
  "projects.title": "Mis <span>Proyectos</span>",
  "projects.subtitle": "Una seleccion de lo que he construido",
  "projects.cta": "Ver todos los proyectos",
  "projects.back": "Volver al inicio",
  "projects.page.title": "Todos los <span>Proyectos</span>",
  "projects.page.subtitle": "Catalogo completo de proyectos profesionales y personales",
  "projects.filter.all": "Todos",
  "projects.filter.profesional": "Profesional",
  "projects.filter.personal": "Personal",
  "experience.title": "Mi <span>Trayectoria</span>",
  "experience.subtitle": "Formacion y experiencia profesional",
  "experience.job1.date": "Oct 2024 — Actualidad",
  "experience.job1.title": "Desarrollador Fullstack",
  "experience.job1.place": "Entorno universitario — Desarrollo y mantenimiento de aplicaciones web",
  "experience.edu1.date": "2020 — Actualidad",
  "experience.edu1.title": "Grado en Ingenieria Informatica",
  "experience.edu1.place": "Universidad de Cordoba",
  "experience.edu2.date": "2018 — 2020",
  "experience.edu2.title": "Bachillerato",
  "experience.edu2.place": "IES Luis de Gongora, Cordoba",
  "contact.title": "Hablemos<span>.</span>",
  "contact.subtitle": "Interesado en trabajar juntos?",
  "contact.cv": "Descargar CV",
  "footer.text": "Disenado y desarrollado por Adrian Arroyo Perez",
  "project.1.title": "Login Abstracto",
  "project.1.desc": "Sistema de autenticacion compartido y reutilizable para multiples aplicaciones web",
  "project.2.title": "Pipelines CI/CD",
  "project.2.desc": "Automatizacion de integracion y despliegue continuo en Azure DevOps",
  "project.3.title": "Testing E2E",
  "project.3.desc": "Framework de testing automatizado end-to-end",
  "project.4.title": "Rediseno Plataforma Online",
  "project.4.desc": "Rediseno completo de plataforma educativa online",
  "project.5.title": "Mejoras ERP",
  "project.5.desc": "Mejoras funcionales en sistema de planificacion de recursos empresariales",
  "project.6.title": "Informes BIRT",
  "project.6.desc": "Generacion de reportes empresariales",
  "project.7.title": "Cloud Config",
  "project.7.desc": "Servidor de configuracion centralizada",
  "project.8.title": "Automatizacion DevOps con IA",
  "project.8.desc": "Skills y automatizacion con IA para flujos DevOps",
  "project.9.title": "Migracion Jakarta EE",
  "project.9.desc": "Migracion tecnologica de javax a Jakarta",
  "project.10.title": "Seguridad ZK",
  "project.10.desc": "Modulo de seguridad para framework ZK",
  "project.11.title": "PetWatch",
  "project.11.desc": "App Android de seguimiento y gestion de mascotas",
  "page.404.title": "Pagina no encontrada",
  "page.404.text": "La pagina que buscas no existe.",
  "page.404.link": "Volver al inicio"
}
```

- [ ] **Step 2: Write en.json — complete English translations**

```json
{
  "nav.about": "About",
  "nav.stack": "Stack",
  "nav.projects": "Projects",
  "nav.experience": "Experience",
  "nav.contact": "Contact",
  "hero.tag": "Fullstack Developer",
  "hero.title": "Hi, I'm <span class=\"gradient\">Adrian Arroyo</span>",
  "hero.description": "Fullstack developer specialized in Java, Spring Boot, and web technologies. Passionate about CI/CD automation, code quality, and scalable solutions.",
  "hero.btn.cv": "Download CV",
  "hero.btn.projects": "View projects",
  "about.title": "About <span>me</span>",
  "about.text": "I'm Adrian, a computer engineer and fullstack developer with experience in university environments. I work with Java, Spring Boot, ZK Framework, and cloud technologies, building and maintaining web applications that serve the academic community. I'm passionate about process automation, continuous integration, and exploring how AI can improve development workflows.",
  "stack.title": "My <span>Stack</span>",
  "stack.subtitle": "Technologies I work with daily",
  "projects.title": "My <span>Projects</span>",
  "projects.subtitle": "A selection of what I've built",
  "projects.cta": "View all projects",
  "projects.back": "Back to home",
  "projects.page.title": "All <span>Projects</span>",
  "projects.page.subtitle": "Complete catalog of professional and personal projects",
  "projects.filter.all": "All",
  "projects.filter.profesional": "Professional",
  "projects.filter.personal": "Personal",
  "experience.title": "My <span>Journey</span>",
  "experience.subtitle": "Education and professional experience",
  "experience.job1.date": "Oct 2024 — Present",
  "experience.job1.title": "Fullstack Developer",
  "experience.job1.place": "University environment — Web application development and maintenance",
  "experience.edu1.date": "2020 — Present",
  "experience.edu1.title": "Bachelor's in Computer Engineering",
  "experience.edu1.place": "University of Cordoba",
  "experience.edu2.date": "2018 — 2020",
  "experience.edu2.title": "High School Diploma",
  "experience.edu2.place": "IES Luis de Gongora, Cordoba",
  "contact.title": "Let's talk<span>.</span>",
  "contact.subtitle": "Interested in working together?",
  "contact.cv": "Download CV",
  "footer.text": "Designed and developed by Adrian Arroyo Perez",
  "project.1.title": "Abstract Login",
  "project.1.desc": "Shared and reusable authentication system for multiple web applications",
  "project.2.title": "CI/CD Pipelines",
  "project.2.desc": "Continuous integration and deployment automation in Azure DevOps",
  "project.3.title": "E2E Testing",
  "project.3.desc": "End-to-end automated testing framework",
  "project.4.title": "Online Platform Redesign",
  "project.4.desc": "Complete redesign of an online educational platform",
  "project.5.title": "ERP Improvements",
  "project.5.desc": "Functional improvements in enterprise resource planning system",
  "project.6.title": "BIRT Reports",
  "project.6.desc": "Enterprise report generation",
  "project.7.title": "Cloud Config",
  "project.7.desc": "Centralized configuration server",
  "project.8.title": "AI-Driven DevOps Automation",
  "project.8.desc": "AI-powered skills and automation for DevOps workflows",
  "project.9.title": "Jakarta EE Migration",
  "project.9.desc": "Technology migration from javax to Jakarta",
  "project.10.title": "ZK Security",
  "project.10.desc": "Security module for ZK framework",
  "project.11.title": "PetWatch",
  "project.11.desc": "Android app for pet tracking and management",
  "page.404.title": "Page not found",
  "page.404.text": "The page you're looking for doesn't exist.",
  "page.404.link": "Back to home"
}
```

- [ ] **Step 3: Commit**

```bash
git add i18n/
git commit -m "feat: add complete translation files for ES and EN"
```

---

### Task 4: i18n Engine

**Files:**
- Create: `js/i18n.js`

- [ ] **Step 1: Write i18n.js**

The i18n engine loads translations from JSON files and applies them to DOM elements via `data-i18n` (textContent) and `data-i18n-html` (for trusted author-controlled content that contains markup like `<span>` tags). Translation JSON files are author-controlled and never contain user-supplied data.

```javascript
const I18n = (() => {
  let currentLang = 'es';
  let translations = {};

  function detectLang() {
    const stored = localStorage.getItem('lang');
    if (stored && (stored === 'es' || stored === 'en')) return stored;
    const browserLang = navigator.language || navigator.userLanguage || '';
    if (browserLang.startsWith('en')) return 'en';
    return 'es';
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.textContent = translations[key];
    });
    // data-i18n-html: used only for trusted, author-controlled translation
    // strings that contain markup (e.g. <span> for gradient text).
    // Never use with external or user-supplied content.
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (translations[key]) el.innerHTML = translations[key];
    });
    document.documentElement.lang = currentLang;
    const toggle = document.querySelector('.lang-toggle');
    if (toggle) toggle.textContent = currentLang === 'es' ? 'EN' : 'ES';
  }

  async function loadLang(lang) {
    try {
      const response = await fetch('i18n/' + lang + '.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      translations = await response.json();
      currentLang = lang;
      localStorage.setItem('lang', lang);
      applyTranslations();
    } catch (e) {
      console.warn('i18n: could not load ' + lang + '.json, using inline fallback');
    }
  }

  function toggle() {
    const next = currentLang === 'es' ? 'en' : 'es';
    loadLang(next);
  }

  function init() {
    currentLang = detectLang();
    loadLang(currentLang);
  }

  return { init, toggle, getCurrentLang: () => currentLang };
})();

document.addEventListener('DOMContentLoaded', () => I18n.init());
```

Note: The spec mentions `data-i18n-placeholder` support. This is intentionally deferred since no pages currently have form inputs with placeholders. If needed later, add a `querySelectorAll('[data-i18n-placeholder]')` loop that calls `el.setAttribute('placeholder', translations[key])`.

- [ ] **Step 2: Commit**

```bash
git add js/i18n.js
git commit -m "feat: add i18n engine with fallback chain and DOM binding"
```

---

### Task 5: Landing Page HTML

**Files:**
- Create: `index.html`

Main page with all sections. Spanish text inline as fallback. `data-i18n` / `data-i18n-html` attributes for translation.

- [ ] **Step 1: Write index.html — complete file**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adrian Arroyo — Desarrollador Fullstack</title>
  <meta name="description" content="Portfolio de Adrian Arroyo Perez — Desarrollador Fullstack especializado en Java, Spring Boot y tecnologias web">
  <meta name="keywords" content="desarrollador, fullstack, java, spring boot, portfolio, ingeniero informatico">
  <meta property="og:title" content="Adrian Arroyo — Fullstack Developer">
  <meta property="og:description" content="Portfolio profesional — Desarrollador Fullstack">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <canvas id="particles-canvas"></canvas>

  <!-- NAVBAR -->
  <nav class="navbar" role="navigation" aria-label="Navegacion principal">
    <a href="#" class="logo">&lt;<span>AA</span>/&gt;</a>
    <ul class="nav-links">
      <li><a href="#about" data-i18n="nav.about">Sobre mi</a></li>
      <li><a href="#stack" data-i18n="nav.stack">Stack</a></li>
      <li><a href="#projects" data-i18n="nav.projects">Proyectos</a></li>
      <li><a href="#experience" data-i18n="nav.experience">Experiencia</a></li>
      <li><a href="#contact" data-i18n="nav.contact">Contacto</a></li>
    </ul>
    <div class="nav-right">
      <button class="lang-toggle" onclick="I18n.toggle()" aria-label="Cambiar idioma">EN</button>
      <button class="hamburger" aria-label="Menu" aria-expanded="false" onclick="toggleMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- MOBILE NAV -->
  <div class="nav-mobile" id="mobileNav" role="navigation" aria-label="Navegacion movil">
    <a href="#about" data-i18n="nav.about" onclick="closeMenu()">Sobre mi</a>
    <a href="#stack" data-i18n="nav.stack" onclick="closeMenu()">Stack</a>
    <a href="#projects" data-i18n="nav.projects" onclick="closeMenu()">Proyectos</a>
    <a href="#experience" data-i18n="nav.experience" onclick="closeMenu()">Experiencia</a>
    <a href="#contact" data-i18n="nav.contact" onclick="closeMenu()">Contacto</a>
  </div>

  <!-- HERO -->
  <header class="hero">
    <div class="hero-content">
      <div class="hero-tag" data-i18n="hero.tag">Desarrollador Fullstack</div>
      <h1 data-i18n-html="hero.title">Hola, soy <span class="gradient">Adrian Arroyo</span></h1>
      <p data-i18n="hero.description">Desarrollador fullstack especializado en Java, Spring Boot y tecnologias web. Apasionado por la automatizacion CI/CD, la calidad del codigo y las soluciones que escalan.</p>
      <div class="hero-buttons">
        <a href="assets/cv-adrian-arroyo.pdf" download class="btn-primary" data-i18n="hero.btn.cv">Descargar CV</a>
        <a href="#projects" class="btn-secondary" data-i18n="hero.btn.projects">Ver proyectos</a>
      </div>
    </div>
  </header>

  <main>
    <!-- ABOUT -->
    <section id="about" class="section">
      <div class="section-inner reveal">
        <h2 class="section-title" data-i18n-html="about.title">Sobre <span>mi</span></h2>
        <p class="about-text" data-i18n="about.text">Soy Adrian, ingeniero informatico y desarrollador fullstack con experiencia en entornos universitarios. Trabajo con Java, Spring Boot, ZK Framework y tecnologias cloud, desarrollando y manteniendo aplicaciones web que dan servicio a la comunidad academica. Me apasiona la automatizacion de procesos, la integracion continua y explorar como la IA puede mejorar los flujos de trabajo de desarrollo.</p>
      </div>
    </section>

    <!-- STACK -->
    <section id="stack" class="section">
      <div class="section-inner reveal">
        <h2 class="section-title" data-i18n-html="stack.title">Mi <span>Stack</span></h2>
        <p class="section-subtitle" data-i18n="stack.subtitle">Tecnologias con las que trabajo dia a dia</p>
        <div class="tech-grid">
          <div class="tech-card"><div class="tech-icon">&#9749;</div><div class="tech-name">Java</div></div>
          <div class="tech-card"><div class="tech-icon">&#127811;</div><div class="tech-name">Spring Boot</div></div>
          <div class="tech-card"><div class="tech-icon">&#127760;</div><div class="tech-name">HTML / CSS</div></div>
          <div class="tech-card"><div class="tech-icon">&#9889;</div><div class="tech-name">JavaScript</div></div>
          <div class="tech-card"><div class="tech-icon">&#128451;</div><div class="tech-name">SQL</div></div>
          <div class="tech-card"><div class="tech-icon">&#128051;</div><div class="tech-name">Docker</div></div>
          <div class="tech-card"><div class="tech-icon">&#128311;</div><div class="tech-name">Azure DevOps</div></div>
          <div class="tech-card"><div class="tech-icon">&#127917;</div><div class="tech-name">Playwright</div></div>
          <div class="tech-card"><div class="tech-icon">&#128295;</div><div class="tech-name">Git</div></div>
          <div class="tech-card"><div class="tech-icon">&#128039;</div><div class="tech-name">Linux</div></div>
          <div class="tech-card"><div class="tech-icon">&#129302;</div><div class="tech-name">Claude AI</div></div>
          <div class="tech-card"><div class="tech-icon">&#128202;</div><div class="tech-name">BIRT Reports</div></div>
          <div class="tech-card"><div class="tech-icon">&#128310;</div><div class="tech-name">ZK Framework</div></div>
          <div class="tech-card"><div class="tech-icon">&#128230;</div><div class="tech-name">Jakarta EE</div></div>
        </div>
      </div>
    </section>

    <!-- PROJECTS (6 featured) -->
    <section id="projects" class="section">
      <div class="section-inner reveal">
        <h2 class="section-title" data-i18n-html="projects.title">Mis <span>Proyectos</span></h2>
        <p class="section-subtitle" data-i18n="projects.subtitle">Una seleccion de lo que he construido</p>
        <div class="projects-grid">
          <div class="project-card" data-type="profesional" data-tags="java,spring,sso">
            <div class="project-type project-type--profesional">Profesional</div>
            <h3 data-i18n="project.1.title">Login Abstracto</h3>
            <p data-i18n="project.1.desc">Sistema de autenticacion compartido y reutilizable para multiples aplicaciones web</p>
            <div class="project-tags"><span>Java</span><span>Spring</span><span>SSO</span></div>
          </div>
          <div class="project-card" data-type="profesional" data-tags="azure-devops,yaml,cicd">
            <div class="project-type project-type--profesional">Profesional</div>
            <h3 data-i18n="project.2.title">Pipelines CI/CD</h3>
            <p data-i18n="project.2.desc">Automatizacion de integracion y despliegue continuo en Azure DevOps</p>
            <div class="project-tags"><span>Azure DevOps</span><span>YAML</span><span>CI/CD</span></div>
          </div>
          <div class="project-card" data-type="profesional" data-tags="fullstack,ux-ui,java">
            <div class="project-type project-type--profesional">Profesional</div>
            <h3 data-i18n="project.4.title">Rediseno Plataforma Online</h3>
            <p data-i18n="project.4.desc">Rediseno completo de plataforma educativa online</p>
            <div class="project-tags"><span>Fullstack</span><span>UX/UI</span><span>Java</span></div>
          </div>
          <div class="project-card" data-type="profesional" data-tags="java,spring-boot,sql">
            <div class="project-type project-type--profesional">Profesional</div>
            <h3 data-i18n="project.5.title">Mejoras ERP</h3>
            <p data-i18n="project.5.desc">Mejoras funcionales en sistema de planificacion de recursos empresariales</p>
            <div class="project-tags"><span>Java</span><span>Spring Boot</span><span>SQL</span></div>
          </div>
          <div class="project-card" data-type="profesional" data-tags="ai,claude,automation">
            <div class="project-type project-type--profesional">Profesional</div>
            <h3 data-i18n="project.8.title">Automatizacion DevOps con IA</h3>
            <p data-i18n="project.8.desc">Skills y automatizacion con IA para flujos DevOps</p>
            <div class="project-tags"><span>AI</span><span>Claude</span><span>Automation</span></div>
          </div>
          <div class="project-card" data-type="personal" data-tags="android,java,mobile">
            <div class="project-type project-type--personal">Personal</div>
            <h3 data-i18n="project.11.title">PetWatch</h3>
            <p data-i18n="project.11.desc">App Android de seguimiento y gestion de mascotas</p>
            <div class="project-tags"><span>Android</span><span>Java</span><span>Mobile</span></div>
          </div>
        </div>
        <div class="projects-cta">
          <a href="projects.html" class="btn-secondary" data-i18n="projects.cta">Ver todos los proyectos</a>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE -->
    <section id="experience" class="section">
      <div class="section-inner reveal">
        <h2 class="section-title" data-i18n-html="experience.title">Mi <span>Trayectoria</span></h2>
        <p class="section-subtitle" data-i18n="experience.subtitle">Formacion y experiencia profesional</p>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--work"></div>
            <div class="timeline-date" data-i18n="experience.job1.date">Oct 2024 — Actualidad</div>
            <h3 data-i18n="experience.job1.title">Desarrollador Fullstack</h3>
            <p class="timeline-place" data-i18n="experience.job1.place">Entorno universitario — Desarrollo y mantenimiento de aplicaciones web</p>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--education"></div>
            <div class="timeline-date" data-i18n="experience.edu1.date">2020 — Actualidad</div>
            <h3 data-i18n="experience.edu1.title">Grado en Ingenieria Informatica</h3>
            <p class="timeline-place" data-i18n="experience.edu1.place">Universidad de Cordoba</p>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot timeline-dot--other"></div>
            <div class="timeline-date" data-i18n="experience.edu2.date">2018 — 2020</div>
            <h3 data-i18n="experience.edu2.title">Bachillerato</h3>
            <p class="timeline-place" data-i18n="experience.edu2.place">IES Luis de Gongora, Cordoba</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="section">
      <div class="section-inner reveal">
        <h2 class="section-title" data-i18n-html="contact.title">Hablemos<span>.</span></h2>
        <p class="section-subtitle" data-i18n="contact.subtitle">Interesado en trabajar juntos?</p>
        <div class="contact-links">
          <a href="mailto:adriarroyo2002@gmail.com" class="contact-link">&#9993; adriarroyo2002@gmail.com</a>
          <a href="https://linkedin.com/in/" class="contact-link" target="_blank" rel="noopener">&#128188; LinkedIn</a>
          <a href="https://github.com/" class="contact-link" target="_blank" rel="noopener">&#128025; GitHub</a>
          <a href="assets/cv-adrian-arroyo.pdf" download class="contact-link" data-i18n="contact.cv">&#128196; Descargar CV</a>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <p data-i18n="footer.text">Disenado y desarrollado por Adrian Arroyo Perez</p>
  </footer>

  <script src="js/i18n.js"></script>
  <script src="js/main.js"></script>
  <script src="js/particles.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Open index.html in browser, verify all sections render**

Expected: dark background, all sections visible with Spanish text, navbar at top, correct layout.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add landing page with all sections and i18n attributes"
```

---

### Task 6: Main JavaScript

**Files:**
- Create: `js/main.js`

Handles: navbar scroll effect, hamburger menu toggle, smooth scroll, scroll-reveal with Intersection Observer.

- [ ] **Step 1: Write main.js**

```javascript
/* === NAVBAR SCROLL EFFECT === */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* === HAMBURGER MENU === */
function toggleMenu() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mobileNav');
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closeMenu() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mobileNav');
  btn.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close menu on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
```

- [ ] **Step 2: Verify in browser**

Open index.html, scroll down. Expected: navbar gets darker background, sections fade in on scroll, hamburger works at mobile widths (resize window below 768px).

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add navbar scroll, hamburger menu, and scroll reveal"
```

---

### Task 7: Particle Effect

**Files:**
- Create: `js/particles.js`

Canvas-based floating particles. Respects `prefers-reduced-motion`.

- [ ] **Step 1: Write particles.js**

```javascript
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 40;
  const COLORS = [
    'rgba(0,255,136,0.3)',
    'rgba(0,187,255,0.2)',
    'rgba(139,92,246,0.2)',
    'rgba(0,255,136,0.15)'
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.3
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
    particles.forEach(p => { p.y = Math.random() * canvas.height; });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -10) Object.assign(p, createParticle());
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(update);
  }

  window.addEventListener('resize', resize);
  init();
  update();
})();
```

- [ ] **Step 2: Verify in browser**

Open index.html. Expected: small colored dots floating upward in the background behind all content.

- [ ] **Step 3: Commit**

```bash
git add js/particles.js
git commit -m "feat: add canvas particle effect with reduced-motion support"
```

---

### Task 8: Projects Page

**Files:**
- Create: `projects.html`

All 11 projects with filter buttons (Todos / Profesional / Personal).

- [ ] **Step 1: Write projects.html — complete file**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proyectos — Adrian Arroyo</title>
  <meta name="description" content="Proyectos de Adrian Arroyo Perez — Desarrollador Fullstack">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <canvas id="particles-canvas"></canvas>

  <nav class="navbar" role="navigation" aria-label="Navegacion principal">
    <a href="index.html" class="logo">&lt;<span>AA</span>/&gt;</a>
    <ul class="nav-links">
      <li><a href="index.html#about" data-i18n="nav.about">Sobre mi</a></li>
      <li><a href="index.html#stack" data-i18n="nav.stack">Stack</a></li>
      <li><a href="index.html#projects" data-i18n="nav.projects">Proyectos</a></li>
      <li><a href="index.html#experience" data-i18n="nav.experience">Experiencia</a></li>
      <li><a href="index.html#contact" data-i18n="nav.contact">Contacto</a></li>
    </ul>
    <div class="nav-right">
      <button class="lang-toggle" onclick="I18n.toggle()" aria-label="Cambiar idioma">EN</button>
      <button class="hamburger" aria-label="Menu" aria-expanded="false" onclick="toggleMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="nav-mobile" id="mobileNav" role="navigation" aria-label="Navegacion movil">
    <a href="index.html#about" data-i18n="nav.about" onclick="closeMenu()">Sobre mi</a>
    <a href="index.html#stack" data-i18n="nav.stack" onclick="closeMenu()">Stack</a>
    <a href="index.html#projects" data-i18n="nav.projects" onclick="closeMenu()">Proyectos</a>
    <a href="index.html#experience" data-i18n="nav.experience" onclick="closeMenu()">Experiencia</a>
    <a href="index.html#contact" data-i18n="nav.contact" onclick="closeMenu()">Contacto</a>
  </div>

  <main class="section" style="padding-top: calc(var(--nav-height) + 40px);">
    <div class="section-inner">
      <a href="index.html" class="back-link" data-i18n="projects.back">Volver al inicio</a>
      <h2 class="section-title" data-i18n-html="projects.page.title">Todos los <span>Proyectos</span></h2>
      <p class="section-subtitle" data-i18n="projects.page.subtitle">Catalogo completo de proyectos profesionales y personales</p>

      <div class="filter-bar">
        <button class="filter-btn active" data-filter="all" data-i18n="projects.filter.all">Todos</button>
        <button class="filter-btn" data-filter="profesional" data-i18n="projects.filter.profesional">Profesional</button>
        <button class="filter-btn" data-filter="personal" data-i18n="projects.filter.personal">Personal</button>
      </div>

      <div class="projects-grid" id="projectsGrid">
        <div class="project-card" data-type="profesional" data-tags="java,spring,sso">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.1.title">Login Abstracto</h3>
          <p data-i18n="project.1.desc">Sistema de autenticacion compartido y reutilizable para multiples aplicaciones web</p>
          <div class="project-tags"><span>Java</span><span>Spring</span><span>SSO</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="azure-devops,yaml,cicd">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.2.title">Pipelines CI/CD</h3>
          <p data-i18n="project.2.desc">Automatizacion de integracion y despliegue continuo en Azure DevOps</p>
          <div class="project-tags"><span>Azure DevOps</span><span>YAML</span><span>CI/CD</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="playwright,qa,automation">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.3.title">Testing E2E</h3>
          <p data-i18n="project.3.desc">Framework de testing automatizado end-to-end</p>
          <div class="project-tags"><span>Playwright</span><span>QA</span><span>Automation</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="fullstack,ux-ui,java">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.4.title">Rediseno Plataforma Online</h3>
          <p data-i18n="project.4.desc">Rediseno completo de plataforma educativa online</p>
          <div class="project-tags"><span>Fullstack</span><span>UX/UI</span><span>Java</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="java,spring-boot,sql">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.5.title">Mejoras ERP</h3>
          <p data-i18n="project.5.desc">Mejoras funcionales en sistema de planificacion de recursos empresariales</p>
          <div class="project-tags"><span>Java</span><span>Spring Boot</span><span>SQL</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="birt,sql,reporting">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.6.title">Informes BIRT</h3>
          <p data-i18n="project.6.desc">Generacion de reportes empresariales</p>
          <div class="project-tags"><span>BIRT</span><span>SQL</span><span>Reporting</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="spring-cloud,microservicios">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.7.title">Cloud Config</h3>
          <p data-i18n="project.7.desc">Servidor de configuracion centralizada</p>
          <div class="project-tags"><span>Spring Cloud</span><span>Microservicios</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="ai,claude,automation">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.8.title">Automatizacion DevOps con IA</h3>
          <p data-i18n="project.8.desc">Skills y automatizacion con IA para flujos DevOps</p>
          <div class="project-tags"><span>AI</span><span>Claude</span><span>Automation</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="jakarta-ee,java,refactoring">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.9.title">Migracion Jakarta EE</h3>
          <p data-i18n="project.9.desc">Migracion tecnologica de javax a Jakarta</p>
          <div class="project-tags"><span>Jakarta EE</span><span>Java</span><span>Refactoring</span></div>
        </div>
        <div class="project-card" data-type="profesional" data-tags="zk,security,java">
          <div class="project-type project-type--profesional">Profesional</div>
          <h3 data-i18n="project.10.title">Seguridad ZK</h3>
          <p data-i18n="project.10.desc">Modulo de seguridad para framework ZK</p>
          <div class="project-tags"><span>ZK</span><span>Security</span><span>Java</span></div>
        </div>
        <div class="project-card" data-type="personal" data-tags="android,java,mobile">
          <div class="project-type project-type--personal">Personal</div>
          <h3 data-i18n="project.11.title">PetWatch</h3>
          <p data-i18n="project.11.desc">App Android de seguimiento y gestion de mascotas</p>
          <div class="project-tags"><span>Android</span><span>Java</span><span>Mobile</span></div>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <p data-i18n="footer.text">Disenado y desarrollado por Adrian Arroyo Perez</p>
  </footer>

  <script src="js/i18n.js"></script>
  <script src="js/main.js"></script>
  <script src="js/particles.js" defer></script>
  <script>
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('#projectsGrid .project-card').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
        });
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open projects.html. Expected: all 11 projects visible, filter buttons work (clicking "Profesional" hides PetWatch, clicking "Personal" shows only PetWatch), back link navigates to index.html.

- [ ] **Step 3: Commit**

```bash
git add projects.html
git commit -m "feat: add projects page with filter by type"
```

---

### Task 9: 404 Page

**Files:**
- Create: `404.html`

- [ ] **Step 1: Write 404.html**

Minimal page: links styles.css, shows centered "404" with gradient, message, and link back to index.html. Loads i18n.js for translation support.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — Adrian Arroyo</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main class="hero" style="text-align:center;">
    <div class="hero-content">
      <h1 style="font-size:72px; margin-bottom:16px;">
        <span class="gradient">404</span>
      </h1>
      <p data-i18n="page.404.text" style="margin-bottom:32px;">La pagina que buscas no existe.</p>
      <a href="index.html" class="btn-primary" data-i18n="page.404.link">Volver al inicio</a>
    </div>
  </main>
  <script src="js/i18n.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add 404.html
git commit -m "feat: add custom 404 page"
```

---

### Task 10: GitHub Repository and Pages Deployment

- [ ] **Step 1: Create GitHub repository**

```bash
cd /c/Users/aaperez/portfolio
gh auth login
gh repo create <username>.github.io --public --source=. --push
```

Note: The repo name must be `<username>.github.io` for GitHub Pages user site. If `gh` CLI is not available, create the repo manually on github.com and add the remote:

```bash
git remote add origin https://github.com/<username>/<username>.github.io.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Enable GitHub Pages**

Go to repository Settings > Pages > Source: Deploy from branch `main` / root (`/`).

- [ ] **Step 3: Verify deployment**

Open `https://<username>.github.io` in browser. Expected: landing page loads with all sections, particles, i18n toggle works, projects page accessible.

- [ ] **Step 4: Update OG meta tags with real URL**

Edit `index.html`: replace `<usuario>` placeholders in og:image and og:url meta tags with the actual GitHub Pages URL.

```bash
git add index.html
git commit -m "fix: update OG meta tags with production URL"
git push
```

---

### Task 11: Final Verification

- [ ] **Step 1: Test i18n toggle**

Open site, click EN button. All text switches to English. Click ES. Back to Spanish. Refresh page. Language persists.

- [ ] **Step 2: Test responsive**

Resize browser to mobile width (below 768px). Expected: hamburger menu appears, grids stack to 1 column, hero text smaller. Test hamburger open/close and Escape key.

- [ ] **Step 3: Test projects page filter**

Open projects.html, test each filter button. Expected: cards show/hide correctly.

- [ ] **Step 4: Test all links**

- "Descargar CV" downloads PDF
- Email link opens mail client
- LinkedIn/GitHub open in new tab
- "Ver todos los proyectos" navigates to projects.html
- Logo navigates to landing
- Back link on projects.html navigates to landing
- All anchor links scroll to correct section

- [ ] **Step 5: Add real LinkedIn and GitHub URLs**

Edit `index.html` contact section: replace placeholder href values with real LinkedIn profile URL and GitHub profile URL.

```bash
git add index.html
git commit -m "fix: add real LinkedIn and GitHub profile URLs"
git push
```
