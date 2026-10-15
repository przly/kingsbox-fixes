/* eslint no-param-reassign: "error" */
/* eslint-disable no-new */

// *******************************************************************************
// GLOBALS
// *******************************************************************************
axios.defaults.headers['Content-Type'] = 'multipart/form-data';

// *******************************************************************************
// 0.1 - BREAKPOINT VARS
// *******************************************************************************
const breakpointSm = 767;
const breakpointMd = 1023;
const breakpointLg = 1171;

// *******************************************************************************
// 0.2 - VARIOUS FUNCTIONS
// *******************************************************************************

// Return Window Width
function windowWidth() {
  return window.innerWidth || document.documentElement.clientWidth;
}

const isFractal = () =>
  !!document.querySelector('.Frame') ||
  window.location.href.includes('localhost:3010') ||
  window.location.href.includes('/preview/components/');

const isLocal = () => window.location.href.includes('localhost');

// *******************************************************************************
// 0.3 - FUNCTIONS
// *******************************************************************************

// Attach Events
function attachEvent(selector, event, handler) {
  document.addEventListener(
    event,
    (ev) => {
      let { target } = ev;
      for (; target && target !== document; target = target.parentNode) {
        if (target.matches(selector)) {
          try {
            handler.call(target, ev);
          } catch (e) {
            console.error(e);
          }
          break;
        }
      }
    },
    false,
  );
}

const euro = Intl.NumberFormat('sl-SI', {
  style: 'currency',
  currency: 'EUR',
  useGrouping: false,
});

// Animate
function animate(elementToAnimate, type) {
  switch (type) {
    case 'show':
      elementToAnimate.classList.add('is-visible');
      elementToAnimate.classList.remove('is-hidden');
      break;
    case 'hide':
      elementToAnimate.classList.add('is-hidden');
      elementToAnimate.classList.remove('is-visible');
      break;
    default:
      break;
  }
}

// Validate email input
const validateEmailInput = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// *******************************************************************************
// 0.4 - DEBOUNCE FUNCTION
// *******************************************************************************

function debounce(func, wait, immediate) {
  let timeout;
  return function (...args) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// *******************************************************************************
// 0.5 - SLIDE FUNCTIONS
// *******************************************************************************

const slideUp = (target, duration) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.boxSizing = 'border-box';
  target.style.height = `${target.offsetHeight}px`;
  // eslint-disable-next-line no-unused-expressions
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout(() => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

const slideDown = (target, duration, displayType) => {
  target.style.removeProperty('display');

  let { display } = window.getComputedStyle(target);

  if (display === 'none') {
    display = displayType;
  }
  target.style.display = display;

  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  // eslint-disable-next-line no-unused-expressions
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = `${duration}ms`;
  target.style.height = `${height}px`;
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};

const slideToggle = (target, duration, displayType) => {
  /* Slide-toggle logic */

  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration, displayType);
  }
  return slideUp(target, duration, displayType);
};

// *******************************************************************************
// 0.6 - Calculate Viewport units
// *******************************************************************************

// function calcVh() {
//   const vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
// }

// const debounceCalcVh = debounce(() => {
//   calcVh();
// }, 50);

// // Only mobile has VH calculation
// window.addEventListener('DOMContentLoaded', () => {
//   calcVh();
// });

// // Only Calc VH for desktop, not mobile
// window.addEventListener('resize', () => {
//   if (
//     !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
//     windowWidth() > breakpointSm
//   ) {
//     debounceCalcVh();
//   }
// });

// *******************************************************************************
// 0.7 - Smooth Scroll
// *******************************************************************************

const smoothScroll = new scrollToSmooth('a', {
  targetAttribute: 'data-scrollto',
  duration: 1000,
  durationRelative: false,
  durationMin: false,
  durationMax: false,
  easing: easeInOutCubic,
  onScrollStart: (data) => {
    // do something
    document.documentElement.style.scrollBehavior = 'initial';
  },
  onScrollUpdate: (data) => {
    // do something
  },
  onScrollEnd: (data) => {
    // do something
    document.documentElement.style.scrollBehavior = 'smooth';
  },
  offset: '#custom-scroll-offset',
});
smoothScroll.init();

// function scrollToSmoothly(pos, time = 500) {
//   const currentPos = window.pageYOffset;
//   let start = null;

//   const step = (currentTime) => {
//     start = !start ? currentTime : start;
//     const progress = currentTime - start;
//     const positionUpY = currentPos - ((currentPos - pos) * progress) / time;
//     const positionDownY = ((pos - currentPos) * progress) / time + currentPos;

//     window.scrollTo(0, currentPos < pos ? positionDownY : positionUpY);

//     if (progress < time) {
//       window.requestAnimationFrame(step);
//     } else {
//       window.scrollTo(0, pos);
//     }
//   };

//   window.requestAnimationFrame(step);
// }

// *******************************************************************************
// 0.8 - Lazy loading (https://github.com/verlok/vanilla-lazyload)
// *******************************************************************************
// const lazyLoadInstance = new LazyLoad({
//   elements_selector: '.lazyload',
// });

// This can be called whenever you need to update the lazyload instance
// lazyLoadInstance.update();

// *******************************************************************************
// 0.9 - Match Height / Equal height : https://dev.to/dhruvangg/equal-height-in-vanilla-javascript-49ch
// *******************************************************************************

function setHeight(el, val) {
  if (typeof val === 'function') val = val();

  if (typeof val === 'string') el.style.height = val;
  else el.style.height = `${val}px`;
}

const equalheight = function (container) {
  let currentTallest = 0;
  let currentRowStart = 0;
  const rowDivs = new Array();
  let $el;
  const topPosition = 0;

  Array.from(document.querySelectorAll(container)).forEach((el, i) => {
    el.style.height = 'auto';
    const topPostion = el.offsetTop;
    if (currentRowStart !== topPostion) {
      let currentDiv = 0;

      for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
        setHeight(rowDivs[currentDiv], currentTallest);
      }
      rowDivs.length = 0;
      currentRowStart = topPostion;
      currentTallest = parseFloat(getComputedStyle(el, null).height.replace('px', ''));
      rowDivs.push(el);
    } else {
      rowDivs.push(el);
      currentTallest =
        currentTallest < parseFloat(getComputedStyle(el, null).height.replace('px', ''))
          ? parseFloat(getComputedStyle(el, null).height.replace('px', ''))
          : currentTallest;
    }

    let currentDiv = 0;
    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
      setHeight(rowDivs[currentDiv], currentTallest);
    }
  });
};

window.addEventListener('load', () => {
  equalheight('.equal-height');
});
window.addEventListener('resize', () => {
  setTimeout(() => {
    equalheight('.equal-height');
  });
});

// *******************************************************************************
// 0.10 - ENVIRONMENT BADGE
// *******************************************************************************
const envBadge = document.querySelector('.sdt-env__badge');
if (envBadge) {
  envBadge.style.top = '150px';
  envBadge.addEventListener('mouseover', (ev) => {
    const { style } = ev.target;
    if (style.top) {
      style.removeProperty('top');
      style.bottom = '250px';
    } else {
      style.removeProperty('bottom');
      style.top = '150px';
    }
  });
}

// *******************************************************************************
// 0.11 - Get nonce for static pages
// *******************************************************************************
const getNonceForAction = async (formAction) => {
  if (isFractal()) {
    return Promise.resolve('');
  }

  try {
    const formDataNonce = {
      action: 'getNonceField',
      nonce_action: formAction,
    };

    const response = await axios.post(localData.apiURL, formDataNonce, {});
    return response.data.data.nonce;
  } catch (error) {
    console.error(error);
  }
};

// *******************************************************************************
// Form helper
// *******************************************************************************
const getEmailError = (formElement) => {
  let emailMessage = '';
  if (formElement.querySelector('[type="email"]')) {
    emailMessage = formElement.querySelector('[type="email"]').getAttribute('data-fv-email-address___message');
  }
  return emailMessage;
};

const joinActiveItems = (checkedItems) =>
  Array.from(checkedItems)
    .map((checkedItem) => checkedItem.getAttribute('value'))
    .join(' | ');

const getFormValue = (form, fv) => {
  const formData = {};
  const requiredFormData = {};

  Object.keys(fv.getFields()).forEach((key) => {
    const element = form.querySelector(`[data-fv-name="${key.replace(/\[\]/g, '')}"]`);

    if (!element) {
      return;
    }

    const parentElem = element.closest('[data-input-group-parent]');

    if ((element.type === 'radio' || element.type === 'checkbox') && parentElem) {
      const selectedInputs = parentElem.querySelectorAll('input:checked');
      const itemValues = joinActiveItems(selectedInputs);
      formData[key] = itemValues || '';

      if (element.hasAttribute('required')) {
        requiredFormData[key] = itemValues || '';
      }
    } else {
      const elementValue = fv.getElementValue(key, element);
      formData[key] = elementValue;

      if (element.hasAttribute('required')) {
        requiredFormData[key] = elementValue;
      }
    }
  });

  return { inputs: JSON.stringify(formData), requiredInputs: JSON.stringify(requiredFormData) };
};

/**
 * @typedef {Object} AxiosOptions - Options object for Axios request.
 * @property {Object} headers - Request headers.
 * @property {string} headers.Content-Type - Content type for the request.
 * @property {string} [method] - HTTP method (e.g., GET, POST, PUT, etc.).
 * @property {string} [url] - Request URL.
 * @property {Object} [params] - URL parameters.
 * @property {Object} [data] - Request payload data.
 * @property {Object} [auth] - Authentication credentials (e.g., { username: 'user', password: 'pass' }).
 * @property {number} [timeout] - Request timeout in milliseconds.
 * @property {boolean} [withCredentials] - Indicates whether cross-site Access-Control requests
 *                                         should be made using credentials.
 */

/**
 * @typedef {Object} Options - Options object for the onFormSubmit function.
 * @property {AxiosOptions} [axiosOptions] - Options for the Axios request.
 * @property {Object} formData - The form data to submit.
 * @property {string} [recaptchaKey] - Recaptcha key.
 * @property {string} [recaptchaAction] - Recaptcha action.
 * @property {number} [timeout] - Timeout for the request in milliseconds.
 * @property {string} [url] - Url of the request.
 * @property {boolean} [forceError] - You should use this to force an form error, to test UI on error.
 */

/**
 * Simulates a form submission using Axios.
 * @param {Options} [options] - Additional options for the request.
 * @returns {Promise} - A promise that resolves to the Axios response.
 */

const onFormSubmit = async (options = { formData: {} }) => {
  // Default values
  if (!options.formData.lang) {
    options.formData.lang = localData.lang;
  }

  // FE / Preview submission of the form without API
  if (isFractal()) {
    console.warn('Fractal - Simulating request');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (options.forceError) {
          reject(new Error('Simulated error'));
          return;
        }

        console.warn('Simulated success, FormData:', options.formData);
        resolve();
      }, options.timeout || 250);
    });
  }

  if (options.recaptchaKey && options.recaptchaAction) {
    const token = await grecaptcha.execute(options.recaptchaKey, { action: options.recaptchaAction });
    const nonce = await getNonceForAction(options.recaptchaAction);

    options.formData = { ...options.formData, action: options.recaptchaAction, nonce, token };
  }

  // Make a request to the API
  return axios.post(options.url || localData.siteURL, options.formData, {
    ...options.axiosOptions,
  });
};

// *******************************************************************************
// Add scrollbar width
// *******************************************************************************
const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);
  const inner = document.createElement('div');
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  document.documentElement.style.setProperty('--scroll-width', `${scrollbarWidth}px`);
};

getScrollbarWidth();

window.addEventListener('resize', () => {
  getScrollbarWidth();
});

// *******************************************************************************
// Toggle class functions
// *******************************************************************************
const toggleBodyScrollLock = (toggle) => {
  document.body.classList.toggle('body-scroll-locked', toggle);
};

const removeActiveClass = (elements) => {
  elements.forEach((el) => el.classList.remove('is-active'));
};

const removeOpenClass = (elements) => {
  elements.forEach((el) => el.classList.remove('is-open'));
};

// Toggle product cols
const toggleHideClass = (element, toggle) => {
  element.classList.toggle('hide', toggle);
};

// *******************************************************************************
// Redirect page and smooth scroll
// *******************************************************************************

// Wait for the page to fully load
window.addEventListener('load', () => {
  // Get the hash value from the URL
  const { hash } = window.location;

  // Check if the hash value is not empty
  if (hash) {
    // Find the target element with the matching ID
    const targetElement = document.querySelector(hash);

    // Check if the target element exists
    if (targetElement) {
      // Calculate the scroll position to the target element
      const scrollPosition = targetElement.getBoundingClientRect().top + window.scrollY;

      // Scroll to the target element smoothly
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }, 300);
    }
  }
});

// *******************************************************************************
// "Edit mode" on front - scroll into view
// *******************************************************************************
document.addEventListener('DOMContentLoaded', () => {
  const editButton = document.getElementById('wp-admin-bar-add-edit-mode-on');
  if (editButton) {
    const checkbox = editButton.querySelector('input');
    editButton.addEventListener('click', (e) => {
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
      if (!checkbox.checked) {
        e.target.blur();
      }
      editButton.classList.toggle('is-active', checkbox.checked);
      document.querySelectorAll('main section').forEach((section, index) => {
        section.classList.toggle('editable-section', checkbox.checked);
        section.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            if (checkbox.checked) {
              e.stopPropagation();
              window.location.replace(`/wp-admin/post.php?post=${localData.id}&action=edit&module-section=${index}`);
            }
          },
          { once: true },
        );
      });
    });
  }
  const params = new URLSearchParams(window.location.search);
  const isPreview = params.has('public_preview') || params.has('preview');
  if (isPreview) {
    document.querySelectorAll('main section').forEach((section, index) => {
      section.classList.add('editable-section');
      section.addEventListener('click', (e) => {
        e.preventDefault();
        window.parent.postMessage(
          {
            type: 'module-section',
            index,
          },
          window.location.origin,
        );
      });
    });
  }
  const targetIndex = parseInt(params.get('module-section'), 10);
  if (!isNaN(targetIndex)) {
    const sections = document.querySelectorAll('main section');
    const index = targetIndex;
    if (sections[index]) {
      setTimeout(() => {
        sections[index].scrollIntoView({
          behavior: 'smooth',
        });
        params.delete('module-section');
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      }, 500);
    }
  }
});

// *******************************************************************************
// Stretch items until left or right of screen
// *******************************************************************************
const stretchElements = () => {
  const scrollbarSize = window.innerWidth - document.documentElement.clientWidth;

  // Stretch to the right edge of the screen
  document.querySelectorAll('[data-stretch-right]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const distance = window.innerWidth - rect.left - scrollbarSize;
    el.style.setProperty('--right-distance', `${distance}px`);
  });

  // Stretch to the left edge of the screen
  document.querySelectorAll('[data-stretch-left]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const distance = rect.right;
    el.style.setProperty('--left-distance', `${distance}px`);
  });
};

stretchElements();
window.addEventListener('resize', debounce(stretchElements, 150));

// *******************************************************************************
// Parallax Image
// *******************************************************************************

// const mm = gsap.matchMedia();
// mm.add('(min-width: 1024px)', () => {
//   CustomEase.create('easeInOut', '0.42,0,0.58,1');
//   document.querySelectorAll('[data-parallax-image]').forEach((element) => {
//     const imageEle = element.querySelector('img');
//     if (!imageEle) return;
//     gsap.to(imageEle, {
//       yPercent: 10,
//       ease: 'easeInOut',
//       scrollTrigger: {
//         trigger: element,
//         start: 'top bottom',
//         end: 'bottom top',
//         scrub: 1,
//       },
//     });
//   });
// });

// *******************************************************************************
// Custom Swiper Scroll For Mobile
// *******************************************************************************

const enableScrollbarSync = (parent, scrollbarEle) => {
  if (!parent || parent._scrollbarSyncDestroy) return parent._scrollbarSyncDestroy;

  const swiperWrapper = parent.querySelector('.swiper');
  const swiperInner = parent.querySelector('.swiper-wrapper');
  const scrollbar = scrollbarEle || parent.querySelector('.swiper-scrollbar');

  // eslint-disable-next-line consistent-return
  if (!swiperWrapper || !swiperInner || !scrollbar) return;

  scrollbar.innerHTML = '<div class="swiper-scrollbar-thumb"></div>';
  const scrollbarThumb = scrollbar.querySelector('.swiper-scrollbar-thumb');

  let startX;
  let startThumbLeft;

  const onTouchMove = (event) => {
    const deltaX = event.touches[0].clientX - startX;
    const maxThumbMove = scrollbar.clientWidth - scrollbarThumb.clientWidth;
    const newLeft = Math.min(Math.max(startThumbLeft + deltaX, 0), maxThumbMove);

    const scrollPercentage = newLeft / maxThumbMove;
    swiperWrapper.scrollLeft = scrollPercentage * (swiperWrapper.scrollWidth - swiperWrapper.clientWidth);
  };

  const onTouchEnd = () => {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  };

  const onTouchStart = (event) => {
    startX = event.touches[0].clientX;
    startThumbLeft = scrollbarThumb.offsetLeft;

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  };

  const syncThumbToScroll = () => {
    const maxThumbMove = scrollbar.clientWidth - scrollbarThumb.clientWidth;
    const maxScroll = swiperWrapper.scrollWidth - swiperWrapper.clientWidth;
    const percentage = swiperWrapper.scrollLeft / maxScroll;
    scrollbarThumb.style.left = `${percentage * maxThumbMove}px`;
  };

  scrollbarThumb.addEventListener('touchstart', onTouchStart);
  swiperWrapper.addEventListener('scroll', syncThumbToScroll);

  // Hide scrollbar if no overflow
  const slideCount = swiperInner.children.length;
  scrollbar.classList.toggle('hide', slideCount <= 1);

  // Cleanup function (call when switching back to desktop)
  // eslint-disable-next-line consistent-return
  parent._scrollbarSyncDestroy = () => {
    scrollbarThumb.removeEventListener('touchstart', onTouchStart);
    swiperWrapper.removeEventListener('scroll', syncThumbToScroll);
    delete parent._scrollbarSyncDestroy;
  };

  return parent._scrollbarSyncDestroy;
};

const enableArrowScrollSync = (parent, options = {}) => {
  if (parent._arrowScrollDestroy) {
    return parent._arrowScrollDestroy;
  }

  const swiperWrapper = parent.querySelector('.swiper');

  const prevBtn = options.prevBtn || parent.querySelector('.swiper-button-prev');
  const nextBtn = options.nextBtn || parent.querySelector('.swiper-button-next');

  if (!swiperWrapper || !prevBtn || !nextBtn) return;

  const scrollToSlide = (direction) => {
    const slides = [...swiperWrapper.querySelectorAll('.swiper-slide')];
    if (!slides.length) return;

    const currentScroll = swiperWrapper.scrollLeft;

    let targetSlide = null;

    if (direction === 1) {
      targetSlide = slides.find((slide) => slide.offsetLeft > currentScroll + 5);
    } else {
      targetSlide = slides
        .slice()
        .reverse()
        .find((slide) => slide.offsetLeft < currentScroll - 5);
    }

    if (targetSlide) {
      swiperWrapper.scrollTo({
        left: targetSlide.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  const onPrevClick = (e) => {
    e.preventDefault();
    scrollToSlide(-1);
  };

  const onNextClick = (e) => {
    e.preventDefault();
    scrollToSlide(1);
  };

  prevBtn.addEventListener('click', onPrevClick);
  nextBtn.addEventListener('click', onNextClick);

  const updateArrowState = () => {
    const maxScroll = swiperWrapper.scrollWidth - swiperWrapper.clientWidth;
    prevBtn.classList.toggle('swiper-button-disabled', swiperWrapper.scrollLeft <= 0);
    prevBtn.toggleAttribute('disabled', swiperWrapper.scrollLeft <= 0);
    nextBtn.classList.toggle('swiper-button-disabled', swiperWrapper.scrollLeft >= maxScroll - 2);
    nextBtn.toggleAttribute('disabled', swiperWrapper.scrollLeft >= maxScroll - 2);
  };

  swiperWrapper.addEventListener('scroll', updateArrowState);
  updateArrowState();

  parent._arrowScrollDestroy = () => {
    prevBtn.removeEventListener('click', onPrevClick);
    nextBtn.removeEventListener('click', onNextClick);
    swiperWrapper.removeEventListener('scroll', updateArrowState);
    delete parent._arrowScrollDestroy;
  };

  return parent._arrowScrollDestroy;
};

const enableProgressSync = (parent) => {
  if (!parent || parent._progressSyncDestroy) {
    return parent?._progressSyncDestroy;
  }

  const swiperWrapper = parent.querySelector('.swiper');
  // eslint-disable-next-line consistent-return
  if (!swiperWrapper) return;

  let rafId = null;

  const updateProgress = () => {
    const maxScroll = swiperWrapper.scrollWidth - swiperWrapper.clientWidth;
    const progress = maxScroll > 0 ? swiperWrapper.scrollLeft / maxScroll : 0;
    const visibleRatio = swiperWrapper.scrollWidth > 0 ? swiperWrapper.clientWidth / swiperWrapper.scrollWidth : 0;

    parent.style.setProperty('--slider-progress', progress);
    parent.style.setProperty('--slider-progress-percent', `${progress * 100}%`);
    parent.style.setProperty('--slider-visible-ratio', `${visibleRatio * 100}%`);
    parent.style.setProperty('--slider-fill-width', `${visibleRatio * 100}%`);
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateProgress);
  };

  swiperWrapper.addEventListener('scroll', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);

  scheduleUpdate();

  parent._progressSyncDestroy = () => {
    swiperWrapper.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', scheduleUpdate);
    window.removeEventListener('load', scheduleUpdate);
    cancelAnimationFrame(rafId);
    delete parent._progressSyncDestroy;
  };

  return parent._progressSyncDestroy;
};

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

// *******************************************************************************
// KeyDown Function
// *******************************************************************************

const onKeydown = (key, callback) => {
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === key.toLowerCase()) {
      callback(event);
    }
  });
};

// *******************************************************************************
// Tabs
// *******************************************************************************

const tabLinks = document.querySelectorAll('[data-tab-link]');

const activateTabById = (targetId) => {
  const link = document.querySelector(`[data-tab-link][data-tab-id="${targetId}"]`);

  if (!link) return;

  const tab = link.closest('[data-tab]');
  const linksParent = link.closest('[data-tab-links]');
  const targetTabContent = tab?.querySelector(`[data-tab-content][id="${targetId}"]`);
  if (!tab || !linksParent || !targetTabContent) return;

  // Remove all active classes
  removeActiveClass(linksParent.querySelectorAll('[data-tab-link]'));
  removeActiveClass(tab.querySelectorAll('[data-tab-content]'));

  // Add active classes
  link.classList.add('is-active');
  targetTabContent.classList.add('is-active');
};

const handleTabClick = (e) => {
  const link = e.currentTarget;

  // With and Without [data-tab-id]
  const tab = link.closest('[data-tab]') || link.closest('[data-tab-links]');
  const allTabLinks = Array.from(tab.querySelectorAll('[data-tab-link]'));
  const allTabContents = Array.from(tab.querySelectorAll('[data-tab-content]'));
  const targetId = link.getAttribute('data-tab-id');

  if (!targetId) {
    const index = allTabLinks.indexOf(link);
    const targetContent = allTabContents[index];
    removeActiveClass(allTabLinks);
    link.classList.add('is-active');

    if (!targetContent) return;

    removeActiveClass(allTabContents);
    targetContent.classList.add('is-active');
    return;
  }

  e.preventDefault();
  activateTabById(targetId);
};

tabLinks.forEach((link) => {
  link.addEventListener('click', handleTabClick);
});

// *******************************************************************************
// Pattern Animation
// *******************************************************************************

const resetPatternAnimation = (pattern) => {
  if (!pattern) return;

  const items = pattern.querySelectorAll(
    '.pattern-animation__group-center, .pattern-animation__group-left, .pattern-animation__group-right',
  );

  gsap.set(items, {
    transform: 'translate(200px, 200px)',
    opacity: 0,
    duration: 0.6,
  });
};

const playPatternAnimation = (pattern, useScrollTrigger = true) => {
  const triggerEle = pattern.closest('[data-animated-pattern]');

  if (!triggerEle) return;

  const centerGroup = pattern.querySelectorAll('.pattern-animation__group-center');
  const leftGroups = pattern.querySelectorAll('.pattern-animation__group-left');
  const rightGroups = pattern.querySelectorAll('.pattern-animation__group-right');

  const tl = gsap.timeline(
    useScrollTrigger
      ? {
          scrollTrigger: {
            trigger: triggerEle,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      : {},
  );

  tl.to(
    centerGroup,
    {
      transform: 'translate(0px, 0px)',
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    },
    0,
  );

  tl.to(
    leftGroups,
    {
      transform: 'translate(0px, 0px)',
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    },
    0,
  );

  tl.to(
    rightGroups,
    {
      transform: 'translate(0px, 0px)',
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    },
    0,
  );
};

// *******************************************************************************
// Common Modal Toggle
// *******************************************************************************

const toggleModal = (element, toggle) => {
  const parentElement = element.closest('[data-modal-parent]');
  const parentId = element.closest('[data-id]')?.getAttribute('data-id');
  const modal = parentElement?.querySelector(`[data-modal]${parentId ? `[data-id="${parentId}"]` : ''}`);
  modal?.classList.toggle('is-open-modal', toggle);
  document.body.classList.toggle('modal-open', toggle);

  toggleBodyScrollLock(toggle);
};

attachEvent('[data-modal-trigger]', 'click', (ev) => {
  ev.preventDefault();
  toggleModal(ev.target, true);
});

// Close modal on Escape key
onKeydown('escape', () => {
  document.querySelectorAll('[data-modal].is-open-modal').forEach((ev) => {
    toggleModal(ev, false);
  });
});

attachEvent('[data-close-modal]', 'click', (ev) => {
  toggleModal(ev.target, false);
});

// *******************************************************************************
// Email validator
// *******************************************************************************

const getEmailRegex = () => '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$';

const validateEmail = (value) => {
  if (value === '') {
    return true;
  }

  const emailRegex = getEmailRegex();

  return (
    FormValidation.validators.emailAddress().validate({
      value,
    }).valid &&
    FormValidation.validators.regexp().validate({
      value,
      options: {
        regexp: emailRegex,
      },
    }).valid
  );
};

// *******************************************************************************
// Copied To Clipboard
// *******************************************************************************

document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy-button]');
  if (!button || button.disabled) return;

  const copyValue = button.dataset.copyText || window.location.href;
  if (!copyValue) return;

  try {
    await navigator.clipboard.writeText(copyValue);

    button.classList.add('is-disabled');
    button.disabled = true;

    setTimeout(() => {
      button.classList.remove('is-disabled');
      button.disabled = false;
    }, 1000);
  } catch (error) {
    console.error('Copy failed:', error);
  }
});

// *******************************************************************************
// Set header height css variable
// *******************************************************************************
const header = document.querySelector('.header-main');

if (header) {
  const updateHeaderHeight = () => document.body.style.setProperty('--header-height', `${header.offsetHeight}px`);

  updateHeaderHeight();
  new ResizeObserver(updateHeaderHeight).observe(header);
}

// *******************************************************************************
// Close All Menu
// *******************************************************************************

const closeAllMenus = () => {
  const openMenus = document.querySelectorAll('.menu__item.has-megamenu.is-active');
  const openSubmenu = document.querySelectorAll('[data-submenu].is-open');
  const otherItems = document.querySelectorAll('.megamenu__nav-item.is-open');

  // Close everything
  removeOpenClass(otherItems);
  removeOpenClass(openSubmenu);
  removeActiveClass(openMenus);
};

// *******************************************************************************
// Lenis
// *******************************************************************************

const initSmoothScrolling = () => {
  new Lenis({
    lerp: 0.2,
    smoothWheel: true,
    autoRaf: true,
  });
};

if (windowWidth() > breakpointMd) {
  initSmoothScrolling();
}

// *******************************************************************************
// Fancybox/fancyapp
// *******************************************************************************

Fancybox.bind('[data-fancybox]');

// *******************************************************************************
// Word splitting
// *******************************************************************************

Splitting();
