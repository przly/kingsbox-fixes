/* eslint-disable no-new */
// Excerpt of source/scripts/01_default.js: only the globals that affect the hero.
// The full file wires up axios, forms, menus, Fancybox etc. and is not part of this sandbox.

const breakpointMd = 1023;

function windowWidth() {
  return window.innerWidth || document.documentElement.clientWidth;
}

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
// Word splitting
// *******************************************************************************

Splitting();
