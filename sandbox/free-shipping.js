// Entry for /free-shipping/. In production the server sends the new free shipping card after a quantity change
// (axiosChangeQuantityInCart in cart-popup.js). Here the total is the quantity times data-unit-price, so the card
// updates without a backend.
const demo = document.querySelector('[data-free-shipping-demo]');

if (demo) {
  const unitPrice = parseFloat(demo.dataset.unitPrice);
  const threshold = parseFloat(demo.dataset.threshold);
  const input = demo.querySelector('.quantity-counter__input');
  const amount = demo.querySelector('.free-shipping-indicator__text strong');
  const progress = demo.querySelector('.free-shipping-indicator__progress-bar-inner');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let previousRemaining = null;

  // 2300 -> "2.300 €", the format the card uses
  const formatPrice = (value) => `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;

  // Back to auto once the pill has resized, so it keeps hugging the amount
  amount.addEventListener('transitionend', (event) => {
    if (event.target === amount && event.propertyName === 'width') amount.style.width = '';
  });

  // The amounts are in their own spans, so they can swap inside the pill while the pill stays still and resizes
  // (free-shipping-indicator.scss). The old one stays on top of the new one until it has left
  const setAmount = (remaining) => {
    const getWidth = () => parseFloat(getComputedStyle(amount).width) || 0;
    const newValue = document.createElement('span');
    newValue.className = 'free-shipping-indicator__amount-value';
    newValue.textContent = formatPrice(remaining);

    let values = amount.querySelector('.free-shipping-indicator__amount-values');

    // First run: wraps the amount from the markup, without animating it
    if (!values) {
      amount.innerHTML = '<span class="free-shipping-indicator__amount-values"></span>';
      values = amount.firstElementChild;
      values.append(newValue);
      return;
    }

    // Read before clearing, so a resize that is still running continues from where it is
    const from = getWidth();
    amount.style.width = '';

    // Amounts still leaving from a quick earlier click go at once, so they don't pile up
    values.querySelectorAll('.is-leaving').forEach((value) => value.remove());

    // Up when the amount grows, down when it shrinks (is-down), like the quantity counter
    const isDown = remaining < previousRemaining;

    const oldValue = values.querySelector('.free-shipping-indicator__amount-value');
    oldValue.classList.remove('is-entering');
    oldValue.classList.toggle('is-down', isDown);
    oldValue.classList.add('is-leaving');
    oldValue.addEventListener('animationend', () => oldValue.remove(), { once: true });

    newValue.classList.add('is-entering');
    newValue.classList.toggle('is-down', isDown);
    values.prepend(newValue);

    // Hidden while "ships for free" shows: no animation runs, so nothing would remove the old amount
    if (!amount.offsetParent) oldValue.remove();

    if (reduceMotion.matches) return;

    // Nothing to resize, or the pill was hidden ("ships for free" showed) and has no width to start from
    const to = getWidth();
    if (!from || !to || from === to) return;

    amount.style.width = `${from}px`;
    amount.offsetWidth;
    amount.style.width = `${to}px`;
  };

  // The threshold lands on the dashed line, which free-shipping-indicator.js treats as the start of free shipping.
  // Above it the bar carries on past the line, and is full at fullAt × the threshold
  const fullAt = 1.33;
  const getProgressPercent = (total) => {
    const track = progress.parentElement;
    const lineOffset = parseFloat(getComputedStyle(track.parentElement, '::after').right) || 0;
    const linePercent = ((track.clientWidth - lineOffset) / track.clientWidth) * 100;

    const percent =
      total <= threshold
        ? (total / threshold) * linePercent
        : linePercent + (100 - linePercent) * Math.min((total - threshold) / (threshold * (fullAt - 1)), 1);

    return Math.round(percent * 10) / 10;
  };

  const update = () => {
    const total = (parseInt(input.value, 10) || 0) * unitPrice;
    const remaining = Math.max(threshold - total, 0);

    // At free shipping the "add … more" text swaps away (free-shipping-indicator.js) and keeps its last amount, so
    // it doesn't flash "0 €" on the way out, and shows the right amount when it comes back
    if (remaining > 0 && remaining !== previousRemaining) {
      setAmount(remaining);
      previousRemaining = remaining;
    }

    progress.style.width = `${getProgressPercent(total)}%`;
  };

  // Sent by quantity-counter.js when + or - changes the value. Only the light counter drives the card, the dark one
  // is there to show its own instance
  demo.addEventListener('quantity-counter-change', (event) => {
    if (event.target.contains(input)) update();
  });

  // The line's position depends on the track's width
  window.addEventListener('resize', update);

  // Wraps the starting amount in its span, without animating it
  update();
}
