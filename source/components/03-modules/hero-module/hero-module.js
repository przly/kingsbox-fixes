const heroModule = document.querySelector('.hero-module');

if (heroModule) {
  setTimeout(() => {
    // Define the custom cubic-bezier easing
    CustomEase.create('customEase', '0.25, 0.49, 0.31, 1');

    const heroWords = gsap.utils.toArray('.hero-module__title .word');

    const heroTimeline = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: 'customEase',
      },
    });

    heroTimeline
      .to('.hero-module__text p', {
        y: 0,
        autoAlpha: 1,
      })
      .to(
        heroWords,
        {
          y: 0,
          // Keep the whole title under 0.3s, however many words it has
          stagger: Math.min(0.025, 0.3 / heroWords.length),
          autoAlpha: 1,
        },
        // Each group starts 0.05s after the previous element started (0.5 - 0.45)
        '-=0.45',
      )
      .to(
        '.hero-module__button-group .btn',
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.05,
        },
        '-=0.45',
      );

    // Overlay
    heroTimeline.to(
      '.hero-module__overlay',
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroModule,
          start: 'center center',
          end: 'bottom center',
          scrub: true,
          markers: false,
        },
      },
      '<',
    );

    // Background parallax
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to('.hero-module__bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroModule,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          markers: false,
        },
      });
    }
  }, 100);
}
