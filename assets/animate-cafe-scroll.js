class AnimateCafeScroll extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.gateOverlay = this.querySelector('#gate-overlay');
    this.pageContainer = this.querySelector('#page-container');

    this.gateAnimation = gsap.to(this.gateOverlay, {
      //paused: true,
      y: '-100vh',
     ease: "sine.inOut",
      delay: 1, 
      duration: 1.25,

      onComplete: () => {
        this.gateOverlay.style.display = 'none';
      },
    });
  }
}

customElements.define('animate-cafe-scroll', AnimateCafeScroll);
