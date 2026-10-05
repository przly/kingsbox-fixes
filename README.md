# Kingsbox fixes

Changes made to the original components of `kingsbox/165-1-kingsbox-prenova`. Paths are relative to the repo's `source/` folder. Everything not listed here is unchanged.

## Hero module

`components/03-modules/hero-module/`

Compared against `develop` at `1ff287de` (2026-10-01).

**`hero-module.js`**

| | Original | Now |
| --- | --- | --- |
| Intro duration per element | 0.4s | 0.5s |
| Title word stagger | 0.1s | `min(0.025s, 0.3s / word count)`, so the whole title stays under 0.3s |
| Button stagger | 0.1s | 0.05s |
| Overlap between text, title and buttons | `-=0.2` | `-=0.45` (each group starts 0.05s after the previous one) |
| Stagger on the single super-title paragraph | 0.1s | removed |

- New background parallax: `.hero-module__bg` moves `yPercent: 20` while the hero scrolls out (`top top` to `bottom top`, scrubbed). Skipped with `prefers-reduced-motion: reduce`.

**`hero-module.scss`**

- `max-width` of the content block: 460px to 520px.
- `will-change: transform` added on the background, for the parallax.

## About module

`components/03-modules/about-module/`

**Title reveal on scroll** (`about-module.js`, `about-module.scss`)

The title is split into words and each word slides up from behind its own mask when the title scrolls into view.

| | Value |
| --- | --- |
| Movement | `translateY(220%)` to 0 |
| Duration | 1s per word |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Stagger | 0.015s |
| Trigger | once, when 40% of the title is in the viewport (`start: '40% bottom'`) |
| Word mask | `clip-path: inset(-0.4em -0.15em -0.4em 0)` |

- The script splits the title itself with `Splitting`, so `about-module.twig` is unchanged.
- The start state is in the SCSS, inside `prefers-reduced-motion: no-preference`. The title is hidden until the script has split it. With reduced motion there is no split and no animation.
- Applies to the title in every variant.

## Card

`components/02-molecules/card/`

**Cursor highlight on the dot pattern** (`card.scss`, new `card.js`)

The dots brighten around the cursor.

| | Value |
| --- | --- |
| Resting dots | `--color-gray-800` (unchanged) |
| Peak dot colour | `#595959` (35% lightness) |
| Radius | 200px |
| Falloff | eased (cosine), nine stops |
| Fade in / out | 150ms / 400ms, `ease-out` |

- `card.scss`: `position: relative` and `@include pointer-dots-highlight` (see Mixins).
- `card.js` is a new file. It sets `--card-pointer-x`, `--card-pointer-y` and the `is-pointer-near` class on every card within 200px of the cursor, so the highlight carries into neighbouring cards.
- It keeps tracking while the page scrolls under a still cursor.
- The last cursor position is kept in `sessionStorage`, so the highlight also works after a reload before the cursor has moved.
- Only cards in the viewport are measured, at most once per frame.
- Only on devices with `(hover: hover) and (pointer: fine)`.

## Advance cookie banner

`components/02-molecules/advance-cookie-banner/advance-cookie-banner.scss`

All changes are on `.advance-cookie-banner__bar`. The script and the twig are unchanged.

- **Border:** `1px solid rgba($cgp_white, 0.08)`, the same as the cards.
- **Cursor highlight:** `@include pointer-dots-highlight`, the same effect as on the cards. `card.js` tracks the bar as well.
- **Move in / move out**, replacing the 0.5s opacity fade:

| | Move in | Move out |
| --- | --- | --- |
| Trigger | `.cookie-not-set` added | `.cookie-not-set` removed (accept, confirm choice, allow all) |
| Duration | 500ms, after a 300ms delay | 300ms |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` | same |
| Movement | from `translateY(100% + 20px)` to 0 | back to `translateY(100% + 20px)` |
| Opacity | 0 to 1 | 1 to 0 |

- Move in is a keyframe animation (`cookieBarIn`), move out is a transition.
- With `prefers-reduced-motion: reduce` the bar only fades.

## Mixins

`scss/mixins/_mixins.scss`

- New `pointer-dots-highlight` mixin, shared by the card and the cookie bar. It holds the highlight colour, the mask radius and falloff, and the fade timings. The 200px radius is repeated as `cardPointerRadius` in `card.js`.
