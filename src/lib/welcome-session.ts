export const WELCOME_STORAGE_KEY = "portfolio:welcome-seen";

// This small synchronous head script runs before the body can paint. Session
// storage is scoped to this tab and survives reloads without affecting others.
export const WELCOME_BOOTSTRAP = `(() => {
  let seen = true;
  try {
    seen = sessionStorage.getItem(${JSON.stringify(WELCOME_STORAGE_KEY)}) === "1";
    sessionStorage.setItem(${JSON.stringify(WELCOME_STORAGE_KEY)}, "1");
  } catch { seen = true; }
  const reloaded = performance.getEntriesByType("navigation")[0]?.type === "reload";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.dataset.portfolioWelcome =
    (!seen || reloaded) && location.pathname === "/" && !reduced ? "play" : "skip";
})();`;
