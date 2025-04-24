class OpacityReveal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.cards = this.querySelectorAll('.card');
    this.cards.forEach((card) => {
      gsap.set(card, { opacity: 0 });

      gsap.to(card, {
        opacity: 1,
        duration: 0.35,
        ease: "linear",
        delay: 0.35,
 
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
