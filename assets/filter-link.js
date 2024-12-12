class FilterLinkHover extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.filterLinks = this.querySelectorAll('.filter-link');
    this.filterLinkTexts = this.querySelectorAll('.filter-link-text');


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
    hoverAnimation.play();
  }

  onMouseOut(hoverAnimation) {
    hoverAnimation.reverse();
  }
}

customElements.define('filter-link-hover', FilterLinkHover);