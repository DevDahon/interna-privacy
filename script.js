const SITE_CONFIG = {
  effectiveDate: "August 30, 2026",
  contactEmail: "rodallenagregado19@gmail.com",
  developerName: "Rod Allen Agregado",
  appVersion: "1.0.6",
  portfolioUrl: "https://www.rodagregado.online/",
  teamUrl: "https://iterablueprints.com/",
};

const THEME_STORAGE_KEY = "interna-privacy-theme";

function applyPolicyConfig() {
  document.querySelectorAll("[data-effective-date]").forEach((node) => {
    node.textContent = SITE_CONFIG.effectiveDate;
  });

  document.querySelectorAll("[data-developer-name]").forEach((node) => {
    node.textContent = SITE_CONFIG.developerName;
  });

  document.querySelectorAll("[data-app-version]").forEach((node) => {
    node.textContent = SITE_CONFIG.appVersion;
  });

  document.querySelectorAll("[data-contact-email]").forEach((node) => {
    node.textContent = SITE_CONFIG.contactEmail;
  });

  document.querySelectorAll("[data-contact-link]").forEach((node) => {
    node.setAttribute("href", `mailto:${SITE_CONFIG.contactEmail}`);
  });

  document.querySelectorAll("[data-portfolio-link]").forEach((node) => {
    node.setAttribute("href", SITE_CONFIG.portfolioUrl);
  });

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function getPreferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // A restricted browser may not expose local storage.
  }

  return window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme) {
  const normalized = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = normalized;

  const toggle = document.getElementById("theme-toggle");
  const nextTheme = normalized === "dark" ? "light" : "dark";
  if (toggle) {
    toggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    toggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", normalized === "dark" ? "#07101f" : "#f4f7fb");
  }
}

function setupThemeToggle() {
  applyTheme(getPreferredTheme());

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The visual theme still changes for this page view.
    }
  });
}

function setupActiveNavState() {
  const links = [...document.querySelectorAll(".nav-link")];
  const sectionEntries = links
    .map((link) => {
      const selector = link.getAttribute("href");
      if (!selector?.startsWith("#")) return null;
      const section = document.querySelector(selector);
      return section ? { link, selector, section } : null;
    })
    .filter(Boolean);

  if (!sectionEntries.length) return;

  let isClickScrolling = false;
  let clickTimeout = null;

  const syncActive = (activeSelector) => {
    sectionEntries.forEach(({ link, selector }) => {
      const isActive = selector === activeSelector;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  sectionEntries.forEach(({ link, selector }) => {
    link.addEventListener("click", () => {
      isClickScrolling = true;
      syncActive(selector);
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 900);
    });
  });

  const onScroll = () => {
    if (isClickScrolling) return;

    // If near the bottom of the page, activate the last section (#contact)
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollPosition >= documentHeight - 80) {
      syncActive(sectionEntries[sectionEntries.length - 1].selector);
      return;
    }

    // Determine current active section based on scroll offset
    const offset = 200;
    let currentActive = sectionEntries[0].selector;

    for (const { selector, section } of sectionEntries) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset) {
        currentActive = selector;
      }
    }

    syncActive(currentActive);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) throw new Error("Copy is not supported in this browser.");
}

function setupInteractiveEmailChip() {
  const button = document.getElementById("email-chip");
  const status = document.getElementById("email-copied");
  if (!button || !status) return;

  let clearStatusTimer;
  button.addEventListener("click", async () => {
    clearTimeout(clearStatusTimer);
    try {
      await copyText(SITE_CONFIG.contactEmail);
      status.textContent = "Email copied.";
    } catch {
      status.textContent = "Copy failed. Select the email address instead.";
    }

    clearStatusTimer = setTimeout(() => {
      status.textContent = "";
    }, 3500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyPolicyConfig();
  setupThemeToggle();
  setupActiveNavState();
  setupInteractiveEmailChip();
});
