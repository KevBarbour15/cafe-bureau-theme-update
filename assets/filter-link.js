class FilterLinkHover extends HTMLElement {
  constructor() {
    super();
    this.isTouchDevice = false;
  }

  connectedCallback() {
    this.filterLinks = this.querySelectorAll('.filter-link');
    this.filterLinkTexts = this.querySelectorAll('.filter-link-text');

    this.filterLinks.forEach((link) => {
      link.addEventListener('touchstart', () => {
        this.isTouchDevice = true;
      }, { passive: true });
    });

    this.filterLinks.forEach((link, idx) => {
      const hoverAnimation = new gsap.timeline({ paused: true })
        .from(this.filterLinkTexts[idx], {
          duration: 0.15,
          scrambleText: true,
        });

      link.addEventListener('mouseover', () => this.onMouseOver(hoverAnimation));
      link.addEventListener('mouseout', () => this.onMouseOut(hoverAnimation));
    });

  }

  onMouseOver(hoverAnimation) {
    if (!this.isTouchDevice) {
      hoverAnimation.play();
    }
  }

  onMouseOut(hoverAnimation) {
    if (!this.isTouchDevice) {
      hoverAnimation.reverse();
    }
  }
}

customElements.define('filter-link-hover', FilterLinkHover);