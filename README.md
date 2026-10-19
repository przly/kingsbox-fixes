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
- No blur in any of these animations. The only blur in the site's motion is the copy button's label and icon swap, the free shipping amount and the quantity counter.
- `site-header.twig`: new `data-wishlist-number` on the wishlist number, like `data-cart-number` on the cart.
- In production the count comes from the server. `cart-popup.js` already writes `wishlistCount` from a response, but to `.header-main__heart`, which no template renders. Here `updateWishlistNumber()` in `product-card.js` counts up and down from the number already in the header, so the sandbox works without a backend. Wire it to the server count when this goes to production.
- With `prefers-reduced-motion: reduce` the number just appears and disappears.

## Copy cart link button

`scripts/01_default.js`, `components/01-atoms/button/button.scss`, `components/01-atoms/icons/icons.scss`, `scss/base/_icon_variables.scss`

**Copied state.** Before, a successful copy only turned the button grey (`is-disabled`) for 1s, which looked like it had stopped working. Now the label changes to "Link copied" and the copy icon turns into a check. After 2s both change back.

| | Value |
| --- | --- |
| Timing | label and icon start together, each the same in both directions, `ease-in-out`: the label in 150ms, the icon in 250ms |
| Width | the button hugs the visible label and resizes to the new one, 250ms, `cubic-bezier(0.22, 1, 0.36, 1)`, the same both ways |
| Label swap | the old label moves up 4px, fades out and blurs to `blur(2px)`, "Link copied" comes from 4px below and `blur(2px)` and fades in |
| Icon swap | the leaving icon goes to `scale(0.25)`, opacity 0 and `blur(2px)`, the arriving one comes from there to normal |
| Colour | background to `--color-black`, text and icon to white, 250ms, `ease-in-out`, the same both ways |
| Hold | 2s. Clicking again copies again and restarts the 2s |

- The icon swap follows [Jakub Krehel's contextual icon animation](https://jakub.kr/writing/details-that-make-interfaces-feel-better#animate-icons-contextually) (opacity, `scale(0.25)`, blur, `ease-in-out`, 2s hold). The durations and the blur are tuned to the transitions.dev motion tokens: text swap 150ms, icon swap 250ms, 2px blur on both. These swaps, the free shipping amount and the quantity counter are the only blur in the site's motion.

- The button is no longer greyed out or disabled. While "copied" shows it turns black (`--color-black`) with white text and icon, on hover too, and goes back to its own colours when the state ends. The colour only fades during the swap (`is-copy-swapping`, added by `swapCopyState()` and removed when the fade ends), so hover stays instant. The icons follow the button's colour instead of their own 300ms fade.
- The button hugs its visible label in both states, and the width change animates: 250ms, `cubic-bezier(0.22, 1, 0.36, 1)` (the motion tokens' resize easing), starting with the label and icon swap. `swapCopyState()` in `01_default.js` measures the label before and after the change, animates between the two in px, and goes back to `width: auto` when it ends. The leaving label is clipped at the sides while the width changes. With reduced motion the width changes at once.
- Below 480px the label is hidden (unchanged), and the icon change alone shows the copy worked.
- The check is a new icon, `icon-checkmark` (`$icon_checkmark` in `scss/base/_icon_variables.scss`, the class in `icons.scss`), from the "Trailing Icon" SVG in the design. The existing `icon-check` is unchanged, because the dropdown uses it.
- `$icon_copy` is replaced with the "CopyIcon" SVG from the design: the same drawing, but on a 16×16 canvas with space around it, like the checkmark, so the two icons are drawn at the same scale. It is only used by the cart and quote popup copy buttons.
- The script adds the second label, the check icon and a `role="status"` screen reader message when the page loads, so `button.twig` and `cart-popup.twig` are unchanged. The visible "Link copied" label is `aria-hidden`; screen readers hear the status message.
- The text can be changed per button with `data-copied-text`. The default is "Link copied".
- If the copy fails, nothing changes and the error is logged, as before.
- Applies to every `data-copy-button`, so the quote popup's copy button gets the same state. A copy button with only an icon (like the product page's copy code button) gets the icon swap and the screen reader message, with no label and no width change.
- With `prefers-reduced-motion: reduce`, the labels and icons only fade.

## Free shipping card

`components/02-molecules/free-shipping-indicator/free-shipping-indicator.scss`, `scss/base/_animations.scss`

**Amount change.** When the amount left to free shipping changes, the old amount swaps for the new one inside the white pill and the pill resizes to it. It is the same swap as the copy button's label.

| | Value |
| --- | --- |
| Old amount out | moves 4px, fades out and blurs to `blur(2px)`, 150ms, `ease-in-out` |
| New amount in | comes 4px from the other side and from `blur(2px)`, fades in, 150ms, `ease-in-out`, at the same time |
| Direction | with the change, like the quantity counter: when the amount goes up (−), the old one moves up and the new one comes up from below; when it goes down (+), the old one moves down and the new one comes down from above (`is-down`) |
| Pill width | resizes to the new amount, 250ms, `cubic-bezier(0.22, 1, 0.36, 1)`, at the same time |
| Progress bar | 250ms, `cubic-bezier(0.22, 1, 0.36, 1)`, the same as the pill. Was 300ms, `--easing-slow` (`cubic-bezier(0.25, 0.1, 0.25, 1)`) |

**State switch** (`free-shipping-indicator.js`, `free-shipping-indicator.scss`). The switch between "Add … more to earn free shipping!" and "Your order ships for free!" swaps the texts like the copy button's label, 150ms, `ease-in-out`, with a 4px move and `blur(2px)`.

| | Value |
| --- | --- |
| To free shipping: old text | "add … more" moves up 4px, fades out and blurs to `blur(2px)`, 150ms, `ease-in-out` |
| To free shipping: new text | "ships for free" rises 12px from `blur(3px)` and fades in, 500ms, `cubic-bezier(0.22, 1, 0.36, 1)` |
| To free shipping: "free" pill | pops from `scale(0.5)`, 8px below, `blur(8px)` and opacity 0, 500ms, `cubic-bezier(0.34, 1.56, 0.64, 1)` (clear overshoot), 80ms after the text starts |

- The values follow the transitions.dev motion tokens: the leaving text and the swap back are a text swap (150ms, `ease-in-out`, 4px, `blur(2px)`), "ships for free" is a text reveal at the emphasis duration (12px, `blur(3px)`, 500ms), and the pill is a badge appear with the success check's 8px blur and the badge's 8px rise, sequenced 80ms after the text. The pill keeps a stronger overshoot than the tokens' badge pop (1.56 instead of 1.36), so it pops more.
| Back | the quick swap: "ships for free" moves down 4px while "add … more" comes down from above, 150ms, `ease-in-out` (`is-down`) |

- Reaching free shipping gets more motion than going back: it is the moment the card exists for, and the way back should just get out of the way. The pill pop outlasts the text, so it runs on its own class, `is-celebrating`, removed when the pop ends. Going back cancels it.

- The card is now a grid (`display: grid`, was `block`), and both texts share its first cell, so the leaving one stays on top of the new one until it has faded out (`is-leaving`, `is-entering`). The progress bar is in the second row. The dotted background is absolutely positioned and is not affected. `gap: 0` undoes the 20px gap from `.gray-dotted-box`, which only applies now that the card is a grid, so the spacing above the bar is unchanged.
- It runs where `is-free` is toggled: `updateProgressWidth()` swaps only when the state actually changes, and not on page load, so a card that starts free doesn't animate.
- The amount keeps its last value while the "add … more" text leaves, so it doesn't flash "0 €", and is right when the text comes back (`sandbox/free-shipping.js`).
- With `prefers-reduced-motion: reduce` the texts and the pill only fade.
- In production the server replaces the card after a quantity change, so the new card starts in its state and does not swap, like the amount.

**Progress bar end.** The bar's right end was cut square near and past 100%: the width goes over 100% once shipping is free, and the striped part next to it can't shrink below its 4px border, so the bar overflowed the track (`overflow: hidden`). Now the bar has `max-width: 100%` and can shrink (`flex-shrink: 1`, was `0`), so it always fits next to the striped part. At 100% the card gets `is-full` and the striped part is hidden, so the bar fills the whole track. The rounded corners show at every width.

**Free shipping starts at the dashed line** (`free-shipping-indicator.js`). Before, the card switched to "ships for free" when the bar's width went over 100%, and the dashed line 16px before the end meant nothing. Now it switches once the bar's end is past the line.

- The line's distance from the end is read from the CSS (`right` of `.free-shipping-indicator__inner::after`), so it is not repeated in the script.
- It is checked against the width the bar is set to, not the animated one, so the state switches as the change starts.
- The line is a fixed 16px from the end, so its position in % depends on the track's width. A `ResizeObserver` checks the state again when the track resizes, without the swap animation.
- `is-full` (bar at 100%) is separate from `is-free`, so a free cart can show the bar past the line but not full, with the striped part still after it.
- **For production:** the server sets the bar's width as a percentage. For "past the line" to mean "above the threshold", the server's percentage has to put the threshold on the line, as `sandbox/free-shipping.js` does. If it keeps sending total ÷ threshold × 100, the card would switch to free a little before the threshold (at about 97% on a 600px track).

- Each amount is in its own `.free-shipping-indicator__amount-value` span, inside `.free-shipping-indicator__amount-values`, so they move inside the pill while the pill stays still. The leaving amount sits on top of the new one and is removed when it has faded out. On quick clicks, an amount that is still leaving is removed at once.
- The amounts are clipped at the pill's sides while the width catches up.
- With `prefers-reduced-motion: reduce` the amounts only fade and the width changes at once, like the copy button.
- In production the server sends a new card after each quantity change (`axiosChangeQuantityInCart` in `cart-popup.js`), which replaces the old one, so nothing animates there yet. On `/free-shipping/` the change, the classes and the width are handled by `sandbox/free-shipping.js`. To use it in production, update the amount in place (or keep the old amount and compare) when the new card arrives.

## Quantity counter

`components/02-molecules/quantity-counter/`, `scss/base/_animations.scss`

**Value change** (`quantity-counter.js`, `quantity-counter.scss`). When + or − changes the number, it swaps like the copy button's label and the free shipping amount, 150ms, `ease-in-out`, with a 4px move and `blur(2px)`. It moves with the change: when the number goes up, the old one moves up and fades out while the new one comes up from below; when it goes down, the old one moves down while the new one comes down from above (`is-down`, keyframes `text-swap-in-down` and `text-swap-out-down`).

- An `<input>` can't animate its text, so on the first change the script wraps the input in `.quantity-counter__value-wrap` and lays the numbers over it as spans (`.quantity-counter__values`, `aria-hidden`). The input's own text is hidden (`has-value-swap` on the counter). The input keeps the value, so `cart-popup.js` and `quote-popup.js` read it as before.
- It is set up on the first change, not on page load, so counters the cart re-renders from the server get it too.
- The counter is a fixed 25px wide, so there is no width change.
- On quick clicks, a number that is still leaving is removed at once.
- Applies to every quantity counter: side cart, cart page, quote popup, accessories, accordions. In the side cart the server re-renders the cart after a change, which can replace the counter before the swap has finished.
- With `prefers-reduced-motion: reduce` the numbers only fade.
- The swap keyframes (`text-swap-in`, `text-swap-out`, their `-down` versions and `text-swap-fade-in`) are shared in `_animations.scss`, and the free shipping amount uses them too.

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

Run `pnpm dev` (port 3020). Each page is an `index.html` registered in `vite.config.js`. Every page has a page switcher in the bottom left corner (`sandbox/route-switcher.js`, styles in `sandbox.css`); a new page goes in its `routes` list as well.

| Route | Shows |
| --- | --- |
| `/` | hero module, about module and cookie banner |
| `/about-module/` | about module |
| `/section-header/` | section header |
| `/home/` | the full homepage |
| `/faq-module/` | FAQ module with 4 accordions, and 4 accordions in the secondary variant |
| `/wishlist-button/` | site header and three product cards with the wishlist button |
| `/copy-cart-link/` | the side cart's "Copy Cart link" button and the product page's grey copy code button, on the side cart's white background |
| `/free-shipping/` | the side cart's free shipping card with a quantity counter under it. + and − change the amount left and the progress bar (`sandbox/free-shipping.js`: quantity × 699 € against the 2.999 € threshold, which lands on the dashed line; at 5 the bar is past the line and the card shows "ships for free", from 6 the bar is full) |

- `/home/` is `04-templates/homepage/homepage.twig` rendered by Fractal with the context from `homepage.config.json`. Asset paths point at `/source/`, and the two Google reCAPTCHA script tags are removed. `/faq-module/` is rendered the same way.
- The components and images these pages need are copied from the Kingsbox repo unchanged, except where a section above lists a change.
- `/home/`, `/faq-module/`, `/wishlist-button/`, `/copy-cart-link/` and `/free-shipping/` load `sandbox/home.js`. Like `bundle:user:js` in the Kingsbox repo, it concatenates `source/scripts` and every component script into one scope (the `virtual:kingsbox-bundle` plugin in `vite.config.js`), with the vendor libraries as globals (`sandbox/home-globals.js`). Lenis smooth scrolling is turned off.
