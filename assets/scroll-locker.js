import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

class ScrollLocker extends HTMLElement {
  constructor() {
    super();
    this.isScrolling = false;
  }

  connectedCallback() {
    this.addEventListener('wheel', this.handleScroll.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('wheel', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    if (!this.isScrolling) {
      this.isScrolling = true;
      gsap.to(window, {
        duration: 0.5,
        scrollTo: {
          y: event.deltaY > 0 ? '+=' + window.innerHeight : '-=' + window.innerHeight,
          autoKill: false,
        },
        onComplete: () => {
          this.isScrolling = false;
        },
      });
    }
    event.preventDefault();
  }
}

customElements.define('scroll-locker', ScrollLocker); 