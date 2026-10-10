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

The hero background adapts the credited `Dragon-Cursor` SVG artwork into a
React component. Its original 40-part segment chain follows the pointer and
returns to an idle orbit when interaction stops. The palette automatically
switches between black and white with the site theme, while reduced-motion
visitors receive a static line-art fallback.

## Content updates

Third-party artwork and source acknowledgements are listed in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

Edit `data/portfolio.ts` for identity, navigation, skills, and mentoring media. Edit the semantic section copy in `app/page.tsx`. Existing legacy HTML and JavaScript files remain in the repository only as migration reference and are not used by the Next.js build.
