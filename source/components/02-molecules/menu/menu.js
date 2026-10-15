const menu = document.querySelector('.menu');
if (menu) {
  const closeMegaMenus = () => {
    const openMenus = document.querySelectorAll('.menu__item.has-megamenu.is-active');
    removeActiveClass(openMenus);
  };

  attachEvent('.menu__item.has-megamenu .menu__link', 'click', (ev) => {
    const item = ev.target.closest('.menu__item');
    const isActive = item.classList.contains('is-active');

    closeMegaMenus();

    if (!isActive) {
      item.classList.add('is-active');
    }
  });

  attachEvent('[data-close-megamenu]', 'click', () => {
    closeMegaMenus();
  });

  attachEvent('.megamenu__back', 'click', () => {
    document.querySelectorAll('.menu__item.has-megamenu.is-active').forEach((el) => el.classList.remove('is-active'));
  });

  attachEvent('.megamenu__main-title', 'click', () => {
    if (windowWidth() <= breakpointMd) closeMegaMenus();
  });
}
