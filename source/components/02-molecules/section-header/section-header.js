// Corner marks: on each side the two dots scale up together in the vertical middle of the header,
// then travel up and down to their corners. Each number fades in behind its dot as it arrives.
// The hidden start state lives in section-header.scss.
const sectionHeaders = document.querySelectorAll('[data-component="mol-section-header"]');

if (sectionHeaders.length > 0) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Same curve as the hero (hero-module.js)
  CustomEase.create('markRevealEase', '0.25, 0.49, 0.31, 1');
  // Strong ease-in-out
  CustomEase.create('markMoveEase', '0.77, 0, 0.175, 1');

  const dotScaleDuration = 0.3;
  // The move starts with the scale-up. Its slow start is hidden under the growth, so the dot never
  // stops in between.
  const dotMoveDuration = 0.8;
  // The dot is visibly in place a little before its move ends, so the number starts then
  const numberRevealStart = 0.6;
  // The number is fully visible well before it stops sliding
  const numberFadeDuration = 0.1;
  const numberSlideDuration = 0.25;
  // How far the number trails behind the dot before settling, in pixels
  const numberShift = 6;
  // Set to false to hide the numbers and show only the dots
  const showNumber = true;

  const playMark = (icon, header) => {
    const dot = icon.querySelector('.number-icon__dot');
    const number = icon.querySelector('.number-icon__number');

    if (!dot || !number) return;

    // Reduced motion: no movement, the mark only fades in
    if (reducedMotion) {
      gsap.to(showNumber ? [dot, number] : dot, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      return;
    }

    // The dot is drawn in one half of its SVG, so its own shape is measured and not the SVG box.
    // Measured here, when the header is on screen, and not on page load.
    const headerRect = header.getBoundingClientRect();
    const svgRect = dot.getBoundingClientRect();
    const shapeRect = dot.querySelector('path').getBoundingClientRect();
    const shapeCenterX = shapeRect.left + shapeRect.width / 2;
    const shapeCenterY = shapeRect.top + shapeRect.height / 2;
    // Distance from the dot's corner to the vertical middle of the header
    const offset = headerRect.top + headerRect.height / 2 - shapeCenterY;

    gsap.set(dot, {
      y: offset,
      scale: 0,
      opacity: 1,
      transformOrigin: `${shapeCenterX - svgRect.left}px ${shapeCenterY - svgRect.top}px`,
    });

    const markTimeline = gsap.timeline();

    // The dot scales up to its normal size in the middle, and is already setting off
    markTimeline.to(dot, { scale: 1, duration: dotScaleDuration, ease: 'expo.out' }, 0);
    markTimeline.to(dot, { y: 0, duration: dotMoveDuration, ease: 'markMoveEase' }, 0);

    // The number fades in as the dot arrives, sliding the last few pixels along the dot's path
    if (showNumber) {
      gsap.set(number, { y: Math.sign(offset) * numberShift });
      markTimeline.to(
        number,
        { y: 0, duration: numberSlideDuration, ease: 'markRevealEase' },
        numberRevealStart
      );
      markTimeline.to(number, { opacity: 1, duration: numberFadeDuration, ease: 'none' }, numberRevealStart);
    }
  };

  sectionHeaders.forEach((header) => {
    const icons = header.querySelectorAll('.number-icon');

    if (icons.length === 0) return;

    // Plays once the whole header is on screen, so both the top and the bottom marks are seen
    ScrollTrigger.create({
      trigger: header,
      start: 'bottom 95%',
      once: true,
      onEnter: () => icons.forEach((icon) => playMark(icon, header)),
    });
  });
}
