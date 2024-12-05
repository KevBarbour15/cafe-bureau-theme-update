class VariantSelector {
  constructor() {
    this.form = document.querySelector('#product-form');
    this.variantSelectors = document.querySelectorAll('.variant-selector');
    this.variantIdInput = document.querySelector('input[name="id"]');
    this.variantError = document.querySelector('.variant-error');
    this.variants = JSON.parse(document.querySelector('[data-variants]').textContent);
    
    this.initializeSelectors();
  }

  initializeSelectors() {
    this.variantSelectors.forEach(selector => {
      selector.addEventListener('change', () => this.onVariantChange());
    });
  }

  onVariantChange() {
    const selectedOptions = Array.from(this.variantSelectors)
      .filter(input => input.checked)
      .map(input => input.value);

    const variant = this.findVariant(selectedOptions);

    if (variant) {
      this.variantIdInput.value = variant.id;
      this.variantError.classList.add('tw-hidden');
      this.form.querySelector('button[type="submit"]').disabled = !variant.available;
    } else {
      this.variantError.classList.remove('tw-hidden');
      this.form.querySelector('button[type="submit"]').disabled = true;
    }
  }

  findVariant(selectedOptions) {
    return this.variants.find(variant => 
      variant.options.every((option, index) => 
        option === selectedOptions[index]
      )
    );
  }
}

// Initialize the variant selector
document.addEventListener('DOMContentLoaded', () => {
  new VariantSelector();
}); 