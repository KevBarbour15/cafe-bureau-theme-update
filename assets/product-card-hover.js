class ProductCardHover extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log('connectedCallback')
    this.productCards = this.querySelectorAll('.product-card');
    this.productImages = this.querySelectorAll('.product-image');
    this.productVideos = this.querySelectorAll('.product-video');

    this.productCards.forEach((productCard, idx) => {

      const productImage = this.productImages[idx];
      const productVideo = this.productVideos[idx];

      const hoverAnimation = gsap.timeline({ paused: true })
        .set(productVideo, {
          display: 'none',
          opacity: 0,
        })
        .to(productImage, {
          opacity: 0,
          duration: 0.05,
          ease: 'power2.inOut',
        }, 0)
        .set(productImage, {
          display: 'none',
        })
        .set(productVideo, {
          display: 'block',
        })
        .to(productVideo, {
          opacity: 1,
          scale: 1,
          duration: 0.15,
          ease: 'power2.inOut',
        });



      productCard.addEventListener('mouseover', () => this.onMouseOver(hoverAnimation));
      productCard.addEventListener('mouseout', () => this.onMouseOut(hoverAnimation));
      productCard.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.onMouseOver(hoverAnimation);
      });
      productCard.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.onMouseOut(hoverAnimation);
      });
    });
  }

  onMouseOver(hoverAnimation) {
    hoverAnimation.play();
  }
  onMouseOut(hoverAnimation) {
    hoverAnimation.reverse();
  }
}

customElements.define('product-card-hover-component', ProductCardHover);