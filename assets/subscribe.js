class SubscribeForm extends HTMLElement {
  connectedCallback() {
    // Check if user already dismissed the popup
    if (localStorage.getItem('subscribeDismissed') === 'true') {
      return;
    }

    this.subscribeContainer = this.querySelector('#subscribe-container');
    this.declineButton = this.querySelector('#decline-button');
    this.subscribeButton = this.querySelector('#subscribe-button');



    if (this.declineButton) {
      this.declineButton.addEventListener('click', () => {
        localStorage.setItem('subscribeDismissed', 'true');
        this.hideContainer();
      });
    }
    if (this.subscribeButton) {
      this.subscribeButton.addEventListener('click', () => this.handleSubscribe());
    }


    


    // Animate the modal content
    const modalContent = this.querySelector('.modal-content');
    setTimeout(() => {
      this.subscribeContainer.classList.remove('tw-opacity-0');
      this.subscribeContainer.classList.remove('tw-hidden');
      this.subscribeContainer.classList.add('tw-flex');

      gsap.set(modalContent, {
        opacity: 0, y: 100,
      })
    
      gsap.to(modalContent, {
        duration: 1,
        ease: 'power4.inOut',
        opacity: 1,
        y: 0,
      });

    }, 5000);

  }

  hideContainer() {
    const modalContent = this.querySelector('.modal-content');
    gsap.to(modalContent, {
      opacity: 0,
      y: 100,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        this.subscribeContainer.classList.add('tw-opacity-0');
        this.subscribeContainer.classList.add('tw-hidden');
        this.subscribeContainer.classList.remove('tw-flex');
        document.body.classList.remove('tw-overflow-hidden');
      },
    });
  }

  handleSubscribe() {
    const successResponse = this.querySelector('#mce-success-response');
    const errorResponse = this.querySelector('#mce-error-response');

    const observer = new MutationObserver(() => {
      if (successResponse && successResponse.style.display !== 'none') {
        localStorage.setItem('subscribeDismissed', 'true');
        setTimeout(() => this.hideContainer(), 3000);
        observer.disconnect();
      }
      if (errorResponse && errorResponse.style.display !== 'none') {
        observer.disconnect(); // keep modal open
      }
    });
    observer.observe(this.querySelector('#mce-responses'), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    });
  }
}

customElements.define('subscribe-form', SubscribeForm);
