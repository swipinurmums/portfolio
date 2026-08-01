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

function renderViewerImage({ animate = false } = {}) {
  const image = viewerImages[viewerIndex];

  if (!image) return;

  if (animate) {
    viewerImage.classList.add("is-changing");
  }

  viewerImage.src = image.src;
  viewerImage.alt = image.alt || "Portfolio image";

  viewerCounter.textContent =
    `${String(viewerIndex + 1).padStart(2, "0")} / ` +
    `${String(viewerImages.length).padStart(2, "0")}`;

  const revealImage = () => {
    requestAnimationFrame(() => {
      viewerImage.classList.remove("is-changing");
    });
  };

  if (viewerImage.complete) {
    revealImage();
  } else {
    viewerImage.onload = revealImage;
  }
}

function openViewer(index) {
  viewerIndex = index;

  /*
   * Remove the open state first so the browser begins from
   * the smaller, transparent image state.
   */
  viewer.classList.remove("is-open");

  renderViewerImage({ animate: true });

  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      viewer.classList.add("is-open");
    });
  });
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function nextViewerImage() {
  viewerIndex = (viewerIndex + 1) % viewerImages.length;
  renderViewerImage({ animate: true });
}

function previousViewerImage() {
  viewerIndex =
    (viewerIndex - 1 + viewerImages.length) % viewerImages.length;

  renderViewerImage({ animate: true });
}

previousZone.addEventListener("click", previousViewerImage);
nextZone.addEventListener("click", nextViewerImage);
closeZone.addEventListener("click", closeViewer);
viewerBackdrop.addEventListener("click", closeViewer);

viewer.addEventListener(
  "touchstart",
  event => {
    const touch = event.changedTouches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },
  { passive: true }
);

viewer.addEventListener(
  "touchend",
  event => {
    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (
      Math.abs(deltaX) > 55 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      if (deltaX < 0) {
        nextViewerImage();
      } else {
        previousViewerImage();
      }
    }
  },
  { passive: true }
);

window.addEventListener("keydown", event => {
  if (!viewer.classList.contains("is-open")) return;

  if (event.key === "ArrowRight") {
    nextViewerImage();
  }

  if (event.key === "ArrowLeft") {
    previousViewerImage();
  }

  if (event.key === "Escape") {
    closeViewer();
  }
});