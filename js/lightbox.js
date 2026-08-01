const viewer = document.querySelector(".viewer");
const viewerImage = document.querySelector(".viewer__image");
const viewerCounter = document.querySelector(".viewer__counter");
const viewerBackdrop = document.querySelector(".viewer__backdrop");
const previousZone = document.querySelector(".viewer__zone--left");
const closeZone = document.querySelector(".viewer__zone--centre");
const nextZone = document.querySelector(".viewer__zone--right");

let currentImageIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

function updateViewer() {
  const image = portfolioImages[currentImageIndex];
  if (!image) return;

  viewerImage.classList.add("is-changing");

  window.setTimeout(() => {
    viewerImage.src = image.src;
    viewerImage.alt = image.alt || "Portfolio image";
    viewerCounter.textContent =
      `${String(currentImageIndex + 1).padStart(2, "0")} / ` +
      `${String(portfolioImages.length).padStart(2, "0")}`;

    viewerImage.onload = () => {
      viewerImage.classList.remove("is-changing");
    };
  }, 90);
}

function openViewer(index) {
  currentImageIndex = index;
  updateViewer();

  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
  updateViewer();
}

function previousImage() {
  currentImageIndex =
    (currentImageIndex - 1 + portfolioImages.length) % portfolioImages.length;
  updateViewer();
}

function initialiseLightbox() {
  document.querySelectorAll(".shot").forEach(shot => {
    shot.addEventListener("click", () => {
      openViewer(Number(shot.dataset.index));
    });
  });

  previousZone.addEventListener("click", previousImage);
  nextZone.addEventListener("click", nextImage);
  closeZone.addEventListener("click", closeViewer);
  viewerBackdrop.addEventListener("click", closeViewer);

  viewer.addEventListener("touchstart", event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  viewer.addEventListener("touchend", event => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY)) {
      deltaX < 0 ? nextImage() : previousImage();
    }
  }, { passive: true });

  window.addEventListener("keydown", event => {
    if (!viewer.classList.contains("is-open")) return;

    if (event.key === "ArrowRight") nextImage();
    if (event.key === "ArrowLeft") previousImage();
    if (event.key === "Escape") closeViewer();
  });
}
