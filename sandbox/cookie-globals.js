// Globals the cookie banner script expects on top of vendor-globals.js.
// Cookies comes from the gulp `vendor.js` bundle (js-cookie); the rest is an excerpt of
// source/scripts/01_default.js, where these are plain script-scope globals.
import Cookies from 'js-cookie';

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

const toggleBodyScrollLock = (toggle) => {
  document.body.classList.toggle('body-scroll-locked', toggle);
};

Object.assign(window, { Cookies, attachEvent, toggleBodyScrollLock });
