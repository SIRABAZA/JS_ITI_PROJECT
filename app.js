let navUlBtn = document.getElementById("custom-navbar-nav");
let registerBtn = document.getElementById("registerBtn");
let loginBtn = document.getElementById("loginBtn");
let signOutDropDown = document.getElementById("signOutDropDown");
function checkIfUserLoggedIn() {
  let sessionUser = sessionStorage.getItem("currentUser");
  if (JSON.parse(sessionUser) != null) {
    registerBtn.remove();
    loginBtn.remove();
    signOutDropDown.innerHTML = `<div class="dropdown">
                <a
                  class="btn btn-primary dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fa-solid fa-user"></i>
                </a>

                <ul class="dropdown-menu">
                  <li class="px-2">Hello ${JSON.parse(sessionUser).name}</li>
                  <li class="px-2">
                    <button class="btn btn-danger w-100" id="signOutBtn">Sign Out</button>
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
