class OpacityReveal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.pageContainer = this.querySelector('.page-container');
    this.cards = this.querySelectorAll('.card');

    this.cards.forEach((card) => {
      gsap.set(card, { opacity: 0 });

      gsap.to(card, {
        opacity: 1,
        duration: 0.35,
        ease: "power4.in",
        delay: 0.25,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
          markers: true,
        }
      });
    });
  }
}

customElements.define('opacity-reveal', OpacityReveal);
