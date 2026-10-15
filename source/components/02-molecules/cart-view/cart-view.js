// **********************************************************
// Cart View
// **********************************************************
const cartModule = document.querySelector('.cart-module');
const cartPopupContent = document.querySelector('.cart-popup');

// Axios remove item from cart
const axiosRemoveItemFromCart = async (itemKey, source) => {
  const formDataInput = new FormData();
  formDataInput.append('action', 'removeItemFromCart');
  formDataInput.append('item_key', itemKey);
  formDataInput.append('source', source);
  formDataInput.append('current', document.querySelector('.free-shipping-indicator__progress-bar-inner')?.style.width);

  const currentValue =
    document.querySelector('.cart-module__amount-row-right')?.innerHTML.trim() ||
    document.querySelector('.cart-popup__total-row input')?.value.trim() ||
    0;
  try {
    const response = await axios.post(localData.apiURL, formDataInput);
    updateCartOnChange(
      source === 'popup' ? response.data.data.cart_popup : response.data.data.cart_content_html,
      source,
      response.data.data.cart_contents_count,
    );
    updateCartNumber(response.data.data.cart_contents_count);
    setTimeout(() => {
      const progressBars = document.querySelectorAll('.free-shipping-indicator__progress-bar');
      progressBars.forEach((bar) => {
        const inner = bar.querySelector('.free-shipping-indicator__progress-bar-inner');
        if (inner && bar.dataset.end) {
          inner.style.width = `${bar.dataset.end}%`;
        }
      });
    }, 20);
    animateNumbersValue(currentValue);
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteClick = (ev) => {
  if (ev.target.closest('.quote-popup')) {
    return;
  }
  if (ev.target.matches('.cart-view__delete i') || ev.target.matches('.cart-view__delete')) {
    const parentElem = ev.target.closest('.cart-view__item');
    const itemKey = parentElem.querySelector('.cart-item-key').value;
    parentElem.remove();

    if (cartModule) {
      if (cartModule.querySelectorAll('.cart-view__item').length === 0) {
        cartModule.classList.add('cart-module--empty');
      }
    } else if (cartPopupContent.querySelectorAll('.cart-view__item').length === 0) {
      cartPopupContent.classList.add('cart-popup--empty');
    }

    const source = cartModule ? 'cartPage' : 'popup';

    axiosRemoveItemFromCart(itemKey, source);
  }
};

if (cartModule) {
  cartModule.addEventListener('click', handleDeleteClick);
}

if (cartPopupContent) {
  cartPopupContent.addEventListener('click', handleDeleteClick);
}
