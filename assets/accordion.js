class Accordion extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    this.header = document.getElementById('accordion-header');
    this.content = document.getElementById('accordion-content');
    this.text = document.getElementById('accordion-text');
    this.upIcon = document.getElementById('up-icon');
    this.downIcon = document.getElementById('down-icon');


    this.splitText = new SplitText(this.text, { type: "chars,words,lines" });

    this.accordionAnimation = gsap.timeline({ paused: true })
      .set(this.content, {
        maxHeight: "auto",
        opacity: 1
      }, 0)
      .to(this.content,
        {
          maxHeight: '100%',
          ease: "linear",
          duration: 0.01
        }, 0)
      .from(this.splitText.words, {
        duration: 0.1,
        opacity: 0,
        ease: "sine.inOut",
        stagger: 0.0035,
        scrambleText: true
      }, 0)
      .to(this.downIcon, {
        ease: "linear",
        duration: 0.15,
        y: () => this.content.offsetHeight,
        rotateX: 180,
      }, 0.15)
      .to(this.content, {
        borderColor: "black",
        duration: 0.05,
        ease: "linear"
      })



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
    this.accordionAnimation.play();
  }

  closeAccordion() {
    this.accordionAnimation.reverse();
  }
}

customElements.define('accordion-component', Accordion);
