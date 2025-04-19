let incrementBtn = document.getElementById("btnIncrementProductPage");
let decrementBtn = document.getElementById("btnDecrementProductPage");
let quatity = document.getElementById("Quatity");
const API_URL = "http://localhost:3000/products";
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const productContainer = document.getElementById("productContainer");
console.log(productContainer);

console.log("Showing product:", productId);

incrementBtn.addEventListener("click", function () {
  quatity.innerHTML = Number(quatity.textContent) + 1;
});
decrementBtn.addEventListener("click", function () {
  if (quatity.textContent == "1") {
    quatity.innerHTML = 1;
  } else {
    quatity.innerHTML = Number(quatity.textContent) - 1;
  }
});
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
              </div>
            </div>
          </div>
          <div class="btnAndIncrement my-3">
            <div class="row d-flex justify-content-between align-items-center">
              <div class="col-md-6 col-sm-12 addToCartCounainer">
                <button
                  href="#"
                  class="btn addToCart btn-dark text-center viewProductBtn"
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
