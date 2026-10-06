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

## Section header

`components/02-molecules/section-header/`, `components/01-atoms/number-icon/`

**Corner marks animation** (new `section-header.js`, `section-header.scss`, `number-icon.twig`)

The four corner marks start empty. On each side the two dots scale up together in the vertical middle of the header, so they read as one dot. Then they split: one travels up to the top corner and one down to the bottom corner. The dots never grow past their normal size. Each number fades in behind its dot as it arrives.

| | Value |
| --- | --- |
| Dots appear | at the vertical middle of the header: scale from 0 to 1× in 0.3s, ease-out expo (GSAP `expo.out`, about `cubic-bezier(0.16, 1, 0.3, 1)`), with no fade |
| Hold | none; the move starts together with the scale-up |
| Dot move | 0.8s, strong ease-in-out, `cubic-bezier(0.77, 0, 0.175, 1)`; most of the distance is covered in the middle 0.3s |
| Number | starts at 0.6s, as the dot visibly arrives: opacity 0 to 1 over 0.1s, linear, and a 6px slide along the dot's path, 0.25s on the hero curve, `cubic-bezier(0.25, 0.49, 0.31, 1)` (`showNumber` in `section-header.js` hides the numbers) |
| Stagger | none, all four move together |
| Trigger | once, when the whole header is on screen (its bottom edge reaches 95% of the viewport height) |

- `number-icon.twig`: each icon's single SVG is split into two SVGs laid over each other, `.number-icon__number` and `.number-icon__dot`, so the dot moves with a CSS transform and the number is not redrawn. The drawing is unchanged.
- `number-icon.scss`: the dot SVG is positioned over the number SVG.
- `section-header.scss`: hidden start state for both.
- With `prefers-reduced-motion: reduce` there is no movement; the marks fade in over 0.2s.
- Applies wherever a section header has corner marks (`center_aligned` or `corner_numbers`).

## Advance cookie banner

`components/02-molecules/advance-cookie-banner/advance-cookie-banner.scss`

All changes are on `.advance-cookie-banner__bar`. The script and the twig are unchanged.

- **Border:** `1px solid rgba($cgp_white, 0.08)`, the same as the cards.
- **Cursor highlight:** `@include pointer-dots-highlight`, the same effect as on the cards. `card.js` tracks the bar as well.
- **Move in / move out**, replacing the 0.5s opacity fade:

| | Move in | Move out |
| --- | --- | --- |
| Trigger | `.cookie-not-set` added | `.cookie-not-set` removed (accept, confirm choice, allow all) |
| Duration | 500ms, after a 300ms delay | 500ms |
| Easing | `cubic-bezier(0.25, 0.49, 0.31, 1)` | same |
| Movement | up by 30px (34px from tablet L up) | back down by the same distance |
| Opacity | 0 to 1 | 1 to 0 |

- Duration, easing and distance match the hero buttons: 0.5s, the hero's custom ease, and one button height.
- Move in is a keyframe animation (`cookieBarIn`), move out is a transition.
- With `prefers-reduced-motion: reduce` the bar only fades.

## Smooth scrolling

`scripts/01_default.js`

- Lenis smooth scrolling is removed, so the page scrolls with the browser's default behaviour. In the repo this is the `initSmoothScrolling()` block (desktop only, above 1023px) in the "Lenis" section.
- `checkout-map.js` looks up the Lenis instance to pause it over the map, so check it still behaves when the block is removed there.

## Text selection on dark backgrounds

`scss/base/_general.scss`, `scss/mixins/_mixins.scss`, `card.scss`, `advance-cookie-banner.scss`

The global `::selection` is black with white text, so selected text was invisible on dark backgrounds. It is now inverted there, to a white highlight with black text:

- `.bg-black` and `.bg-gray-950` sections, in `_general.scss`.
- `.card` and `.advance-cookie-banner__bar`, which are dark regardless of the section they sit in.

## Mixins

`scss/mixins/_mixins.scss`

- New `pointer-dots-highlight` mixin, shared by the card and the cookie bar. It holds the highlight colour, the mask radius and falloff, and the fade timings. The 200px radius is repeated as `cardPointerRadius` in `card.js`.
- New `dark-surface-selection` mixin, which holds the inverted selection colours.
