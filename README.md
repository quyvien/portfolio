# Personal portfolio

A dependency-free, responsive portfolio. Open `index.html` in a browser, or serve this directory using any static web server. No install or build step is required. To deploy, upload only `index.html`, `layout.css`, `motion.css`, `content.js`, `app.js`, `motion.js`, and `assets/` to your static host. Exclude browser profiles, test files, and preview screenshots.

The revised structure adapts the supplied HTML reference: fixed navigation with a full-screen modal menu, a split uppercase hero with panoramic media, a prominent identity block, a sticky project introduction beside large project previews, and a large typographic footer. The three-part About section introduces Quy Vien as a third-year HUFLIT IT student pursuing software engineering. Skills reuse the existing chapter styles, and MenuScan is the featured project. Reference-specific identity, projects, credentials, testimonials, counters, chat, and Next.js build files are not imported.

## Personalize

- Edit `content.js`: name, introduction, two animated lines, media, and contact information. Keep HTML defaults in sync so the content also works without JavaScript. About, categorized skills, and the MenuScan project are authored in index.html.
- Add only verified project details and personal contributions. The MenuScan illustration is decorative, not a product screenshot.
- Projects accept `title`, `summary`, `problem`, `contribution`, `approach`, `learning`, `image`, `imageAlt`, `video`, and `links: [{label, url}]`. A project video has native playback controls and never autoplays. Add more project articles in `index.html` with consecutive `data-project` indices to match additional config entries.
- Add real `contact.email`, `contact.linkedin`, and `contact.github` values. Empty values show labeled placeholders, not dead links.
- Replace the original SVG compositions in `assets/` with your own media when available. The illustrations are intentionally abstract placeholders, not evidence of completed projects. The four referenced images were not present in the provided attachments.
- Set `hero.video` to an MP4/WebM asset path and `hero.poster` to its poster. Hero playback is muted, looping, inline, and pausable. Missing media, playback rejection, and reduced motion keep the static poster. A missing custom poster falls back to the included artwork.

## Behavior

The first visit follows the system color scheme. The theme button stores subsequent choices in local storage; blocked storage does not prevent the control from working. Text remains readable without JavaScript. Reduced motion disables sliding and automatic video playback. Content and links are inserted using text nodes and allowed web/mail URL schemes.

Motion is isolated in `motion.js` and `motion.css`: staggered hero and section entrances, two typography lines driven in opposing directions by scroll position, gentle project-image parallax, menu entrances, and link hover feedback. Entrances play once and cancel when their content receives keyboard focus. Scroll updates use a single requested animation frame rather than a continuous loop. Reduced-motion preference changes cancel active entrances and reset scroll transforms immediately. Mobile uses shorter travel distances; the existing portrait crop is preserved.

Reference research: the public scripts of https://romancaseres.cloud/ were inspected on 2026-10-04. They use GSAP/ScrollTrigger for opposing service typography, staggered about/contact/footer reveals, a pinned desktop multi-project gallery, and Lenis smooth scrolling. This portfolio adapts the movement with browser APIs; its single project does not need a pinned slideshow. No reference text, images, or bundled source is included. Next.js is not required for these effects.

Open `/tests/motion.html` for motion-specific checks in normal and reduced-motion browser modes, including the no-JavaScript fallback.

With the preview server running, `node --experimental-websocket tests/run-motion.mjs` runs both browser suites in real-time headless Chrome on Windows and saves desktop/mobile screenshots. Motion verification: 8 normal-motion checks, 7 reduced-motion checks, and a live preference-change check passed; the existing 35/36 browser checks also passed. Layout was checked at 320, 375, 390, 768, 1024, and 1440 pixels.

## Local preview on Windows

Run `powershell -ExecutionPolicy Bypass -File serve.ps1` from this directory and visit `http://localhost:4173`. Stop the server with Ctrl+C. The server binds only to localhost and serves files only within this folder.

## Verification

Open `/tests/browser.html` through the local preview server to run the browser checks. This uses an iframe and isolated preview content, and changes the theme preference on this local origin.

Verified in headless Chrome at 320, 375, 390, 768, 1024, and 1440 pixels: no horizontal overflow, header and featured text fit, navigation targets, theme switching and persistence, one-time typography reveal, static media fallback, broken video/poster fallback, and working email/GitHub contact links. Standard run: 35 checks passed. Reduced-motion run: 36 checks passed. The revised layout also checks modal menu opening/closing, focus restoration, cancel dismissal, menu navigation, and project index navigation. Phone, tablet, desktop, and both themes were also inspected in screenshots. Playback with your actual future video still needs to be checked once that asset is supplied.
