class ProductVariantSelector extends HTMLElement {
  constructor() {
    super();
    this._currentVariantId = this.dataset.currentVariant;

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeVariant());
    } else {
      this.initializeVariant();
    }
  }

  // Add getter and setter for currentVariantId
  get currentVariantId() {
    return this._currentVariantId;
  }

  set currentVariantId(value) {
    this._currentVariantId = value;
    // Update styles whenever currentVariantId changes
    const activeButton = this.querySelector(`.size-swatch[data-variant-id="${value}"]`);
    if (activeButton) {
      this.updateButtonStyles(activeButton);
    }
  }

  updateButtonStyles(activeButton) {
    const allButtons = this.querySelectorAll('.size-swatch');

    allButtons.forEach(btn => {
      // Reset all buttons first
      btn.style.backgroundColor = '#fff';
      btn.style.color = '#000';
      btn.style.borderRadius = '50px';
      btn.classList.remove('active');
    });

    // Then set active button styles
    if (activeButton) {
      activeButton.style.borderRadius = '0px';
      activeButton.style.backgroundColor = '#000';
      activeButton.style.color = '#fff';
      activeButton.classList.add('active');
    } 
    
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      const button = e.target.closest('.size-swatch');
      if (!button || button.disabled) return;

      e.preventDefault();
      const newVariantId = button.dataset.variantId;

      this.currentVariantId = newVariantId;

      this.updateButtonStyles(button);

      const url = new URL(window.location);
      url.searchParams.set('variant', newVariantId);
      window.history.replaceState({}, '', url);

      // Update variant input in form
      const variantInput = document.querySelector('input[name="id"]');
      if (variantInput) {
        variantInput.value = newVariantId;
        variantInput.disabled = button.dataset.available !== 'true';
      }

      // Dispatch event for other components
      this.dispatchEvent(new CustomEvent('variant:changed', {
        detail: {
          variantId: newVariantId,
          available: button.dataset.available === 'true',
          activeVariant: newVariantId
        },
        bubbles: true
      }));
    });
  }

  initializeVariant() {
    const variantInput = document.querySelector('input[name="id"]');
    if (variantInput) {
      variantInput.value = this.currentVariantId;

      // Find the active button and update styles
      const activeButton = this.querySelector(`.size-swatch[data-variant-id="${this.currentVariantId}"]`);
      if (activeButton) {
        this.updateButtonStyles(activeButton);
      }
    }
  }
}

customElements.define('product-variant-selector', ProductVariantSelector); 