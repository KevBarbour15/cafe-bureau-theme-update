class LinkHover extends HTMLElement {
  constructor() {
    super();
    this.isTouchDevice = false;
  }

  connectedCallback() {
    if (window.innerWidth < 768) {
      return;
    }

    this.link = this.querySelector('.hover-link');
    this.link.addEventListener('touchstart', () => {
      this.isTouchDevice = true;
    }, { passive: true });

    this.linkTexts = this.querySelector('.hover-link-text');
    this.linkArrow = this.querySelector('.hover-link-arrow');

    this.animate = new gsap.timeline({ paused: true })
      .from(this.linkArrow, { 
        opacity: 0,
        x: 0,
        duration: 0.15,
        ease: "sine.inOut",
        display: 'none'
      })
      .to(this.linkArrow, { 
        display: 'block',
        opacity: 1,
        x: 10,
        duration: 0.15,
        ease: "sine.inOut"
      });

    this.link.addEventListener('mouseover', () => this.onMouseOver());
    this.link.addEventListener('mouseout', () => this.onMouseOut());
  }

  onMouseOver() {
    if (!this.isTouchDevice) {
      this.animate.play();
    }
  }

  onMouseOut() {
    if (!this.isTouchDevice) {
      this.animate.reverse();
    }
  }
}

customElements.define('link-hover-effect', LinkHover);