let userObj = JSON.parse(sessionStorage.getItem("currentUser"));
let productsInCartComponent = document.getElementById(
  "productsInCartComponent"
);
const apiBaseUrl = "http://localhost:3000"; // Adjust if your JSON server runs on different port
let totalDiscountConatiner = document.getElementById("totalDiscountConatiner");
// let totalAfterDiscount = 0;
// let totalBeforeDiscount = 0;
console.log(userObj);

function checkCart(cart) {
  if (cart.length > 0) {
    return true;
  } else {
    return false;
  }
}
function renderOrderSummary() {}
// Global variables

let cart = []; // This will store our local copy of the cart

// Initialize cart on page load
async function initializeCart() {
  try {
    const response = await fetch(`${apiBaseUrl}/users/${userObj.id}`);
    const userData = await response.json();
    cart = userData.cart || [];

    // Render all cart items
    productsInCartComponent.innerHTML = "";
    if (cart.length > 0) {
      cart.forEach((product) => renderProduct(product));
      // Initialize order summary
      updateOrderSummary(cart);
    } else {
      showEmptyCart();
    }
  } catch (error) {
    console.error("Error loading cart:", error);
    showNotification("Failed to load cart", "error");
  }
}

// Render a single product
function renderProduct(productToRender) {
  // Create unique ID combining product ID, size, and random string
  const uniqueId = `${productToRender.id}-${
    productToRender.size
  }-${Math.random().toString(36).substring(2, 6)}`;

  productsInCartComponent.innerHTML += `
    <div class="row" data-unique-id="${uniqueId}" data-product-id="${productToRender.id}">
      <div class="col-12 d-flex gap-2">
        <div class="imgContainerCart rounded-4">
          <img src="${productToRender.image}" alt="${productToRender.title}" />
        </div>
        <div class="productInfoCart w-100">
          <div class="d-flex justify-content-between align-items-center">
            <p class="fw-bolder productName">${productToRender.title}</p>
            <button class="trashBtn" data-unique-id="${uniqueId}">
              <i class="fa-solid fa-trash-can text-danger"></i>
            </button>
          </div>
          <p class="productSize">
            Size: <span class="text-body-secondary">${productToRender.size}</span>
          </p>
          <div class="row justify-content-between">
            <div class="col-4">
              <h5 class="productPrice">$${productToRender.price}</h5>
            </div>
            <div class="IncDecCustom col-4 px-3 d-flex justify-content-between align-items-center">
              <i class="fa-solid fa-minus customIncDec decrease-btn" data-unique-id="${uniqueId}"></i>
              <p class="pt-3 quantity" data-unique-id="${uniqueId}">${productToRender.quantity}</p>
              <i class="fa-solid fa-plus customIncDec increase-btn" data-unique-id="${uniqueId}"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="hrLine m-auto my-4"></div>
    </div>`;
}

// Main event handler for cart interactions
productsInCartComponent.addEventListener("click", async (e) => {
  const uniqueId =
    e.target.getAttribute("data-unique-id") ||
    e.target.closest("[data-unique-id]")?.getAttribute("data-unique-id");

  if (!uniqueId) return;

  // Extract product info from uniqueId (format: "id-size-random")
  const [productId, size] = uniqueId.split("-");

  if (e.target.classList.contains("increase-btn")) {
    await updateQuantity(uniqueId, productId, size, 1);
  } else if (e.target.classList.contains("decrease-btn")) {
    await updateQuantity(uniqueId, productId, size, -1);
  } else if (e.target.closest(".trashBtn")) {
    await removeProduct(uniqueId, productId, size);
  }
});

// Handle quantity updates
async function updateQuantity(uniqueId, productId, size, change) {
  try {
    const quantityElement = document.querySelector(
      `.quantity[data-unique-id="${uniqueId}"]`
    );
    if (!quantityElement) return;

    let currentQuantity = parseInt(quantityElement.textContent);
    let newQuantity = currentQuantity + change;

    // Don't allow quantities below 1
    if (newQuantity < 1) newQuantity = 1;

    // Optimistically update UI
    quantityElement.textContent = newQuantity;

    // Find the product in our local cart copy
    const productIndex = cart.findIndex(
      (item) => item.id === productId && item.size === size
    );

    if (productIndex !== -1) {
      // Update local cart
      cart[productIndex].quantity = newQuantity;

      // Update db.json
      const success = await saveCartToStorage(cart);

      if (!success) {
        // Revert UI if save failed
        quantityElement.textContent = currentQuantity;
        throw new Error("Failed to save cart");
      }

      // Update the order summary after successful quantity update
      updateOrderSummary(cart);
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    showNotification("Failed to update quantity", "error");
  }
}

// Handle product removal
async function removeProduct(uniqueId, productId, size) {
  try {
    // Optimistically remove from UI
    const productElement = document.querySelector(
      `[data-unique-id="${uniqueId}"]`
    );
    if (productElement) {
      productElement.style.transition = "opacity 0.3s ease";
      productElement.style.opacity = "0";

      await new Promise((resolve) => {
        productElement.addEventListener("transitionend", resolve, {
          once: true,
        });
      });

      productElement.remove();
    }

    // Update local cart
    cart = cart.filter(
      (item) => !(item.id === productId && item.size === size)
    );

    // Update db.json
    const success = await saveCartToStorage(cart);

    if (!success) throw new Error("Failed to update cart");

    // Update order summary
    updateOrderSummary(cart);

    // Show empty cart if needed
    if (cart.length === 0) {
      showEmptyCart();
    }

    showNotification("Product removed", "success");
  } catch (error) {
    console.error("Error removing product:", error);

    // Revert UI if error occurred
    if (productElement) {
      productElement.style.opacity = "1";
      productsInCartComponent.appendChild(productElement);
    }

    showNotification("Failed to remove product", "error");
  }
}

// Save cart to db.json
async function saveCartToStorage(updatedCart) {
  try {
    const response = await fetch(`${apiBaseUrl}/users/${userObj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userObj,
        cart: updatedCart,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error saving cart:", error);
    return false;
  }
}

// Show empty cart state
function showEmptyCart() {
  productsInCartComponent.innerHTML = `
    <div class="text-center py-5">
      <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
      <h5 class="text-muted">Your cart is empty</h5>
      <a href="../index.html" class="btn btn-dark rounded-pill mt-3">Continue Shopping</a>
    </div>
  `;
}
function calculateDiscountPercentage(originalPrice, discountedPrice) {
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;
  return Math.round(discountPercentage); // Rounds to nearest whole number
}
function updateOrderSummary(cartItems) {
  // Initialize totals
  let totalAfterDiscount = 0;
  let totalBeforeDiscount = 0;

  // Calculate totals for all items in cart
  cartItems.forEach((item) => {
    totalAfterDiscount += Number(item.price) * Number(item.quantity);
    totalBeforeDiscount +=
      Number(item.priceBeforeDiscount) * Number(item.quantity);
  });

  // Format numbers for display
  const formattedSubtotal = (
    Math.round(totalBeforeDiscount * 100) / 100
  ).toFixed(2);
  const formattedDiscount = (
    Math.round((totalBeforeDiscount - totalAfterDiscount) * 100) / 100
  ).toFixed(2);
  const formattedTotal = (Math.round(totalAfterDiscount * 100) / 100).toFixed(
    2
  );

  // Update the HTML
  totalDiscountConatiner.innerHTML = `
    <p class="fw-bolder productName">Order Summary</p>
    <div class="lead">
      <p>Subtotal<span class="fw-bold float-end">$${formattedSubtotal}</span></p>
      <p>
        Discount (<span class="text-danger">-${calculateDiscountPercentage(
          formattedSubtotal,
          formattedTotal
        )}%</span>)
        <span class="fw-bold float-end text-danger">-$${formattedDiscount}</span>
      </p>
      <p>Delivery Fee <span class="fw-bold float-end">$0</span></p>
    </div>
    <div class="hrLine m-auto my-4"></div>
    <p class="lead">Total <span class="fw-bold float-end">$${formattedTotal}</span></p>
    <div class="d-flex justify-content-center align-items-center gap-2">
      <div class="input-group">
        <span class="input-group-text discountSticker" id="basic-addon1">
          <i class="fa-solid fa-tag"></i>
        </span>
        <input
          type="text"
          class="form-control inputDiscount"
          placeholder="Add Promo Code"
          aria-label="discount"
          aria-describedby="basic-addon1"
        />
      </div>
      <button class="btn btn-dark btnApply">Apply</button>
    </div>
    <button class="btn btn-dark btnCheckout">
      Go to Checkout <i class="fa-solid fa-arrow-right"></i>
    </button>
  `;
}
// Initialize the cart when page loads
document.addEventListener("DOMContentLoaded", initializeCart);
async function fetchUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const user = await response.json();
    console.log("Fetched User:", user.cart);

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Re-throw for further handling
  }
}

fetchUser(userObj.id);
function checkIfUserLoggedIn() {
  let sessionUser = sessionStorage.getItem("currentUser");
  if (JSON.parse(sessionUser) != null) {
    signOutDropDown.innerHTML = `<div class="dropdown">
                <a
                  class="btn btn-dark dropdown-toggle btn-user-dropdown"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-user"></i>
                </a>

                <ul class="dropdown-menu p-3">
                  <li class="px-2 pb-3">Hello ${
                    JSON.parse(sessionUser).name
                  }</li>
                  <li class="">
                    <button class="btn btn-dark btn-user-dropdown w-100 py-2 px-3" id="signOutBtn">Sign Out</button>
                  </li>
                </ul>
              </div>`;
    let signOutBtn = document.getElementById("signOutBtn");

    signOutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("currentUser");
      location.reload();
    });
  } else {
    signOutDropDown.innerHTML = `<li class="custom-nav-item" id="loginBtn">
              <a
                href="./Login.html"
                class="custom-nav-link btn btn-dark nav-btns"
                >Login</a
              >
            </li>
            <li class="custom-nav-item" id="registerBtn">
              <a
                href="./Register.html"
                class="custom-nav-link btn btn-dark nav-btns"
                >Register</a
              >
            </li>`;
  }
}
// console.log(JSON.parse(sessionStorage.getItem("currentUser")));
window.onload = function () {
  // Your code here
  checkIfUserLoggedIn();
};
