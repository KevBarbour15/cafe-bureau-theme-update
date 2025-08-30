class MailchimpSubscribe extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.form = this.shadowRoot.querySelector("form");
    this.emailInput = this.shadowRoot.querySelector("input[type='email']");
    this.messageBox = this.shadowRoot.querySelector(".message");

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = this.emailInput.value.trim();
    if (!email) {
      this.showMessage("Please enter a valid email address.", "error");
      return;
    }

    //const audienceId = this.getAttribute("data-audience-id");
    const audienceId = "d5c3f80b7d"
    //const audienceId = "d5c3f80b7d"
    //const serverPrefix = this.getAttribute("data-server-prefix");
    const serverPrefix = "us18"

    //const apiKey = this.getAttribute("data-api-key");
    const apiKey = "d2bace65ec659fba079b4b0e88545202-us18"

    try {
      const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `apikey ${apiKey}`
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed"
        })
      });

      if (response.status === 200 || response.status === 201) {
        this.showMessage("Thanks for subscribing!", "success");
        this.form.reset();
      } else {
        const data = await response.json();
        this.showMessage(data.detail || "Something went wrong. Try again.", "error");
      }
    } catch (err) {
      this.showMessage("Network error. Please try later.", "error");
    }
  }

  showMessage(msg, type) {
    this.messageBox.textContent = msg;
    this.messageBox.className = `message ${type}`;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: flex;
          gap: 0.5rem;
        }
        input[type="email"] {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          padding: 0.5rem 1rem;
          background: black;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .message {
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        .message.success { color: green; }
        .message.error { color: red; }
      </style>
      <form novalidate>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
      <div class="message"></div>
    `;
  }
}

customElements.define("mailchimp-subscribe", MailchimpSubscribe);
