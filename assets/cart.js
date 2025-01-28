// Add this at the top of the file to verify the event system
console.log('PUB_SUB_EVENTS available:', PUB_SUB_EVENTS);
console.log('publish function available:', typeof publish);
console.log('subscribe function available:', typeof subscribe);

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();
    console.log('CartItems constructor called');
    this.lineItemStatusElement =
      document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener('change', debouncedOnChange.bind(this));

    // Listen for form submissions that might add items to cart
    document.addEventListener('submit', (event) => {
      if (event.target.matches('form[action*="/cart/add"]')) {
        console.log('Form submission intercepted');
        event.preventDefault();
        const formData = new FormData(event.target);
        
        fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          console.log('Add to cart response received');
          return response.json();
        })
        .then(data => {
          console.log('Item added to cart:', data);
          try {
            // Try both direct DOM update and event publishing
            const cartCountElements = document.querySelectorAll('#cart-count');
            cartCountElements.forEach(element => {
              element.textContent = data.items ? data.items.length : '0';
            });
            
            // Manually trigger cart update
            console.log('Publishing cart update event');
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: data });
            
            // Also try fetching current cart state
            return fetch(`${routes.cart_url}.js`);
          } catch (error) {
            console.error('Error in cart update handling:', error);
          }
        })
        .then(response => response.json())
        .then(cartData => {
          console.log('Current cart state:', cartData);
          const cartCountElements = document.querySelectorAll('#cart-count');
          cartCountElements.forEach(element => {
            element.textContent = cartData.item_count;
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });

    // Add additional listener for AJAX add to cart if present
    document.addEventListener('click', (event) => {
      const addToCartButton = event.target.closest('[data-add-to-cart]');
      if (addToCartButton) {
        console.log('Add to cart button clicked');
        event.preventDefault();
        const form = addToCartButton.closest('form');
        if (form) {
          const formData = new FormData(form);
          fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(data => {
            console.log('Item added to cart via AJAX:', data);
            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: data });
          })
          .catch(error => console.error('Error:', error));
        }
      }
    });

    this.updateCartCount = (count) => {
      const cartCountElements = document.querySelectorAll('#cart-count');
      cartCountElements.forEach(element => {
        element.textContent = count;
      });
      
      const cartIcon = document.getElementById('cart-icon');
      if (cartIcon) {
        cartIcon.style.display = count > 0 ? 'flex' : 'none';
      }
    };
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    console.log('CartItems connected');
    try {
      this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
        console.log('Cart update event received:', event);
        this.onCartUpdate();
      });
      console.log('Successfully subscribed to cart updates');
    } catch (error) {
      console.error('Error subscribing to cart updates:', error);
    }
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  resetQuantityInput(id) {
    const input = this.querySelector(`#Quantity-${id}`);
    input.value = input.getAttribute('value');
    this.isEnterPressed = false;
  }

  setValidity(event, index, message) {
    event.target.setCustomValidity(message);
    event.target.reportValidity();
    this.resetQuantityInput(index);
    event.target.select();
  }

  validateQuantity(event) {
    const inputValue = parseInt(event.target.value);
    const index = event.target.dataset.index;
    let message = '';

    if (inputValue < event.target.dataset.min) {
      message = window.quickOrderListStrings.min_error.replace('[min]', event.target.dataset.min);
    } else if (inputValue > parseInt(event.target.max)) {
      message = window.quickOrderListStrings.max_error.replace('[max]', event.target.max);
    } else if (inputValue % parseInt(event.target.step) !== 0) {
      message = window.quickOrderListStrings.step_error.replace('[step]', event.target.step);
    }

    if (message) {
      this.setValidity(event, index, message);
    } else {
      event.target.setCustomValidity('');
      event.target.reportValidity();
      this.updateQuantity(
        index,
        inputValue,
        document.activeElement.getAttribute('name'),
        event.target.dataset.quantityVariantId
      );
    }
  }

  onChange(event) {
    this.validateQuantity(event);
  }

  onCartUpdate() {
    console.log('onCartUpdate called');
    
    fetch(`${routes.cart_url}.js`)
      .then(response => response.json())
      .then(cart => {
        console.log('Cart data received:', cart);
        const cartCountElements = document.querySelectorAll('#cart-count');
        console.log('Found cart count elements:', cartCountElements.length);
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
        });

        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
          cartIcon.style.display = cart.item_count > 0 ? 'flex' : 'none';
        }
      })
      .catch(error => console.error('Error fetching cart:', error));

    if (this.tagName === 'CART-DRAWER-ITEMS') {
      fetch(`${routes.cart_url}?section_id=cart-drawer`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const selectors = ['cart-drawer-items', '.cart-drawer__footer'];
          for (const selector of selectors) {
            const targetElement = document.querySelector(selector);
            const sourceElement = html.querySelector(selector);
            if (targetElement && sourceElement) {
              targetElement.replaceWith(sourceElement);
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      fetch(`${routes.cart_url}?section_id=main-cart-items`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const sourceQty = html.querySelector('cart-items');
          this.innerHTML = sourceQty.innerHTML;
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section',
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents',
      },
    ];
  }

  updateQuantity(line, quantity, name, variantId) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        
        this.updateCartCount(parsedState.item_count);

        const quantityElement =
          document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
        const items = document.querySelectorAll('.cart-item');

        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute('value');
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector('cart-drawer');
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });
        const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
        let message = '';
        if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement.value)) {
          if (typeof updatedValue === 'undefined') {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem =
          document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`))
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'));
        } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'));
        }

        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cart-items', cartData: parsedState, variantId: variantId });
      })
      .catch(() => {
        this.querySelectorAll('.loading__spinner').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        this.disableLoading(line);
      });
  }

  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item__error-text').textContent = message;

    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus =
      document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading__spinner`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading__spinner`);

    cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
  }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define(
    'cart-note',
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          'input',
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
          }, ON_CHANGE_DEBOUNCE_TIMER)
        );
      }
    }
  );
}

// Add this to your cart update handling code
async function updateQuantity(event) {
  const quantity = event.target.value;
  const id = event.target.dataset.quantityVariantId;
  
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        quantity: quantity
      })
    });

    const cart = await response.json();
    
    // Update cart total
    const cartTable = document.querySelector('.cart-items');
    if (cartTable) {
      cartTable.dataset.cartTotal = cart.total_price;
    }
    
    // Update line item price
    const linePrice = cart.items.find(item => item.variant_id === parseInt(id))?.final_line_price;
    if (linePrice) {
      const linePriceElement = event.target.closest('tr').querySelector('.cart-item__price-wrapper .price--end');
      if (linePriceElement) {
        linePriceElement.innerHTML = formatMoney(linePrice);
      }
    }
    
    // Clear any error messages
    const errorElement = document.querySelector(`#Line-item-error-${event.target.dataset.index}`);
    if (errorElement) {
      errorElement.querySelector('.cart-item__error-text').textContent = '';
      errorElement.classList.remove('active');
    }

  } catch (error) {
    console.error('Error updating cart:', error);
    const errorElement = document.querySelector(`#Line-item-error-${event.target.dataset.index}`);
    if (errorElement) {
      errorElement.querySelector('.cart-item__error-text').textContent = 'Error updating cart';
      errorElement.classList.add('active');
    }
  }
}

// Helper function to format money (adjust according to your shop's currency format)
function formatMoney(cents) {
  return (cents/100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD' // Change this to your shop's currency
  });
}
