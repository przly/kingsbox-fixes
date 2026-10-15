const missionSlider = document.querySelectorAll('[data-slider="mission-slider"]');

const missionSliderOptions = {
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
  },
};

const initMissionSlider = (el) => new Swiper(el, missionSliderOptions);

setupResponsiveSliders({
  sliderElements: missionSlider,
  breakpoint: breakpointSm,
  initSlider: initMissionSlider,
  mobileFallback: '',
  parentSelector: '[data-slider-parent]',
});
