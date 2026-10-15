const shippingProgressBars = document.querySelectorAll('.free-shipping-indicator__progress-bar-inner');

if (shippingProgressBars.length > 0) {
  const updateProgressWidth = (progressBar) => {
    const parent = progressBar.closest('.free-shipping-indicator');
    parent.classList.toggle('is-free', parseFloat(progressBar.style.width) > 100);
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      updateProgressWidth(mutation.target);
    });
  });

  window.addEventListener('load', () => {
    shippingProgressBars.forEach((progressBar) => {
      updateProgressWidth(progressBar);

      observer.observe(progressBar, {
        attributes: true,
        attributeFilter: ['style'],
      });
    });
  });
}
