// Sandbox only: a page switcher fixed in the bottom left corner of every sandbox page. The routes are the pages in
// vite.config.js; add new ones here too.
const routes = [
  ['/', 'Hero'],
  ['/home/', 'Homepage'],
  ['/about-module/', 'About module'],
  ['/section-header/', 'Section header'],
  ['/faq-module/', 'FAQ module'],
  ['/wishlist-button/', 'Wishlist button'],
  ['/copy-cart-link/', 'Copy cart link'],
  ['/free-shipping/', 'Free shipping'],
  ['/load-more/', 'Load more'],
];

// "/home", "/home/" and "/home/index.html" are the same page
const normalize = (path) => path.replace(/index\.html$/, '').replace(/\/?$/, '/');
const current = normalize(window.location.pathname);

const label = document.createElement('label');
label.className = 'sandbox-route-switcher';

const select = document.createElement('select');
select.setAttribute('aria-label', 'Sandbox page');
routes.forEach(([path, name]) => select.add(new Option(name, path, false, normalize(path) === current)));
select.addEventListener('change', () => {
  window.location.href = select.value;
});

label.append(select);
document.body.append(label);
