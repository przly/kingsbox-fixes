const cardSlider = document.querySelectorAll('[data-slider="card-slider"]');

const cardSliderOptions = {
  slidesPerView: 'auto',
  spaceBetween: 16,
  watchOverflow: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar',
  },
  breakpoints: {
    767: {
      slidesPerView: 'auto',
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
};

const initCardSlider = (el) => {
  const dynamicParent = el.closest('[data-slider-main-parent]');
  const parentEle = el.closest('.card-slider');
  const controlsParent = dynamicParent || parentEle;

  const selectedCols = parentEle.getAttribute('data-select-col');
  const gap = parentEle.getAttribute('data-gap');
  const arrowRight = controlsParent.querySelector('.arrow-right');
  const arrowLeft = controlsParent.querySelector('.arrow-left');
  const pagination = controlsParent.querySelector('.swiper-pagination');
  const fallbackCols = selectedCols || 4;

  const options = {
    ...cardSliderOptions,
    pagination: {
      ...cardSliderOptions.pagination,
      el: pagination,
    },
    navigation: {
      prevEl: arrowLeft,
      nextEl: arrowRight,
    },

    breakpoints: {
      ...cardSliderOptions.breakpoints,
      1024: {
        slidesPerView: 3,
        spaceBetween: parseInt(gap, 10),
      },
      1199: {
        slidesPerView: fallbackCols,
        spaceBetween: parseInt(gap, 10),
      },
    },
  };

  new Swiper(el, options);
};

cardSlider.forEach((el) => initCardSlider(el));

setupResponsiveSliders({
  sliderElements: cardSlider,
  breakpoint: breakpointSm,
  initSlider: initCardSlider,
  mobileFallback: [enableProgressSync, enableArrowScrollSync],
  parentSelector: '[data-slider-parent]',
});
