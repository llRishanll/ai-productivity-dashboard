export function initFadeInOnScroll() {
  const groups = document.querySelectorAll(".fade-in-group");

  groups.forEach(group => {
    const items = group.querySelectorAll(".fade-in-item");
    const staggerDelay = parseInt(group.dataset.staggerDelay) || 100;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // fade in visible items with stagger
          items.forEach((item, index) => {
            const fadeDuration = item.dataset.fadeDuration || "0.6s";
            item.style.transitionDuration = fadeDuration;
            setTimeout(() => {
              item.classList.add("is-visible");
            }, index * staggerDelay);
          });
        } else {
          // fade them out again when leaving viewport
          items.forEach(item => {
            item.classList.remove("is-visible");
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(group);
  });
}
