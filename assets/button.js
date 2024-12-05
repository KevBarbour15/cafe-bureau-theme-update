class Button extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.button = document.getElementById('button');
    this.hoverAnimation = gsap.to(this.button, {
      borderRadius: '2px',
      duration: 0.2,
      ease: 'linear',
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