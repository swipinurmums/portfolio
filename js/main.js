const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("is-hidden"), 250);
});

initialiseRevealAnimations();
initialiseLightbox();
