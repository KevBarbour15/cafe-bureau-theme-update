class UpdateCart extends HTMLElement {
  constructor() {
    super();
    this.cartCount = 0;
  }

  connectedCallback() {
    // SlideCart provides a cartUpdated event
    document.addEventListener('cart:updated', (event) => {
      this.updateCartCount(event.detail.count);
    });

   
  }

  updateCartCount(count) {
    const cartCountElement = this.querySelector('#cart-icon p');
    if (cartCountElement) {
      cartCountElement.textContent = count;
    }
  }
}

customElements.define('update-cart', UpdateCart);