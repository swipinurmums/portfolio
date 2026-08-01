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

function getContainedRect(naturalWidth, naturalHeight) {
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

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!sourceImage || reduceMotion) {
    viewer.classList.add("is-open", "is-settled");
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

  const preload = new Image();
  preload.src = image.src;

  const runAnimation = () => {
    const naturalWidth =
      preload.naturalWidth ||
      sourceImage.naturalWidth ||
      sourceRect.width;

    const naturalHeight =
      preload.naturalHeight ||
      sourceImage.naturalHeight ||
      sourceRect.height;

    const target = getContainedRect(naturalWidth, naturalHeight);

    requestAnimationFrame(() => {
      transitionImage.style.left = `${target.left}px`;
      transitionImage.style.top = `${target.top}px`;
      transitionImage.style.width = `${target.width}px`;
      transitionImage.style.height = `${target.height}px`;
      transitionImage.style.objectPosition = "50% 50%";
    });

    window.setTimeout(() => {
      viewer.classList.add("is-settled");
      transitionImage.style.opacity = "0";

      window.setTimeout(() => {
        transitionImage.remove();
      }, 150);
    }, 400);
  };

  if (preload.complete) {
    runAnimation();
  } else {
    preload.onload = runAnimation;

    preload.onerror = () => {
      viewer.classList.add("is-settled");
      transitionImage.remove();
    };
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
  viewer.classList.remove("is-settled");

  viewerIndex = index;
  viewerSource = sourceButton;

  renderViewerImage();

  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");

  animateIntoViewer(sourceButton, viewerImages[index]);
}

function closeViewer() {
  viewer.classList.remove("is-open", "is-settled");
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
  viewerIndex =
    (viewerIndex - 1 + viewerImages.length) % viewerImages.length;

  viewerSource = null;
  renderViewerImage();
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