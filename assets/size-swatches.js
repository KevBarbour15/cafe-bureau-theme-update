class SizeSwatches extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.sizeSwatches = document.querySelectorAll('.size-swatch');

    this.sizeSwatches.forEach((sizeSwatch) => {
      const hoverAnimations = gsap.timeline({ paused: true })
        .to(sizeSwatch, {
          borderRadius: '0px',
          backgroundColor: '#000',
          color: '#fff',
          duration: 0.2,
          ease: 'power2.inOut',
        });

      sizeSwatch.addEventListener('mouseover', () => {
        if (!sizeSwatch.classList.contains('active')) {
          this.onMouseOver(hoverAnimations);
        }
      });

      sizeSwatch.addEventListener('mouseout', () => {
        if (!sizeSwatch.classList.contains('active')) {
          this.onMouseOut(hoverAnimations);
        }
      });
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