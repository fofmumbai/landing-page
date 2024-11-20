setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 5000);

setTimeout(() => {
  document.getElementById("text-overlay").style.display = "none";
}, 5000);

document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.getElementById('open-video-button');
  const closeButton = document.getElementById('close-video-button');
  const videoOverlay = document.getElementById('video-overlay');
  const promoVideo = document.getElementById('promo-video');

  const muteButton = document.getElementById('mute-button');
  const muteIcon = document.getElementById('mute-icon');
  const skipButton = document.getElementById('skip-button');

  // Function to open the video overlay
  openButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    videoOverlay.classList.add('active');
    promoVideo.play();
    promoVideo.muted = false; // Ensure video starts unmuted
    updateMuteIcon(false);
  });

  // Function to close the video overlay
  if (closeButton) { // Check if closeButton exists
    closeButton.addEventListener('click', () => {
      videoOverlay.classList.remove('active');
      promoVideo.pause();
      promoVideo.currentTime = 0; // Reset video to start
    });
  }

  // // Close overlay when clicking outside the video container
  // videoOverlay.addEventListener('click', (e) => {
  //   if (e.target === videoOverlay) {
  //     videoOverlay.classList.remove('active');
  //     promoVideo.pause();
  //     promoVideo.currentTime = 0;
  //   }
  // });

  // Function to toggle mute/unmute
  muteButton.addEventListener('click', () => {
    promoVideo.muted = !promoVideo.muted;
    updateMuteIcon(promoVideo.muted);
  });

  // Function to update mute icon based on state
  function updateMuteIcon(isMuted) {
    if (isMuted) {
      // Change to muted icon
      muteIcon.innerHTML = `
        <line x1="9" y1="9" x2="15" y2="15"></line>
        <path d="M19 19 L5 5"></path>
      `;
    } else {
      // Default volume icon
      muteIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
    }
  }

  // // Function to handle skip button
  // skipButton.addEventListener('click', () => {
  //   window.location.href = "home.html";
  // } );

  // Redirect to main page after video ends
  promoVideo.addEventListener("ended", () => {
    window.location.href = "home";
  });

});
