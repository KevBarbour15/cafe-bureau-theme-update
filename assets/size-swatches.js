class SizeSwatches extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.sizeSwatches = document.querySelectorAll('.size-swatch');
    this.sizeSwatchBorders = document.querySelectorAll('.size-swatch-border');

    this.sizeSwatches.forEach((sizeSwatch, idx) => {

      const swatchBorder = this.sizeSwatchBorders[idx];

      const hoverAnimation = gsap.to(swatchBorder, {
        borderRadius: '3px',
        duration: 0.2,
        ease: 'power2.inOut',
        paused: true,
        backgroundColor: '#000',
        color: '#fff',
      }, 0);

      sizeSwatch.addEventListener('mouseover', () => this.onMouseOver(hoverAnimation));
      sizeSwatch.addEventListener('mouseout', () => this.onMouseOut(hoverAnimation));
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