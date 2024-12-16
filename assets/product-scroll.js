class ProductPageScroll extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.detailsContainer = document.getElementById('details-container');
    this.imageContainer = document.getElementById('image-container');
    this.scrollArrow = document.getElementById('scroll-arrow');

    this.pinDetailsAnimation = gsap.to(this.detailsContainer, {
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
          this.detailsContainer.style.zIndex = '1';
          this.imageContainer.style.zIndex = '1';
        }
      }
    });

    this.pinImageAnimation = gsap.to(this.scrollArrow, {
      scrollTrigger: {
        trigger: this.imageContainer,
        start: "top top",
        end: "65% top",
        onUpdate: (self) => {
          if (self.progress >= 1) {
            
            gsap.to(this.scrollArrow, {
              opacity: 0,
              duration: 0.25,
              ease: "power1.inOut"
            })
            gsap.to(this.scrollArrow, {
              display: 'none',
              delay: 0.25,
            })
          } else {
            this.scrollArrow.style.display = 'block';
            gsap.to(this.scrollArrow, {
              opacity: 1,
              duration: 0.25,
              ease: "power1.inOut"
            }) 
          }
        }
      }
    });
  }
}

customElements.define('product-page-scroll', ProductPageScroll);
