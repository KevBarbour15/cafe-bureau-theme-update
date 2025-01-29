class GateAnimation  extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.gateOverlay = this.querySelector('#gate-overlay');

    this.gateAnimation = gsap.to(this.gateOverlay, {
      //paused: true,
      y: '-100vh',
     ease: "sine.inOut",
      delay: 1.25, 
      duration: 1.75,

      onComplete: () => {
        this.gateOverlay.style.display = 'none';
      },
    });
  }
}

customElements.define('gate-animation', GateAnimation);