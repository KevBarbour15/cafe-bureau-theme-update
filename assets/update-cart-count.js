class UpdateCartCount extends HTMLElement {
  constructor() {
    super();
    this.currentCartCount;
  }
    
  connectedCallback() {
    // Get initial cart count from the span element
    const cartCountSpan = this.querySelector('#cart-count');
    this.currentCartCount = parseInt(cartCountSpan?.textContent || '0');

    window.SLIDECART_UPDATED = (cart) => {
      this.cartCount = cart.item_count;
      if (this.cartCount !== this.currentCartCount) {
        this.currentCartCount = this.cartCount;
        this.updateCount();
      }
    };
  }

  updateCount() {
    const cartCountSpan = this.querySelector('#cart-count');
    if (cartCountSpan) {
      cartCountSpan.textContent = this.currentCartCount;
    }
  }
}

customElements.define('update-cart-count', UpdateCartCount);
