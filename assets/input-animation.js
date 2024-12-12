class InputAnimation extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.input = document.getElementsByClassName('subscribe-input');


    

    if (!this.input) return;

    this.inputAnimation = gsap.timeline({ repeat: -1 })
      .to(this.input, {
        opacity: 0.3,
        duration: 0.65,
        ease: "power1.out"
      }, 0.25)
      .to(this.input, {
        opacity: 1,
        duration: 0.65,
        ease: "power1.in"
      }, 0.95)
    
    

    this.input.addEventListener('focus', () => this.inputAnimation);
    this.input.addEventListener('blur', () => this.inputAnimation.reverse());
  }


}

customElements.define('input-animation', InputAnimation);

