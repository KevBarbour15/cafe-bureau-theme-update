class Loading extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() { 
    this.loadingText = this.querySelector('#loading-text');
    this.loadingContainer = this.querySelector('#loading-container');
    this.splitText = new SplitText(this.loadingText, { type: ' chars' });
    this.imagesLoaded = false;
   
    this.loadingAnimation();
    this.checkImagesLoaded();
  }

  disconnectedCallback() {
    this.loadingAnimation.remove();
  }

  loadingAnimation() {
    const tl = gsap.timeline({
      repeat: -1
    });

    tl.to(this.splitText.chars, {
      duration: 0.75,
      scrambleText: true,
      stagger: {
        each: 0.05,
        repeat: 0,
        yoyo: true
      }
    });
  }

  checkImagesLoaded() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      this.setAttribute('data-images-loaded', 'true');
      return;
    }

    const checkComplete = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setTimeout(() => {
          this.setAttribute('data-images-loaded', 'true');
        }, 1000);
      }
    };

    images.forEach(img => {
      if (img.complete) {
        checkComplete();
      } else {
        img.addEventListener('load', checkComplete);
        img.addEventListener('error', checkComplete); // Handle broken images
      }
    });

    // Fallback timeout in case some images never load
    setTimeout(() => {
      if (this.getAttribute('data-images-loaded') !== 'true') {
        this.setAttribute('data-images-loaded', 'true');
      }
    }, 5000); // 5 second timeout
  }
}

customElements.define("loading-component", Loading);