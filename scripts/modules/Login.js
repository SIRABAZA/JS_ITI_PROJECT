document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginMessage = document.getElementById("loginMessage");

  // Check if elements exist
  if (!loginForm || !loginEmail || !loginPassword || !loginMessage) {
    console.error("Required login elements not found in DOM");
    return;
  }

  // Login API URL
  const API_URL = "http://localhost:3000/users";

  // Login function
  async function loginUser(email, password) {
    try {
      const response = await fetch(
        `${API_URL}?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Network error");

      const users = await response.json();
      if (users.length === 0) throw new Error("User not found");

      const user = users[0];

      // In production: Compare hashed passwords with bcrypt
      if (user.password !== password) {
        throw new Error("Incorrect password");
      }

      // Return user data without password
      const { password: _, ...userData } = user;
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      // Clear previous messages
      loginMessage.textContent = "";
      loginMessage.className = "";

      // Get form values
      const email = loginEmail.value.trim();
      const password = loginPassword.value;

      // Validate inputs
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Attempt login
      const user = await loginUser(email, password);

      // Login success
      loginMessage.textContent = `Welcome, ${user.name}!`;
      loginMessage.className = "alert alert-success";

      // Store user in session
      sessionStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect after delay
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
    } catch (error) {
      // Login failed
      loginMessage.textContent = error.message;
      loginMessage.className = "alert alert-danger my-2";
      loginPassword.value = ""; // Clear password field
    }
  });
});
