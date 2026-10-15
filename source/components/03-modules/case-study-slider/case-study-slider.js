const caseStudySlider = document.querySelectorAll('[data-slider="case-study-slider"]');

const caseStudySliderOptions = {
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
      slidesPerView: 1,
      spaceBetween: 10,
    },
  },
};

const initCaseStudySlider = (el) => {
  const parentEle = el.closest('.case-study-slider');
  const isSmall = parentEle.classList.contains('case-study-slider--small');

  const arrowRight = parentEle.querySelector('.arrow-right');
  const arrowLeft = parentEle.querySelector('.arrow-left');
  const pagination = parentEle.querySelector('.swiper-pagination');

  const options = {
    ...caseStudySliderOptions,
    slidesPerView: 'auto',
    breakpoints: {
      767: {
        slidesPerView: isSmall ? 2 : 1,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: isSmall ? 4 : 'auto',
        spaceBetween: 10,
      },
    },
    pagination: {
      ...caseStudySliderOptions.pagination,
      el: pagination,
    },
    navigation: {
      prevEl: arrowLeft,
      nextEl: arrowRight,
    },
  };

  new Swiper(el, options);
};

caseStudySlider.forEach((el) => initCaseStudySlider(el));

setupResponsiveSliders({
  sliderElements: caseStudySlider,
  breakpoint: breakpointSm,
  initSlider: initCaseStudySlider,
  mobileFallback: [enableProgressSync, enableArrowScrollSync],
  parentSelector: '[data-slider-parent]',
});
