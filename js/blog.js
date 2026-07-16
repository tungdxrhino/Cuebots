const menuButton = document.querySelector("[data-blog-menu]");
const navigation = document.querySelector("[data-blog-nav]");

if (document.querySelector(".breadcrumb") && !document.querySelector('link[href="sticky-nav.css"]')) {
  const stickyNavigationStyles = document.createElement("link");
  stickyNavigationStyles.rel = "stylesheet";
  stickyNavigationStyles.href = "sticky-nav.css";
  document.head.append(stickyNavigationStyles);
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Close" : "Menu";
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !navigation.classList.contains("open")) return;
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
    menuButton.focus();
  });
}
