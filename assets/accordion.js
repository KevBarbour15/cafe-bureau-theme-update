class Accordion extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    this.header = document.getElementById('accordion-header');
    this.content = document.getElementById('accordion-content');
    this.text = document.getElementById('accordion-text');
    this.downIcon = document.getElementById('down-icon');

    this.splitText = new SplitText(this.text, { type: "chars,words,lines" });

    this.openAnimation = gsap.timeline({ paused: true })
      .set(this.splitText.chars, {
        opacity: 0,
      }, 0)
      .to(this.content, {
        maxHeight: '100%',
        duration: 0.3,
        borderColor: "black",
        opacity: 1,
        ease: "linear",
      }, 0.05)
      .to(this.splitText.chars, {
        duration: 0.125,
        opacity: 1,
        ease: "linear",
        stagger: 0.0003,
        scrambleText: {
          text: true,
          chars: "lowerCase",
          revealDelay: 0.1,
        }
      }, 0.15)
      .to(this.downIcon, {
        ease: "linear",
        duration: 0.15,
        rotateX: 180,
      }, "-=0.3");


    this.header.addEventListener('click', () => this.toggleAccordion());
  }

  toggleAccordion() {
    if (this.isOpen) {
      this.closeAccordion();
    } else {
      this.openAccordion();
    }
    this.isOpen = !this.isOpen;
  }

  openAccordion() {
    this.openAnimation.play();
  }

  closeAccordion() {
    this.openAnimation.reverse();
  }
}

customElements.define('accordion-component', Accordion);
