// Globals the about-module scripts expect on top of vendor-globals.js.
// countUp comes from the gulp `vendor.js` bundle (countUp.umd.js); the rest is an excerpt of
// source/scripts/01_default.js, where these are plain script-scope globals.
import * as countUp from 'countup.js';

const breakpointSm = 767;

function windowWidth() {
  return window.innerWidth || document.documentElement.clientWidth;
}

// Swiper is not loaded: the default variant has no steps slider, so initSlider is never called.
const setupResponsiveSliders = ({
  sliderElements,
  breakpoint = 767,
  initSlider,
  mobileFallback,
  parentSelector = '[data-slider-parent]',
  debounceDelay = 150,
}) => {
  const handleSlider = () => {
    sliderElements.forEach((sliderEl) => {
      const parent = sliderEl.closest(parentSelector);
      const isDesktop = windowWidth() > breakpoint;

      if (isDesktop) {
        if (!sliderEl.swiper) {
          initSlider(sliderEl);
          sliderEl.swiper.update();
        }
      } else {
        const fallbacks = Array.isArray(mobileFallback) ? mobileFallback : [mobileFallback];

        fallbacks.forEach((fallback) => {
          if (typeof fallback === 'function') {
            fallback(parent);
          }
        });

        if (sliderEl.swiper) {
          sliderEl.swiper.destroy(true, true);
          sliderEl.swiper = null;
        }
      }
    });
  };

  // Initial run
  handleSlider();

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleSlider, debounceDelay);
  });
};

Object.assign(window, { countUp, breakpointSm, setupResponsiveSliders });
