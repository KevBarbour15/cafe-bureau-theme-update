class SubscribeForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    try {
      let subscribeDismissed = localStorage.getItem('subscribeDismissed');
      let lastVisitTime = localStorage.getItem('subscribeLastVisit');
      this.subscribeContainer = document.getElementById('subscribe-container');
      this.emailInput = document.getElementById('subscribe-email');

      // Check if user has dismissed or subscribed
      if (subscribeDismissed !== null) {
        this.hideContainer();
        return;
      }

      // Check if enough time has passed since last visit (30 days)
      if (lastVisitTime && !this.shouldShowPopup(lastVisitTime)) {
        this.hideContainer();
        return;
      }

      this.dismissButton = document.getElementById('dismiss-button');
      this.subscribeButton = document.getElementById('subscribe-button');

      this.handleDismiss = () => this.dismissSubscribe();
      this.handleSubscribe = () => this.subscribeToNewsletter();
      this.handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          this.dismissSubscribe();
        }
      };

      this.dismissButton.addEventListener('click', this.handleDismiss);
      this.subscribeButton.addEventListener('click', this.handleSubscribe);
      document.addEventListener('keydown', this.handleEscapeKey);

      // Record this visit time
      this.recordVisit();
      
      this.showContainer();
    } catch (error) {
      console.error('Error initializing subscribe form:', error);
    }
  }

  disconnectedCallback() {
    if (this.dismissButton) {
      this.dismissButton.removeEventListener('click', this.handleDismiss);
    }
    if (this.subscribeButton) {
      this.subscribeButton.removeEventListener('click', this.handleSubscribe);
    }
    document.removeEventListener('keydown', this.handleEscapeKey);
    
    // Ensure scroll is restored if component is removed
    this.enableScroll();
  }

  static getSubscribeStatus() {
    try {
      return localStorage.getItem('subscribeDismissed');
    } catch (error) {
      console.error('Error reading subscribe status:', error);
      return null;
    }
  }

  shouldShowPopup(lastVisitTime) {
    if (!lastVisitTime) {
      return true; // First time visitor
    }

    try {
      const lastVisit = new Date(parseInt(lastVisitTime));
      const now = new Date();
      const daysDiff = (now.getTime() - lastVisit.getTime()) / (1000 * 3600 * 24);
      
      // Show popup if more than 30 days have passed
      return daysDiff >= 30;
    } catch (error) {
      console.error('Error calculating time difference:', error);
      return true; // Show popup if there's an error
    }
  }

  recordVisit() {
    try {
      localStorage.setItem('subscribeLastVisit', new Date().getTime().toString());
    } catch (error) {
      console.error('Error recording visit time:', error);
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  subscribeToNewsletter() {
    const email = this.emailInput.value.trim();
    
    if (!email) {
      this.showError('Please enter your email address');
      return;
    }
    
    if (!this.validateEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    // Store that user has subscribed
    localStorage.setItem('subscribeDismissed', 'subscribed');
    this.hideContainer();
    
    // You can add additional logic here like:
    // - Making an API call to your newsletter service
    // - Showing a success message
    // - Redirecting to a thank you page
    console.log('User subscribed with email:', email);
    
    // Optional: Show success message before hiding
    // this.showSuccess('Thank you for subscribing!');
  }

  showError(message) {
    // Remove existing error message
    const existingError = this.subscribeContainer.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message tw-text-red-500 tw-text-sm tw-mt-xs';
    errorDiv.textContent = message;
    
    const emailContainer = this.emailInput.parentElement;
    emailContainer.appendChild(errorDiv);
    
    // Add error styling to input
    this.emailInput.classList.add('tw-border-red-500');
    
    // Remove error styling after 3 seconds
    setTimeout(() => {
      this.emailInput.classList.remove('tw-border-red-500');
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 3000);
  }

  showSuccess(message) {
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message tw-text-green-500 tw-text-sm tw-mt-xs';
    successDiv.textContent = message;
    
    const emailContainer = this.emailInput.parentElement;
    emailContainer.appendChild(successDiv);
    
    // Hide after 2 seconds
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, 2000);
  }

  dismissSubscribe() {
    localStorage.setItem('subscribeDismissed', 'dismissed');
    this.hideContainer();
  }

  hideContainer() {
    if (typeof gsap !== 'undefined') {
      gsap.to(this.subscribeContainer, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          this.subscribeContainer.style.display = 'none';
          this.enableScroll(); // Re-enable scroll when hidden
        }
      });
    } else {
      // Fallback without GSAP
      this.subscribeContainer.style.opacity = '0';
      setTimeout(() => {
        this.subscribeContainer.style.display = 'none';
        this.enableScroll(); // Re-enable scroll when hidden
      }, 300);
    }
  }

  showContainer() {
    console.log('showContainer called');
    
    // Disable scroll when popup opens
    this.disableScroll();
    
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
      console.log('GSAP is available, using GSAP animation');
      gsap.set(this.subscribeContainer, {
        opacity: 0,
        display: "flex",
      });

      gsap.to(this.subscribeContainer, {
        delay: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else {
      console.log('GSAP not available, using fallback');
      // Fallback without GSAP
      this.subscribeContainer.style.display = 'flex';
      
      setTimeout(() => {
        this.subscribeContainer.style.opacity = '1';
      }, 100);
    }
  }

  disableScroll() {
    try {
      // Store current scroll position
      this.scrollPosition = window.pageYOffset;
      
      // Add styles to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
    } catch (error) {
      console.error('Error disabling scroll:', error);
    }
  }

  enableScroll() {
    try {
      // Remove scroll prevention styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      if (this.scrollPosition !== undefined) {
        window.scrollTo(0, this.scrollPosition);
      }
    } catch (error) {
      console.error('Error enabling scroll:', error);
    }
  }
}

customElements.define('subscribe-form', SubscribeForm);
