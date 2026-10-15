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

## Case study video

`components/03-modules/case-study-video/`

**Bottom title reveal on scroll** (new `case-study-video.js`, `case-study-video.scss`)

The title under the video gets the same word reveal as the about module title, with the same values (movement, duration, easing, stagger, trigger and word mask).

- The script splits the title itself with `Splitting`, so `case-study-video.twig` is unchanged.
- The start state is in the SCSS, inside `prefers-reduced-motion: no-preference`. With reduced motion there is no split and no animation.

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
- When the title's text is in a dot's path (a left-aligned header, as in the FAQ module), that dot is clipped to the space between the text and its corner. It slides out from behind the text instead of appearing over it. Positions, padding and timing are unchanged, and the clip is removed when the animation ends. Dots whose path is clear of text are not clipped.
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

## Accordion item

`components/02-molecules/accordion-item/`

**Open and close motion** (`accordion-item.js`, `accordion-item.scss`)

Opening and closing use the same duration and easing, and the icon moves with the panel.

| | Original | Now |
| --- | --- | --- |
| Slide duration | 300ms | 250ms |
| Slide easing | `ease` (browser default, `slideDown`/`slideUp` set none) | `cubic-bezier(0.22, 1, 0.36, 1)` on `.accordion-item__content` |
| Chevron flip | no animation (the transition was on `.icon`, the flip is on `.icon::before`) | 250ms, same easing, on `.icon::before` |
| Plus/minus icon (secondary variant) | 80ms `ease` | 250ms, same easing |

- The hover background (80ms) is unchanged.

## Product card wishlist button

`components/02-molecules/product-card/product-card.scss`, `scss/base/_icon_variables.scss`

Restyled to the Figma design (KingsBox file, node `10933:5189`).

| | Original | Now |
| --- | --- | --- |
| Shape | circle | 34px square, 6px radius |
| Selected background | `--color-blue-500` | `--color-red-50` |
| Selected heart | white outline | filled, `--color-red-500` |

- Default (transparent, dark outline heart) and hover (white background) look the same as before.
- Hover is instant. The original faded the background and the icon over 500ms.
- Click motion (`product-card.scss`, `product-card.js`):

| | Value |
| --- | --- |
| Select: heart | pops from `scale(0.8)` to its normal size, 250ms, `cubic-bezier(0.34, 1.36, 0.64, 1)` (slight overshoot) |
| Unselect: heart | from `scale(0.96)`, 250ms, `ease-in-out`, no overshoot |
| Background | instant, on hover, select and unselect |
| Press | `scale(0.98)` over 100ms on `:active`, instant on release, the same as the regular buttons (`button.scss`) |

- `product-card.js` sets `data-wishlist-toggled` on the first click, and the animations only run with it. Hearts that are already selected on page load do not pop.
- With `prefers-reduced-motion: reduce` there is no animation.
- New `$icon_heart_filled`: the outer outline of `$icon_heart`, so the filled heart has exactly the same shape.
- Figma's `red/500` is `#fb2c36`. The project's `--color-red-500` is `#ed1c24`, and the button uses the project token.

**Navbar wishlist number** (`product-card.js`, `site-header.twig`, `site-header.scss`)

Clicking a product card heart updates the wishlist number on the navbar heart.

| | Value |
| --- | --- |
| Number appears (0 to 1) | pops in from `scale(0.5)` and `opacity: 0`, 300ms, `cubic-bezier(0.34, 1.36, 0.64, 1)` |
| Number changes (while visible) | only the number moves, the badge stays still: it slides 4px and fades in, 250ms, `cubic-bezier(0.34, 1.36, 0.64, 1)` (slight overshoot). Up from below when the count grows, down from above when it shrinks |
| Number disappears (back to 0) | shrinks to `scale(0.8)` and fades out, 150ms, `cubic-bezier(0.22, 1, 0.36, 1)`, then hidden |
| Navbar heart, on add | pops from `scale(0.8)`, 250ms, same easing as the card heart |

- The number is written into a `.header-main__link-number-value` span, so it can move inside the badge.
- No blur in any of these animations: it is not used anywhere else on the site.
- `site-header.twig`: new `data-wishlist-number` on the wishlist number, like `data-cart-number` on the cart.
- In production the count comes from the server. `cart-popup.js` already writes `wishlistCount` from a response, but to `.header-main__heart`, which no template renders. Here `updateWishlistNumber()` in `product-card.js` counts up and down from the number already in the header, so the sandbox works without a backend. Wire it to the server count when this goes to production.
- With `prefers-reduced-motion: reduce` the number just appears and disappears.

## Page scrollbar

`scss/base/_general.scss`, `components/03-modules/site-header/site-header.scss`

The space for the page's scrollbar is always reserved (`scrollbar-gutter: stable` on `html`). The page no longer jumps sideways when it becomes tall enough to scroll, for example when an accordion opens on a short page, or when scrolling is locked.

- Because the space stays reserved while scrolling is locked, the locks no longer pad for the scrollbar: the `padding-right: var(--scroll-width)` on the locked `body` and on `.header-main`, and Fancybox's `--f-scrollbar-compensate` margin, are dropped where `scrollbar-gutter` is supported. Browsers without support keep the old padding.
- With overlay scrollbars (macOS default, phones) nothing changes, because no space is taken.

## Wide screens

`scss/base/_general.scss`, `scss/base/_extensions.scss`

From 1440px up the container was locked at 1410px, so a wider screen only got wider side margins. Now, above 1440px:

- The container follows the viewport and keeps the 20px side margin it has at 1440px.
- The cards grow with it and keep their proportions. Their content does not scale.
- The page headings grow by the same amount: h1, h2, h3 and the 7xl display size (hero and centred section header titles).
- Nothing else scales: body text, smaller titles (h4 to h6), buttons, the navbar and all spacing keep their size.

Below 1440px nothing changes. Both stop at a 2560px viewport: the container at 2530px (2520px of content) and the cards and headings at their 2560px size. Wider screens show the 2560px layout centred, with wider side margins. Full-width section backgrounds still fill the screen.

- `--page-zoom` on `html` is how much wider the viewport is than 1440px. It is written as `tan(atan2(min(100vw, 2560px), 1440px))`, because `calc()` cannot divide one length by another in every browser yet.
- Cards whose size is a fixed px value multiply it by `--page-zoom`: the `min-height` and `max-width` of `.card` (`card.scss`), and the `height` and `max-width` of `.case-study-card--large` (`case-study-card.scss`).
- The other cards need no change, because their height already follows their width: the step card and the product card through their image ratio, the default case study card through `aspect-ratio`.
- `.case-study-card--medium` is left alone. It is only used in the megamenu.
- Headings multiply their desktop `font-size` by `--heading-zoom` (`_extensions.scss`), which is `--page-zoom` on `html` and `1` inside the site header, the menu, the megamenu and modals, so those keep their sizes. The smaller breakpoints still set their own sizes.
- The two boxes that cap a title's width grow with it, so the titles keep their line breaks: `.hero-module__content` (520px, `hero-module.scss`) and the centred `.section-header__inner` (900px, `section-header.scss`).

## Mixins

`scss/mixins/_mixins.scss`

- New `pointer-dots-highlight` mixin, shared by the card and the cookie bar. It holds the highlight colour, the mask radius and falloff, and the fade timings. The 200px radius is repeated as `cardPointerRadius` in `card.js`.

## Sandbox pages

Run `pnpm dev` (port 3020). Each page is an `index.html` registered in `vite.config.js`.

| Route | Shows |
| --- | --- |
| `/` | hero module, about module and cookie banner |
| `/about-module/` | about module |
| `/section-header/` | section header |
| `/home/` | the full homepage |
| `/faq-module/` | FAQ module with 4 accordions, and 4 accordions in the secondary variant |
| `/wishlist-button/` | site header and three product cards with the wishlist button |

- `/home/` is `04-templates/homepage/homepage.twig` rendered by Fractal with the context from `homepage.config.json`. Asset paths point at `/source/`, and the two Google reCAPTCHA script tags are removed. `/faq-module/` is rendered the same way.
- The components and images these pages need are copied from the Kingsbox repo unchanged, except where a section above lists a change.
- `/home/`, `/faq-module/` and `/wishlist-button/` load `sandbox/home.js`. Like `bundle:user:js` in the Kingsbox repo, it concatenates `source/scripts` and every component script into one scope (the `virtual:kingsbox-bundle` plugin in `vite.config.js`), with the vendor libraries as globals (`sandbox/home-globals.js`). Lenis smooth scrolling is turned off.
