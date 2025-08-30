class MailchimpNewsletter {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.options = {
      apiKey: options.apiKey || 'd2bace65ec659fba079b4b0e88545202-us18',
      listId: options.listId || 'd5c3f80b7d',
      server: options.server || 'us18',
      ...options
    };
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupFormState();
  }

  setupFormState() {
    // Add loading state
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.emailInput = this.form.querySelector('input[type="email"]');
    this.errorElement = this.form.querySelector('[id*="error"]');
    this.successElement = this.form.querySelector('[id*="success"]');
    
    // Hide existing error/success messages initially
    if (this.errorElement) this.errorElement.style.display = 'none';
    if (this.successElement) this.successElement.style.display = 'none';
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;
    
    this.setLoadingState(true);
    
    try {
      const response = await this.subscribeToMailchimp();
      this.handleResponse(response);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  validateForm() {
    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      this.showError('Please enter an email address');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      this.showError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }

  async subscribeToMailchimp() {
    const email = this.emailInput.value.trim();
    const url = `https://${this.options.server}.api.mailchimp.com/3.0/lists/${this.options.listId}/members`;
    
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: '', // Can be extended to include first name field
        LNAME: ''  // Can be extended to include last name field
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${this.options.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Subscription failed');
    }

    return await response.json();
  }

  handleResponse(response) {
    this.hideError();
    this.showSuccess();
    this.resetForm();
  }

  handleError(error) {
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.message.includes('Member Exists')) {
      errorMessage = 'This email is already subscribed to our newsletter.';
    } else if (error.message.includes('Invalid Resource')) {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.showError(errorMessage);
  }

  showError(message) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.style.display = 'block';
      this.emailInput.setAttribute('aria-invalid', 'true');
      this.emailInput.setAttribute('aria-describedby', this.errorElement.id);
    }
  }

  hideError() {
    if (this.errorElement) {
      this.errorElement.style.display = 'none';
      this.emailInput.removeAttribute('aria-invalid');
      this.emailInput.removeAttribute('aria-describedby');
    }
  }

  showSuccess() {
    if (this.successElement) {
      this.successElement.style.display = 'block';
      this.successElement.focus();
    }
  }

  resetForm() {
    this.form.reset();
    this.hideError();
  }

  setLoadingState(loading) {
    if (this.submitButton) {
      this.submitButton.disabled = loading;
      this.submitButton.textContent = loading ? 'Subscribing...' : 'Subscribe';
    }
    
    if (this.emailInput) {
      this.emailInput.disabled = loading;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const mailchimpForm = document.getElementById('MailchimpFooter');
  if (mailchimpForm) {
    // These values should be set via Shopify settings or environment variables
    new MailchimpNewsletter('MailchimpFooter', {
      apiKey: window.mailchimpConfig?.apiKey || '',
      listId: window.mailchimpConfig?.listId || '',
      server: window.mailchimpConfig?.server || ''
    });
  }
});
