// Everything that uses the pointer-dots-highlight mixin: the cards and the cookie banner bar
const cards = document.querySelectorAll('[data-component="mol-card"], .advance-cookie-banner__bar');
const cardPointerClass = 'is-pointer-near';
// Keep in sync with the mask radius in the pointer-dots-highlight mixin (scss/mixins/_mixins.scss)
const cardPointerRadius = 200;

const cardPointerStorageKey = 'cardPointer';

const visibleCards = new Set();
let cardPointer = null;
let cardPointerFrame = null;

// The browser only reveals where the cursor is when it fires a mouse event, so after a reload the
// position is unknown until the cursor moves. The last position is therefore carried over in
// sessionStorage and used until the first real event arrives.
const restoreCardPointer = () => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(cardPointerStorageKey));
    const isInViewport =
      stored && stored.x >= 0 && stored.y >= 0 && stored.x <= window.innerWidth && stored.y <= window.innerHeight;

    return isInViewport ? { x: stored.x, y: stored.y } : null;
  } catch (error) {
    return null;
  }
};

const storeCardPointer = () => {
  try {
    if (cardPointer) {
      sessionStorage.setItem(cardPointerStorageKey, JSON.stringify(cardPointer));
    } else {
      sessionStorage.removeItem(cardPointerStorageKey);
    }
  } catch (error) {
    // Storage is unavailable (private mode, blocked site data): the highlight then waits for the first mouse event
  }
};

// Feeds the cursor position to the dot highlight in card.scss. Every card within reach of the cursor
// gets it, not only the hovered one, so the highlight carries over into neighbouring cards. It works
// from the last known cursor position instead of :hover, so it also follows while the page scrolls
// under a cursor that is not moving.
const updateCardPointer = () => {
  cardPointerFrame = null;

  visibleCards.forEach((card) => {
    if (!cardPointer) {
      card.classList.remove(cardPointerClass);
      return;
    }

    const rect = card.getBoundingClientRect();
    const distanceX = Math.max(rect.left - cardPointer.x, 0, cardPointer.x - rect.right);
    const distanceY = Math.max(rect.top - cardPointer.y, 0, cardPointer.y - rect.bottom);
    const isNear = Math.hypot(distanceX, distanceY) < cardPointerRadius;

    card.classList.toggle(cardPointerClass, isNear);

    if (isNear) {
      card.style.setProperty('--card-pointer-x', `${cardPointer.x - rect.left - card.clientLeft}px`);
      card.style.setProperty('--card-pointer-y', `${cardPointer.y - rect.top - card.clientTop}px`);
    }
  });
};

const scheduleCardPointerUpdate = () => {
  if (cardPointerFrame === null) {
    cardPointerFrame = requestAnimationFrame(updateCardPointer);
  }
};

if (cards.length > 0 && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  // Only cards in the viewport are measured
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleCards.add(entry.target);
      } else {
        visibleCards.delete(entry.target);
        entry.target.classList.remove(cardPointerClass);
      }
    });

    scheduleCardPointerUpdate();
  });

  cards.forEach((card) => cardObserver.observe(card));

  cardPointer = restoreCardPointer();

  const setCardPointer = (event) => {
    cardPointer = { x: event.clientX, y: event.clientY };
    scheduleCardPointerUpdate();
  };

  // pointerover and mouseover are what the browser fires on its own when the page scrolls under a
  // still cursor, which corrects a restored position without the cursor having to move
  ['pointermove', 'pointerover', 'mouseover'].forEach((type) => {
    window.addEventListener(type, setCardPointer, { passive: true });
  });

  window.addEventListener('scroll', scheduleCardPointerUpdate, { passive: true });
  window.addEventListener('pagehide', storeCardPointer);

  // Cursor left the window
  document.documentElement.addEventListener('pointerleave', () => {
    cardPointer = null;
    scheduleCardPointerUpdate();
  });
}
