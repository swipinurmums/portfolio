const portfolioPhotos = [...document.querySelectorAll(".photo")];

function getPhotoSource(index) {
  const image = portfolioPhotos[index].querySelector("img");

  return {
    src: image.currentSrc || image.src,
    alt: image.alt
  };
}
