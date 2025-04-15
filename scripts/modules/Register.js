const API_URL = "http://localhost:3001/users";

const nameInput = document.getElementById("exampleInputName");
const emailInput = document.getElementById("exampleInputEmail");
const passwordInput = document.getElementById("exampleInputPassword");
const confirmInput = document.getElementById("exampleInputConfirmPassword");
const form = document.getElementById("myForm");

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
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
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
  } else if (!isValidEmail(emailInput.value)) {
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

  if (validateForm()) {
    // Create user object
    const newUser = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value, // Note: In production, hash this password
      createdAt: new Date().toISOString(),
      isActive: true,
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

      console.log("User saved:", savedUser);
    } catch (error) {
      console.error("Error saving user:", error);
      createErrorMessage(form, "Failed to save user. Please try again.");
    }
  }
});

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

    return await response.json();
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

// Get single user
async function getUser(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
}

// Update user
async function updateUser(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return await response.json();
}

// Delete user
async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}
