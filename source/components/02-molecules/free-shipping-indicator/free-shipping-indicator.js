const shippingProgressBars = document.querySelectorAll('.free-shipping-indicator__progress-bar-inner');

if (shippingProgressBars.length > 0) {
  // Swaps "add … more" and "ships for free" (free-shipping-indicator.scss). The leaving text stays visible on top of
  // the new one until its animation ends. Back from free shipping, the swap runs the other way (is-down)
  const swapFreeShippingText = (parent, isFree) => {
    const notFreeText = parent.querySelector('.free-shipping-indicator__text:not(.free-shipping-indicator__free)');
    const freeText = parent.querySelector('.free-shipping-indicator__free');
    if (!notFreeText || !freeText) return;

    const leaving = isFree ? notFreeText : freeText;
    const entering = isFree ? freeText : notFreeText;

    [leaving, entering].forEach((text) => {
      text.classList.remove('is-leaving', 'is-entering');
      text.classList.toggle('is-down', !isFree);
    });
    parent.offsetWidth;

    // Only the text's own animation: the amount inside it has its own swap, whose animationend bubbles up
    const removeOnEnd = (text, className) => {
      const onEnd = (event) => {
        if (event.target !== text) return;
        text.classList.remove(className);
        text.removeEventListener('animationend', onEnd);
      };
      text.addEventListener('animationend', onEnd);
    };

    leaving.classList.add('is-leaving');
    entering.classList.add('is-entering');
    removeOnEnd(leaving, 'is-leaving');
    removeOnEnd(entering, 'is-entering');

    // Reaching free shipping also pops the "free" pill (free-shipping-indicator.scss). It outlasts the text's
    // swap, so it has its own class, removed when the pop ends. Going back cancels it
    parent.classList.remove('is-celebrating');
    if (!isFree) return;

    parent.offsetWidth;
    parent.classList.add('is-celebrating');

    const onPopEnd = (event) => {
      if (event.animationName !== 'free-shipping-pop' && event.animationName !== 'text-swap-fade-in') return;
      if (event.target !== freeText.querySelector('strong')) return;
      parent.classList.remove('is-celebrating');
      parent.removeEventListener('animationend', onPopEnd);
    };
    parent.addEventListener('animationend', onPopEnd);
  };

  // Free shipping starts at the dashed line (.free-shipping-indicator__inner::after), so the card is free once the
  // bar's end is past it. The line's distance from the end is read from the CSS. The bar's set width is used, not
  // its rendered one, so the state switches as the change starts, not when the width transition ends.
  // animate is off on page load and resize, so a card that starts free doesn't swap
  const updateProgressWidth = (progressBar, animate = false) => {
    const parent = progressBar.closest('.free-shipping-indicator');
    const track = progressBar.parentElement;
    const lineOffset = parseFloat(getComputedStyle(track.parentElement, '::after').right) || 0;
    const percent = parseFloat(progressBar.style.width) || 0;
    const isFree = (percent / 100) * track.clientWidth > track.clientWidth - lineOffset;

    // Full: the striped part is hidden, so the bar takes the whole track (free-shipping-indicator.scss)
    parent.classList.toggle('is-full', percent >= 100);

    if (parent.classList.contains('is-free') === isFree) return;

    parent.classList.toggle('is-free', isFree);
    if (animate) swapFreeShippingText(parent, isFree);
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      updateProgressWidth(mutation.target, true);
    });
  });

  // The line is a fixed distance from the end, so where it falls depends on the track's width
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const progressBar = entry.target.querySelector('.free-shipping-indicator__progress-bar-inner');
      if (progressBar) updateProgressWidth(progressBar);
    });
  });

  window.addEventListener('load', () => {
    shippingProgressBars.forEach((progressBar) => {
      updateProgressWidth(progressBar);

      observer.observe(progressBar, {
        attributes: true,
        attributeFilter: ['style'],
      });
      resizeObserver.observe(progressBar.parentElement);
    });
  });
}
