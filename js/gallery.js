let portfolioImages = [];

const layoutImageLimits = {
  hero: 1,
  feature: 1,
  "single-wide": 1,
  "single-large-left": 1,
  "single-inset-left": 1,
  "single-inset-right": 1,
  "pair-staggered": 2,
  "pair-equal": 2,
  landscape: 1,
  cinematic: 1,
  triptych: 3
};

function createShot(image, globalIndex, isFirstShoot) {
  const button = document.createElement("button");

  button.className = [
    "shot",
    isFirstShoot ? "" : "reveal",
    image.className || ""
  ].filter(Boolean).join(" ");

  button.type = "button";
  button.dataset.index = String(globalIndex);
  button.setAttribute("aria-label", `Open image ${globalIndex + 1}`);

  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.alt || "Portfolio image";
  img.decoding = "async";

  if (image.position) {
    img.style.objectPosition = image.position;
  }

  if (globalIndex === 0) {
    img.fetchPriority = "high";
  } else {
    img.loading = "lazy";
  }

  button.appendChild(img);
  return button;
}

function createShootSection(shoot, shootIndex) {
  const section = document.createElement("section");
  section.className = `shoot layout--${shoot.layout}`;
  section.dataset.shoot = shoot.id || `shoot-${shootIndex + 1}`;

  const expectedCount = layoutImageLimits[shoot.layout];
  const selectedImages = expectedCount
    ? shoot.images.slice(0, expectedCount)
    : shoot.images;

  selectedImages.forEach(image => {
    const globalIndex = portfolioImages.length;
    portfolioImages.push(image);
    section.appendChild(createShot(image, globalIndex, shootIndex === 0));
  });

  return section;
}

function createContactScreen(contact) {
  if (!contact || contact.enabled === false) return null;

  const section = document.createElement("section");
  section.className = "contact-screen";

  const links = [
    contact.email ? {
      text: contact.email,
      href: `mailto:${contact.email}`
    } : null,
    contact.instagram ? {
      text: "Instagram",
      href: contact.instagram
    } : null
  ].filter(Boolean);

  links.forEach(linkData => {
    const link = document.createElement("a");
    link.textContent = linkData.text;
    link.href = linkData.href;

    if (linkData.href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }

    section.appendChild(link);
  });

  return section;
}

function createLoopReturn() {
  const section = document.createElement("section");
  section.className = "loop-return";

  const link = document.createElement("a");
  link.href = "#top";
  link.textContent = "AB";
  link.setAttribute("aria-label", "Return to the beginning");

  section.appendChild(link);
  return section;
}

function renderPortfolio(data) {
  const root = document.querySelector("#portfolio-root");
  const feed = document.createElement("div");
  feed.className = "portfolio-feed";

  portfolioImages = [];

  data.shoots.forEach((shoot, index) => {
    feed.appendChild(createShootSection(shoot, index));
  });

  const contact = createContactScreen(data.contact);
  if (contact) feed.appendChild(contact);

  if (data.settings?.loopReturn !== false) {
    feed.appendChild(createLoopReturn());
  }

  root.replaceChildren(feed);
}
