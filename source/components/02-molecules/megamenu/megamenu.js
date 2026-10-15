attachEvent('.has-submenu .megamenu__nav-link', 'click', (ev) => {
  const parent = ev.target.closest('.megamenu__nav-item');
  const targetValue = ev.target.getAttribute('data-menu-target');

  const isAlreadyOpen = parent.classList.contains('is-open');

  const openSubmenu = document.querySelectorAll('[data-submenu].is-open');
  const otherItems = document.querySelectorAll('.megamenu__nav-item.is-open');

  // Close everything
  removeOpenClass(otherItems);
  removeOpenClass(openSubmenu);

  // If it was already open, stop here (toggle off)
  if (isAlreadyOpen) {
    return;
  }

  // Otherwise open the clicked item
  parent.classList.add('is-open');

  const targetedSubmenu = document.querySelector(`[data-submenu="${targetValue}"]`);

  targetedSubmenu?.classList.add('is-open');
});

attachEvent('.megamenu__submenu-main-title', 'click', (ev) => {
  const submenu = ev.target.closest('[data-submenu]');
  const targetValue = submenu.dataset.submenu;

  if (windowWidth() <= breakpointMd) {
    submenu.classList.remove('is-open');
    document
      .querySelector(`.megamenu__nav-link[data-menu-target="${targetValue}"]`)
      ?.closest('.megamenu__nav-item')
      ?.classList.remove('is-open');
  }
});

onKeydown('escape', () => {
  closeAllMenus();
});
