# Quy Vien Portfolio

A static-exported portfolio built with Next.js and TypeScript. The visual system from the original HTML/CSS site is preserved while the runtime is split into server-rendered content and small client-side interaction boundaries.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript (strict mode)
- SVG animation driven by `requestAnimationFrame`
- Static export for deployment to any static host

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks and production build

```bash
npm run typecheck
npm run lint
npm run build
```

The production build is written to `out/`. It can be uploaded to any host that serves static HTML, CSS, JavaScript, fonts, and images.

## Project structure

```text
app/
  layout.tsx       Metadata, global styles, and theme bootstrap
  page.tsx         Server-rendered portfolio sections
  three.css        Dragon cursor presentation and fallback styles
components/
  Header.tsx       Menu, theme, and active-section behavior
  DragonCursor.tsx Segmented SVG dragon following the pointer
  HeroSceneLoader.tsx
  HeroFallback.tsx Reduced-motion fallback
  MotionController.tsx
data/
  portfolio.ts     Portfolio content and typed collections
public/assets/     Images, fonts, and illustrations
```

## Dragon cursor behavior

The hero background uses an original SVG skeleton assembled from a head, wings, ribs, and vertebrae. A lightweight segment-chain animation makes each part follow the one ahead of it, producing a fluid dragon motion toward the pointer. When the pointer is idle, the dragon slowly patrols the hero. Reduced-motion visitors receive a static line-art fallback.

## Content updates

Edit `data/portfolio.ts` for identity, navigation, skills, and mentoring media. Edit the semantic section copy in `app/page.tsx`. Existing legacy HTML and JavaScript files remain in the repository only as migration reference and are not used by the Next.js build.
