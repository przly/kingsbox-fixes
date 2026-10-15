// **********************************************************
// Logo Slider
// **********************************************************

const logoSlider = document.querySelectorAll('.logo-slider');

logoSlider.forEach((parent) => {
  const track = parent.querySelector('.logo-slider__track');
  const dragEle = parent.querySelector('.logo-slider__inner');

  if (!track) return;

  // SPEED CONTROL
  const SPEED = 40;

  const setSpeed = () => {
    track.style.animationDuration = `${track.scrollWidth / 2 / SPEED}s`;
  };

  if (document.readyState === 'complete') {
    setSpeed();
  } else {
    window.addEventListener('load', setSpeed, { once: true });
  }

  window.addEventListener('resize', debounce(setSpeed, 150));

  // DRAG LOGIC
  let isDragging = false;
  let startX = 0;
  let startOffset = 0;
  let currentOffset = 0;

  const getOffset = () => parseFloat(getComputedStyle(track).getPropertyValue('--offset')) || 0;
  const getLoopWidth = () => track.scrollWidth / 2;

  const pointerDown = (e) => {
    isDragging = true;
    startX = e.clientX;

    track.style.animationPlayState = 'paused';

    startOffset = getOffset();

    dragEle.style.cursor = 'grabbing';
  };

  const pointerMove = (e) => {
    if (!isDragging) return;

    const delta = e.clientX - startX;
    let next = startOffset + delta;

    const loopWidth = getLoopWidth();

    next = ((next % loopWidth) + loopWidth) % loopWidth;
    next = -loopWidth + next;

    currentOffset = next;

    track.style.setProperty('--offset', `${currentOffset}px`);
  };

  const pointerUp = () => {
    if (!isDragging) return;
    isDragging = false;

    dragEle.style.cursor = 'grab';

    track.style.animationPlayState = 'running';
  };

  dragEle.addEventListener('pointerdown', pointerDown);
  window.addEventListener('pointermove', pointerMove);
  window.addEventListener('pointerup', pointerUp);

  dragEle.addEventListener('touchstart', () => {}, { passive: true });

  dragEle.querySelectorAll('img').forEach((img) => {
    img.setAttribute('draggable', 'false');
  });
});
