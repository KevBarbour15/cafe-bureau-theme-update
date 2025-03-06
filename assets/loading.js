class Loading extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() { 
    this.loadingText = this.querySelector('#loading-text');
    this.loadingContainer = this.querySelector('#loading-container');
    this.splitText = new SplitText(this.loadingText, { type: ' chars' });

   
    this.loadingAnimation();
  }

  disconnectedCallback() {
    this.loadingAnimation.remove();
  }

  loadingAnimation() {
    const tl = gsap.timeline({
      repeat: -1
    });

    tl.to(this.splitText.chars, {
      duration: 0.75,
      scrambleText: true,
      stagger: {
        each: 0.05,
        repeat: 0,
        yoyo: true
      }
    });
  }
}

customElements.define("loading-component", Loading);