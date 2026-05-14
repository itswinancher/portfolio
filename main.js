function setYear() {
  const node = document.querySelector("[data-year]");
  if (node) node.textContent = String(new Date().getFullYear());
}

function setupMobileMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (!menuToggle || !mobileMenu) return;

  const close = () => {
    mobileMenu.setAttribute("data-open", "false");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    mobileMenu.setAttribute("data-open", "true");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.getAttribute("data-open") === "true";
    if (isOpen) close();
    else open();
  });

  // Fermer le menu mobile lors du clic sur un lien ou sur le logo
  document.addEventListener("click", (event) => {
    const target = event.target;
    const isLink = target.closest("a");
    const isMobileMenuOpen = mobileMenu.getAttribute("data-open") === "true";
    
    if (isLink && isLink.hash) {
      // Optionnel: mise à jour immédiate de l'état actif lors du clic
      const links = document.querySelectorAll(".nav__link");
      links.forEach(l => {
        if (l.getAttribute("href") === isLink.hash) l.setAttribute("aria-current", "page");
        else l.removeAttribute("aria-current");
      });
    }

    if (isMobileMenuOpen && isLink) {
      close();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function setupActiveNav() {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  if (links.length === 0) return;

  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter((n) => n instanceof HTMLElement);

  const setCurrent = (id) => {
    for (const link of links) {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      if (isCurrent) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setCurrent(visible.target.id);
      }
    },
    { rootMargin: "-10% 0px -80% 0px", threshold: [0, 0.1] },
  );

  for (const section of sections) observer.observe(section);
}

function main() {
  setYear();
  setupMobileMenu();
  setupActiveNav();
}

main();

