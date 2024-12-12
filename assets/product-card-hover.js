class ProductCardHover extends HTMLElement {
  constructor() {
    super();
    this.observerCallback = this.observerCallback.bind(this);
  }

  connectedCallback() {

    this.productCard = this.querySelector('.product-card');
    this.productImage = this.querySelector('.product-image');
    this.productVideo = this.querySelector('.product-video');
    this.productVideoContainer = this.querySelector('.product-video-container');

    this.observer = new IntersectionObserver(this.observerCallback, {
      root: null,
      rootMargin: '50px',
      threshold: 0
    });

    this.productVideo.addEventListener('canplay', () => {
      this.videoReady = true;
    });

    this.productVideo.addEventListener('error', (e) => {
      console.error('Error loading video:', e);
      this.videoReady = false;
    });

    this.hoverAnimation = gsap.timeline({ paused: true })
      .set(this.productVideo, {
        play: false,
        currentTime: 0,
      }, 0)
      .set(this.productVideoContainer, {
        opacity: 0,
      }, 0)
      .set(this.productVideo, {
        play: true,
      }, 0)
      .to(this.productVideoContainer, {
        display: 'block',
        opacity: 1,
      }, 0)
      .to(this.productImage, {
        opacity: 0,
      }, 0)
      .set(this.productImage, {
        display: 'none',
      }, 0);

    this.observer.observe(this.productCard);

    this.productCard.addEventListener('mouseover', () => this.onMouseOver());
    this.productCard.addEventListener('mouseout', () => this.onMouseOut());
    this.productCard.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.onMouseOver();
    });
    this.productCard.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.onMouseOut();
    });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  observerCallback(entries) {
    const entry = entries[0];
    if (entry.isIntersecting && this.productVideoContainer?.getAttribute('data-src')) {
      const videoUrl = this.productVideoContainer.getAttribute('data-src');
      if (videoUrl) {
        this.productVideo.src = videoUrl;
      }
    }
  }

  onMouseOver() {
    if (this.videoReady) {
      this.hoverAnimation.play();
    } else {
      console.log('Video is not ready');
    }
  }

  onMouseOut() {
    this.hoverAnimation.reverse();
  }
}

customElements.define('product-card-hover-component', ProductCardHover);