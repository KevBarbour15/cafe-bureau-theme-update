class AdjustCartQuantity extends HTMLElement {
  constructor() {
    super();
    this.increaseQuantityButton = null;
    this.decreaseQuantityButton = null;
    this.quantityInput = null;
    this.updateCartButton = null;
    this.quantity = null;
    this.originalQuantity = null;
    this.productInventory = null;
  }

  connectedCallback() {
    this.increaseQuantityButton = this.querySelector('#increase-quantity');
    this.decreaseQuantityButton = this.querySelector('#decrease-quantity');
    this.quantityInput = this.querySelector('#quantity-input');
    this.updateCartButton = this.querySelector('#update-cart');
    this.productInventory = this.getAttribute('data-product-inventory');

    this.originalQuantity = this.quantityInput.value;
    this.quantity = this.quantityInput.value;

    this.decreaseQuantityButton.addEventListener('click', () => {
      this.decreaseQuantity();
    });

    this.increaseQuantityButton.addEventListener('click', () => {
      this.increaseQuantity();
    });

    this.updateCartButton.addEventListener('click', () => {
      this.updateCart();
    });

    this.adjustButtonVisibility();
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
      this.quantityInput.value = this.quantity;
      this.adjustButtonVisibility();
    }
  }

  increaseQuantity() {
    if (this.quantity < this.productInventory) {
      this.quantity++;
      this.quantityInput.value = this.quantity;
      this.adjustButtonVisibility();
    }
  }

  async updateCart() {
    if (this.quantity !== this.originalQuantity) {
      try {
        const formData = {
          id: this.closest('cart-items').querySelector('[name="id"]').value,
          quantity: parseInt(this.quantity)
        };

        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh the page to show updated cart
        window.location.reload();
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  }

  adjustButtonVisibility() {
    // Disable decrease button at minimum quantity (0)
    if (this.quantity <= 0) {
      this.decreaseQuantityButton.setAttribute('disabled', '');
      this.decreaseQuantityButton.style.cursor = 'not-allowed';
      this.decreaseQuantityButton.style.opacity = '0.3';
    } else {
      this.decreaseQuantityButton.removeAttribute('disabled');
      this.decreaseQuantityButton.style.cursor = 'pointer';
      this.decreaseQuantityButton.style.opacity = '1';
    }

    // Disable increase button at maximum inventory
    if (this.quantity >= this.productInventory) {
      this.increaseQuantityButton.setAttribute('disabled', '');
      this.increaseQuantityButton.style.cursor = 'not-allowed';
      this.increaseQuantityButton.style.opacity = '0.3';
    } else {
      this.increaseQuantityButton.removeAttribute('disabled');
      this.increaseQuantityButton.style.cursor = 'pointer';
      this.increaseQuantityButton.style.opacity = '1';
    }
  }
}
customElements.define('adjust-cart-quantity', AdjustCartQuantity);