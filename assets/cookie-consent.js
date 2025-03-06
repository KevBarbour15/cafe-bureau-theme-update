class CookieConsent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    try {
      let cookieConsent = localStorage.getItem('cookieConsent');
      this.cookieConsentContainer = document.getElementById('cookie-consent-container');

      if (cookieConsent !== null) {
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
      return localStorage.getItem('cookieConsent');
    } catch (error) {
      console.error('Error reading cookie consent status:', error);
      return null;
    }
  }

  acceptCookieConsent() {
    localStorage.setItem('cookieConsent', 'true');
    this.hideContainer();
  }

  declineCookieConsent() {
    localStorage.setItem('cookieConsent', 'false');
    this.hideContainer();
  }

  hideContainer() {
    gsap.to(this.cookieConsentContainer, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.cookieConsentContainer.style.display = 'none';
      }
    });
  }

  showContainer() {
    gsap.set(this.cookieConsentContainer, {
      opacity: 0,
      display: "flex",
      yPercent: 100,
    });

    gsap.to(this.cookieConsentContainer, {
      delay: 1,
      opacity: 1,
      duration: 1,
      ease: 'power4.inOut',
      yPercent: 0,
    });
  }
}

customElements.define('cookie-consent', CookieConsent);