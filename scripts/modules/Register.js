const API_URL = "http://localhost:3000/users";
const nameInput = document.getElementById("exampleInputName");
const emailInput = document.getElementById("exampleInputEmail");
const passwordInput = document.getElementById("exampleInputPassword");
const confirmInput = document.getElementById("exampleInputConfirmPassword");
const form = document.getElementById("myForm");
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

window.onload = function () {
  let sessionUser = sessionStorage.getItem("currentUser");
  if (JSON.parse(sessionUser) != null) {
    window.location.href("./Login.html");
  }
};
function createErrorMessage(inputElement, message) {
  // Clear any existing error first
  clearValidation(inputElement);

  // Create new error message
  const errorElement = document.createElement("div");
  errorElement.className = "invalid-feedback";
  errorElement.textContent = message;
  inputElement.classList.add("is-invalid");
  inputElement.parentNode.appendChild(errorElement);
}

// Clear validation state (unchanged)
function clearValidation(inputElement) {
  inputElement.classList.remove("is-invalid");
  const feedback = inputElement.parentNode.querySelector(".invalid-feedback");
  if (feedback) feedback.remove();
}

// Validations
function isValidName(name) {
  const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
  return pattern.test(name);
}
function isValidEmail(email) {
  const pattern = /^[^@]+@[^@]+\.[^@]+$/;
  return pattern.test(email);
}
async function validateEmail(email) {
  if (!email.trim()) {
    return { valid: false, message: "Please enter your email" };
  }

  if (!isValidEmail(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }

  const emailExists = await isEmailRegistered(email);
  if (emailExists) {
    return { valid: false, message: "This email is already registered" };
  }

  return { valid: true };
}
function isValidPassword(password) {
  const pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return pattern.test(password);
}

// Validate entire form
function validateForm() {
  let isValid = true;

  // Name validation
  if (!nameInput.value.trim()) {
    createErrorMessage(nameInput, "Please enter your name");
    isValid = false;
  } else if (!isValidName(nameInput.value)) {
    createErrorMessage(
      nameInput,
      "Only letters, spaces, hyphens, and apostrophes allowed"
    );
    isValid = false;
  } else {
    clearValidation(nameInput);
  }

  // Email validation
  if (!emailInput.value.trim()) {
    createErrorMessage(emailInput, "Please enter your email");
    isValid = false;
  } else if (!emailInput.value) {
    createErrorMessage(emailInput, "Please enter a valid email address");
    isValid = false;
  } else {
    clearValidation(emailInput);
  }

  // Password validation
  if (!passwordInput.value.trim()) {
    createErrorMessage(passwordInput, "Please enter a password");
    isValid = false;
  } else if (!isValidPassword(passwordInput.value)) {
    createErrorMessage(
      passwordInput,
      "Password must contain: 8+ characters, uppercase, lowercase, number, and special character"
    );
    isValid = false;
  } else {
    clearValidation(passwordInput);
  }

  // Confirm password validation
  if (!confirmInput.value.trim()) {
    createErrorMessage(confirmInput, "Please confirm your password");
    isValid = false;
  } else if (passwordInput.value !== confirmInput.value) {
    createErrorMessage(confirmInput, "Passwords do not match");
    isValid = false;
  } else {
    clearValidation(confirmInput);
  }

  return isValid;
}

// Real-time validation
[nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
  input.addEventListener("input", function () {
    if (this.value.trim()) {
      clearValidation(this);
    }
  });
});

// Form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Validate form (synchronous checks)
  if (!validateForm()) return;

  // Additional async email validation
  const emailValidation = await validateEmail(emailInput.value.trim());
  if (!emailValidation.valid) {
    createErrorMessage(emailInput, emailValidation.message);
    return;
  }

  // Create user object
  const newUser = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
    createdAt: new Date().toISOString(),
    isActive: true,
    cart: [],
  };

  try {
    // Save the user to JSON Server
    const savedUser = await saveUserToJsonServer(newUser);

    // Show success feedback
    const successAlert = document.createElement("div");
    successAlert.className = "alert alert-success mt-3";
    successAlert.textContent = "User Created Successfully!";
    form.parentNode.insertBefore(successAlert, form.nextSibling);

    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      successAlert.remove();
    }, 2000);
    window.location.href = "../Pages/Login.html";
  } catch (error) {
    console.error("Error saving user:", error);
    createErrorMessage(form, "Failed to save user. Please try again.");
  }
});
async function isEmailRegistered(email) {
  try {
    const response = await fetch(
      `http://localhost:3000/users?email=${encodeURIComponent(email)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const users = await response.json();
    return users.length > 0; // Returns true if email exists
  } catch (error) {
    console.error("Error checking email:", error);
    return false; // Assume email is available if there's an error
  }
}
async function saveUserToJsonServer(newUser) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (isEmailRegistered(newUser.email)) {
      createErrorMessage(emailInput, "Email Is Already Excist");
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}

// Additional CRUD operations you might need:

// Get all users
async function getUsers() {
  const response = await fetch(API_URL);
  return await response.json();
}
