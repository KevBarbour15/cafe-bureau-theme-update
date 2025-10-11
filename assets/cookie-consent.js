class CookieConsent extends HTMLElement {
  constructor() {
    super();
    this.consentStatus = null;
  }

  connectedCallback() {
    try {
      this.consentStatus = localStorage.getItem('cookieConsent');
      this.cookieConsentContainer = document.getElementById('cookie-consent-container');

      // If consent already given, hide banner and load scripts
      if (this.consentStatus !== null) {
        this.hideContainer();
        this.loadScriptsBasedOnConsent();
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
    this.consentStatus = 'true';
    this.hideContainer();
    this.loadScriptsBasedOnConsent();
  }

  declineCookieConsent() {
    localStorage.setItem('cookieConsent', 'false');
    this.consentStatus = 'false';
    this.hideContainer();
    this.loadScriptsBasedOnConsent();
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

  loadScriptsBasedOnConsent() {
    if (this.consentStatus === 'true') {
      // Load tracking scripts when consent is given
      this.loadTrackingScripts();
      this.enableMailchimp();
    } else {
      // Block tracking scripts when consent is declined
      this.blockTrackingScripts();
      this.disableMailchimp();
    }
  }

  loadTrackingScripts() {
    // Load external CDN scripts
    this.loadExternalScript('https://unpkg.com/embla-carousel/embla-carousel.umd.js');
    this.loadExternalScript('https://unpkg.com/embla-carousel-autoplay/embla-carousel-autoplay.umd.js');
    this.loadExternalScript('https://unpkg.com/embla-carousel-fade/embla-carousel-fade.umd.js');
    
    // Dispatch event to load Shopify tracking scripts
    window.dispatchEvent(new CustomEvent('cookieConsentAccepted'));
  }

  blockTrackingScripts() {
    // Block external scripts by removing them
    const externalScripts = document.querySelectorAll('script[src*="unpkg.com"]');
    externalScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    
    // Dispatch event to block Shopify tracking scripts
    window.dispatchEvent(new CustomEvent('cookieConsentDeclined'));
  }

  loadExternalScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  }

  enableMailchimp() {
    // Enable Mailchimp newsletter signup
    const subscribeContainer = document.getElementById('subscribe-form-container');
    if (subscribeContainer) {
      subscribeContainer.style.display = 'block';
    }
  }

  disableMailchimp() {
    // Disable Mailchimp newsletter signup
    const subscribeContainer = document.getElementById('subscribe-form-container');
    if (subscribeContainer) {
      subscribeContainer.style.display = 'none';
    }
  }
}

customElements.define('cookie-consent', CookieConsent);