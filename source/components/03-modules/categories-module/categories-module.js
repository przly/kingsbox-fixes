const categoriesSlider = document.querySelectorAll('[data-slider="categories-slider"]');

if (categoriesSlider.length > 0) {
  const categoriesSliderOptions = {
    slidesPerView: 1,
    speed: 800,
    spaceBetween: 0,
    effect: windowWidth() > breakpointMd ? 'creative' : 'slide',
    breakpoints: {
      767: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      1023: {
        spaceBetween: 0,
        allowTouchMove: false,
        simulateTouch: false,
        direction: 'vertical', // vertical sliding
        creativeEffect: {
          prev: {
            shadow: false,
            translate: [0, '20%', -1], // Y-axis translation
          },
          next: {
            translate: [0, '-100%', 0], // Y-axis translation
          },
        },
      },
    },
  };

  const initCategoriesSlider = () => {
    categoriesSlider.forEach((el) => {
      const categoriesModule = el.closest('.categories-module');
      const categoriesImages = categoriesModule.querySelectorAll('.categories-module__image');
      const categoriesLinks = categoriesModule.querySelectorAll('.categories-module__title');
      const slider = new Swiper(el, categoriesSliderOptions);

      if (windowWidth() > breakpointMd) {
        categoriesLinks.forEach((link) => {
          link.addEventListener('mouseenter', () => {
            const index = link.getAttribute('data-item');
            const image = el.querySelector(`[data-image="${index}"]`);

            removeActiveClass([...categoriesLinks, ...categoriesImages]);

            link.classList.add('is-active');
            image.classList.add('is-active');

            slider.slideTo(index, 800);
          });
        });

        const observer = new IntersectionObserver(
          ([entry]) => {
            el.classList.toggle('is-active', entry.isIntersecting);
          },
          {
            threshold: 0.1,
          },
        );

        observer.observe(el);
      }
    });
  };

  setupResponsiveSliders({
    sliderElements: categoriesSlider,
    breakpoint: breakpointSm,
    initSlider: initCategoriesSlider,
    mobileFallback: () => {},
    parentSelector: '[data-slider-parent]',
  });
}
