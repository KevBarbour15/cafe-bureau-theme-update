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
      console.log('declineButton found:', this.declineButton);

      this.handleDecline = () => this.declineSubscribeConsent();

      this.declineButton.addEventListener('click', this.handleDecline);
      console.log('Added click listener to decline button');

      // Show immediately for testing
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
    console.log('acceptSubscribeConsent called');
    localStorage.setItem('subscribeDismissed', 'true');
    this.hideContainer();
  }

  declineSubscribeConsent() {
    console.log('declineSubscribeConsent called');
    localStorage.setItem('subscribeDismissed', 'true');
    this.hideContainer();
  }

  hideContainer() {
    console.log('hideContainer called');
    // Simple hide without GSAP for testing
    this.subscribeContainer.style.opacity = '0';
    this.subscribeContainer.style.display = 'none';
    console.log('Container hidden with simple method');
  }

  showContainer() {
    console.log('showContainer called');
    // Simple show without GSAP for testing
    this.subscribeContainer.style.display = 'flex';
    this.subscribeContainer.style.opacity = '1';
    console.log('Container shown with simple method');
  }
}

customElements.define('subscribe-form', SubscribeForm);
