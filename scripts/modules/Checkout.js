let userObj = JSON.parse(sessionStorage.getItem("currentUser"));
let totalDiscountConatiner = document.getElementById("totalDiscountConatiner");
let productsInCartComponent = document.getElementById(
  "productsInCartComponent"
);
let checkoutForm = document.getElementById("checkoutForm");
let placeOrderBtn = document.getElementById("placeOrderBtn");
const apiBaseUrl = "http://localhost:3000";

const formInputs = {
  firstName: document.getElementById("firstNameInput"),
  lastName: document.getElementById("lastNameInput"),
  addressLine1: document.getElementById("addressLine1Input"),
  addressLine2: document.getElementById("addressLine2Input"),
  city: document.getElementById("cityInput"),
  state: document.getElementById("stateInput"),
  zipCode: document.getElementById("zipCodeInput"),
  paymentMethod: document.querySelector('input[name="paymentMethod"]:checked'),
  cardNumber: document.getElementById("cardNumber"),
  cardName: document.getElementById("cardName"),
  expiryDate: document.getElementById("expiryDate"),
  cvv: document.getElementById("cvv"),
};

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
window.onload = function () {
  checkIfUserLoggedIn();
};

function calculateDiscountPercentage(originalPrice, discountedPrice) {
  if (originalPrice <= 0) return 0;
  const discountAmount = originalPrice - discountedPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;
  return Math.round(discountPercentage);
}

function updateOrderSummary(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    totalDiscountConatiner.innerHTML = `
      <p class="fw-bolder productName">Order Summary</p>
      <div class="lead">
        <p>Your cart is empty</p>
      </div>
      <a href="../index.html" class="btn btn-dark btnCheckout">
        Continue Shopping <i class="fa-solid fa-arrow-right"></i>
      </a>
    `;
    return;
  }

  let totalAfterDiscount = 0;
  let totalBeforeDiscount = 0;

  cartItems.forEach((item) => {
    totalAfterDiscount += Number(item.price) * Number(item.quantity);
    totalBeforeDiscount +=
      Number(item.priceBeforeDiscount) * Number(item.quantity);
  });

  const formattedSubtotal = (
    Math.round(totalBeforeDiscount * 100) / 100
  ).toFixed(2);
  const formattedDiscount = (
    Math.round((totalBeforeDiscount - totalAfterDiscount) * 100) / 100
  ).toFixed(2);
  const formattedTotal = (Math.round(totalAfterDiscount * 100) / 100).toFixed(
    2
  );

  totalDiscountConatiner.innerHTML = `
    <p class="fw-bolder productName">Order Summary</p>
    <div class="lead">
      <p>Subtotal<span class="fw-bold float-end">$${formattedSubtotal}</span></p>
      <p>
        Discount (<span class="text-danger">-${calculateDiscountPercentage(
          totalBeforeDiscount,
          totalAfterDiscount
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
    <button id="placeOrderBtn" class="btn btn-dark btnCheckout">
      Place Order <i class="fa-solid fa-arrow-right"></i>
    </button>
  `;

  document
    .getElementById("placeOrderBtn")
    .addEventListener("click", handlePlaceOrder);
}

function renderCartProducts(productToRender) {
  console.log(productToRender);

  productsInCartComponent.innerHTML += `
    <div class="col-12 mb-3">
      <div class="d-flex">
        <div class="imageContainerCheckout me-2">
          <img class="w-100 h-100" src="${productToRender.image}" alt="${
    productToRender.title
  }" />
        </div>
        <div>
          <p class="fw-bold">${productToRender.title}</p>
          <p>Size: ${productToRender.size}</p>
          <p>Quantity: ${productToRender.quantity}</p>
          <p class="fw-bold">$${(
            productToRender.price * productToRender.quantity
          ).toFixed(2)}</p>
        </div>
      </div>
    </div>
    <div class="hrLine m-auto my-4"></div>
  `;
}

async function fetchUserData() {
  try {
    const response = await fetch(`${apiBaseUrl}/users/${userObj.id}`);
    if (!response.ok) throw new Error("Failed to fetch user data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

function prefillUserData(userData) {
  if (userData.shippingAddress) {
    formInputs.firstName.value = userData.shippingAddress.firstName || "";
    formInputs.lastName.value = userData.shippingAddress.lastName || "";
    formInputs.addressLine1.value = userData.shippingAddress.addressLine1 || "";
    formInputs.addressLine2.value = userData.shippingAddress.addressLine2 || "";
    formInputs.city.value = userData.shippingAddress.city || "";
    formInputs.state.value = userData.shippingAddress.state || "";
    formInputs.zipCode.value = userData.shippingAddress.zipCode || "";
  }
}

function validateForm() {
  const requiredFields = [
    formInputs.firstName,
    formInputs.lastName,
    formInputs.addressLine1,
    formInputs.city,
    formInputs.state,
    formInputs.zipCode,
  ];

  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
    }
  });

  if (formInputs.paymentMethod.value === "card") {
    const cardFields = [
      formInputs.cardNumber,
      formInputs.cardName,
      formInputs.expiryDate,
      formInputs.cvv,
    ];

    cardFields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });
  }

  return isValid;
}

async function handlePlaceOrder() {
  if (!validateForm()) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const userResponse = await fetch(`${apiBaseUrl}/users/${userObj.id}`);
    if (!userResponse.ok) throw new Error("Failed to fetch user data");
    const userData = await userResponse.json();

    if (!userData.cart || userData.cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Calculate total
    const total = userData.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      orderId: "ORD-" + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items: [...userData.cart],
      shippingAddress: {
        firstName: formInputs.firstName.value,
        lastName: formInputs.lastName.value,
        addressLine1: formInputs.addressLine1.value,
        addressLine2: formInputs.addressLine2.value,
        city: formInputs.city.value,
        state: formInputs.state.value,
        zipCode: formInputs.zipCode.value,
      },
      paymentMethod: formInputs.paymentMethod.value,
      status: "processing",
      total: userData.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    };
    sessionStorage.setItem("latestOrder", JSON.stringify(order));

    const updatedUser = {
      ...userData,
      orders: [...(userData.orders || []), order],
      cart: [],
    };

    const updateResponse = await fetch(`${apiBaseUrl}/users/${userObj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!updateResponse.ok) throw new Error("Failed to update user data");

    window.location.href = "./OrderConfirmation.html";
  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an error processing your order. Please try again.");
  }
}

function generateOrderId() {
  return (
    "ORD-" +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 5).toUpperCase()
  );
}

async function initializeCheckout() {
  try {
    if (!userObj) {
      window.location.href = "./Login.html";
      return;
    }

    const userData = await fetchUserData();
    if (!userData) return;

    productsInCartComponent.innerHTML = "";

    if (userData.cart && userData.cart.length > 0) {
      userData.cart.forEach((product) => renderCartProducts(product));
      updateOrderSummary(userData.cart);
    } else {
      updateOrderSummary([]);
    }

    prefillUserData(userData);

    document
      .querySelectorAll('input[name="paymentMethod"]')
      .forEach((radio) => {
        radio.addEventListener("change", function () {
          formInputs.paymentMethod = this;
        });
      });
  } catch (error) {
    console.error("Error initializing checkout:", error);
  }

  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      formInputs.paymentMethod = this;
      const cardFields = document.getElementById("cardFields");
      if (this.value === "card") {
        cardFields.style.display = "block";
      } else {
        cardFields.style.display = "none";
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", initializeCheckout);
