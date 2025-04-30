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
document.addEventListener("DOMContentLoaded", function () {
  const order = JSON.parse(sessionStorage.getItem("latestOrder"));
  const orderContainer = document.querySelector(".orderConfirmationContainer");

  if (!order) {
    window.location.href = "../index.html";
    return;
  }

  // Calculate total quantity
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Render order details
  orderContainer.innerHTML = `
    <h2>Order Confirmation #${order.orderId}</h2>
    <p class="lead fs-5">
      Thank you for your order! You'll receive an email confirmation shortly.
    </p>
    <p class="fw-bold">Order Date: ${new Date(
      order.date
    ).toLocaleDateString()}</p>
    
    ${order.items
      .map(
        (item) => `
      <div class="d-flex gap-3 mt-2">
        <div class="imageContainerOrderConfirmation">
          <img class="w-100 h-100" src="${item.image}" alt="${item.title}" />
        </div>
        <div>
          <h4>${item.title}</h4>
          <p class="lead">Size: <span class="fw-bold">${item.size}</span></p>
          <p class="lead">Quantity: <span class="fw-bold">${
            item.quantity
          }</span></p>
          <p class="lead">Price: <span class="fw-bold">$${(
            item.price * item.quantity
          ).toFixed(2)}</span></p>
        </div>
      </div>
      <div class="hrLine m-auto my-4"></div>
    `
      )
      .join("")}

    <div class="row my-3">
      <div class="col-6">
        <p class="fw-bold my-0">Shipping Address</p>
        <p class="lead my-0">${order.shippingAddress.firstName} ${
    order.shippingAddress.lastName
  }</p>
        <p class="lead my-0">${order.shippingAddress.addressLine1}</p>
        ${
          order.shippingAddress.addressLine2
            ? `<p class="lead my-0">${order.shippingAddress.addressLine2}</p>`
            : ""
        }
        <p class="lead my-0">${order.shippingAddress.city}, ${
    order.shippingAddress.state
  } ${order.shippingAddress.zipCode}</p>

        <p class="fw-bold my-0 mt-3">Shipment Method</p>
        <p class="lead">Standard Delivery (3-5 business days)</p>
      </div>
      <div class="col-6">
        <p class="fw-bolder">Payment Method</p>
        <p>${
          order.paymentMethod === "card"
            ? "Credit/Debit Card"
            : "Cash on Delivery"
        }</p>
      </div>
      <div class="hrLine m-auto my-4"></div>
      <div class="col-12">
        <h3>Total: <span>$${order.total.toFixed(2)}</span></h3>
        <p class="lead">${totalQuantity} item${totalQuantity > 1 ? "s" : ""}</p>
      </div>
      <div class="col-12 mt-4">
        <a href="../index.html" class="btn btn-dark">Continue Shopping</a>
      </div>
    </div>
  `;
});
