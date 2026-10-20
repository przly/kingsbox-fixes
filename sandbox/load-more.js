// Entry for /load-more/. In production product-list.js puts is-loading on the footer while it fetches the next page
// (setLoading in fetchProducts). Here a timer stands in for the request, so the spinner shows without a backend.
const footer = document.querySelector('[data-product-list-load-more]');
const loadingDuration = 1500;

footer?.addEventListener('click', (event) => {
  const button = event.target.closest('.load-more-products');
  if (!button || footer.classList.contains('is-loading')) return;

  footer.classList.add('is-loading');
  button.setAttribute('aria-busy', 'true');

  setTimeout(() => {
    footer.classList.remove('is-loading');
    button.removeAttribute('aria-busy');
  }, loadingDuration);
});
