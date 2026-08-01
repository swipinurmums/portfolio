const loader = document.querySelector(".loader");
const portfolioRoot = document.querySelector("#portfolio-root");

async function startPortfolio() {
  try {
    const response = await fetch(PORTFOLIO_CONFIG.dataPath, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Could not load portfolio data (${response.status})`);
    }

    const data = await response.json();

    if (!Array.isArray(data.shoots) || data.shoots.length === 0) {
      throw new Error("portfolio.json does not contain any shoots");
    }

    renderPortfolio(data);
    initialiseRevealAnimations();
    initialiseLightbox();
  } catch (error) {
    console.error(error);
    portfolioRoot.innerHTML = `
      <div class="error-message">
        The portfolio could not load. Run the site through GitHub Pages,
        Live Server, or another local web server rather than opening
        index.html directly.
      </div>
    `;
  } finally {
    window.setTimeout(() => loader.classList.add("is-hidden"), 250);
  }
}

startPortfolio();
