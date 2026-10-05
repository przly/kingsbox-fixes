const aboutStepsSlider = document.querySelectorAll('[data-slider="about-steps-slider"]');

const aboutStepsSliderOptions = {
  slidesPerView: 'auto',
  spaceBetween: 16,
  watchOverflow: true,
  breakpoints: {
    767: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1199: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
};

const initAboutStepsSlider = (el) => new Swiper(el, aboutStepsSliderOptions);

setupResponsiveSliders({
  sliderElements: aboutStepsSlider,
  breakpoint: breakpointSm,
  initSlider: initAboutStepsSlider,
  mobileFallback: '',
  parentSelector: '[data-slider-parent]',
});

// Title reveal: every word slides up from behind its own mask when the title scrolls into view.
// The hidden start state lives in about-module.scss.
const aboutTitles = document.querySelectorAll('.about-module__title .title > *');

if (aboutTitles.length > 0 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  CustomEase.create('aboutTitleEase', '0.16, 1, 0.3, 1');

  aboutTitles.forEach((title) => {
    Splitting({ target: title, by: 'words' });

    // The word is the mask, the inner span is what moves
    const wordInners = Array.from(title.querySelectorAll('.word'), (word) => {
      const wordInner = document.createElement('span');

      wordInner.className = 'word__inner';
      wordInner.append(...word.childNodes);
      word.append(wordInner);

      return wordInner;
    });

    gsap.to(wordInners, {
      y: 0,
      duration: 1,
      ease: 'aboutTitleEase',
      stagger: 0.015,
      scrollTrigger: {
        trigger: title,
        // Starts once 40% of the title is in the viewport, and plays only once
        start: '40% bottom',
        once: true,
      },
    });
  });
}
