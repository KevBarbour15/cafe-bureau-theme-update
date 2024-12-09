class Button extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.button = this.querySelector('#button');
    this.hoverAnimation = gsap.to(this.button, {
      borderRadius: '2px',
      duration: 0.2,
      ease: 'linear',
      backgroundColor: '#000',
      color: '#fff',
      paused: true,
    });

    this.button.addEventListener('mouseover', () => this.onMouseOver());
    this.button.addEventListener('mouseout', () => this.onMouseOut());
  }

  onMouseOver() {
    this.hoverAnimation.play();
  }

  onMouseOut() {
    this.hoverAnimation.reverse();
  }
}

customElements.define('button-component', Button);