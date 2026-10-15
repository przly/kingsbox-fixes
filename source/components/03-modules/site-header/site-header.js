// *******************************************************************************
// 1.0 - Mobile menu toggle
// *******************************************************************************

attachEvent('.mobile-hamburger', 'click', (ev) => {
  ev.preventDefault();

  // Open menu
  document.body.classList.toggle('is-open-menu');
  const hamburger = ev.target.closest('.mobile-hamburger');

  const isOpen = hamburger.classList.contains('is-open');

  hamburger.classList.toggle('is-open', !isOpen);
  hamburger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');

  closeAllMenus();
});

// *******************************************************************************
// 2.0 - Add class to body after some scroll
// *******************************************************************************
function addScrollingClass() {
  const top = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollingUp = top < (addScrollingClass.lastTop ?? top);

  document.body.classList.toggle('is-scrolled', top > 80);
  document.body.classList.toggle('is-scrolled-up', top > 80 && scrollingUp);

  addScrollingClass.lastTop = top;
}

let ticking = false;
document.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      addScrollingClass();
      ticking = false;
    });
    ticking = true;
  }
});
