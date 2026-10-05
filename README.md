# Kingsbox homepage hero sandbox

Standalone copy of the homepage hero (`hero-module`) from `kingsbox/165-1-kingsbox-prenova`, taken from `develop` at `d420e0fd` (2026-10-02).

```bash
pnpm install
pnpm dev        # http://localhost:3020
```

| Route | What it shows |
| --- | --- |
| `/` | `hero-module` followed by `about-module` (both `default` variants) and a placeholder block, as one scrolling page |
| `/about-module/` | `about-module`, `default` variant, on its own |

## What is where

`source/` mirrors the repo's `source/` folder with the same paths and unmodified files, so anything changed here can be copied or diffed straight back.

| Path | What it is |
| --- | --- |
| `source/components/03-modules/hero-module/hero-module.js` | The GSAP intro timeline and the scroll-scrubbed overlay |
| `source/components/03-modules/hero-module/hero-module.scss` | Hero styles, including the hidden start states of the animated elements |
| `source/components/03-modules/hero-module/hero-module.twig` | Original template, for reference only (not rendered here) |
| `source/components/01-atoms/` | The atoms the hero uses: button, icons, margin, section-margin, title |
| `source/scss/` | The full global SCSS (variables, mixins, reset, utilities, `slowZoom` keyframes) |
| `index.html` | `hero-module.twig` rendered by hand with the `default` context from `hero-module.config.json` |
| `sandbox/` | Glue that is not in the repo (see below) |

## About module route

The about-module markup exists twice, in `index.html` and in `about-module/index.html`, so a markup change has to be made in both. `/about-module/` is the `default` variant of `about-module`, copied from the local clone's `develop` at `1ff287de` (2026-10-01), together with what it includes: `02-molecules/card`, `01-atoms/mod-counter` and `03-modules/editor-text`, plus the four card icons in `source/images/`.

| Path | What it is |
| --- | --- |
| `about-module/index.html` | `about-module.twig` rendered by hand with the `default` context from `about-module.config.json` |
| `sandbox/about-module.js` | Entry for the route |
| `sandbox/about-globals.js` | `countUp` (from `vendor.js`) and the `breakpointSm` / `setupResponsiveSliders` excerpt of `01_default.js` that `about-module.js` calls |

## Cookie banner

Both routes end with `02-molecules/advance-cookie-banner`, placed after `</main>` as in the repo's `homepage.twig`, rendered by hand with the context from its config. It came with `01-atoms/toggle`, and `sandbox/cookie-globals.js` supplies `Cookies` (js-cookie, from `vendor.js`) and the `attachEvent` / `toggleBodyScrollLock` excerpt of `01_default.js`. The markup exists in both HTML files. The bar shows until `necessary_cookie` is set; delete that cookie for `localhost` to see it again.

Swiper is not loaded, because the `default` variant has no steps slider. The `secondary` variant needs it, along with `02-molecules/step-card` and `02-molecules/section-header`.

## Differences from the real site

- `index.html` is static HTML. If the markup changes, port the change to `hero-module.twig` by hand.
- `sandbox/vendor-globals.js` replaces the gulp `vendor.js` bundle and exposes `gsap`, `ScrollTrigger`, `CustomEase`, `Lenis` and `Splitting` as globals.
- `sandbox/default-excerpt.js` holds the two bits of `source/scripts/01_default.js` that affect the hero: the Lenis setup (desktop only, above 1023px) and the `Splitting()` call.
- The site header, which sits on top of the hero on the real homepage, is not included.
- A placeholder block below the about module stands in for the rest of the homepage so the page keeps scrolling.
- Only the video variant is rendered. For the background-image variant (the one that uses `slowZoom`), swap the `hero-module__bg` block in `index.html` for the image markup from the twig file.

## CSS build

`vite.config.js` compiles `source/scss/style.scss` and every `source/components/**/*.scss` separately and concatenates them into `source/css/bundle.css`, the same way `config/css.config.js` does in the repo. Sass is pinned to 1.58.3 to match the repo, so pnpm prints an unmet peer warning for Vite; it can be ignored because Vite's own Sass pipeline is not used.
