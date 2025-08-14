// DOM Elements
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const nav = document.querySelector("nav");
const loaderWrapper = document.querySelector(".loader-wrapper");
const zoomBanner = document.querySelector(".zoom-banner");
const zoomBannerClose = document.getElementById("zoom-banner-close");

// Cart Elements
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");

// Coupon UI
const couponInput = document.getElementById("coupon-code");
const applyCouponBtn = document.getElementById("apply-coupon");
const couponMessage = document.getElementById("coupon-message");
const cartSubtotalPrice = document.getElementById("cart-subtotal-price");
const cartDiscountRow = document.getElementById("cart-discount");
const cartDiscountAmount = document.getElementById("cart-discount-amount");

// Theme toggle
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Reviews
const reviewsSlider = document.getElementById("reviews-slider");
const reviewForm = document.getElementById("review-form");

// Cart State
let cart = JSON.parse(localStorage.getItem("frozenbyveer-cart")) || [];
let appliedCoupon =
  JSON.parse(localStorage.getItem("frozenbyveer-coupon")) || null;
let reviews = JSON.parse(localStorage.getItem("frozenbyveer-reviews")) || [];

// Handle page loading
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 1200);

  const zoomBannerClosed = localStorage.getItem("zoomBannerClosed") === "true";
  if (zoomBannerClosed || window.innerWidth <= 1024) {
    hideBanner();
  }
});

// Create overlay element for mobile menu
const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeCart();
  initTheme();
  initializeReviews();
  setupMobileMenu();
  setupSmoothScroll();
  setupNavbarScroll();
  setupAnimations();
  createBackToTopButton();
  addCardHoverEffects();
});

// Mobile menu functionality
function setupMobileMenu() {
  if (menuBtn && navLinks) {
    function toggleMenu() {
      navLinks.parentElement.classList.toggle("active");
      overlay.classList.toggle("active");
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);

      if (navLinks.parentElement.classList.contains("active")) {
        menuBtn.innerHTML = '<i class="ri-close-line"></i>';
        document.body.style.overflow = "hidden";
      } else {
        menuBtn.innerHTML = '<i class="ri-menu-3-line"></i>';
        document.body.style.overflow = "";
      }
    }

    menuBtn.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav__links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks && navLinks.parentElement.classList.contains("active")) {
        navLinks.parentElement.classList.remove("active");
        overlay.classList.remove("active");
        menuBtn.innerHTML = '<i class="ri-menu-3-line"></i>';
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  });
}

// Smooth scroll functionality
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition - navHeight,
          behavior: "smooth",
        });
      }
    });
  });
}

// Navbar scroll functionality
function setupNavbarScroll() {
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }
}

// Animations setup
function setupAnimations() {
  if (typeof ScrollReveal === "function") {
    const sr = ScrollReveal({
      distance: "60px",
      duration: 1200,
      delay: 200,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      reset: false,
    });

    sr.reveal(".hero__content h1", { origin: "left", delay: 400 });
    sr.reveal(".hero__content p", { origin: "left", delay: 600 });
    sr.reveal(".hero__btn", { origin: "left", delay: 800 });
    sr.reveal(".hero__content .socials", { origin: "left", delay: 1000 });
    sr.reveal(".hero__image img", { origin: "right", delay: 400 });
    sr.reveal(".section__header-wrapper", { origin: "top", distance: "30px" });
    sr.reveal(".popular__card", { origin: "bottom", interval: 200 });
    sr.reveal(".discover__card", { origin: "bottom", interval: 300 });
    sr.reveal(".banner__card", { origin: "bottom", interval: 200, delay: 800 });
    sr.reveal(".review__card", { origin: "bottom", interval: 200 });
  }
}

// Back to top button
function createBackToTopButton() {
  const backToTopBtn = document.createElement("button");
  backToTopBtn.classList.add("back-to-top");
  backToTopBtn.setAttribute("aria-label", "Back to top");
  backToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
  document.body.appendChild(backToTopBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Card hover effects
function addCardHoverEffects() {
  const cards = document.querySelectorAll(
    ".popular__card, .discover__card, .review__card, .banner__card"
  );
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
      card.style.boxShadow = "0 20px 30px rgba(0, 0, 0, 0.1)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
}

// Form validation
function validateForm(event) {
  event.preventDefault();
  const emailInput = document.getElementById("email-input");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailInput || !emailPattern.test(emailInput.value)) {
    emailInput.classList.add("error");
    emailInput.style.animation = "shake 0.5s ease";
    setTimeout(() => {
      emailInput.style.animation = "";
    }, 500);
    return false;
  }

  const form = emailInput.closest("form");
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<i class="ri-check-line"></i> Subscribed!';
      submitBtn.style.backgroundColor = "#2ecc71";
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = "";
        emailInput.value = "";
      }, 3000);
    }
  }
  return false;
}

window.validateForm = validateForm;

// Zoom banner functionality
if (zoomBannerClose && zoomBanner) {
  zoomBannerClose.addEventListener("click", () => {
    hideBanner();
    localStorage.setItem("zoomBannerClosed", "true");
  });
}

function hideBanner() {
  if (zoomBanner) {
    zoomBanner.style.display = "none";
    if (nav) nav.style.top = "0";
    const header = document.querySelector("header");
    if (header) header.style.paddingTop = "80px";
  }
}

// ===== SHOPPING CART FUNCTIONALITY =====

// Initialize cart on page load
function initializeCart() {
  updateCartCount();
  updateCartDisplay();
  setupCartEventListeners();
  setupAddToCartButtons();
  setupCouponChipListeners();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("frozenbyveer-cart", JSON.stringify(cart));
}

// Update cart count in navbar
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (totalItems > 0) {
    cartCount.style.display = "flex";
    cartCount.classList.add("animate");
    setTimeout(() => cartCount.classList.remove("animate"), 600);
  } else {
    cartCount.style.display = "none";
  }
}

// Update cart display
function updateCartDisplay() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="ri-shopping-cart-line"></i>
        <h4>Your cart is empty</h4>
        <p>Add some delicious ice cream to get started!</p>
      </div>
    `;
    cartCheckoutBtn.disabled = true;
  } else {
    cartItems.innerHTML = cart.map((item) => createCartItemHTML(item)).join("");
    cartCheckoutBtn.disabled = false;
  }

  updateCartTotal();
}

// Create HTML for cart item
function createCartItemHTML(item) {
  return `
    <div class="cart-item" data-item-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity('${
              item.id
            }', -1)" ${item.quantity <= 1 ? "disabled" : ""}>
              <i class="ri-subtract-line"></i>
            </button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${
              item.id
            }', 1)">
              <i class="ri-add-line"></i>
            </button>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.id}')">
            <i class="ri-delete-bin-line"></i> Remove
          </button>
        </div>
      </div>
    </div>
  `;
}

// Update cart total
function updateCartTotal() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (cartSubtotalPrice)
    cartSubtotalPrice.textContent = `$${subtotal.toFixed(2)}`;

  // Get discount percentage from applied coupon
  let discountPct = 0;
  if (appliedCoupon && appliedCoupon.code) {
    discountPct = getDiscountPercentage(appliedCoupon.code);
  }

  const discountAmount = discountPct > 0 ? (subtotal * discountPct) / 100 : 0;

  if (cartDiscountRow) {
    if (discountAmount > 0) {
      cartDiscountRow.style.display = "flex";
      if (cartDiscountAmount)
        cartDiscountAmount.textContent = `-$${discountAmount.toFixed(
          2
        )} (${discountPct}% off)`;
    } else {
      cartDiscountRow.style.display = "none";
    }
  }

  const total = Math.max(0, subtotal - discountAmount);
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Setup coupon chip listeners
function setupCouponChipListeners() {
  const couponChips = document.querySelectorAll(".coupon-chip");
  couponChips.forEach((chip) => {
    chip.addEventListener("click", function () {
      const couponCode = this.getAttribute("data-coupon");
      couponInput.value = couponCode;
      applyCoupon(couponCode);
    });
  });
}

// Apply coupon function
function applyCoupon(codeRaw) {
  const code = (codeRaw || "").toUpperCase().trim();
  if (!code) {
    appliedCoupon = null;
    localStorage.removeItem("frozenbyveer-coupon");
    showCouponMessage("Coupon cleared.", "success");
    updateCartTotal();
    return;
  }

  const pct = getDiscountPercentage(code);
  if (pct > 0) {
    appliedCoupon = { code: code, percentage: pct };
    localStorage.setItem("frozenbyveer-coupon", JSON.stringify(appliedCoupon));
    showCouponMessage(`${code} applied! ${pct}% off`, "success");
    updateCartTotal();
  } else {
    showCouponMessage(
      "Invalid coupon code. Try: ICE10, MANGO15, FRESH25, CHOCO20, SWEET30, BERRY10, CRUNCH22, CHOCO35, CHEESE15, STRAWB28, COOKIE20, CLASSIC25",
      "error"
    );
  }
}

// Get discount percentage
function getDiscountPercentage(code) {
  if (!code) return 0;

  // Define all available coupon codes with their discount percentages
  const coupons = {
    ICE10: 10,
    MANGO15: 15,
    FRESH25: 25,
    CHOCO20: 20,
    SWEET30: 30,
    BERRY10: 10,
    CRUNCH22: 22,
    CHOCO35: 35,
    CHEESE15: 15,
    STRAWB28: 28,
    COOKIE20: 20,
    CLASSIC25: 25,
  };

  return coupons[code] || 0;
}

// Show coupon message
function showCouponMessage(msg, type) {
  if (!couponMessage) return;
  couponMessage.textContent = msg;
  couponMessage.className = `coupon-message ${type}`;

  setTimeout(() => {
    couponMessage.textContent = "";
    couponMessage.className = "coupon-message";
  }, 3000);
}

// Add item to cart
function addToCart(itemData) {
  const existingItem = cart.find((item) => item.id === itemData.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: itemData.id,
      name: itemData.name,
      price: parseFloat(itemData.price),
      image: itemData.image,
      quantity: 1,
    });
  }

  saveCart();
  updateCartCount();
  updateCartDisplay();

  // Show success feedback
  showAddToCartFeedback();
}

// Update item quantity
function updateQuantity(itemId, change) {
  const item = cart.find((item) => item.id === itemId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(itemId);
  } else {
    saveCart();
    updateCartCount();
    updateCartDisplay();
  }
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCart();
  updateCartCount();
  updateCartDisplay();
}

// Show add to cart feedback
function showAddToCartFeedback() {
  const feedback = document.createElement("div");
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  feedback.innerHTML = '<i class="ri-check-line"></i> Added to cart!';
  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    feedback.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 300);
  }, 3000);
}

// Setup cart event listeners
function setupCartEventListeners() {
  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartModal.classList.contains("active")) {
      closeCart();
    }
  });

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", handleCheckout);
  }

  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", () =>
      applyCoupon(couponInput.value)
    );
  }

  if (couponInput) {
    couponInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyCoupon(couponInput.value);
      }
    });
  }
}

// Setup add to cart buttons
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = button.closest(".popular__card, .discover__card");
      if (!card) return;

      const itemData = {
        id: card.dataset.itemId,
        name: card.dataset.itemName,
        price: card.dataset.itemPrice,
        image: card.dataset.itemImage,
      };

      addToCart(itemData);
    });
  });
}

// Open cart modal
function openCart() {
  cartModal.classList.add("active");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    const firstFocusable = cartModal.querySelector(
      "button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (firstFocusable) firstFocusable.focus();
  }, 100);
}

// Close cart modal
function closeCart() {
  cartModal.classList.remove("active");
  document.body.style.overflow = "";

  if (cartBtn) cartBtn.focus();
}

// Handle checkout
function handleCheckout() {
  if (cart.length === 0) return;

  const checkoutMessage = document.createElement("div");
  checkoutMessage.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    z-index: 10002;
    max-width: 400px;
    width: 90%;
  `;
  checkoutMessage.innerHTML = `
    <i class="ri-check-line" style="font-size: 3rem; color: #10b981; margin-bottom: 15px;"></i>
    <h3 style="margin: 0 0 10px 0; color: var(--text-dark);">Order Placed!</h3>
    <p style="margin: 0 0 20px 0; color: var(--text-light);">Thank you for your order. Your delicious ice cream will be ready soon!</p>
    <button onclick="this.parentElement.remove()" style="
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    ">Continue Shopping</button>
  `;
  document.body.appendChild(checkoutMessage);

  cart = [];
  saveCart();
  updateCartCount();
  updateCartDisplay();
  closeCart();
}

// ===== REVIEWS FUNCTIONALITY =====

function initializeReviews() {
  renderReviews();
  setupReviewForm();
}

function renderReviews() {
  if (!reviewsSlider) return;

  // Clear existing reviews (keep original ones)
  const existingReviews = reviewsSlider.querySelectorAll(
    ".review__card:not(.original)"
  );
  existingReviews.forEach((review) => review.remove());

  // Add new reviews
  reviews.forEach((review) => {
    const reviewElement = createReviewHTML(review);
    reviewsSlider.appendChild(reviewElement);
  });
}

function createReviewHTML(review) {
  const reviewDiv = document.createElement("div");
  reviewDiv.className = "review__card";

  const stars = Array.from(
    { length: 5 },
    (_, i) => `<i class="ri-star-${i < review.rating ? "fill" : "line"}"></i>`
  ).join("");

  reviewDiv.innerHTML = `
    <div class="review__rating">${stars}</div>
    <p class="review__text">"${review.text}"</p>
    <div class="review__profile">
      <div class="review__avatar">
        <i class="ri-user-fill"></i>
      </div>
      <div class="review__info">
        <h4>${review.name}</h4>
        <p>Customer</p>
      </div>
    </div>
  `;

  return reviewDiv;
}

function setupReviewForm() {
  if (!reviewForm) return;

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewer-name")?.value?.trim();
    const rating = parseInt(
      document.querySelector('input[name="rating"]:checked')?.value || "0"
    );
    const text = document.getElementById("review-text")?.value?.trim();

    if (!name || !rating || !text) {
      alert("Please fill in all fields");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name,
      rating: Math.max(1, Math.min(5, rating)),
      text: text,
      date: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    localStorage.setItem("frozenbyveer-reviews", JSON.stringify(reviews));
    renderReviews();

    // Clear form
    reviewForm.reset();

    // Show success message
    const submitBtn = reviewForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Review Added!";
    submitBtn.style.background = "var(--success-color)";

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = "";
    }, 2000);
  });
}

// ===== THEME TOGGLE FUNCTIONALITY =====

function initTheme() {
  const savedTheme = localStorage.getItem("frozenbyveer-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "ri-moon-line" : "ri-sun-line";
  }
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("frozenbyveer-theme", newTheme);
  updateThemeIcon(newTheme);
}

// Setup theme toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", toggleTheme);
}

// Make cart functions globally available
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.handleCheckout = handleCheckout;
window.applyCoupon = applyCoupon;
