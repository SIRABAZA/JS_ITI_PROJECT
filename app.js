let navUlBtn = document.getElementById("custom-navbar-nav");
let registerBtn = document.getElementById("registerBtn");
let loginBtn = document.getElementById("loginBtn");
let signOutDropDown = document.getElementById("signOutDropDown");
let priceInput = document.getElementById("priceInput");
let sizeInput = document.getElementById("sizeInput");
let productsContainer = document.getElementById("products-container");
let viewProductBtns = document.querySelectorAll(".viewProductBtn");
let products = [];

//handle if the user is loggedIn
function checkIfUserLoggedIn() {
  let sessionUser = sessionStorage.getItem("currentUser");
  if (JSON.parse(sessionUser) != null) {
    registerBtn.remove();
    loginBtn.remove();
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
    signOutDropDown.innerHTML = "";
  }
}
// console.log(JSON.parse(sessionStorage.getItem("currentUser")));
window.onload = function () {
  // Your code here
  checkIfUserLoggedIn();
};

/////fetch products on load
const API_URL = "http://localhost:3000/products";
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    // Handle both array and object formats
    if (Array.isArray(data)) {
      products = data; // Direct array of products
    } else if (data.products && Array.isArray(data.products)) {
      products = data.products; // Object with products array
    } else {
      throw new Error(
        "Invalid data format: expected array or object with products array"
      );
    }

    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    showError(error.message);
  }
}

function renderProducts(productsToRender) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  if (!productsToRender || productsToRender.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-12 text-center text-muted py-4">
        <p>No products found</p>
      </div>
    `;
    return;
  }

  productsToRender.forEach((product) => {
    productsContainer.innerHTML += `<div class="col-md-4 col-sm-6 col-xl-3 my-3">
                  <div
                    class="card product_card shadow-lg h-100 product"
                    data-id=${product.id}
                  >
                    <div class="img__Container">
                      <img
                        src=${product.images[0]}
                        class="card-img-top"
                        loading="lazy"
                      />
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${product.title}</h5>
                      <div class="d-flex justify-content-between">
                        <p class="product__price card-text fw-semibold">
                          ${product.price}
                        </p>
                        <del
                          class="product__before__discount card-text fw-normal text-danger"
                        >
                          ${product.priceBeforeDiscount}</del
                        >
                      </div>
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <button
                            href="#"
                            class="btn btn-dark text-center p-2 viewProductBtn"
                            id="viewProductBtn"
                            data-id=${product.id}
                          >
                            View Product
                          </button>
                        </div>
                        <div class="">
                          <button
                            class="btn wishList_btn text-dark rounded-circle p-2 d-flex justify-content-center align-items-center border-dark"
                          >
                            <i class="fa-solid fa-heart"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
  });
}

function showError(message) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = `
    <div class="col-12 text-center text-danger py-4">
      <p>Error loading products</p>
      <small>${message}</small>
    </div>
  `;
}

//handle when price input chanage
priceInput.addEventListener("input", function (e) {
  if (e.target.value == "") {
    fetchProducts();
  } else {
    filterProdcutsPrice(e.target.value);
  }
});
async function filterProdcutsPrice(price) {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();

    let filteredProduct = product.filter((item) => {
      return item.price <= price;
    });
    renderProducts(filteredProduct);
  } catch (error) {
    console.error(`Error fetching product:`, error);
  }
}

//handle when size input change
async function filterProdcutsSize(size) {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();

    let filteredProduct = product.filter((item) => {
      return item.sizes.includes(size);
    });

    renderProducts(filteredProduct);
  } catch (error) {
    console.error(`Error fetching product:`, error);
  }
}
sizeInput.addEventListener("input", function (e) {
  if (e.target.value == "") {
    fetchProducts();
  } else {
    filterProdcutsSize(e.target.value.toUpperCase());
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Get the current path and navigate relative to it
  document.addEventListener("click", (e) => {
    // Check if clicked element (or its parent) has a product ID
    const productCard = e.target.closest("[data-id]");
    const viewButton = e.target.closest(".view-product-btn");

    if (productCard || viewButton) {
      e.preventDefault();
      const productId = (productCard || viewButton).dataset.id;

      // Calculate correct path and navigate
      const basePath = window.location.pathname
        .split("/")
        .slice(0, -1)
        .join("/");
      window.location.href = `${basePath}/pages/Products.html?id=${productId}`;
    }
  });
  fetchProducts();
});

//Handle View Product Button
// Better approach - use event delegation
document.addEventListener("click", function (e) {
  // Handle product card clicks
  const productCard = e.target.closest(".product");
  if (productCard) {
    e.preventDefault();
    const productId = productCard.dataset.id;
    window.location.href = `pages/Products.html?id=${productId}`; // or your preferred routing
    return;
  }

  // Handle specific button clicks
  const productBtn = e.target.closest(".view-product-btn");
  if (productBtn) {
    e.preventDefault();
    const productId = productBtn.dataset.id;
    window.location.href = `pages/Products.html?id=${productId}`;
  }
});
// Fetch single product by ID
async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();
    console.log(product);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
  }
}
