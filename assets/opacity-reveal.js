class OpacityReveal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.cards = this.querySelectorAll('.card');
    
    // Check if we're inside a loading component
    const loadingComponent = this.closest('loading-component');
    if (loadingComponent) {
      // If we are, wait for loading to complete
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-images-loaded') {
            if (loadingComponent.getAttribute('data-images-loaded') === 'true') {
              // Wait a frame to ensure DOM is ready
              requestAnimationFrame(() => {
                this.animateCards();
                // Refresh ScrollTrigger after all cards are set up
                gsap.registerPlugin(ScrollTrigger);
                ScrollTrigger.refresh();
              });
              observer.disconnect();
            }
          }
        });
      });

      observer.observe(loadingComponent, { attributes: true });
    } else {
      // If not, animate immediately
      this.animateCards();
    }
  }

  animateCards() {
    this.cards.forEach((card) => {
      gsap.set(card, { opacity: 0 });

      gsap.to(card, {
        opacity: 1,
        duration: 0.5,
        ease: "linear",
        delay: 0.15,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none",
        }
      });
    });
  }
}

customElements.define('opacity-reveal', OpacityReveal);
