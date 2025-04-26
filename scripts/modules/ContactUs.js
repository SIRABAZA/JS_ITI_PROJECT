const signOutDropDown = document.getElementById("signOutDropDown");

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
