const handler = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio > 0 && !entry.target.classList.contains('is-done')) {
      entry.target.classList.add('is-done');
      const counterValue = entry.target.getAttribute('data-counter');
      const separator = entry.target.getAttribute('data-separator');
      const decimal = entry.target.getAttribute('data-decimal');
      const decimalPlaces = counterValue.split('.')?.[1]?.length ?? 0;
      const isStatic = entry.target.getAttribute('data-static-counter');

      const c = new countUp.CountUp(entry.target, counterValue, {
        separator,
        decimal,
        decimalPlaces,
        duration: isStatic ? 0 : 2,
      });

      c.start();
    }
  });
};

const counterModule = document.querySelectorAll('[data-counter]');

if (counterModule.length > 0) {
  const observerDataModule = new IntersectionObserver(handler);

  counterModule.forEach((element) => {
    observerDataModule.observe(element);
  });
}
