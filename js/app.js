const loader = document.querySelector(".loader");
const portfolioRoot = document.querySelector("#portfolio");
const desktopCursor = document.querySelector(".desktop-cursor");

let allImages = [];

function createShot(image, extraClass = "") {
  const index = allImages.length;
  allImages.push(image);

  const button = document.createElement("button");
  button.type = "button";
  button.className = ["shot", "reveal", extraClass, image.previewClass || ""]
    .filter(Boolean)
    .join(" ");
  button.setAttribute("aria-label", `Open image ${index + 1}`);

  if (image.position) {
    button.style.setProperty("--position", image.position);
  }

  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.alt || "Portfolio image";
  img.loading = index === 0 ? "eager" : "lazy";
  img.decoding = "async";

  if (index === 0) {
    img.fetchPriority = "high";
    button.classList.remove("reveal");
    button.classList.add("hero-shot");
  }

  button.appendChild(img);
  button.addEventListener("click", () => openViewer(index, button));

  return button;
}

function grid(className, images) {
  const container = document.createElement("div");
  container.className = `chapter-grid ${className}`;

  images.forEach(image => {
    container.appendChild(createShot(image));
  });

  return container;
}

function chapter(className = "") {
  const section = document.createElement("section");
  section.className = `chapter ${className}`.trim();
  return section;
}

function renderRunway(section) {
  const [hero, portraitLarge, portraitSmall, wide, finalLeft, finalRight] = section.images;
  const chapterNode = chapter("chapter--runway");

  const heroWrap = document.createElement("div");
  heroWrap.className = "runway-hero";
  heroWrap.appendChild(createShot(hero));
  chapterNode.appendChild(heroWrap);

  chapterNode.appendChild(grid("runway-pair", [portraitLarge, portraitSmall]));
  chapterNode.appendChild(grid("runway-wide", [wide]));
  chapterNode.appendChild(grid("runway-closing", [finalLeft, finalRight]));

  return chapterNode;
}

function renderWorldCup(section) {
  const [headshot, second, pairLeft, pairRight, group, wide] = section.images;
  const chapterNode = chapter("chapter--world-cup");

  chapterNode.appendChild(grid("world-cup-headshot", [headshot]));
  chapterNode.appendChild(grid("world-cup-second", [second]));
  chapterNode.appendChild(grid("world-cup-pair", [pairLeft, pairRight]));
  chapterNode.appendChild(grid("world-cup-group", [group]));
  chapterNode.appendChild(grid("world-cup-landscape", [wide]));

  return chapterNode;
}

function renderEsmee(section) {
  const [feature, fullLength, closePortrait, closingLeft, closingRight] = section.images;
  const chapterNode = chapter("chapter--esmee");

  const featureWrap = document.createElement("div");
  featureWrap.className = "esmee-feature";
  featureWrap.appendChild(createShot(feature));
  chapterNode.appendChild(featureWrap);

  chapterNode.appendChild(grid("esmee-full", [fullLength]));
  chapterNode.appendChild(grid("esmee-close", [closePortrait]));
  chapterNode.appendChild(grid("esmee-closing", [closingLeft, closingRight]));

  return chapterNode;
}

function renderPair(section, className) {
  const chapterNode = chapter(`chapter--${section.id}`);
  chapterNode.appendChild(grid(className, section.images));
  return chapterNode;
}

function renderContact(contact) {
  const section = document.createElement("footer");
  section.className = "contact";

  const name = document.createElement("a");
  name.className = "contact__name";
  name.href = "#top";
  name.textContent = "Aron Belle";
  name.setAttribute("aria-label", "Aron Belle — return to the beginning");
  section.appendChild(name);

  if (contact.instagram) {
    const instagram = document.createElement("a");
    instagram.href = contact.instagram;
    instagram.target = "_blank";
    instagram.rel = "noreferrer";
    instagram.textContent = "Instagram";
    section.appendChild(instagram);
  }

  if (contact.email) {
    const email = document.createElement("a");
    email.href = `mailto:${contact.email}`;
    email.textContent = "Email";
    email.setAttribute("aria-label", contact.email);
    section.appendChild(email);
  }

  return section;
}

function initialiseRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: .12,
    rootMargin: "0px 0px -5% 0px"
  });

  items.forEach(item => observer.observe(item));
}

function initialiseDesktopCursor() {
  if (!desktopCursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  window.addEventListener("pointermove", event => {
    desktopCursor.style.left = `${event.clientX}px`;
    desktopCursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll(".shot").forEach(shot => {
    shot.addEventListener("pointerenter", () => {
      desktopCursor.classList.add("is-over-image");
    });

    shot.addEventListener("pointerleave", () => {
      desktopCursor.classList.remove("is-over-image");
    });
  });

  document.documentElement.addEventListener("mouseleave", () => {
    desktopCursor.style.opacity = "0";
  });

  document.documentElement.addEventListener("mouseenter", () => {
    desktopCursor.style.opacity = "1";
  });
}

async function start() {
  try {
    const response = await fetch("data/portfolio.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Could not load portfolio data (${response.status})`);
    }

    const data = await response.json();
    const feed = document.createElement("div");
    feed.className = "portfolio-feed";

    allImages = [];

    data.sections.forEach(section => {
      if (section.type === "runway") feed.appendChild(renderRunway(section));
      if (section.type === "world-cup") feed.appendChild(renderWorldCup(section));
      if (section.type === "esmee") feed.appendChild(renderEsmee(section));
      if (section.type === "timmy") feed.appendChild(renderPair(section, "timmy-grid"));
      if (section.type === "tux") feed.appendChild(renderPair(section, "tux-grid"));
      if (section.type === "digis") feed.appendChild(renderPair(section, "digis-grid"));
    });

    feed.appendChild(renderContact(data.contact));

    portfolioRoot.replaceChildren(feed);
    configureViewer(allImages);
    initialiseRevealAnimations();
    initialiseDesktopCursor();

    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  } catch (error) {
    console.error(error);
    portfolioRoot.innerHTML = `
      <div class="error">
        The portfolio could not load. Use GitHub Pages or a local web server.
      </div>
    `;
  } finally {
    window.setTimeout(() => loader.classList.add("is-hidden"), 1050);
  }
}

start();
