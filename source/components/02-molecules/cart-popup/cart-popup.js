const cartPopupElem = document.querySelector('.cart-popup');

// *******************************************************************************
// Update Cart on change
// *******************************************************************************
const updateCartOnChange = (data, source, cartContentsCount) => {
  if (source === 'popup') {
    const content = document.querySelector('.cart-popup .cart-popup__content');
    if (!content) {
      return;
    }
    content.innerHTML = data;
    document.querySelector('.cart-popup')?.classList.toggle('cart-popup--empty', !Number(cartContentsCount));
  } else if (source === 'cartPage') {
    document.querySelector('.cart-module .cart-module__inner').innerHTML = data;
  }
};
// **********************************************************
// update cart count in header
// **********************************************************
const updateCartNumber = (number) => {
  const cartIconNumberEl = document.querySelector('[data-cart-number]');
  if (!cartIconNumberEl) {
    return;
  }

  cartIconNumberEl.textContent = number;
  cartIconNumberEl.style.display = number ? 'flex' : 'none';
  if (number) {
    setIconAnimation(cartIconNumberEl.closest('.header-main__cart'));
  }
};

const setIconAnimation = (item) => {
  const icon = item.closest('a') || item;
  if (icon) {
    icon.classList.add('is-active');
    setTimeout(() => {
      icon.classList.remove('is-active');
    }, 250);
  }
};

if (cartPopupElem) {
  // **********************************************************
  // Pin Subtotal And Buttons Under The Scrolling Part
  // **********************************************************
  // The server sends the subtotal and buttons (__footer) inside __content, which scrolls. They're moved out, after
  // __scroll, so they stay at the bottom. This runs again each time __content's HTML is replaced (here and in
  // product-module.js), and the new footer takes the old one's place
  const cartPopupInner = cartPopupElem.querySelector('.cart-popup__inner');
  const cartPopupContent = cartPopupElem.querySelector('.cart-popup__content');

  const placeCartPopupFooter = () => {
    const footer = cartPopupContent.querySelector(':scope > .cart-popup__footer');
    cartPopupInner.querySelector(':scope > .cart-popup__footer')?.remove();
    if (footer) {
      cartPopupInner.append(footer);
    }
  };

  if (cartPopupInner && cartPopupContent) {
    placeCartPopupFooter();

    // Only when new HTML arrives: moving the footer out also changes __content, which must not remove it again
    new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length)) {
        placeCartPopupFooter();
      }
    }).observe(cartPopupContent, { childList: true });
  }

  // **********************************************************
  // Open Cart Popup
  // **********************************************************

  attachEvent('.cart-popup-trigger', 'click', (ev) => {
    const cartPopup = document.querySelector('.cart-popup');
    if (!document.querySelector('.purchase-process')) {
      if (cartPopup) {
        const isOpen = cartPopup.classList.contains('is-cart-open');
        cartPopup.classList.toggle('is-cart-open', !isOpen);
        toggleBodyScrollLock(!isOpen);
      }
      ev.preventDefault();
    }
  });

  // **********************************************************
  // Close Popup When Escape Key Press
  // **********************************************************

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const cartPopupEle = document.querySelectorAll('.cart-popup');
      if (cartPopupEle.length > 0) {
        cartPopupEle.forEach((el) => {
          el.classList.remove('is-cart-open');
          toggleBodyScrollLock(false);
        });
      }
    }
  });

  // **********************************************************
  // Close Popup When Click On Outside
  // **********************************************************

  attachEvent('.cart-popup__overlay, .cart-popup__close', 'click', (ev) => {
    const parentEle = ev.target.closest('.cart-popup');
    parentEle.classList.remove('is-cart-open');
    ev.preventDefault();
    toggleBodyScrollLock(false);
  });

  // **********************************************************
  // Change Item Quantity In Popup Cart
  // **********************************************************
  // Axios add/remove item quantity from cart
  const axiosChangeQuantityInCart = async (newAmountData, source) => {
    const formDataInput = new FormData();
    formDataInput.append('action', 'changeItemQuantityInCart');
    formDataInput.append('inputs', JSON.stringify(newAmountData));
    formDataInput.append('id', localData.id);
    formDataInput.append('source', source);
    formDataInput.append(
      'current',
      document.querySelector('.free-shipping-indicator__progress-bar-inner')?.style.width,
    );
    try {
      const response = await axios.post(localData.apiURL, formDataInput);
      const responseData = response.data.data;
      updateCartOnChange(
        source === 'popup' ? responseData.cart_popup : responseData.cart_content_html,
        source,
        responseData.cart_contents_count,
      );
      updateCartNumber(responseData.cart_contents_count);
      if (responseData?.quote_count !== undefined && typeof window.updateQuotePopup === 'function') {
        window.updateQuotePopup(responseData.quote_popup, responseData.quote_count);
      }
      const headerIcon = document.querySelectorAll('.header-main__heart .header-main__icon-items');
      const data = responseData.like;
      headerIcon.forEach((i) => {
        i.innerHTML = data.wishlistCount;
        i.style.display = data.wishlistCount ? 'flex' : 'none';
        if (data.wishlistCount) {
          setIconAnimation(i);
        }
      });
      if (data.liked) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach((item) => {
          if (data.liked.includes(item.dataset.productId)) {
            item.querySelector('button').classList.add('is-active');
          }
        });
        const productDetail = document.querySelectorAll('.product-id');
        productDetail.forEach((item) => {
          if (item.value && data.liked.includes(item.value) && item.closest('.container')) {
            item.closest('.container').querySelector('.wishlist-button').classList.add('is-active');
          }
        });
      }
      setTimeout(() => {
        const progressBars = document.querySelectorAll('.free-shipping-indicator__progress-bar');
        progressBars.forEach((bar) => {
          const inner = bar.querySelector('.free-shipping-indicator__progress-bar-inner');
          if (inner && bar.dataset.end) {
            inner.style.width = `${bar.dataset.end}%`;
          }
        });
      }, 20);
    } catch (err) {
      console.error(err);
    }
  };

  // Change Item Quantity Debounce
  const debounceAxiosChangeQuantityInCart = debounce((newAmountData, source) =>
    axiosChangeQuantityInCart(newAmountData, source),
  );

  const hasWordPressLoginCookie = document.cookie.split(';').some((cookie) => {
    const name = cookie.trim().split('=')[0];
    return (
      name.startsWith('wordpress_logged_in_') ||
      name.startsWith('woocommerce_cart_hash') ||
      name.startsWith('wp-settings-time-') ||
      name.startsWith('wordpress_test_cookie') ||
      name.startsWith('wp_woocommerce_session_')
    );
  });

  // click on add/remove item quantity button
  attachEvent('.quantity-counter__button--remove:not(.is-disabled), .quantity-counter__button--add', 'click', (ev) => {
    setTimeout(() => {
      if (ev.target.closest('.quote-popup')) {
        return;
      }
      if (!ev.target.closest('.cart-view__item')) {
        return;
      }
      const newAmountData = {
        cart_item_key: document.querySelector('.cart-item-key').value,
        quantity: ev.target.closest('.quantity-counter').querySelector('.quantity-counter__input').value,
      };
      const source = ev.target.closest('.cart-popup') ? 'popup' : 'cartPage';
      debounceAxiosChangeQuantityInCart(newAmountData, source);
    }, 10);
  });

  if (!document.querySelector('header.header-main--purchase-process')) {
    if (document.querySelector('.sc-cart-module')) {
      axiosChangeQuantityInCart({}, 'cartPage');
      document.querySelector('.cart-popup-trigger').style.pointerEvents = 'none';
    } else {
      if (
        (Cookies.get('wishlist_items') && Cookies.get('wishlist_items').replace('[]', '')) ||
        Cookies.get('quote_hash') ||
        hasWordPressLoginCookie
      ) {
        axiosChangeQuantityInCart({}, 'popup');
      }
    }
  }
}
