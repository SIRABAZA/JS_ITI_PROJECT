document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginMessage = document.getElementById("loginMessage");

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

    checkIfUserLoggedIn();
  };

  if (!loginForm || !loginEmail || !loginPassword || !loginMessage) {
    console.error("Required login elements not found in DOM");
    return;
  }


  const API_URL = "http://localhost:3000/users";

 
  async function loginUser(email, password) {
    try {
      const response = await fetch(
        `${API_URL}?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Network error");

      const users = await response.json();
      if (users.length === 0) throw new Error("User not found");

      const user = users[0];

      if (user.password !== password) {
        throw new Error("Incorrect password");
      }

     
      const { ...userData } = user;
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }


  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {

      loginMessage.textContent = "";
      loginMessage.className = "";


      const email = loginEmail.value.trim();
      const password = loginPassword.value;


      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }


      const user = await loginUser(email, password);


      loginMessage.textContent = `Welcome, ${user.name}!`;
      loginMessage.className = "alert alert-success";


      sessionStorage.setItem("currentUser", JSON.stringify(user));

   
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } catch (error) {
      loginMessage.textContent = error.message;
      loginMessage.className = "alert alert-danger my-2";
      loginPassword.value = ""; // Clear password field
    }
  });
});
