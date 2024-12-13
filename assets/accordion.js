class Accordion extends HTMLElement {
  constructor() {
    super();
    this.openIndex = null;
  }

  connectedCallback() {
    this.header = this.querySelectorAll('.accordion-header');
    this.content = this.querySelectorAll('.accordion-content');
    this.downIcon = this.querySelectorAll('.down-icon');

    // Add initial styles
    this.content.forEach(content => {
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.overflow = 'hidden';
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

    content.style.maxHeight = '0';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';
    icon.style.transform = 'rotateX(0deg)';

    setTimeout(() => {
      content.classList.add('tw-hidden');
    }, 50);
  }

  openAccordion(idx) {
    const content = this.content[idx];
    const icon = this.downIcon[idx];

    setTimeout(() => {
      content.classList.remove('tw-hidden');
    }, 50);
    content.style.overflow = 'visible';
    content.style.maxHeight = '100%';
    content.style.opacity = '1';
    content.style.borderColor = 'black';
    icon.style.transform = 'rotateX(180deg)';
  }
}

customElements.define('accordion-component', Accordion);
