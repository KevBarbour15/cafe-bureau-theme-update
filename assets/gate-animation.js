class GateAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (window.scrollY > 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }


    this.gateOverlay = this.querySelector('#gate-overlay');
    this.html = document.querySelector('html');

    this.html.style.overflowY = 'hidden';

    // Start gate animation after a short delay to allow scroll to begin
    setTimeout(() => {
      this.startGateAnimation();
    }, 100);
  }

  startGateAnimation() {
    this.gateAnimation = gsap.timeline().set(this.gateOverlay, {
      opacity: 0,
    })
      .to(this.gateOverlay, {
        delay: 0.35,
        opacity: 1,
        duration: 0.1,
      }).to(this.gateOverlay, {
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

customElements.define('gate-animation', GateAnimation);