# Diseño: Portfolio Personal — Adrián Arroyo Pérez

- **Versión:** 1.1
- **Autor:** Adrián Arroyo Pérez
- **Fecha:** 2026-03-23
- **Estado:** Aprobado

## Resumen

Sitio web estático de portfolio personal para presentar CV, trayectoria profesional y proyectos a empresas del sector de ingeniería informática. Hospedado en GitHub Pages, bilingüe (ES/EN), con estilo dark mode y elementos visuales creativos (animaciones, gradientes, partículas).

## Arquitectura

- **Tipo:** Sitio estático híbrido — landing page (scroll continuo) + página dedicada de proyectos
- **Hosting:** GitHub Pages desde rama `main`
- **URL:** `https://<usuario>.github.io`
- **Tecnología:** HTML5 + CSS3 + JavaScript vanilla
- **i18n:** Archivos JSON (`/i18n/es.json`, `/i18n/en.json`) con un solo HTML por página
- **Dependencias externas:** Ninguna

## Estructura de archivos

```
portfolio/
├── index.html              # Landing page
├── projects.html           # Página de todos los proyectos
├── 404.html                # Página 404 personalizada con enlace a landing
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── i18n.js             # Sistema de traducción
│   ├── main.js             # Navegación, scroll, animaciones on-scroll
│   └── particles.js        # Efecto partículas decorativas
├── i18n/
│   ├── es.json             # Traducciones español
│   └── en.json             # Traducciones inglés
├── assets/
│   ├── cv-adrian-arroyo.pdf
│   └── og-image.png
└── README.md
```

## Páginas

### Landing (`index.html`)

Scroll continuo con las siguientes secciones en orden:

1. **Navbar** — Fija con backdrop blur. Logo `<AA/>`. Enlaces ancla: Sobre mí, Stack, Proyectos, Experiencia, Contacto. Selector de idioma ES/EN. Responsive con menú hamburguesa en mobile.

2. **Hero** — Fondo con gradiente radial pulsante y partículas flotantes. Tag "Desarrollador Fullstack". Título `Hola, soy Adrián Arroyo` con gradiente en el nombre. Párrafo de presentación. Dos botones: "Descargar CV" (descarga PDF) y "Ver proyectos" (ancla o navega a projects.html).

3. **Sobre mí** — Párrafo breve de presentación profesional y personal. Sin foto (opcional a futuro).

4. **Stack tecnológico** — Grid responsive de tarjetas con hover (elevación + borde gradiente). Tecnologías: Java, Spring Boot, HTML/CSS, JavaScript, SQL, Docker, Azure DevOps, Playwright, Git, Linux, Claude AI, BIRT Reports, ZK Framework, Jakarta EE.

5. **Proyectos destacados** — 6 cards seleccionados de los 11 totales (destacados: #1 Login Abstracto, #2 Pipelines CI/CD, #4 Rediseño Plataforma Online, #5 Mejoras ERP, #8 Automatización DevOps con IA, #11 PetWatch). Cada card: etiqueta tipo (Profesional/Personal), título, descripción corta, tags de tecnología. Hover: elevación + línea gradiente superior. Botón "Ver todos →" enlaza a `projects.html`.

6. **Trayectoria** — Timeline vertical con línea de gradiente. Puntos de color diferenciados: verde (trabajo), azul (grado), púrpura (bachillerato). Entradas:
   - Oct 2024 — Actualidad: Desarrollador Fullstack (entorno universitario)
   - 2020 — Actualidad: Grado en Ingeniería Informática (Universidad de Córdoba)
   - 2018 — 2020: Bachillerato (IES Luis de Góngora, Córdoba)

7. **Contacto** — Enlaces en tarjetas: email (adriarroyo2002@gmail.com), LinkedIn, GitHub, descarga CV.

8. **Footer** — Créditos: "Diseñado y desarrollado por Adrián Arroyo Pérez"

### Proyectos (`projects.html`)

- Misma navbar y footer que landing
- Filtro por tipo: Todos / Profesional / Personal (botones toggle, filtrado via atributo `data-type` en cada card con JS)
- Grid de 11 cards con la misma estructura visual que la landing
- Datos de proyectos incluidos en los archivos i18n JSON (descripciones traducidas) + atributos `data-type` y `data-tags` en el HTML para metadatos
- Botón de volver a la landing

## Sistema i18n

### Mecanismo

- Elementos HTML con atributo `data-i18n="clave"` para texto
- Elementos con `data-i18n-placeholder="clave"` para placeholders
- `i18n.js` carga el JSON del idioma seleccionado via fetch, recorre el DOM y aplica los textos
- Para HTML dentro de traducciones (ej: `<span>` en títulos), usar `innerHTML` en claves marcadas como `data-i18n-html="clave"`. Los archivos JSON de traducción son contenido de confianza, controlado por el autor. Nunca usar este mecanismo con datos externos o suministrados por usuarios.

### Persistencia y detección de idioma

- Cadena de fallback: `localStorage("lang")` → `navigator.language` (si empieza por `en`, usar `en`) → default `es`
- Idioma guardado en `localStorage` bajo clave `lang`
- Al cargar la página: sigue la cadena de fallback anterior

### Fallback ante fallo de carga

- El HTML contiene el texto en español como contenido por defecto directamente en los elementos
- `i18n.js` sobreescribe solo si el fetch del JSON tiene éxito
- Si el fetch falla, la página se muestra en español sin interrupciones

### Estructura JSON (parcial)

```json
{
  "nav.about": "Sobre mí",
  "nav.stack": "Stack",
  "nav.projects": "Proyectos",
  "nav.experience": "Experiencia",
  "nav.contact": "Contacto",
  "hero.tag": "Desarrollador Fullstack",
  "hero.title": "Hola, soy <span class='gradient'>Adrián Arroyo</span>",
  "hero.description": "Desarrollador fullstack especializado en Java, Spring Boot y tecnologías web...",
  "hero.btn.cv": "Descargar CV",
  "hero.btn.projects": "Ver proyectos"
}
```

## Estilo visual

- **Fondo:** #0a0a0f (casi negro)
- **Texto principal:** #e0e0e0
- **Texto secundario:** #888 / #999
- **Gradiente primario:** #00ff88 → #00bbff (verde → azul)
- **Acento terciario:** #8b5cf6 (púrpura)
- **Cards:** fondo rgba(255,255,255,0.03), borde rgba(255,255,255,0.06)
- **Tipografía:** system-ui stack (Segoe UI, SF Pro, sans-serif)
- **Border radius:** 10-16px en cards/botones

### Animaciones

- **Partículas flotantes:** puntos pequeños ascendentes con opacidad variable (CSS @keyframes)
- **Hero gradiente:** pulsación suave con animation alternate
- **Cards hover:** translateY(-4px) + border-color transition
- **Scroll reveal:** Intersection Observer para fadeIn/slideUp al entrar en viewport
- **Navbar:** blur + opacidad en scroll
- **`prefers-reduced-motion`:** todas las animaciones se desactivan con `@media (prefers-reduced-motion: reduce)` para usuarios que lo configuren en su SO

### Responsive

- **Mobile (<768px):** Navbar hamburguesa, hero texto más pequeño, grids de 1 columna, timeline simplificado
- **Tablet (768-1024px):** Grids de 2 columnas
- **Desktop (>1024px):** Layout completo como en mockup

## SEO y Open Graph

```html
<meta name="description" content="Portfolio de Adrián Arroyo Pérez — Desarrollador Fullstack">
<meta name="keywords" content="desarrollador, fullstack, java, spring boot, portfolio">
<meta property="og:title" content="Adrián Arroyo — Fullstack Developer">
<meta property="og:description" content="Portfolio profesional...">
<meta property="og:image" content="https://<usuario>.github.io/assets/og-image.png">
<meta property="og:url" content="https://<usuario>.github.io">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

`<html lang>` se actualiza dinámicamente al cambiar idioma.

## Proyectos (contenido)

| # | Nombre | Tipo | Descripción (ES) | Tags |
|---|--------|------|-------------------|------|
| 1 | Login Abstracto | Profesional | Sistema de autenticación compartido y reutilizable para múltiples aplicaciones web | Java, Spring, SSO |
| 2 | Pipelines CI/CD | Profesional | Automatización de integración y despliegue continuo en Azure DevOps | Azure DevOps, YAML, CI/CD |
| 3 | Testing E2E | Profesional | Framework de testing automatizado end-to-end | Playwright, QA, Automation |
| 4 | Rediseño Plataforma Online | Profesional | Rediseño completo de plataforma educativa online | Fullstack, UX/UI, Java |
| 5 | Mejoras ERP | Profesional | Mejoras funcionales en sistema de planificación de recursos empresariales | Java, Spring Boot, SQL |
| 6 | Informes BIRT | Profesional | Generación de reportes empresariales | BIRT, SQL, Reporting |
| 7 | Cloud Config | Profesional | Servidor de configuración centralizada | Spring Cloud, Microservicios |
| 8 | Automatización DevOps con IA | Profesional | Skills y automatización con IA para flujos DevOps | AI, Claude, Automation |
| 9 | Migración Jakarta EE | Profesional | Migración tecnológica de javax a Jakarta | Jakarta EE, Java, Refactoring |
| 10 | Seguridad ZK | Profesional | Módulo de seguridad para framework ZK | ZK, Security, Java |
| 11 | PetWatch | Personal | App Android de seguimiento y gestión de mascotas | Android, Java, Mobile |

## Accesibilidad

- HTML semántico: `<nav>`, `<main>`, `<section>`, `<footer>`, `<header>`
- Navegación por teclado: menú hamburguesa y selector de idioma accesibles con Tab/Enter/Escape
- ARIA: `aria-label` en botones de icono, `aria-expanded` en menú hamburguesa, `role="navigation"`
- `prefers-reduced-motion`: desactiva todas las animaciones (partículas, hover, scroll reveal)
- Contraste: texto secundario mínimo #999 sobre #0a0a0f (ratio ≥ 6:1)

## Rendimiento

- `particles.js` cargado con `defer` para no bloquear el render
- Imágenes futuras con `loading="lazy"`
- Objetivo: Lighthouse 90+ en mobile

## Fuera de alcance

- Formulario de contacto con backend (solo enlaces directos)
- Blog o sección de artículos
- Animaciones 3D o WebGL
- CMS o panel de administración
- Analytics (se puede añadir después)
- Página 404 con contenido elaborado (solo redirección simple a landing)
