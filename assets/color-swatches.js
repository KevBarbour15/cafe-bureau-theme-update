class ColorSwatches extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.colorSwatches = document.querySelectorAll('.color-swatch');
    this.colorSwatchBorders = document.querySelectorAll('.color-swatch-border');

    this.colorSwatches.forEach((colorSwatch, idx) => {

      const swatchBorder = this.colorSwatchBorders[idx];

      const hoverAnimation = gsap.to(swatchBorder, {
        borderRadius: '2px',
        duration: 0.2,
        ease: 'linear',
        paused: true,
      }); 

      colorSwatch.addEventListener('mouseover', () => this.onMouseOver(hoverAnimation));
      colorSwatch.addEventListener('mouseout', () => this.onMouseOut(hoverAnimation));
    });
  }

  onMouseOver(animation) {
    animation.play();
  }

  onMouseOut(animation) {
   animation.reverse();
  }
}

customElements.define('color-swatches-component', ColorSwatches);