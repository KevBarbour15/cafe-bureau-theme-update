class Menu extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    // Element references
    this.initializeElements();

    // Animation setup
    this.initializeMenuAnimation();
    this.initializeCartAnimation();

    // Event listeners
    this.setupEventListeners();
  }

  // Element initialization
  initializeElements() {
    this.hamburger = document.getElementById('hamburger');
    this.hamburgerBar1 = document.getElementById('hamburger-bar-1');
    this.hamburgerBar2 = document.getElementById('hamburger-bar-2');
    this.hamburgerBar3 = document.getElementById('hamburger-bar-3');
    this.cartLink = document.getElementById('cart-link');
    this.cartIcon = document.getElementById('cart-icon');
    this.cartArrow = document.getElementById('cart-arrow');
    this.menu = document.getElementById('menu');
    this.links = document.querySelectorAll('.menu-link');
    this.linkTexts = document.querySelectorAll('.menu-link-text');
    this.menuArrows = document.querySelectorAll('.menu-link-arrow');
  }

  // Animation initialization
  initializeMenuAnimation() {
    this.open = new gsap.timeline({ paused: true });
    this.open.set(this.links, { opacity: 0, x: -15 })
      .add('join')
      .to(this.menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.15,
        ease: "sine.inOut"
      })
      .to(this.hamburgerBar1, .15, { y: 7, ease: "power4.in" }, 'join')
      .to(this.hamburgerBar3, .15, { y: -7, ease: "power4.in" }, 'join')
      .fromTo(this.hamburgerBar2, .3, { opacity: 1 }, { opacity: 0 })
      .add('spin', "-=.1")
      .to([this.hamburgerBar1, this.hamburgerBar2], .15, { rotation: 135, ease: "linear" }, 'spin')
      .to(this.hamburgerBar3, .15, { rotation: 225, ease: "linear" }, 'spin')
      .to(this.links,
        {
          opacity: 1,
          duration: 0.15,
          ease: "linear",
          stagger: 0.05,
          x: 0
        }, 0.15)
      .to(this.linkTexts,
        {
          duration: 0.35,
          stagger: 0.075,
          scrambleText: true
        }, 0.2);


    this.hoverLinks = [];
    this.links.forEach((_, index) => {
      this.hoverLinks[index] = new gsap.timeline({ paused: true })
        .set(this.menuArrows[index], { opacity: 1, duration: 0.05 })
        .to(this.menuArrows[index], { duration: 0.15, ease: "sine.inOut", x: "10" });
    });
  }

  initializeCartAnimation() {
    this.hoverCart = new gsap.timeline({ paused: true });
    this.hoverCart
      .to(this.cartIcon, {
        duration: 0.15,
        x: "0%",
        ease: "linear",
      }, 0)
      .to(this.cartArrow, {
        duration: 0.1,
        opacity: 1,
        ease: "linear"
      }, 0.05);
  }

  // Event listener setup
  setupEventListeners() {
    this.hamburger.addEventListener('click', () => this.onToggleMenu());
    this.cartLink.addEventListener('mouseover', () => this.onMouseOverCart());
    this.cartLink.addEventListener('mouseout', () => this.onMouseOutCart());

    this.links.forEach((link, index) => {
      link.addEventListener('mouseover', () => this.onMouseOver(index));
      link.addEventListener('mouseout', () => this.onMouseOut(index));
    });
  }

  onToggleMenu() {
    if (this.isOpen) {
      this.isOpen = !this.isOpen;
      this.open.reverse();
    } else {
      this.isOpen = !this.isOpen;
      this.open.play();
    }

  }

  onMouseOver(index) {
    this.hoverLinks[index].play();
  }

  onMouseOut(index) {
    this.hoverLinks[index].reverse();
  }

  onMouseOverCart() {
    this.hoverCart.play();
  }

  onMouseOutCart() {
    this.hoverCart.reverse();
  }

}

customElements.define('menu-overlay', Menu);