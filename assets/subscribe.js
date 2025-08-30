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
      this.acceptButton = document.getElementById('accept-button');

      this.handleDecline = () => this.declineCookieConsent();
      this.handleAccept = () => this.acceptCookieConsent();

      this.declineButton.addEventListener('click', this.handleDecline);
      this.acceptButton.addEventListener('click', this.handleAccept);

      this.showContainer();
    } catch (error) {
      console.error('Error initializing cookie consent:', error);
    }
  }

  disconnectedCallback() {
    if (this.declineButton) {
      this.declineButton.removeEventListener('click', this.handleDecline);
    }
    if (this.acceptButton) {
      this.acceptButton.removeEventListener('click', this.handleAccept);
    }
  }

  static getConsentStatus() {
    try {
      return localStorage.getItem('subscribeDismissed');
    } catch (error) {
      console.error('Error reading cookie consent status:', error);
      return null;
    }
  }

  acceptCookieConsent() {
    localStorage.setItem('subscribeDismissed', 'true');
    this.hideContainer();
  }

  declineCookieConsent() {
    localStorage.setItem('subscribeDismissed', 'false');
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
