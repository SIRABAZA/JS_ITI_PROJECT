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
