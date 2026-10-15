attachEvent('.product-card__thumbnail:not(.is-out-of-stock)', 'click', (e) => {
  const card = e.target.closest('.product-card');
  const i = [...card.querySelectorAll('.product-card__thumbnail')].indexOf(e.target);

  card
    .querySelectorAll('.product-card__slide, .product-card__thumbnail')
    .forEach((el) => el.classList.remove('is-active'));

  card.querySelectorAll('.product-card__slide')[i].classList.add('is-active');
  e.target.classList.add('is-active');
});

// Restarts a CSS animation class on an element, also when it is still running from the last change
const replayClass = (element, className) => {
  element.classList.remove(className);
  // eslint-disable-next-line no-unused-expressions
  element.offsetWidth;
  element.classList.add(className);
};

// Navbar wishlist number (site-header.twig). Production gets the count from the server; here it is
// counted up and down from the number already in the header. Animated in site-header.scss.
const updateWishlistNumber = (change) => {
  const numberEl = document.querySelector('[data-wishlist-number]');

  if (!numberEl) return;

  // The count is kept in data-count, because at 0 the old number stays visible during the exit animation.
  // The first time it comes from the number the header was rendered with.
  const previous = parseInt(numberEl.dataset.count ?? numberEl.textContent, 10) || 0;
  const number = Math.max(previous + change, 0);
  const link = numberEl.closest('.header-main__link');

  numberEl.dataset.count = number;

  numberEl.classList.remove('is-entering', 'is-changing', 'is-leaving', 'is-down');

  if (number === 0) {
    // Hidden once its exit animation has played (or straight away with reduced motion)
    replayClass(numberEl, 'is-leaving');
    const hide = () => {
      if (numberEl.classList.contains('is-leaving')) numberEl.style.display = 'none';
    };
    numberEl.addEventListener('animationend', hide, { once: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) hide();
  } else {
    // In its own span, so a new count can slide inside the badge while the badge stays still
    numberEl.innerHTML = `<span class="header-main__link-number-value">${number}</span>`;
    numberEl.style.display = 'flex';
    if (number < previous) numberEl.classList.add('is-down');
    replayClass(numberEl, previous === 0 ? 'is-entering' : 'is-changing');
  }

  // The navbar heart pops when a product is added
  if (link && change > 0) replayClass(link, 'is-wishlist-added');
};

attachEvent('[data-wishlist-button]', 'click', (ev) => {
  const button = ev.target.closest('[data-wishlist-button]');

  // Turns on the click animation (product-card.scss), so it never plays on page load
  button.dataset.wishlistToggled = '';
  button.classList.toggle('is-active');
  updateWishlistNumber(button.classList.contains('is-active') ? 1 : -1);
});
