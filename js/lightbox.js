const viewer = document.querySelector(".viewer");
const viewerImage = document.querySelector(".viewer__image");
const viewerCounter = document.querySelector(".viewer__counter");
const viewerBackdrop = document.querySelector(".viewer__backdrop");
const previousZone = document.querySelector(".viewer__zone--left");
const closeZone = document.querySelector(".viewer__zone--centre");
const nextZone = document.querySelector(".viewer__zone--right");

let currentPhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

function renderViewer() {
  const image = getPhotoSource(currentPhotoIndex);

  viewerImage.src = image.src;
  viewerImage.alt = image.alt;
  viewerCounter.textContent =
    `${String(currentPhotoIndex + 1).padStart(2, "0")} / ` +
    `${String(portfolioPhotos.length).padStart(2, "0")}`;
}

function openViewer(index) {
  currentPhotoIndex = index;
  renderViewer();

  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function showNextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % portfolioPhotos.length;
  renderViewer();
}

function showPreviousPhoto() {
  currentPhotoIndex =
    (currentPhotoIndex - 1 + portfolioPhotos.length) % portfolioPhotos.length;
  renderViewer();
}

function initialiseLightbox() {
  portfolioPhotos.forEach((photo, index) => {
    photo.addEventListener("click", () => openViewer(index));
  });

  previousZone.addEventListener("click", showPreviousPhoto);
  nextZone.addEventListener("click", showNextPhoto);
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
      deltaX < 0 ? showNextPhoto() : showPreviousPhoto();
    }
  }, { passive: true });

  window.addEventListener("keydown", event => {
    if (!viewer.classList.contains("is-open")) return;

    if (event.key === "ArrowRight") showNextPhoto();
    if (event.key === "ArrowLeft") showPreviousPhoto();
    if (event.key === "Escape") closeViewer();
  });
}
