const quotePopup = document.querySelector('.quote-popup');

window.updateProjectsNumber = (number) => {
  const count = Number(number) || 0;
  document.querySelectorAll('[data-projects-number]').forEach((item) => {
    item.textContent = count;
    item.style.display = count > 0 ? 'flex' : 'none';
  });
};

window.updateQuotePopup = (data = '', count = 0) => {
  const quoteCount = Math.max(0, Number(count) || 0);
  const quoteNumber = quotePopup?.querySelector('.quote-popup__number');
  if (quoteNumber) {
    quoteNumber.textContent = `[${quoteCount}]`;
  }
  quotePopup?.classList.toggle('quote-popup--empty', !quoteCount);
  if (quotePopup && typeof data === 'string') {
    const quoteContent = quotePopup.querySelector('.quote-popup__content');
    if (quoteContent) {
      quoteContent.innerHTML = data;
    }
  }
  window.updateProjectsNumber(quoteCount);
};

const axiosChangeQuantityInQuote = async (action, inputs) => {
  const formData = new FormData();
  formData.append('action', action);
  formData.append('inputs', JSON.stringify(inputs));

  try {
    const response = await axios.post(localData.apiURL, formData);
    if (response.data?.success) {
      const { data } = response.data;
      window.updateQuotePopup(data?.quote_popup, data?.count);
    }
  } catch (error) {
    console.error(error);
  }
};

if (quotePopup) {
  // **********************************************************
  // Open Cart Popup
  // **********************************************************

  attachEvent('.quote-popup-trigger', 'click', (ev) => {
    const isOpen = quotePopup.classList.contains('is-quote-open');
    quotePopup.classList.toggle('is-quote-open', !isOpen);
    toggleBodyScrollLock(!isOpen);
    ev.preventDefault();
  });

  // **********************************************************
  // Close Popup When Escape Key Press
  // **********************************************************

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      quotePopup.classList.remove('is-quote-open');
      toggleBodyScrollLock(false);
    }
  });

  // **********************************************************
  // Close Popup When Click On Outside
  // **********************************************************

  attachEvent('.quote-popup__overlay, .quote-popup__close', 'click', (ev) => {
    const parentEle = ev.target.closest('.quote-popup');
    parentEle.classList.remove('is-quote-open');
    ev.preventDefault();
    toggleBodyScrollLock(false);
  });

  attachEvent(
    '.quote-popup .cart-view__item .quantity-counter__button--remove:not(.is-disabled), .quote-popup .cart-view__item .quantity-counter__button--add',
    'click',
    (ev) => {
      setTimeout(() => {
        const item = ev.target.closest('.quote-popup .cart-view__item');
        const productId = item?.querySelector('.product-id')?.value;
        const quantity = item?.querySelector('.quantity-counter__input')?.value;
        if (productId && quantity) {
          axiosChangeQuantityInQuote('changeQuoteItemQuantity', {
            product_id: productId,
            quantity,
          });
        }
      }, 10);
    },
  );

  attachEvent('.quote-popup .cart-view__item .cart-view__delete', 'click', (ev) => {
    const productId = ev.target.closest('.quote-popup .cart-view__item')?.querySelector('.product-id')?.value;
    if (productId) {
      axiosChangeQuantityInQuote('removeQuoteItem', { product_id: productId });
    }
  });
}
