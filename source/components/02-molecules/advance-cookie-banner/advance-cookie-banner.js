const advanceCookieElement = document.querySelector('.advance-cookie-banner');

if (advanceCookieElement) {
  // check cookie after static page load (WP Fastest Cache or WP Super Cache) //
  window.addEventListener('DOMContentLoaded', () => {
    if (!Cookies.get('necessary_cookie')) {
      advanceCookieElement.classList.add('cookie-not-set');
    }
  });

  const cookieInputs = document.querySelectorAll('.advance-cookie-banner__modal input');
  const essentialCookie = document.querySelectorAll('.is-necessary input');
  const { cookieActiveFor = 365 } = document.querySelector('.advance-cookie-banner').dataset;
  const activeDays = Number(cookieActiveFor) || 365;

  const activeScripts = () => {
    try {
      const cookieValue = Cookies.get('performance_cookie');
      if (cookieValue && cookieValue === 'true') {
        document.querySelectorAll('script.performance_cookie').forEach((item) => {
          item.type = 'text/javascript';
          document.head.appendChild(item);
        });
        advanceCookieElement.querySelectorAll('.advance-cookie-banner__modal-content input').forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          if (item.dataset.cookie === 'performance_cookie') {
            item.checked = item.dataset.cookie;
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setCookie = (cookieName) => {
    Cookies.set(cookieName, true, { expires: activeDays });
  };

  const closeCookieModal = () => {
    const modalEle = document.querySelector('.advance-cookie-banner__modal.is-open-modal');
    if (modalEle) {
      modalEle.classList.remove('is-open-modal');
      toggleBodyScrollLock(false);
    }
  };
  const toggleCookieInput = (elem, toggle) => {
    // eslint-disable-next-line no-param-reassign
    elem.checked = toggle;
  };

  // *******************************************************************************
  // Set cookies
  // *******************************************************************************

  const checkCookies = (checkAll) => {
    cookieInputs.forEach((item) => {
      const cookieName = item.getAttribute('data-cookie');
      if (item.checked || checkAll) {
        setCookie(cookieName);
      } else {
        toggleCookieInput(item, false);
        Cookies.remove(cookieName);
      }
    });
  };

  attachEvent('.btn--accept-cookie, .btn--confirm-choice', 'click', (ev) => {
    checkCookies(ev.target.classList.contains('btn--accept-cookie'));
    advanceCookieElement.classList.remove('cookie-not-set');
    closeCookieModal();
    setTimeout(() => {
      activeScripts();
    }, 200);
    ev.preventDefault();
  });

  // *******************************************************************************
  // Accept all cookies
  // *******************************************************************************

  attachEvent('.btn--accept-all', 'click', (ev) => {
    cookieInputs.forEach((item) => {
      const cookieName = item.getAttribute('data-cookie');
      setCookie(cookieName);
      toggleCookieInput(item, true);
    });
    ev.preventDefault();
    closeCookieModal();
    advanceCookieElement.classList.remove('cookie-not-set');
    activeScripts();
  });

  // *******************************************************************************
  // Check already set cookie on load
  // *******************************************************************************
  cookieInputs.forEach((item) => {
    const cookieName = item.getAttribute('data-cookie');
    const cookieStatus = Cookies.get(cookieName);
    toggleCookieInput(item, !!cookieStatus);
  });
  essentialCookie.forEach((input) => {
    toggleCookieInput(input, true);
  });

  // *******************************************************************************
  // Open Modal
  // *******************************************************************************

  attachEvent('.btn--cookie-setting', 'click', (ev) => {
    const parentElem = ev.target.closest('.advance-cookie-banner');
    parentElem.querySelector('.advance-cookie-banner__modal').classList.add('is-open-modal');
    toggleBodyScrollLock(true);
    ev.preventDefault();
  });

  // *******************************************************************************
  // Close Modal
  // *******************************************************************************
  attachEvent(
    '.advance-cookie-modal__close-btn, .advance-cookie-banner__modal-overlay, .advance-cookie-banner__modal-close',
    'click',
    (ev) => {
      ev.target.closest('.advance-cookie-banner__modal').classList.remove('is-open-modal');
      toggleBodyScrollLock(false);
      ev.preventDefault();
    },
  );

  // Close bar on click of 'X'
  attachEvent('.advance-cookie-banner__close', 'click', (ev) => {
    ev.target.closest('.advance-cookie-banner').classList.remove('cookie-not-set');
    ev.preventDefault();
  });

  // *******************************************************************************
  // Close Modal When Escape Key Press
  // *******************************************************************************

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCookieModal();
    }
  });
  activeScripts();
}
