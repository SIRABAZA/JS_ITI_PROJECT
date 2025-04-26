let productContainer = document.getElementById("productContainer");
const API_URL = "http://localhost:3000/products";
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
let productDetails;
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
    window.location.href = "http://127.0.0.1:5500/pages/Login.html";

    signOutDropDown.innerHTML = "";
  }
}
window.onload = function () {
  checkIfUserLoggedIn();
};
console.log("Showing product:", productId);

function renderProduct(productToRender) {
  productContainer.innerHTML = "";

  productContainer.innerHTML = `<div class="row">
        <div class="col-md-12 col-lg-6">
          <div class="slider-container productPhotos">
            <div class="slider">
              <div class="slide active">
                <img
                  src=${productToRender.images[0]}
                  alt="Beach"
                />
              </div>
              <div class="slide">
                <img
                  src=${productToRender.images[1]}
                  alt="Mountains"
                />
              </div>
              <div class="slide">
                <img
                  src=${productToRender.images[2]}
                  alt="Forest"
                />
              </div>
            </div>

            <button class="arrow prev-button">&#10094;</button>
            <button class="arrow next-button">&#10095;</button>

            <div class="dots-container"></div>
          </div>
        </div>
        <div class="col-md-12 col-lg-6 bg-white p-3">
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge rounded-pill text-bg-dark">${productToRender.category}</span>
            <div>
              <button
                class="btn wishList_btn text-dark rounded-circle p-2 d-flex justify-content-center align-items-center border-dark"
              >
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
          <div class="NameContainer d-flex justify-content-between">
            <h2>${productToRender.title}</h2>
            <div
              class="ratingContaier d-flex justify-content-start align-items-center gap-2 my-2"
            >
              <span
                class="badge rounded-pill text-bg-warning d-flex justify-content-center align-items-center text-white"
                >${productToRender.rating}</span
              >

              <div
                class="startContainer d-flex justify-content-center align-items-center"
              >
                <i class="fa-solid fa-star starSpecific"></i>
                <i class="fa-solid fa-star starSpecific"></i>
                <i class="fa-solid fa-star starSpecific"></i>
                <i class="fa-solid fa-star starSpecific"></i>
                <i class="fa-solid fa-star-half-stroke starSpecific"></i>
              </div>
            </div>
          </div>
          <div class="priceContainer">
            <div class="d-flex justify-content-start gap-4">
              <p class="product__price card-text fw-semibold">$${productToRender.price}</p>
              <del
                class="product__before__discount card-text fw-normal text-danger"
              >
                $${productToRender.priceBeforeDiscount}</del
              >
            </div>
          </div>
          <div class="colorsContainer mb-3">
            <h5>Colors</h5>
            <div class="d-flex justify-content-start align-items-center gap-2">
              <div class="colors" style="background-color: ${productToRender.colors[0]}"></div>
              <div class="colors" style="background-color: ${productToRender.colors[1]}"></div>
              <div class="colors" style="background-color: ${productToRender.colors[2]}"></div>
            </div>
          </div>

          <div class="SelectSizeContainer my-3">
            <div class="w-50 selectSize">
              <div class="col-md">
                <div class="form-floating">
                  <select class="form-select" id="floatingSelectGrid">
                    <option selected>Select Your Size</option>
                    <option value="1">S</option>
                    <option value="2">M</option>
                    <option value="3">L</option>
                    <option value="4">XL</option>
                  </select>
                  <label for="floatingSelectGrid">Size</label>
                </div>
                          <div id="pleaseSelectSize">
            
          </div>
              </div>
            </div>
          </div>
          <div class="btnAndIncrement my-3">
            <div class="row d-flex justify-content-between align-items-center">
              <div class="col-md-6 col-sm-12 addToCartCounainer">
                <button
                  href="#"
                  class="btn addToCart btn-dark text-center viewProductBtn"
                  id="addToCartProduct"
                >
                  Add To Cart
                  <i class="fa-solid fa-cart-shopping"></i>
                </button>
              </div>
              <div
                class="col-md-6 col-sm-12 d-flex justify-content-between align-items-center incDecSection"
              >
                <div class="btnQuantity">
                  <button
                    class="btn btn-dark incDecBtns btnChildQuan rounded-circle"
                    id="btnDecrementProductPage"
                  >
                    -
                  </button>
                </div>
                <span id="Quatity">1</span>
                <div class="btnQuantity">
                  <button
                    class="btn btn-dark incDecBtns btnChildQuan rounded-circle"
                    id="btnIncrementProductPage"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="productDiscription">
            <p>
              Stylish slim-fit trousers with stretch fabric for all-day comfort.
            </p>
          </div>
          <div class="stockLeft bg-danger text-white text-center">
            <p>
              <i class="fa-solid fa-triangle-exclamation"></i>
              Only ${productToRender.stock} Pieces Left In Stock Hurry Up!!
            </p>
          </div>
        </div>
      </div>`;
  let pleaseSelectSize = document.getElementById("pleaseSelectSize");

  let incrementBtn = document.getElementById("btnIncrementProductPage");
  let decrementBtn = document.getElementById("btnDecrementProductPage");
  let quatity = document.getElementById("Quatity");
  let addToCartBtn = document.getElementById("addToCartProduct");
  let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  let selectSize = document.getElementById("floatingSelectGrid");

  let selectedOption = selectSize.options[selectSize.selectedIndex];
  let selectedText = selectedOption.textContent;
  selectSize.addEventListener("change", function () {
    selectedOption = this.options[selectSize.selectedIndex];
    selectedText = selectedOption.textContent;
  });
  //increment Event
  incrementBtn.addEventListener("click", function () {
    quatity.innerHTML = Number(quatity.textContent) + 1;
  });

  //Decrement Event
  decrementBtn.addEventListener("click", function () {
    if (quatity.textContent == "1") {
      quatity.innerHTML = 1;
    } else {
      quatity.innerHTML = Number(quatity.textContent) - 1;
    }
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      let theProduct = {
        id: productToRender.id,
        title: productToRender.title,
        category: productToRender.category,
        price: productToRender.price,
        priceBeforeDiscount: productToRender.priceBeforeDiscount,
        image: productToRender.images[0],
        size: selectedText,
        quantity: Number(quatity.textContent),
      };

      e.preventDefault();
      addToCart(currentUser.id, theProduct);
    });
  }
}
if (productId) {
  fetchProductById(productId);
} else {
  console.log("error");
}
async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();
    renderProduct(product);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
  }
}

async function addToCart(userId, product) {
  if (product.size == "Select Your Size") {
    pleaseSelectSize.innerHTML = `<p class="lead text-danger">Please Select A Size</p>`;
    return;
  } else {
    pleaseSelectSize.innerHTML = "";
  }
  try {
    // 1. Fetch the current user data
    const response = await fetch(`http://localhost:3000/users/${userId}`);
    const user = await response.json();

    let updatedCart;

    // Check if the product with the same ID AND size exists
    const existingProductIndex = user.cart.findIndex(
      (item) => item.id === product.id && item.size === product.size
    );

    if (existingProductIndex !== -1) {
      // Product with same ID & size exists → increase quantity
      updatedCart = [...user.cart];
      updatedCart[existingProductIndex].quantity =
        (updatedCart[existingProductIndex].quantity || 1) +
        (product.quantity || 1);
    } else {
      // Product doesn't exist or has a different size → add as new item
      updatedCart = [
        ...user.cart,
        { ...product, quantity: product.quantity || 1 },
      ];
    }

    // Update the user's cart
    const updateResponse = await fetch(
      `http://localhost:3000/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: updatedCart,
        }),
      }
    );

    return await updateResponse.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get all necessary elements
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const dotsContainer = document.querySelector(".dots-container");

  let currentIndex = 0;
  let interval;

  // Create dots based on number of slides
  function createDots() {
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        goToSlide(index);
        resetAutoSlide();
      });

      dotsContainer.appendChild(dot);
    });
  }

  // Function to display a specific slide
  function goToSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"));
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentIndex = index;
  }

  // Function to go to next slide
  function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    goToSlide(newIndex);
  }

  // Function to go to previous slide
  function prevSlide() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(newIndex);
  }

  // Reset auto slide timer
  function resetAutoSlide() {
    clearInterval(interval);
    startAutoSlide();
  }

  // Start automatic slideshow
  function startAutoSlide() {
    interval = setInterval(nextSlide, 5000);
  }

  // Event listeners
  prevButton.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  nextButton.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoSlide();
    }
  });

  // Touch events for mobile swipe
  let touchStartX = 0;
  let touchEndX = 0;

  const slider = document.querySelector(".slider");

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > minSwipeDistance) {
      // Swiped right, go to previous slide
      prevSlide();
      resetAutoSlide();
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped left, go to next slide
      nextSlide();
      resetAutoSlide();
    }
  }

  // Initialize
  createDots();
  startAutoSlide();
});
