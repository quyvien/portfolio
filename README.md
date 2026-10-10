# Quy Vien Portfolio

A static-exported portfolio built with Next.js, TypeScript, and React Three Fiber. The visual system from the original HTML/CSS site is preserved while the runtime is split into server-rendered content and small client-side interaction boundaries.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript (strict mode)
- Three.js, React Three Fiber, and Drei
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
  three.css        3D scene presentation and fallback styles
components/
  Header.tsx       Menu, theme, and active-section behavior
  HeroScene.tsx    Interactive WebGL sculpture
  HeroSceneLoader.tsx
  HeroFallback.tsx Reduced-motion and WebGL fallback
  MotionController.tsx
data/
  portfolio.ts     Portfolio content and typed collections
public/assets/     Images, fonts, and illustrations
```

## 3D behavior

The hero sculpture is dynamically loaded on the client so Three.js does not enter the initial server-rendered content bundle. It reacts gently to pointer position, caps device pixel ratio, avoids shadows and remote environment maps, and displays a CSS fallback when reduced motion is enabled or WebGL is unavailable.

Keep future `.glb` models in `public/models/`. Compress large meshes and textures before adding them; mobile performance takes priority over polygon count or post-processing.

## Content updates

Edit `data/portfolio.ts` for identity, navigation, skills, and mentoring media. Edit the semantic section copy in `app/page.tsx`. Existing legacy HTML and JavaScript files remain in the repository only as migration reference and are not used by the Next.js build.
