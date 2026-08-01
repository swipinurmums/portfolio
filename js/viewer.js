const viewer = document.querySelector(".viewer");
const viewerImage = document.querySelector(".viewer__image");
const viewerCounter = document.querySelector(".viewer__counter");
const viewerBackdrop = document.querySelector(".viewer__backdrop");
const previousZone = document.querySelector(".viewer__zone--previous");
const closeZone = document.querySelector(".viewer__zone--close");
const nextZone = document.querySelector(".viewer__zone--next");

let viewerImages = [];
let viewerIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

function configureViewer(images) {
  viewerImages = images;
}

function renderViewerImage() {
  const image = viewerImages[viewerIndex];
  if (!image) return;

  viewerImage.classList.add("is-changing");

  window.setTimeout(() => {
    viewerImage.src = image.src;
    viewerImage.alt = image.alt || "Portfolio image";
    viewerCounter.textContent =
      `${String(viewerIndex + 1).padStart(2, "0")} / ` +
      `${String(viewerImages.length).padStart(2, "0")}`;

    if (viewerImage.complete) {
      viewerImage.classList.remove("is-changing");
    } else {
      viewerImage.onload = () => {
        viewerImage.classList.remove("is-changing");
      };
    }
  }, 80);
}

function openViewer(index) {
  viewerIndex = index;
  renderViewerImage();
  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function nextViewerImage() {
  viewerIndex = (viewerIndex + 1) % viewerImages.length;
  renderViewerImage();
}

function previousViewerImage() {
  viewerIndex = (viewerIndex - 1 + viewerImages.length) % viewerImages.length;
  renderViewerImage();
}

previousZone.addEventListener("click", previousViewerImage);
nextZone.addEventListener("click", nextViewerImage);
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
    deltaX < 0 ? nextViewerImage() : previousViewerImage();
  }
}, { passive: true });

window.addEventListener("keydown", event => {
  if (!viewer.classList.contains("is-open")) return;

  if (event.key === "ArrowRight") nextViewerImage();
  if (event.key === "ArrowLeft") previousViewerImage();
  if (event.key === "Escape") closeViewer();
});
