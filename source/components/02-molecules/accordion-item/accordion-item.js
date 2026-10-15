// **************************************************
// Accordion
// **************************************************

const ACCORDION_DURATION = 250;

const closeAccordions = () => {
  document.querySelectorAll('.accordion-item.is-open').forEach((item) => {
    const content = item.querySelector('.accordion-item__content');

    item.classList.remove('is-open');
    slideUp(content, ACCORDION_DURATION);
  });
};

const toggleAccordion = (item, content) => {
  item.classList.toggle('is-open');
  slideToggle(content, ACCORDION_DURATION, 'block');
};

const openAccordion = (item, content) => {
  item.classList.add('is-open');
  slideDown(content, ACCORDION_DURATION, 'block');
};

attachEvent('.accordion-item__title', 'click', (ev) => {
  const title = ev.target.closest('.accordion-item__title');
  const accordion = title.closest('.accordion-list'); // Updated selector
  const item = title.closest('.accordion-item');
  const content = item.querySelector('.accordion-item__content');

  const isMultiple = accordion?.dataset.accordion === 'multiple';
  const isOpen = item.classList.contains('is-open');

  if (isMultiple) {
    toggleAccordion(item, content);
    return;
  }

  if (isOpen) {
    closeAccordions();
    return;
  }

  closeAccordions();
  openAccordion(item, content);
});
