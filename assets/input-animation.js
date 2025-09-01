class InputAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.input = document.getElementById('newsletter-heading');


    

    if (!this.input) return;

    this.inputAnimation = gsap.timeline({ repeat: -1 })
      .to(this.input, {
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, 0.25)
      .to(this.input, {
        opacity: 1,
        duration: 1,
        ease: "power4.in"
      }, 0.95)
    
    

    this.input.addEventListener('focus', () => this.inputAnimation);
    this.input.addEventListener('blur', () => this.inputAnimation.reverse());
  }


}

customElements.define('input-animation', InputAnimation);

