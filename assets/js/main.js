// Get all sticker elements
const stickers = document.querySelectorAll("#sticker");

// Configuration for random movement
const config = {
  minRadius: 10, // Minimum movement radius
  maxRadius: 100, // Maximum movement radius
  minDuration: 2, // Minimum animation duration in seconds
  maxDuration: 5, // Maximum animation duration in seconds
  minInterval: 1000, // Minimum time between movements (ms)
  maxInterval: 3000, // Maximum time between movements (ms)
  maxRotation: 0, // Maximum rotation in degrees
  boundsMargin: 50, // Margin from viewport edges
};

// Store initial positions and states for each sticker
const stickerStates = new Map();

// Initialize sticker states
stickers.forEach((sticker) => {
  const rect = sticker.getBoundingClientRect();
  stickerStates.set(sticker, {
    initialX: rect.left,
    initialY: rect.top,
    currentX: 0,
    currentY: 0,
    rotation: 0,
    isDragging: false,
    interval: null,
  });
});

// Utility functions
const random = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Function to check if position is within viewport bounds
function isInBounds(x, y) {
  const margin = config.boundsMargin;
  return (
    x >= margin &&
    x <= window.innerWidth - margin &&
    y >= margin &&
    y <= window.innerHeight - margin
  );
}

// Generate new random position
function getNewPosition(sticker, state) {
  let attempts = 0;
  let newX, newY;

  // Try to find a valid position within bounds
  do {
    const radius = random(config.minRadius, config.maxRadius);
    const angle = random(0, Math.PI * 2);

    newX = state.initialX + radius * Math.cos(angle);
    newY = state.initialY + radius * Math.sin(angle);

    attempts++;
  } while (!isInBounds(newX, newY) && attempts < 10);

  return { x: newX - state.initialX, y: newY - state.initialY };
}

// Animate individual sticker
function animateSticker(sticker) {
  const state = stickerStates.get(sticker);

  if (!state.isDragging) {
    // Generate random movement parameters
    const newPos = getNewPosition(sticker, state);
    const duration = random(config.minDuration, config.maxDuration);
    const rotation = random(-config.maxRotation, config.maxRotation);

    // Apply smooth transition with random easing
    const easings = [
      "ease-in-out",
      "ease-out",
      "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    ];
    const randomEasing = easings[Math.floor(random(0, easings.length))];

    // Update state
    state.currentX = newPos.x;
    state.currentY = newPos.y;
    state.rotation = rotation;

    // Apply animation
    sticker.style.transition = `transform ${duration}s ${randomEasing}`;
    sticker.style.transform = `
            translate(${newPos.x}px, ${newPos.y}px)
            rotate(${rotation}deg)
            scale(${random(0.95, 1.05)})
        `;

    // Schedule next animation with random interval
    clearTimeout(state.interval);
    state.interval = setTimeout(() => {
      animateSticker(sticker);
    }, random(config.minInterval, config.maxInterval));
  }
}

// Start initial animations with slight delays
stickers.forEach((sticker, index) => {
  setTimeout(() => {
    animateSticker(sticker);
  }, index * 500); // Stagger the start of animations
});

// Handle window resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    stickers.forEach((sticker) => {
      const state = stickerStates.get(sticker);
      state.initialX = state.currentX;
      state.initialY = state.currentY;
    });
  }, 250);
});

//Company Logo Slider
document.addEventListener("DOMContentLoaded", function () {
  const mediaQuery = window.matchMedia("(min-width: 768px)");
  const slideTrack = document.querySelector(".logo-slide-track");

  // Function to handle responsive behavior
  function handleScreenChange(e) {
    if (e.matches) {
      // Desktop view
      slideTrack.style.transform = "none";
    } else {
      // Mobile view - reset transform if needed
      slideTrack.style.transform = "";
    }
  }

  // Initial check
  handleScreenChange(mediaQuery);

  // Listen for changes
  mediaQuery.addListener(handleScreenChange);
});

// Modal functionality
// Modal functionality
function createModal() {
  // Get modal elements and verify they exist
  const elements = {
    modalBackdrop: document.querySelector(".modal-backdrop"),
    modal: document.querySelector(".modal"),
    modalClose: document.querySelector(".modal-close"),
    modalImg: document.querySelector(".modal-img"),
    modalImgLoader: document.querySelector(".modal-img-loader"),
    modalTitle: document.querySelector(".modal-title"),
    modalDescription: document.querySelector(".modal-description"),
    modalSocialLinks: document.querySelector(".modal-social-links"),
    modalRedirectLinks: document.querySelector(".modal-redirect-links"),
    modalBtn: document.querySelector(".modal-btn"),
    modalCustomContent: document.querySelector(".modal-custom-content"),
  };

  // Check if required elements exist
  const missingElements = Object.entries(elements)
    .filter(([key, element]) => !element)
    .map(([key]) => key);

  if (missingElements.length > 0) {
    console.error("Missing required modal elements:", missingElements);
    return {
      openModal: () =>
        console.error("Modal cannot be opened due to missing elements"),
      closeModal: () =>
        console.error("Modal cannot be closed due to missing elements"),
    };
  }

  // Function to preload image
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  // Function to open modal
  async function openModal(cardData) {
    if (!cardData) {
      console.error("No card data provided to openModal");
      return;
    }

    // Show modal with loading state
    elements.modalBackdrop.style.display = "block";
    elements.modal.style.display = "block";
    document.body.classList.add("modal-open");

    // Handle image loading
    if (cardData.image) {
      elements.modalImg.style.opacity = "0";
      elements.modalImgLoader.style.display = "block";

      try {
        await preloadImage(cardData.image);
        elements.modalImg.src = cardData.image;
        elements.modalImg.style.display = "block";
        elements.modalImg.style.opacity = "1";
        elements.modalImgLoader.style.display = "none";
      } catch (error) {
        console.error(error);
        elements.modalImg.style.display = "none";
        elements.modalImgLoader.style.display = "none";
      }
    } else {
      elements.modalImg.style.display = "none";
      elements.modalImgLoader.style.display = "none";
    }

    // Set other modal content
    elements.modalTitle.textContent = cardData.title || "";

    if (cardData.description) {
      elements.modalDescription.innerHTML = cardData.description;
      elements.modalDescription.style.display = "block";
    } else {
      elements.modalDescription.style.display = "none";
    }

    // Add social media links
    elements.modalSocialLinks.innerHTML = "";
    if (cardData.socialLinks) {
      cardData.socialLinks.forEach((link) => {
        const socialLink = document.createElement("a");
        socialLink.href = link.url;
        socialLink.target = "_blank";
        socialLink.rel = "noopener noreferrer";
        socialLink.innerHTML = `<i class="bx ${link.icon} modal-social-name"></i>`;
        elements.modalSocialLinks.appendChild(socialLink);
      });
      elements.modalSocialLinks.style.display = "flex";
    } else {
      elements.modalSocialLinks.style.display = "none";
    }

    // Add redirect links
    elements.modalRedirectLinks.innerHTML = "";
    if (cardData.redirectLinks && cardData.redirectLinks.length > 0) {
      cardData.redirectLinks.forEach((link) => {
        const redirectLink = document.createElement("a");
        redirectLink.href = link.url;
        redirectLink.target = "_blank";
        redirectLink.rel = "noopener noreferrer";
        redirectLink.className = "modal-redirect-link";
        redirectLink.innerHTML = `
          <span class="modal-redirect-text">${link.text}</span>
          <i class="bx bx-right-arrow-alt"></i>
        `;
        elements.modalRedirectLinks.appendChild(redirectLink);
      });
      elements.modalRedirectLinks.style.display = "block";
    } else {
      elements.modalRedirectLinks.style.display = "none";
    }

    if (cardData.button) {
      elements.modalBtn.textContent = cardData.button;
      elements.modalBtn.style.display = "block";
    } else {
      elements.modalBtn.style.display = "none";
    }

    // Add custom HTML content
    if (cardData.customContent) {
      elements.modalCustomContent.innerHTML = cardData.customContent;
      elements.modalCustomContent.style.display = "block";
    } else {
      elements.modalCustomContent.style.display = "none";
    }

    // Trigger reflow and add active classes
    elements.modal.offsetHeight;
    elements.modalBackdrop.classList.add("active");
    elements.modal.classList.add("active");
  }

  // Function to close modal
  function closeModal() {
    elements.modalBackdrop.classList.remove("active");
    elements.modal.classList.remove("active");

    setTimeout(() => {
      elements.modalBackdrop.style.display = "none";
      elements.modal.style.display = "none";
      document.body.classList.remove("modal-open");
      // Reset image state
      elements.modalImg.src = "";
      elements.modalImg.style.opacity = "0";
    }, 300);
  }

  // Add event listeners only if elements exist
  elements.modalClose.addEventListener("click", closeModal);
  elements.modalBackdrop.addEventListener("click", (e) => {
    if (e.target === elements.modalBackdrop) {
      closeModal();
    }
  });

  // Add escape key listener
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      elements.modalBackdrop.style.display === "block"
    ) {
      closeModal();
    }
  });

  return { openModal, closeModal };
}

// Initialize modal only after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const { openModal } = createModal();

  // Add click event listeners to thirdfold cards
  const cards = document.querySelectorAll(".thirdfold__data");
  if (cards.length > 0) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        try {
          const cardData = JSON.parse(card.dataset.modalContent);
          openModal(cardData);
        } catch (error) {
          console.error("Failed to parse card data:", error);
        }
      });
    });
  } else {
    console.warn("No thirdfold cards found on the page");
  }
});

/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  // Validate that variables exist
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      // We add the show-menu class to the div tag with the nav__menu class
      nav.classList.toggle("show-menu");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 200) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SHOW SCROLL TOP ====================*/
function scrollTop() {
  const scrollTop = document.getElementById("scroll-top");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollTop.classList.add("show-scroll");
  else scrollTop.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollTop);

/*==================== SCROLL REVEAL ANIMATION ====================*/
// const sr = ScrollReveal({
//   distance: "30px",
//   duration: 1800,
//   reset: true,
// });

// sr.reveal(
//   `.firstfold__data, .firstfold__img,
//            .thirdfold__data,
//            .fourthfold__content,
//            .footer__content`,
//   {
//     origin: "top",
//     interval: 200,
//   }
// );

// sr.reveal(`.secondfold__img, .home__img, .fifthfold__content`, {
//   origin: "left",
// });

// sr.reveal(`.secondfold__data, home__data, .fifthfold__img`, {
//   origin: "right",
// });
