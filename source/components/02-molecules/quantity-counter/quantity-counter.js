// ********
// Quantity Counter
// ********

const updateAccordionAddedItems = (accordion) => {
  const countElement = accordion.querySelector('[data-added-items]');
  const wrapperElement = accordion.querySelector('.accordion-item__added-items');

  const total = [...accordion.querySelectorAll('.quantity-counter__input')].reduce(
    (sum, input) => sum + (parseInt(input.value, 10) || 0),
    0,
  );

  if (countElement) {
    countElement.textContent = `+${total}`;
  }
  wrapperElement?.classList.toggle('hide', total === 0);
};

const addRemoveQuantityCounterButton = (element, toggle) => {
  const parentElem = element.closest('.quantity-counter');
  const inputElem = parentElem.querySelector('.quantity-counter__input');
  const minusButton = parentElem.querySelector('.quantity-counter__button--remove');
  const addButton = parentElem.querySelector('.quantity-counter__button--add');
  let currentVal = parseInt(inputElem.value, 10);
  const maxValue = parseInt(inputElem.getAttribute('max'), 10);
  const minValue = parseInt(parentElem.getAttribute('data-min-value'), 10);

  const accessoryCard = parentElem.closest('.product-accessory-card');
  const previousVal = currentVal;

  if (toggle && maxValue && currentVal >= maxValue) {
    addButton.classList.add('is-disabled');
    return;
  }

  if (toggle ? currentVal >= minValue : currentVal > minValue) {
    // eslint-disable-next-line
    inputElem.value = toggle ? ++currentVal : --currentVal;
    minusButton.classList.remove('is-disabled');
    accessoryCard?.classList.add('bg-black');
  }

  if (currentVal === minValue) {
    minusButton.classList.add('is-disabled');
    accessoryCard?.classList.remove('bg-black');
  }

  if (!toggle && maxValue && currentVal < maxValue) {
    addButton.classList.remove('is-disabled');
  }

  // Disable add when value reached max
  if (toggle && maxValue && currentVal >= maxValue) {
    addButton.classList.add('is-disabled');
  }

  const accordion = parentElem.closest('.accordion-item--secondary');
  if (accordion) updateAccordionAddedItems(accordion);

  if (currentVal !== previousVal) {
    parentElem.dispatchEvent(new CustomEvent('quantity-counter-change', { bubbles: true }));
  }
};

attachEvent('.quantity-counter__button--add', 'click', (ev) => {
  addRemoveQuantityCounterButton(ev.target, true);
});

attachEvent('.quantity-counter__button--remove', 'click', (ev) => {
  addRemoveQuantityCounterButton(ev.target, false);
});

// ********
// Counter Disabled Class
// ********

const quantityCounterEle = document.querySelectorAll('.quantity-counter');

if (quantityCounterEle.length > 0) {
  quantityCounterEle.forEach((el) => {
    const inputElem = el.querySelector('.quantity-counter__input');
    const minusButton = el.querySelector('.quantity-counter__button--remove');
    const addButton = el.querySelector('.quantity-counter__button--add');
    const currentVal = parseInt(inputElem.value, 10);
    const maxValue = parseInt(inputElem.getAttribute('max'), 10);
    const minValue = parseInt(el.getAttribute('data-min-value'), 10);
    const accessoryCard = el.closest('.product-accessory-card');

    if (currentVal > minValue) {
      minusButton.classList.remove('is-disabled');
      accessoryCard?.classList.add('bg-black');
    }

    if (currentVal > 0) {
      accessoryCard?.classList.add('bg-black');
    }

    if (maxValue && currentVal >= maxValue) {
      addButton.classList.add('is-disabled');
      accessoryCard?.classList.remove('bg-black');
    }
  });
}

document.querySelectorAll('.accordion-item--secondary').forEach((accordion) => {
  updateAccordionAddedItems(accordion);
});
