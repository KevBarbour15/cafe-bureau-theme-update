class SizeSwatches extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.sizeSwatches = document.querySelectorAll('.size-swatch');
    this.sizeSwatchBorders = document.querySelectorAll('.size-swatch-border');

    this.sizeSwatches.forEach((sizeSwatch, idx) => {
      const sizeSwatchBorder = this.sizeSwatchBorders[idx];

      const hoverAnimations = gsap.timeline({ paused: true })
        .to(sizeSwatchBorder, {
          borderRadius: '0px',
          duration: 0.2,
          ease: 'power2.inOut',
        })
        .to(sizeSwatchBorder, {
          backgroundColor: '#000',
          color: '#fff',
          duration: 0.2,
          ease: 'power2.inOut',
        }, '<');


      sizeSwatch.addEventListener('mouseover', () => this.onMouseOver(hoverAnimations));
      sizeSwatch.addEventListener('mouseout', () => this.onMouseOut(hoverAnimations));
    });
  }

  onMouseOver(animation) {
    animation.play();
  }

  onMouseOut(animation) {
    animation.reverse();
  }
}

customElements.define('size-swatches-component', SizeSwatches);