function setupNetworkingSearch() {
  // Collect all the networking groups data
  const networkingGroups = Array.from(
    document.querySelectorAll(".thirdfold__data")
  ).map((group) => {
    const modalContent = JSON.parse(group.dataset.modalContent);
    return {
      element: group,
      groupName: modalContent.title,
      people: modalContent.redirectLinks.map((link) => link.text.toLowerCase()),
    };
  });

  // Create search input and results container
  const searchContainer = document.createElement("div");
  searchContainer.className = "networking-search-container";
  searchContainer.innerHTML = `
        <div class="curated-steps">
          <div class="steps"><h1><span>Step 1:</span> Download the networking prompt sheet</h1></div>
          <a href ="./eventassets/networkingsheet.pdf" target ="_blank" class="button home__button" id="downloadpdfbtn" download>Download PDF</a>
          <div class="steps steps-2"><h1><span>Step 2:</span> Find your networking group</h1></div>
          <input type="text" id="networking-search" placeholder="Search by your name...">
          <div id="search-results" class="search-results"></div>
        </div>
    `;

  // Insert the search container before the networking grid
  const networkingGrid = document.querySelector(".networking__grid");
  networkingGrid.parentNode.insertBefore(searchContainer, networkingGrid);

  const searchInput = document.getElementById("networking-search");
  const searchResults = document.getElementById("search-results");

  // Reset highlighting function
  function resetHighlighting() {
    document.querySelectorAll(".thirdfold__data").forEach((group) => {
      group.classList.remove("highlighted-group");
    });
    searchResults.innerHTML = "";
  }

  // Search function
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Reset previous highlights
    resetHighlighting();

    if (searchTerm === "") return;

    // Find matching groups
    const matchedGroups = networkingGroups.filter((group) =>
      group.people.some((person) => person.includes(searchTerm))
    );

    // Highlight matched groups
    matchedGroups.forEach((group) => {
      group.element.classList.add("highlighted-group");

      // Create result item
      const resultItem = document.createElement("div");
      resultItem.className = "search-result-item";
      resultItem.innerHTML = `
                Found in ${group.groupName}
                <button class="view-group-btn" data-group-index="${networkingGroups.indexOf(
                  group
                )}">View Group</button>
            `;
      searchResults.appendChild(resultItem);
    });

    // Add click events to view group buttons
    document.querySelectorAll(".view-group-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const groupIndex = btn.dataset.groupIndex;
        const targetGroup = networkingGroups[groupIndex].element;

        // Scroll to the group
        targetGroup.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Trigger modal
        const modalContent = JSON.parse(targetGroup.dataset.modalContent);
        targetGroup.click(); // This will trigger the existing modal open functionality
      });
    });
  });

  // Clear search when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      resetHighlighting();
      searchInput.value = "";
    }
  });
}

// Run the search setup when the page loads
document.addEventListener("DOMContentLoaded", setupNetworkingSearch);

const slider = document.getElementById("slider");
const slideWidth = document.querySelector(".slide").offsetWidth + 10; // Add gap spacing

function nextSlide() {
  slider.scrollBy({ left: slideWidth, behavior: "smooth" });
}

function prevSlide() {
  slider.scrollBy({ left: -slideWidth, behavior: "smooth" });
}

// Swipe functionality
let startX = 0;

slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const diff = startX - touch.clientX;

  if (diff > 50) {
    nextSlide();
    startX = touch.clientX; // Reset startX for continuous swiping
  } else if (diff < -50) {
    prevSlide();
    startX = touch.clientX;
  }
});

// Modal functionality
function createModal() {
  // Create modal HTML structure
  const modalHTML = `
    <div class="modal-backdrop">
      <div class="modal">
        <button class="modal-close">&times;</button>
        <div class="modal-content">
          <img src="" alt="" class="modal-img">
          </br>
          <h3 class="modal-title"></h3>
		  <div class="modal-custom-content"></div>
          <div class="modal-description"></div>
          <div class="modal-social-links"></div>
          <div class="modal-redirect-links"></div>
          <button class="modal-btn"></button>
        </div>
      </div>
    </div>
  `;

  // Add modal to document
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Get modal elements
  const modalBackdrop = document.querySelector(".modal-backdrop");
  const modal = document.querySelector(".modal");
  const modalClose = document.querySelector(".modal-close");
  const modalImg = document.querySelector(".modal-img");
  const modalTitle = document.querySelector(".modal-title");
  const modalDescription = document.querySelector(".modal-description");
  const modalSocialLinks = document.querySelector(".modal-social-links");
  const modalRedirectLinks = document.querySelector(".modal-redirect-links");
  const modalBtn = document.querySelector(".modal-btn");
  const modalCustomContent = document.querySelector(".modal-custom-content");

  // Function to open modal
  function openModal(cardData) {
    // Set modal content based on cardData
    if (cardData.image) {
      modalImg.src = cardData.image;
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
    }

    modalTitle.textContent = cardData.title || "";

    if (cardData.description) {
      modalDescription.innerHTML = cardData.description;
      modalDescription.style.display = "block";
    } else {
      modalDescription.style.display = "none";
    }

    // Add social media links
    modalSocialLinks.innerHTML = "";
    if (cardData.socialLinks) {
      cardData.socialLinks.forEach((link) => {
        const socialLink = document.createElement("a");
        socialLink.href = link.url;
        socialLink.target = "_blank";
        socialLink.rel = "noopener noreferrer";
        socialLink.innerHTML = `<i class="bx ${link.icon}"></i>`;
        modalSocialLinks.appendChild(socialLink);
      });
      modalSocialLinks.style.display = "flex";
    } else {
      modalSocialLinks.style.display = "none";
    }

    // Add redirect links
    modalRedirectLinks.innerHTML = "";
    if (cardData.redirectLinks && cardData.redirectLinks.length > 0) {
      cardData.redirectLinks.forEach((link) => {
        const redirectLink = document.createElement("a");
        redirectLink.href = link.url;
        redirectLink.target = "_blank";
        redirectLink.rel = "noopener noreferrer";
        redirectLink.className = "modal-redirect-link";
        redirectLink.innerHTML = `
          <span class="modal-redirect-text">${link.text}</span>
          <i class="bx bxl-linkedin"></i>
        `;
        modalRedirectLinks.appendChild(redirectLink);
      });
      modalRedirectLinks.style.display = "block";
    } else {
      modalRedirectLinks.style.display = "none";
    }

    if (cardData.button) {
      modalBtn.textContent = cardData.button;
      modalBtn.style.display = "block";
    } else {
      modalBtn.style.display = "none";
    }

    // Add custom HTML content
    if (cardData.customContent) {
      modalCustomContent.innerHTML = cardData.customContent;
      modalCustomContent.style.display = "block";
    } else {
      modalCustomContent.style.display = "none";
    }

    modalBackdrop.style.display = "block";
    modal.style.display = "block";
    document.body.classList.add("modal-open");

    // Trigger reflow
    modal.offsetHeight;

    modalBackdrop.classList.add("active");
    modal.classList.add("active");
  }

  // Function to close modal
  function closeModal() {
    modalBackdrop.classList.remove("active");
    modal.classList.remove("active");

    setTimeout(() => {
      modalBackdrop.style.display = "none";
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }, 300); // Match the transition duration
  }

  // Add click event listeners
  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // Add escape key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.style.display === "block") {
      closeModal();
    }
  });

  return { openModal, closeModal };
}

// Initialize modal
const { openModal } = createModal();

// Add click event listeners to thirdfold cards
document.querySelectorAll(".thirdfold__data").forEach((card) => {
  card.addEventListener("click", () => {
    const cardData = JSON.parse(card.dataset.modalContent);
    openModal(cardData);
  });
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
// const sections = document.querySelectorAll("section[id]");

// function scrollActive() {
//   const scrollY = window.pageYOffset;

//   sections.forEach((current) => {
//     const sectionHeight = current.offsetHeight;
//     const sectionTop = current.offsetTop - 50;
//     sectionId = current.getAttribute("id");

//     if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
//       document
//         .querySelector(".nav__menu a[href*=" + sectionId + "]")
//         .classList.add("active-link");
//     } else {
//       document
//         .querySelector(".nav__menu a[href*=" + sectionId + "]")
//         .classList.remove("active-link");
//     }
//   });
// }
// window.addEventListener("scroll", scrollActive);

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
