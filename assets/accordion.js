class Accordion extends HTMLElement {
  constructor() {
    super();
    this.openIndex = null;
  }

  connectedCallback() {
    this.header = this.querySelectorAll('.accordion-header');
    this.content = this.querySelectorAll('.accordion-content');
    this.downIcon = this.querySelectorAll('.down-icon');

    this.content.forEach(content => {
      content.classList.add('tw-hidden');
      gsap.set(content, {
        maxHeight: 0,
        opacity: 0,
        overflow: 'hidden',
        padding: '0px 0px'
      });
    });

    this.header.forEach((header, idx) => {
      header.addEventListener('click', () => this.toggleAccordion(idx));
    });
  }

  toggleAccordion(idx) {
    if (this.openIndex === idx) {
      this.closeAccordion(idx);
      this.openIndex = null;
      return;
    }

    if (this.openIndex !== null) {
      this.closeAccordion(this.openIndex);
    }

    this.openAccordion(idx);
    this.openIndex = idx;
  }

  closeAccordion(idx) {
    const content = this.content[idx];
    const icon = this.downIcon[idx];

    const timeline = gsap.timeline()
      .to(content, {
        maxHeight: 0,
        padding: '0px 0px',
        overflow: 'hidden',
        duration: 0.3,
        ease: 'sine.inOut',
      })
      .to(icon, {
        rotation: 0,
        duration: 0.3,
        ease: 'sine.inOut'
      }, '<')
      .set(content, {
        opacity: 0
      });

    setTimeout(() => {
      content.classList.add('tw-hidden');
    }, 300);
  }

  openAccordion(idx) {
    const content = this.content[idx];
    const icon = this.downIcon[idx];

    content.classList.remove('tw-hidden');

    // Temporarily remove restrictions to measure full height
    gsap.set(content, {
      opacity: 0,
      maxHeight: 'none',
      overflow: 'visible',
      padding: '8px 0px'
    });

    // Measure the natural height
    const height = content.offsetHeight;

    // Reset and animate to measured height
    gsap.set(content, {
      maxHeight: 0,
      opacity: 0,
      overflow: 'hidden',
      padding: '0px 0px'
    });

    const timeline = gsap.timeline()
      .to(content, {
        maxHeight: height,
        padding: '8px 0px',
        overflow: 'visible',
        duration: 0.3,
        ease: 'sine.inOut',
        borderBottom: '1px solid black'
      }, 0)
      .to(content, {
        opacity: 1,
        duration: 0.15,
        ease: 'sine.out'
      }, 0.2)
      .to(icon, {
        rotation: 180,
        duration: 0.3,
        ease: 'sine.inOut'
      }, '<');
  }
}

customElements.define('accordion-component', Accordion);
