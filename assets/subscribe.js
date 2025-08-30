class SubscribeForm extends HTMLElement {
 constructor() {
    super();
  }

  connectedCallback() {
    try {
      let subscribeDismissed = localStorage.getItem('subscribeDismissed');
      this.subscribeContainer = document.getElementById('subscribe-container');

      if (subscribeDismissed !== null) {
        this.hideContainer();
        return;
      }

      this.declineButton = document.getElementById('decline-button');

      this.handleDecline = () => this.declineSubscribeConsent();

      this.declineButton.addEventListener('click', this.handleDecline);

      this.showContainer();
    } catch (error) {
      console.error('Error initializing subscribe form:', error);
    }
  }

  disconnectedCallback() {
    if (this.declineButton) {
      this.declineButton.removeEventListener('click', this.handleDecline);
    }
  }

  static getConsentStatus() {
    try {
      return localStorage.getItem('subscribeDismissed');
    } catch (error) {
      console.error('Error reading subscribe consent status:', error);
      return null;
    }
  }

  acceptSubscribeConsent() {
    localStorage.setItem('subscribeDismissed', 'true');
    this.hideContainer();
  }

  declineSubscribeConsent() {
    localStorage.setItem('subscribeDismissed', 'true');
    this.hideContainer();
  }

  hideContainer() {
    gsap.to(this.subscribeContainer, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.subscribeContainer.style.display = 'none';
      }
    });
  }

  showContainer() {
    gsap.set(this.subscribeContainer, {
      opacity: 0,
      display: "flex",
      yPercent: 100,
    });

    gsap.to(this.subscribeContainer, {
      delay: 1,
      opacity: 1,
      duration: 1,
      ease: 'power4.inOut',
      yPercent: 0,
    });
  }
}

customElements.define('subscribe-form', SubscribeForm);
