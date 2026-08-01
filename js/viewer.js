const viewer = document.querySelector(".viewer");
const viewerImage = document.querySelector(".viewer__image");
const viewerCounter = document.querySelector(".viewer__counter");
const viewerBackdrop = document.querySelector(".viewer__backdrop");
const previousZone = document.querySelector(".viewer__zone--previous");
const closeZone = document.querySelector(".viewer__zone--close");
const nextZone = document.querySelector(".viewer__zone--next");

let viewerImages = [];
let viewerIndex = 0;
let viewerSource = null;
let touchStartX = 0;
let touchStartY = 0;

function configureViewer(images) {
  viewerImages = images;
}

function getContainedRect(image, naturalWidth, naturalHeight) {
  const viewportWidth = window.innerWidth - 32;
  const viewportHeight = window.innerHeight - 96;
  const ratio = Math.min(
    viewportWidth / naturalWidth,
    viewportHeight / naturalHeight
  );

  const width = naturalWidth * ratio;
  const height = naturalHeight * ratio;

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height
  };
}

function animateIntoViewer(sourceButton, image) {
  const sourceImage = sourceButton?.querySelector("img");
  if (!sourceImage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    viewer.classList.add("is-open");
    return;
  }

  const sourceRect = sourceButton.getBoundingClientRect();
  const transitionImage = sourceImage.cloneNode();
  transitionImage.className = "viewer-transition-image";
  transitionImage.style.left = `${sourceRect.left}px`;
  transitionImage.style.top = `${sourceRect.top}px`;
  transitionImage.style.width = `${sourceRect.width}px`;
  transitionImage.style.height = `${sourceRect.height}px`;
  transitionImage.style.objectPosition =
    getComputedStyle(sourceImage).objectPosition || "50% 50%";

  document.body.appendChild(transitionImage);
  viewer.classList.add("is-open");
  viewerImage.style.opacity = "0";

  const preload = new Image();
  preload.src = image.src;

  const run = () => {
    const target = getContainedRect(
      preload.naturalWidth || sourceImage.naturalWidth || sourceRect.width,
      preload.naturalHeight || sourceImage.naturalHeight || sourceRect.height
    );

    requestAnimationFrame(() => {
      transitionImage.style.left = `${target.left}px`;
      transitionImage.style.top = `${target.top}px`;
      transitionImage.style.width = `${target.width}px`;
      transitionImage.style.height = `${target.height}px`;
      transitionImage.style.objectPosition = "50% 50%";
    });

    window.setTimeout(() => {
      viewerImage.style.opacity = "";
      transitionImage.style.opacity = "0";

      window.setTimeout(() => {
        transitionImage.remove();
      }, 180);
    }, 470);
  };

  if (preload.complete) {
    run();
  } else {
    preload.onload = run;
  }
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

function openViewer(index, sourceButton = null) {
  viewerIndex = index;
  viewerSource = sourceButton;
  renderViewerImage();
  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");

  animateIntoViewer(sourceButton, viewerImages[index]);
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  viewerSource = null;
}

function nextViewerImage() {
  viewerIndex = (viewerIndex + 1) % viewerImages.length;
  viewerSource = null;
  renderViewerImage();
}

function previousViewerImage() {
  viewerIndex = (viewerIndex - 1 + viewerImages.length) % viewerImages.length;
  viewerSource = null;
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
