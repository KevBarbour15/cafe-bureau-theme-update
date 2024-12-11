class ProductPageScroll extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.detailsContainer = document.getElementById('details-container');
    this.imageContainer = document.getElementById('image-container');
    this.animation = gsap.to(this.detailsContainer, {
      ease: "none",
      scrollTrigger: {
        trigger: this.imageContainer,
        start: "top top",
        end: "bottom bottom",
        pin: this.detailsContainer,
        scrub: true,
        pinSpacing: false,
        preventOverlaps: true,
        fastScrollEnd: true,
        onUpdate: self => {
          // Ensure z-index hierarchy is maintained during animation
          this.detailsContainer.style.zIndex = '1';
          this.imageContainer.style.zIndex = '1';
        }
      }
    });
  }
}

customElements.define('product-page-scroll', ProductPageScroll);
