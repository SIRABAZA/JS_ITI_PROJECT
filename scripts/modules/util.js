// DOM Elements
const navbarToggler = document.querySelector(".custom-navbar-toggler");
const navbarCollapse = document.querySelector(".custom-navbar-collapse");
const dropdownToggles = document.querySelectorAll(".custom-dropdown-toggle");
const navLinks = document.querySelectorAll(
  ".custom-nav-link:not(.custom-dropdown-toggle)"
);

// Toggle navigation menu on toggler click
navbarToggler.addEventListener("click", () => {
  navbarCollapse.classList.toggle("show");
});

// Handle dropdowns
dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();

    // Find the dropdown menu associated with this toggle
    const dropdown = toggle.nextElementSibling;

    // Close all other dropdowns
    document.querySelectorAll(".custom-dropdown-menu.show").forEach((menu) => {
      if (menu !== dropdown) {
        menu.classList.remove("show");
      }
    });

    // Toggle the dropdown
    dropdown.classList.toggle("show");
  });
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-dropdown")) {
    document.querySelectorAll(".custom-dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
  }
});

// Add 'after' content to dropdown toggles
document.addEventListener("DOMContentLoaded", () => {
  dropdownToggles.forEach((toggle) => {
    toggle.classList.add("custom-dropdown-toggle");
  });
});

// Active nav-link handling
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove active class from all nav links
    navLinks.forEach((item) => item.classList.remove("custom-active"));

    // Add active class to clicked link
    link.classList.add("custom-active");

    // Close the navbar on mobile when a link is clicked
    if (window.innerWidth < 992) {
      navbarCollapse.classList.remove("show");
    }
  });
});

// Close the navbar when window is resized to desktop size
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) {
    navbarCollapse.classList.remove("show");

    // Reset dropdowns
    document.querySelectorAll(".custom-dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
  }
});
