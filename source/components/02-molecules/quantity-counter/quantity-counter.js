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

// Swaps the shown number like the copy button's label (quantity-counter.scss). An input can't animate its text, so
// the numbers are spans laid over it, and the input keeps the value for the cart scripts. Set up on the first change,
// so counters the cart re-renders get it too
const swapQuantityCounterValue = (parentElem, previousVal, currentVal) => {
  const inputElem = parentElem.querySelector('.quantity-counter__input');
  let values = parentElem.querySelector('.quantity-counter__values');

  if (!values) {
    const wrap = document.createElement('span');
    wrap.className = 'quantity-counter__value-wrap';
    inputElem.before(wrap);
    wrap.append(inputElem);
    wrap.insertAdjacentHTML(
      'beforeend',
      `<span class="quantity-counter__values" aria-hidden="true"><span class="quantity-counter__value">${previousVal}</span></span>`,
    );
    values = wrap.lastElementChild;
    parentElem.classList.add('has-value-swap');
  }

  // Numbers still leaving from a quick earlier click go at once, so they don't pile up
  values.querySelectorAll('.is-leaving').forEach((value) => value.remove());

  // Up when the number grows, down when it shrinks (is-down)
  const isDown = currentVal < previousVal;

  const oldValue = values.querySelector('.quantity-counter__value');
  oldValue.classList.remove('is-entering');
  oldValue.classList.toggle('is-down', isDown);
  oldValue.classList.add('is-leaving');
  oldValue.addEventListener('animationend', () => oldValue.remove(), { once: true });

  const newValue = document.createElement('span');
  newValue.classList.add('quantity-counter__value', 'is-entering');
  newValue.classList.toggle('is-down', isDown);
  newValue.textContent = currentVal;
  values.prepend(newValue);
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
    swapQuantityCounterValue(parentElem, previousVal, currentVal);
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
