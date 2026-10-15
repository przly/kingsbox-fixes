// Bottom title reveal, same as the about-module title: every word slides up from behind its own mask
// when the title scrolls into view. The hidden start state lives in case-study-video.scss.
const caseStudyVideoTitles = document.querySelectorAll('.case-study-video__content .title > *');

if (caseStudyVideoTitles.length > 0 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  CustomEase.create('caseStudyVideoTitleEase', '0.16, 1, 0.3, 1');

  caseStudyVideoTitles.forEach((title) => {
    Splitting({ target: title, by: 'words' });

    // The word is the mask, the inner span is what moves
    const wordInners = Array.from(title.querySelectorAll('.word'), (word) => {
      const wordInner = document.createElement('span');

      wordInner.className = 'word__inner';
      wordInner.append(...word.childNodes);
      word.append(wordInner);

      return wordInner;
    });

    gsap.to(wordInners, {
      y: 0,
      duration: 1,
      ease: 'caseStudyVideoTitleEase',
      stagger: 0.015,
      scrollTrigger: {
        trigger: title,
        // Starts once 40% of the title is in the viewport, and plays only once
        start: '40% bottom',
        once: true,
      },
    });
  });
}
