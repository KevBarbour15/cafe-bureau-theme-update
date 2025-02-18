class GateAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.gateOverlay = this.querySelector('#gate-overlay');
    this.html = document.querySelector('html');
    this.window = window;
    
    
    if (window.scrollY !== 0) {
      this.window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
    this.html.style.overflowY = 'hidden';

    this.gateAnimation = gsap.to(this.gateOverlay, {
      y: '-100vh',
      ease: "linear",
      delay: 1,
      duration: 1.15,

      onComplete: () => {
        this.gateOverlay.style.display = 'none';
        this.html.style.overflowY = 'auto';
      },
    });
  }
}

customElements.define('gate-animation', GateAnimation);