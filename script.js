document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------
    // Helpers
    // -----------------------------
    const CART_KEY = "cart";
    const CONTACT_STORAGE_KEY = "contactSubmissions";
  
    function showMessage(message) {
      alert(message);
    }
  
    function getCart() {
      return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
    }
  
    function saveCart(cart) {
      sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  
    function clearCartStorage() {
        alert("Your Cart is now empty.")
      sessionStorage.removeItem(CART_KEY);
    }
  
    function formatPrice(price) {
      return `$${price.toFixed(2)}`;
    }
  
    // -----------------------------
    // Mobile nav
    // -----------------------------
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
  
    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            nav.classList.toggle("open");
            menuButton.classList.toggle("open"); // 👈 ADD THIS
          
            const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!isExpanded));
          });
    }
  
    // -----------------------------
    // Community subscribe
    // -----------------------------
    const newsletterForm = document.querySelector("#communityNewsletterForm");
    const newsletterSuccess = document.querySelector("#newsletterSuccess");
  
    if (newsletterForm && newsletterSuccess) {
      newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const emailInput = newsletterForm.querySelector("#newsletter-email");
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!emailValue) {
          showMessage("Please enter your email address.");
          return;
        }
  
        if (!emailRegex.test(emailValue)) {
          showMessage("Please enter a valid email address.");
          return;
        }
  
        showMessage("Thank you for subscribing.");
        newsletterForm.style.display = "none";
        newsletterSuccess.classList.remove("hidden");
      });
    }
  
    // -----------------------------
    // Product catalog for gallery
    // -----------------------------
    const products = [
      {
        id: 1,
        title: "Brie Mine 4Ever",
        description: "A book for cheese lovers.",
        price: 12.99,
        image: "static/Client3_Book1.png",
        alt: "Brie Mine 4Ever, a book for cheese lovers"
      },
      {
        id: 2,
        title: "Glory Riders",
        description: "A book about bikers.",
        price: 14.99,
        image: "static/Client3_Book2.png",
        alt: "Glory Riders, a book about bikers"
      },
      {
        id: 3,
        title: "Sorcerer’s Shadowed Chronicles",
        description: "A fantasy book.",
        price: 16.99,
        image: "static/Client3_Book3.png",
        alt: "Sorcerer's Shadowed Chronicles, a fantasy book"
      },
      {
        id: 4,
        title: "Ball",
        description: "A magazine about pickleball.",
        price: 5.99,
        image: "static/Client3_Magazine1.png",
        alt: "Ball magazine about pickleball"
      },
      {
        id: 5,
        title: "Travel",
        description: "A magazine for travelers.",
        price: 6.99,
        image: "static/Client3_Magazine2.png",
        alt: "Travel magazine for travelers"
      },
      {
        id: 6,
        title: "Eat.",
        description: "A magazine for foodies.",
        price: 6.99,
        image: "static/Client3_Magazine3.png",
        alt: "Eat magazine for foodies"
      },
      {
        id: 7,
        title: "Canvas Tote Bag",
        description: "A tote bag for book lovers.",
        price: 18.0,
        image: "static/Client3_ToteBag.png",
        alt: "Canvas tote bag with all I do is read text"
      },
      {
        id: 8,
        title: "Notebook",
        description: "A branded notebook for readers and writers.",
        price: 9.99,
        image: "static/Client3_Notebook.png",
        alt: "Book Haven Bookstore notebook"
      },
      {
        id: 9,
        title: "Sticker Set",
        description: "A set of four reading-themed stickers.",
        price: 4.99,
        image: "static/Client3_Stickers.png",
        alt: "Book Haven Bookstore sticker set"
      }
    ];
  
    // -----------------------------
    // Gallery / cart
    // -----------------------------
    let cart = getCart();
  
    const galleryGrid = document.querySelector("#galleryGrid");
    const cartItemsContainer = document.querySelector("#cartItems");
    const cartCount = document.querySelector("#cartCount");
    const cartTotal = document.querySelector("#cartTotal");
    const clearCartButton = document.querySelector(".clear-cart");
    const processOrderButton = document.querySelector(".process-order");
  
    const orderModal = document.querySelector("#orderModal");
    const closeModalBtn = document.querySelector("#closeModalBtn");
    const startNewOrderBtn = document.querySelector("#startNewOrderBtn");
    const modalOrderItems = document.querySelector("#modalOrderItems");
    const modalOrderTotal = document.querySelector("#modalOrderTotal");
  
    function getCartItem(productId) {
      return cart.find((item) => item.id === productId);
    }
  
    function getCartCount() {
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  
    function getCartTotal() {
      return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  
    function syncCartStorage() {
      if (cart.length > 0) {
        saveCart(cart);
      } else {
        clearCartStorage();
      }
    }
  
    function addToCart(productId) {
      const existingItem = getCartItem(productId);
  
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const product = products.find((item) => item.id === productId);
        if (product) {
          cart.push({ ...product, quantity: 1 });
        }
      }
  
      syncCartStorage();
      renderProducts();
      renderCart();
    }
  
    function increaseQuantity(productId) {
      const item = getCartItem(productId);
      if (!item) return;
  
      item.quantity += 1;
      syncCartStorage();
      renderProducts();
      renderCart();
    }
  
    function decreaseQuantity(productId) {
      const item = getCartItem(productId);
      if (!item) return;
  
      item.quantity -= 1;
  
      if (item.quantity <= 0) {
        cart = cart.filter((cartItem) => cartItem.id !== productId);
      }
  
      syncCartStorage();
      renderProducts();
      renderCart();
    }
  
    function removeFromCart(productId) {
      cart = cart.filter((item) => item.id !== productId);
      syncCartStorage();
      renderProducts();
      renderCart();
    }
  
    function resetCart() {
      cart = [];
      syncCartStorage();
      renderProducts();
      renderCart();
    }
  
    function renderProducts() {
      if (!galleryGrid) return;
  
      galleryGrid.innerHTML = "";
  
      products.forEach((product) => {
        const cartItem = getCartItem(product.id);
        const quantity = cartItem ? cartItem.quantity : 0;
  
        const card = document.createElement("article");
        card.classList.add("gallery-card");
  
        let actionMarkup = `
          <button type="button" class="btn add-to-cart" data-id="${product.id}">
            Add to Cart
          </button>
        `;
  
        if (quantity > 0) {
          actionMarkup = `
            <div class="card-quantity-controls">
              <button type="button" class="qty-btn card-decrease-btn" data-id="${product.id}">−</button>
              <span>${quantity}</span>
              <button type="button" class="qty-btn card-increase-btn" data-id="${product.id}">+</button>
            </div>
          `;
        }
  
        card.innerHTML = `
          <img src="${product.image}" alt="${product.alt}">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p class="price">${formatPrice(product.price)}</p>
          ${actionMarkup}
        `;
  
        galleryGrid.appendChild(card);
      });
  
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.id);
          addToCart(productId);
        });
      });
  
      document.querySelectorAll(".card-increase-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.id);
          increaseQuantity(productId);
        });
      });
  
      document.querySelectorAll(".card-decrease-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.id);
          decreaseQuantity(productId);
        });
      });
    }
  
    function renderCart() {
      if (!cartItemsContainer || !cartCount || !cartTotal) return;
  
      cartCount.textContent = getCartCount();
      cartTotal.textContent = formatPrice(getCartTotal());
  
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
        return;
      }
  
      cartItemsContainer.innerHTML = "";
  
      cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
  
        cartItem.innerHTML = `
          <div class="cart-item-main">
            <div class="cart-item-info">
              <h3>${item.title}</h3>
              <p>${formatPrice(item.price)} each</p>
              <p>Subtotal: ${formatPrice(item.price * item.quantity)}</p>
            </div>
  
            <div class="cart-item-actions">
              <button type="button" class="remove-item-btn" data-id="${item.id}" aria-label="Remove ${item.title} from cart">&times;</button>
              <div class="cart-quantity-controls">
                <button type="button" class="qty-btn decrease-btn" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button type="button" class="qty-btn increase-btn" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        `;
  
        cartItemsContainer.appendChild(cartItem);
      });
  
      document.querySelectorAll(".increase-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.id);
          increaseQuantity(productId);
        });
      });
  
      document.querySelectorAll(".decrease-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.id);
          decreaseQuantity(productId);
        });
      });
  
      document.querySelectorAll(".remove-item-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = Number(button.dataset.id);
          removeFromCart(productId);
        });
      });
    }
  
    function openOrderModal() {
      if (!orderModal || !modalOrderItems || !modalOrderTotal) return;
  
      modalOrderItems.innerHTML = "";
  
      cart.forEach((item) => {
        const modalItem = document.createElement("div");
        modalItem.classList.add("modal-item");
  
        modalItem.innerHTML = `
          <div class="modal-item-text">
            <h3>${item.title}</h3>
            <p>${item.quantity}x &nbsp; ${formatPrice(item.price)}</p>
          </div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        `;
  
        modalOrderItems.appendChild(modalItem);
      });
  
      modalOrderTotal.textContent = formatPrice(getCartTotal());
      orderModal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    }
  
    function closeOrderModal() {
      if (!orderModal) return;
      orderModal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }
  
    if (clearCartButton) {
      clearCartButton.addEventListener("click", () => {
        resetCart();
      });
    }
  
    if (processOrderButton) {
      processOrderButton.addEventListener("click", () => {
        if (cart.length === 0) {
          showMessage("Your cart is empty.");
          return;
        }
        openOrderModal();
      });
    }
  
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeOrderModal);
    }
  
    if (startNewOrderBtn) {
      startNewOrderBtn.addEventListener("click", () => {
        closeOrderModal();
        resetCart();
      });
    }
  
    if (orderModal) {
      orderModal.addEventListener("click", (event) => {
        if (event.target === orderModal) {
          closeOrderModal();
        }
      });
    }
  
    // -----------------------------
    // About / contact form -> localStorage
    // -----------------------------
    const contactForm = document.querySelector("#contactForm");
  
    if (contactForm) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!name || !email || !message) {
          showMessage("Please fill out all fields.");
          return;
        }
  
        if (!emailRegex.test(email)) {
          showMessage("Please enter a valid email address.");
          return;
        }
  
        const contactEntry = {
          name,
          email,
          message,
          submittedAt: new Date().toISOString()
        };
  
        const existingContacts = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY)) || [];
        existingContacts.push(contactEntry);
        localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(existingContacts));
  
        showMessage("Thank you for your message.");
        contactForm.reset();
      });
    }
  
    // -----------------------------
    // Initial render
    // -----------------------------
    renderProducts();
    renderCart();



  });