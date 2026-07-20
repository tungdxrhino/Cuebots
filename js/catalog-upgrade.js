(() => {
  "use strict";

  const body = document.body;
  const ROOT = body.dataset.root || "";
  const PAGE_TYPE = body.dataset.pageType || (body.dataset.contentSlug ? "content" : "home");
  const params = new URLSearchParams(location.search);
  const PAGE = params.get("id") || body.dataset.page || body.dataset.contentSlug || "home";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const path = value => `${ROOT}${value}`;

  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const compact = value => String(value || "").replace(/\s+/g, " ").trim();
  const truncate = (value, length = 150) => compact(value).length > length ? `${compact(value).slice(0, length).replace(/\s+\S*$/, "")}…` : compact(value);

  let catalog = [];
  let collections = [];
  let contentPages = [];
  let promotions = [];
  let visibleProducts = [];
  let visibleLimit = 24;

  const classLabels = {
    "complete-cue": "Complete cue",
    "cue-butt": "Butt only",
    shaft: "Shaft",
    case: "Cue case",
    glove: "Glove",
    accessory: "Accessory",
    bundle: "Bundle",
    service: "Service"
  };

  const currencyConfig = {
    USD: { rate: 1 / 26150, locale: "en-US", currency: "USD" },
    VND: { rate: 1, locale: "vi-VN", currency: "VND" },
    CNY: { rate: 7.18 / 26150, locale: "zh-CN", currency: "CNY" },
    EUR: { rate: .86 / 26150, locale: "fr-FR", currency: "EUR" },
    KRW: { rate: 1390 / 26150, locale: "ko-KR", currency: "KRW" },
    JPY: { rate: 156 / 26150, locale: "ja-JP", currency: "JPY" }
  };

  function selectedCurrency() {
    try { return sessionStorage.getItem("cuebotsCurrency") || "USD"; }
    catch { return "USD"; }
  }

  function roundedDisplay(value) {
    const amount = Math.max(0, Math.round(Number(value) || 0));
    if (amount < 1000) return amount;
    const step = 10 ** Math.max(0, String(amount).length - 3);
    return Math.floor(amount / step) * step;
  }

  function money(vndValue) {
    const key = currencyConfig[selectedCurrency()] ? selectedCurrency() : "USD";
    const config = currencyConfig[key];
    return new Intl.NumberFormat(config.locale, { style: "currency", currency: config.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(roundedDisplay(Number(vndValue || 0) * config.rate));
  }

  function localImage(product, index = 0) {
    const image = product?.images?.[index] || product?.images?.[0];
    return image?.localPath ? path(image.localPath) : path("assets/images/brand/logo-cuebots-horizontal-blue-01.webp");
  }

  function imageMarkup(product, index = 0, eager = false) {
    const image = product?.images?.[index] || product?.images?.[0] || {};
    return `<img src="${escapeHtml(localImage(product, index))}" width="${Number(image.width) || 1200}" height="${Number(image.height) || 1200}" alt="${escapeHtml(image.alt || product?.title || "CUEBOTS product")}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>`;
  }

  function detailUrl(product) {
    return path(`pages/product-view.html?id=${encodeURIComponent(product.slug)}`);
  }

  function collectionUrl(slug) {
    const staticRoutes = {
      "pool-cues": "collection-pool-cues.html", "break-cues": "collection-break-cues.html", "jump-cues": "collection-jump-cues.html",
      "carbon-shafts": "collection-carbon-shafts.html", "cue-butts": "collection-cue-butts.html", cases: "collection-cases.html",
      gloves: "collection-gloves.html", accessories: "collection-accessories.html"
    };
    return path(`pages/${staticRoutes[slug] || `collection-view.html?id=${encodeURIComponent(slug)}`}`);
  }

  function values(product, key) {
    return [...new Set((product?.specs?.[key] || []).map(compact).filter(Boolean))];
  }

  function productFacts(product) {
    const facts = [];
    if (product.cueType) facts.push(product.cueType);
    if (product.shaftPurpose) facts.push(product.shaftPurpose);
    if (product.caseType) facts.push(product.caseType);
    if (product.gloveHand) facts.push(`${product.gloveHand} hand`);
    [["joint", "Joint"], ["diameter", "Diameter"], ["weight", "Weight"], ["capacity", "Capacity"]].forEach(([key, label]) => {
      if (values(product, key)[0]) facts.push(`${label}: ${values(product, key)[0]}`);
    });
    if (product.productClass === "cue-butt") facts.unshift("BUTT ONLY");
    return [...new Set(facts)].slice(0, 4);
  }

  function requiresOptions(product) {
    return (product.options || []).some(option => !/^title$/i.test(option.name || "") && (option.values || []).length > 0);
  }

  function productCard(product) {
    const compare = Number(product.compareAtPrice) > Number(product.price) ? `<del>${money(product.compareAtPrice)}</del>` : "";
    const discount = Number(product.compareAtPrice) > Number(product.price) ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
    const facts = productFacts(product);
    return `<article class="catalog-product-card" data-product-class="${escapeHtml(product.productClass || "unclassified")}">
      <a class="catalog-product-media" href="${detailUrl(product)}">${imageMarkup(product)}${discount ? `<span class="catalog-sale-badge">-${discount}%</span>` : ""}<span class="catalog-stock ${product.available ? "in-stock" : "out-stock"}">${product.available ? "IN STOCK" : "OUT OF STOCK"}</span></a>
      <button class="catalog-heart" type="button" data-catalog-wishlist="${escapeHtml(product.slug)}" aria-label="Save ${escapeHtml(product.title)}"><svg class="icon"><use href="#i-heart"></use></svg></button>
      <div class="catalog-product-copy"><p class="catalog-product-brand">${escapeHtml(product.vendor || "CUEBOTS")} · ${escapeHtml(classLabels[product.productClass] || "Equipment")}</p><h3><a href="${detailUrl(product)}">${escapeHtml(product.title)}</a></h3>
      ${facts.length ? `<ul>${facts.map(fact => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>` : `<p>${escapeHtml(truncate(product.description, 92) || "View product details and available configurations.")}</p>`}
      <div class="catalog-price"><strong>${money(product.price)}</strong>${compare}</div>
      <div class="catalog-card-actions">${requiresOptions(product) ? `<a class="btn" href="${detailUrl(product)}">VIEW OPTIONS</a>` : `<button class="btn" type="button" data-catalog-add="${escapeHtml(product.slug)}"${product.available ? "" : " disabled"}>ADD TO CART</button>`}<button class="btn btn-secondary" type="button" data-catalog-quick="${escapeHtml(product.slug)}">QUICK VIEW</button></div></div>
    </article>`;
  }

  async function loadData() {
    const filenames = ["products.json", "collections.json", "pages.json", "promotions.json"];
    const responses = await Promise.all(filenames.map(filename => fetch(path(`data/${filename}`), { cache: "no-cache" })));
    if (responses.some(response => !response.ok)) throw new Error("Catalog data files are unavailable.");
    [catalog, collections, contentPages, promotions] = await Promise.all(responses.map(response => response.json()));
    catalog = catalog.filter(product => product.productClass);
    window.CUEBOTS_CATALOG = catalog;
  }

  const coreRoute = {
    home: path("index.html"), cues: collectionUrl("pool-cues"), butts: collectionUrl("cue-butts"), shafts: collectionUrl("carbon-shafts"),
    casesGloves: collectionUrl("cases"), accessories: collectionUrl("accessories"), discover: path("pages/discover.html"), support: path("pages/support.html")
  };

  function bestProducts(filter, limit = 3) {
    return catalog.filter(filter).sort((a, b) => Number(b.available) - Number(a.available) || new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, limit);
  }

  function contentCard(title, copy, url, product) {
    return `<a class="mega-visual-card" href="${url}"><span class="mega-visual-media">${product ? imageMarkup(product) : `<span class="mega-fallback-art" aria-hidden="true">CUEBOTS</span>`}</span><span class="mega-visual-label"><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(copy)}</small></span><span aria-hidden="true">→</span></span></a>`;
  }

  function menuConfigurations() {
    const productPanel = (label, url, filter, links = []) => ({ label, url, products: bestProducts(filter), links });
    return [
      { label: "CUES", url: coreRoute.cues, panels: [
        productPanel("Pool Cues", collectionUrl("pool-cues"), p => p.productClass === "complete-cue" && p.cueType === "pool", ["Complete Sets", "Best Sellers", "New Arrivals"]),
        productPanel("Break Cues", collectionUrl("break-cues"), p => p.productClass === "complete-cue" && p.cueType === "break", ["Power Cues", "Break Shafts"]),
        productPanel("Jump Cues", collectionUrl("jump-cues"), p => p.productClass === "complete-cue" && p.cueType === "jump", ["Compact Jump Cues", "Break & Jump"]),
        productPanel("Carom Cues", collectionUrl("carom-cues"), p => p.productClass === "complete-cue" && p.cueType === "carom", ["Carom Series", "Carom Shafts"])
      ], promo: ["Find Your Setup", "Compare complete cues by purpose and fit.", path("pages/buying-guides.html")] },
      { label: "BUTTS", url: coreRoute.butts, panels: [
        productPanel("All Cue Butts", collectionUrl("cue-butts"), p => p.productClass === "cue-butt", ["Playing Butts", "Break Butts", "Carom Butts"]),
        productPanel("Shop by Wrap", `${collectionUrl("cue-butts")}#filters`, p => p.productClass === "cue-butt" && values(p, "wrap").length, ["Wrapless", "Leather Wrap", "Sport Wrap"]),
        productPanel("Compatibility", path("pages/compatibility-help.html"), p => p.productClass === "cue-butt" && values(p, "joint").length, ["Joint / Pin", "Compatible Shafts", "Ask an Expert"])
      ], promo: ["Joint Compatibility", "Confirm the fit before choosing a butt.", path("pages/joint-guide.html")] },
      { label: "SHAFTS", url: coreRoute.shafts, panels: [
        productPanel("All Shafts", collectionUrl("carbon-shafts"), p => p.productClass === "shaft", ["Playing Shafts", "Break Shafts", "Carom Shafts"]),
        productPanel("Shop by Joint", `${collectionUrl("carbon-shafts")}#filters`, p => p.productClass === "shaft" && values(p, "joint").length, ["Radial", "Uni-Loc / UNI-QR", "3/8 & 5/16"]),
        productPanel("Shop by Diameter", `${collectionUrl("carbon-shafts")}#filters`, p => p.productClass === "shaft" && values(p, "diameter").length, ["Low Deflection", "Playing Profiles", "Break Profiles"])
      ], promo: ["Upgrade My Shaft", "Keep your butt. Change the response.", path("pages/shaft-selection-guide.html")] },
      { label: "CASES & GLOVES", url: coreRoute.casesGloves, panels: [
        productPanel("Cue Cases", collectionUrl("cases"), p => p.productClass === "case", ["Soft Cases", "Hard Cases", "Shop by Capacity"]),
        productPanel("Pool Gloves", collectionUrl("gloves"), p => p.productClass === "glove", ["Left Hand", "Right Hand", "Multi-buy Packs"])
      ], promo: ["Fit & Capacity Guides", "Choose glove sizing or case capacity with confidence.", path("pages/glove-size-guide.html")] },
      { label: "ACCESSORIES", url: coreRoute.accessories, panels: [
        productPanel("Playing Essentials", collectionUrl("accessories"), p => p.productClass === "accessory", ["Cue Tips", "Chalk", "Joint Protectors"]),
        productPanel("Care & Maintenance", `${collectionUrl("accessories")}#filters`, p => p.productClass === "accessory" && /clean|care|towel|maint/i.test(`${p.title} ${p.description}`), ["Cleaning Products", "Towels", "Replacement Parts"])
      ], promo: ["Product Care", "Keep your equipment clean and match-ready.", path("pages/product-care.html")] },
      { label: "DISCOVER", url: coreRoute.discover, panels: [
        { label: "CUEBOTS", url: path("pages/our-story.html"), links: ["Our Story", "About CUEBOTS", "Customization"], cards: [["Our Story", "Built for players", path("pages/our-story.html")], ["About CUEBOTS", "Company and craft", path("pages/about.html")], ["Customization", "Make the cue your own", path("pages/customization.html")]] },
        { label: "Guides", url: path("pages/buying-guides.html"), links: ["Buying Guides", "Product Guides", "Joint Guide"], cards: [["Buying Guides", "Choose with clarity", path("pages/buying-guides.html")], ["Shaft Guide", "Profile, joint and purpose", path("pages/shaft-selection-guide.html")], ["Joint Guide", "Compatibility explained", path("pages/joint-guide.html")]] },
        { label: "Latest Articles", url: path("pages/blog.html"), links: ["Blog", "Latest Articles", "Player Stories"], cards: [["CUEBOTS Blog", "Latest equipment knowledge", path("pages/blog.html")], ["Product Care", "Simple maintenance", path("pages/product-care.html")], ["Player Stories", "Community and reviews", path("pages/player-stories.html")]] }
      ], promo: ["Explore CUEBOTS", "Design, knowledge and player stories.", path("pages/discover.html")] },
      { label: "SUPPORT", url: coreRoute.support, panels: [
        { label: "Order Help", url: path("pages/order-support.html"), links: ["Shipping", "Returns & Exchanges", "Cancellation", "Warranty", "Order Status"], cards: [["Shipping Policy", "Delivery information", path("pages/shipping-policy.html")], ["Returns & Exchanges", "Before and after purchase", path("pages/returns-policy.html")], ["Warranty", "Coverage and claims", path("pages/warranty.html")]] },
        { label: "Product Help", url: path("pages/compatibility-help.html"), links: ["Joint Compatibility", "Shaft Selection", "Glove Sizing", "Product Care"], cards: [["Compatibility Help", "Butt and shaft fit", path("pages/compatibility-help.html")], ["Glove Size Guide", "Choose the right fit", path("pages/glove-size-guide.html")], ["Product Care", "Maintenance guidance", path("pages/product-care.html")]] },
        { label: "Contact", url: path("pages/contact.html"), links: ["Contact Us", "FAQ", "Ask an Expert"], cards: [["Contact Us", "CUEBOTS support", path("pages/contact.html")], ["FAQ", "Quick answers", path("pages/faq.html")], ["Ask an Expert", "Get compatibility help", path("pages/ask-an-expert.html")]] }
      ], promo: ["Ask an Expert", "Get human help before you order.", path("pages/ask-an-expert.html")] }
    ];
  }

  function megaPanel(menu, panel, menuIndex, panelIndex) {
    const fallbackProducts = catalog.slice(0, 3);
    const products = panel.products || [];
    const cards = panel.cards
      ? panel.cards.map((card, index) => contentCard(card[0], card[1], card[2], fallbackProducts[index])).join("")
      : products.map(product => contentCard(product.title, `${product.vendor || "CUEBOTS"} · ${money(product.price)}`, detailUrl(product), product)).join("");
    const fillCards = cards || contentCard("View the collection", "Browse available equipment", panel.url, fallbackProducts[0]);
    const promoProduct = products[0] || fallbackProducts[0];
    return `<section class="mega-menu-panel${panelIndex === 0 ? " active" : ""}" id="catalog-mega-${menuIndex}-${panelIndex}" role="tabpanel" data-catalog-mega-panel="${panelIndex}"${panelIndex === 0 ? "" : " hidden"}><div class="mega-panel-title"><span>${escapeHtml(panel.label)}</span><a href="${panel.url}">VIEW ALL →</a></div><div class="mega-quick-links">${(panel.links || []).map(link => `<a href="${panel.url}">${escapeHtml(link)}</a>`).join("")}</div><div class="mega-visual-grid">${fillCards}<a class="mega-promo-card" href="${menu.promo[2]}">${promoProduct ? imageMarkup(promoProduct) : ""}<span><small>PLAYER SUPPORT</small><strong>${escapeHtml(menu.promo[0])}</strong><b>${escapeHtml(menu.promo[1])} →</b></span></a></div></section>`;
  }

  function renderNavigation() {
    const desktop = $("[data-desktop-nav],.desktop-nav");
    const mobile = $("[data-mobile-nav],.mobile-nav");
    if (!desktop) return;
    const menus = menuConfigurations();
    desktop.innerHTML = `<div class="nav-item"><a class="nav-link" href="${coreRoute.home}"${PAGE_TYPE === "home" ? ' aria-current="page"' : ""}>HOME</a></div>` + menus.map((menu, menuIndex) => {
      const tabs = menu.panels.map((panel, panelIndex) => `<button class="mega-menu-tab${panelIndex === 0 ? " active" : ""}" type="button" role="tab" aria-selected="${panelIndex === 0}" aria-controls="catalog-mega-${menuIndex}-${panelIndex}" data-catalog-mega-tab="${panelIndex}"><span>${escapeHtml(panel.label)}</span><span aria-hidden="true">→</span></button>`).join("");
      return `<div class="nav-item has-dropdown" data-catalog-menu><a class="nav-link" href="${menu.url}" aria-haspopup="true" aria-expanded="false" aria-controls="catalog-menu-${menuIndex}" data-catalog-mega-trigger>${menu.label}</a><div class="nav-dropdown mega-menu" id="catalog-menu-${menuIndex}"><div class="mega-menu-shell"><aside class="mega-menu-sidebar"><small>EXPLORE ${menu.label}</small><div class="mega-menu-tabs" role="tablist">${tabs}</div><a class="mega-menu-view-all" href="${menu.url}">VIEW ALL ${menu.label} →</a></aside><div class="mega-menu-content">${menu.panels.map((panel, panelIndex) => megaPanel(menu, panel, menuIndex, panelIndex)).join("")}</div></div></div></div>`;
    }).join("");
    if (mobile) mobile.innerHTML = `<a class="mobile-nav-card catalog-mobile-home" href="${coreRoute.home}"><span><strong>HOME</strong><small>RETURN TO HOME →</small></span></a>` + menus.map(menu => `<details class="catalog-mobile-group"><summary>${menu.label}<span>+</span></summary>${menu.panels.map(panel => `<a href="${panel.url}">${escapeHtml(panel.label)}<span>→</span></a>`).join("")}<a class="catalog-mobile-view-all" href="${menu.url}">VIEW ALL ${menu.label}</a></details>`).join("");
    wireMegaMenus();
  }

  function wireMegaMenus() {
    const items = $$('[data-catalog-menu]');
    const close = item => { item.classList.remove("is-mega-open"); $("[data-catalog-mega-trigger]", item)?.setAttribute("aria-expanded", "false"); };
    const open = item => { if (!matchMedia("(min-width: 1181px)").matches) return; items.forEach(other => other !== item && close(other)); item.classList.add("is-mega-open"); $("[data-catalog-mega-trigger]", item)?.setAttribute("aria-expanded", "true"); };
    items.forEach(item => {
      const trigger = $("[data-catalog-mega-trigger]", item);
      const tabs = $$('[data-catalog-mega-tab]', item);
      const panels = $$('[data-catalog-mega-panel]', item);
      const select = index => { tabs.forEach((tab, i) => { tab.classList.toggle("active", i === index); tab.setAttribute("aria-selected", String(i === index)); }); panels.forEach((panel, i) => { panel.hidden = i !== index; panel.classList.toggle("active", i === index); }); };
      tabs.forEach((tab, index) => {
        tab.addEventListener("mouseenter", () => select(index));
        tab.addEventListener("focus", () => select(index));
        tab.addEventListener("click", () => select(index));
        tab.addEventListener("keydown", event => { if (!/ArrowUp|ArrowDown|Home|End/.test(event.key)) return; event.preventDefault(); const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowDown" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length; tabs[next].focus(); });
      });
      item.addEventListener("mouseenter", () => open(item));
      item.addEventListener("mouseleave", () => close(item));
      item.addEventListener("focusin", () => open(item));
      item.addEventListener("focusout", () => requestAnimationFrame(() => !item.contains(document.activeElement) && close(item)));
      trigger.addEventListener("keydown", event => { if (event.key === "ArrowDown") { event.preventDefault(); open(item); setTimeout(() => tabs[0]?.focus(), 0); } if (event.key === "Escape") { close(item); trigger.focus(); } });
      item.addEventListener("keydown", event => { if (event.key === "Escape") { event.preventDefault(); close(item); trigger.focus(); } });
    });
    document.addEventListener("pointerdown", event => { if (!event.target.closest("[data-catalog-menu]")) items.forEach(close); });
  }

  const collectionRules = {
    "pool-cues": { title: "Pool Cues", eyebrow: "COMPLETE PLAYING CUES", description: "Complete pool cues only — compare purpose, joint, shaft profile and wrap without mixing in single shafts or butts.", filter: p => p.productClass === "complete-cue" && p.cueType === "pool" },
    "break-cues": { title: "Break Cues", eyebrow: "POWER WITH CONTROL", description: "Purpose-built complete break cues for the opening shot.", filter: p => p.productClass === "complete-cue" && p.cueType === "break" },
    "jump-cues": { title: "Jump Cues", eyebrow: "CREATE A WAY OUT", description: "Complete jump cues selected for controlled elevation and difficult recovery shots.", filter: p => p.productClass === "complete-cue" && p.cueType === "jump" },
    "carom-cues": { title: "Carom Cues", eyebrow: "CAROM PERFORMANCE", description: "Complete carom cues, separated from single carom shafts.", filter: p => p.productClass === "complete-cue" && p.cueType === "carom" },
    "cue-butts": { title: "Cue Butts", eyebrow: "BUTT ONLY", description: "Cue butts only. Confirm joint, weight and wrap before selecting a compatible shaft.", filter: p => p.productClass === "cue-butt" },
    "carbon-shafts": { title: "Shafts", eyebrow: "CHOOSE PURPOSE AND FIT", description: "Playing, break and carom shafts with joint and diameter information kept visible.", filter: p => p.productClass === "shaft" },
    cases: { title: "Cue Cases", eyebrow: "PROTECT YOUR SETUP", description: "Hard and soft cue cases organized by capacity, color and brand.", filter: p => p.productClass === "case" },
    gloves: { title: "Billiard Gloves", eyebrow: "CONSISTENT BRIDGE", description: "Choose hand, color and pack; select your exact size on the product page.", filter: p => p.productClass === "glove" },
    accessories: { title: "Accessories", eyebrow: "MATCH-READY DETAILS", description: "Tips, chalk, protectors, extensions, care products and small parts — cases and gloves stay in their own collections.", filter: p => p.productClass === "accessory" }
  };

  function currentCollectionRule() {
    if (collectionRules[PAGE]) return collectionRules[PAGE];
    if (PAGE === "sale") return { title: "Current Offers", eyebrow: "VERIFIED SOURCE PRICING", description: "Products whose current public source data includes a valid compare-at price.", filter: product => Number(product.compareAtPrice) > Number(product.price) };
    const source = collections.find(collection => collection.slug === PAGE);
    if (source) return { title: source.title, eyebrow: "CUEBOTS COLLECTION", description: source.description || "Explore products in this collection.", filter: product => product.collections.includes(source.slug) };
    if (PAGE === "break-power") return { ...collectionRules["break-cues"], title: "Break Power", filter: p => p.cueType === "break" || p.shaftPurpose === "break" };
    if (PAGE === "upgrade-my-shaft") return { ...collectionRules["carbon-shafts"], title: "Upgrade My Shaft" };
    if (PAGE === "shop-cue-butts") return collectionRules["cue-butts"];
    if (PAGE === "first-carbon-cue") return { ...collectionRules["pool-cues"], title: "First Carbon Cue" };
    if (PAGE === "difficult-shots") return { ...collectionRules["pool-cues"], title: "Control & Difficult Shots" };
    return collectionRules["pool-cues"];
  }

  function uniqueOptions(products, getter) {
    return [...new Set(products.flatMap(getter).map(compact).filter(Boolean))].sort((a, b) => a.localeCompare(b)).slice(0, 80);
  }

  function renderCollectionPage() {
    const target = $("[data-page-content]");
    if (!target) return;
    const rule = currentCollectionRule();
    visibleProducts = catalog.filter(rule.filter);
    visibleLimit = 24;
    const heroProduct = visibleProducts.find(product => product.images?.length) || catalog[0];
    const brands = uniqueOptions(visibleProducts, product => [product.vendor]);
    const joints = uniqueOptions(visibleProducts, product => values(product, "joint"));
    const types = uniqueOptions(visibleProducts, product => [product.cueType || product.shaftPurpose || product.caseType || product.gloveHand]);
    document.title = `${rule.title} | CUEBOTS`;
    target.innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${coreRoute.home}">Home</a><span>/</span><span aria-current="page">${escapeHtml(rule.title)}</span></nav>
      <section class="catalog-source-hero"><div class="catalog-source-hero-media">${imageMarkup(heroProduct, 0, true)}</div><div class="container catalog-source-hero-copy"><p class="eyebrow">${escapeHtml(rule.eyebrow)}</p><h1>${escapeHtml(rule.title)}</h1><p>${escapeHtml(rule.description)}</p><a class="btn" href="#catalog-results">SHOP ${escapeHtml(rule.title.toUpperCase())}</a></div></section>
      <section class="catalog-taxonomy-strip"><div class="container catalog-taxonomy-links"><a href="${collectionUrl("pool-cues")}">CUES</a><a href="${collectionUrl("cue-butts")}">BUTTS</a><a href="${collectionUrl("carbon-shafts")}">SHAFTS</a><a href="${collectionUrl("cases")}">CASES</a><a href="${collectionUrl("gloves")}">GLOVES</a><a href="${collectionUrl("accessories")}">ACCESSORIES</a></div></section>
      <section class="store-section" id="catalog-results"><div class="container"><div class="catalog-commerce-head"><div><p class="eyebrow">${visibleProducts.length} PRODUCTS</p><h2>Compare the right specifications</h2></div><button class="catalog-filter-toggle btn btn-secondary" type="button" data-catalog-filter-toggle aria-expanded="false">FILTER & SORT</button></div>
      <div class="catalog-layout"><aside class="catalog-filter-panel" id="filters" data-catalog-filters><div class="catalog-filter-head"><h2>Filter</h2><button type="button" data-catalog-filter-close aria-label="Close filters">×</button></div>
        <label>Product type<select data-filter-field="type"><option value="">All</option>${types.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>
        <label>Brand<select data-filter-field="brand"><option value="">All</option>${brands.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>
        ${joints.length ? `<label>Joint / pin<select data-filter-field="joint"><option value="">All</option>${joints.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : ""}
        <label>Availability<select data-filter-field="stock"><option value="">All</option><option value="in">In stock</option><option value="out">Out of stock</option></select></label>
        <label>Price<select data-filter-field="price"><option value="">All prices</option><option value="low">Lowest third</option><option value="mid">Middle third</option><option value="high">Highest third</option></select></label>
        <label>Sort<select data-filter-field="sort"><option value="featured">Featured</option><option value="new">Newest</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label><button class="catalog-clear-filter" type="button" data-catalog-clear>CLEAR FILTERS</button></aside>
        <div class="catalog-results"><p class="catalog-result-count" data-catalog-result-count></p><div class="catalog-live-grid" data-catalog-live-grid></div><button class="btn catalog-load-more" type="button" data-catalog-load-more>LOAD MORE</button></div></div></div></section>
      <section class="catalog-support-promo"><div class="container"><div><p class="eyebrow">BUY WITH CONFIDENCE</p><h2>${rule.title.includes("Shaft") || rule.title.includes("Butt") ? "Check compatibility before you order." : "Need help narrowing the choice?"}</h2><p>Product data stays specific to this category. Our support team can help when fit or configuration is uncertain.</p></div><a class="btn" href="${path("pages/ask-an-expert.html")}">ASK AN EXPERT</a></div></section>`;
    updateCollectionGrid();
  }

  function updateCollectionGrid() {
    const rule = currentCollectionRule();
    let products = catalog.filter(rule.filter);
    const get = field => $(`[data-filter-field="${field}"]`)?.value || "";
    const type = get("type"), brand = get("brand"), joint = get("joint"), stock = get("stock"), price = get("price"), sort = get("sort");
    if (type) products = products.filter(p => [p.cueType, p.shaftPurpose, p.caseType, p.gloveHand].includes(type));
    if (brand) products = products.filter(p => p.vendor === brand);
    if (joint) products = products.filter(p => values(p, "joint").includes(joint));
    if (stock) products = products.filter(p => stock === "in" ? p.available : !p.available);
    const prices = products.map(p => Number(p.price)).filter(Number.isFinite).sort((a, b) => a - b);
    if (price && prices.length) { const one = prices[Math.floor(prices.length / 3)], two = prices[Math.floor(prices.length * 2 / 3)]; products = products.filter(p => price === "low" ? p.price <= one : price === "mid" ? p.price > one && p.price <= two : p.price > two); }
    if (sort === "new") products.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    if (sort === "price-low") products.sort((a, b) => a.price - b.price);
    if (sort === "price-high") products.sort((a, b) => b.price - a.price);
    if (sort === "name") products.sort((a, b) => a.title.localeCompare(b.title));
    visibleProducts = products;
    const grid = $("[data-catalog-live-grid]");
    if (grid) grid.innerHTML = products.length ? products.slice(0, visibleLimit).map(productCard).join("") : `<div class="catalog-empty"><h3>No exact match</h3><p>Clear one or more filters to see available products.</p><button class="btn btn-secondary" type="button" data-catalog-clear>CLEAR FILTERS</button></div>`;
    if ($("[data-catalog-result-count]")) $("[data-catalog-result-count]").textContent = `${products.length} matching products · showing ${Math.min(products.length, visibleLimit)}`;
    if ($("[data-catalog-load-more]")) $("[data-catalog-load-more]").hidden = visibleLimit >= products.length;
  }

  function optionMarkup(product) {
    return (product.options || []).filter(option => !/^title$/i.test(option.name || "")).map((option, index) => `<label class="catalog-product-option"><span>${escapeHtml(option.name)}</span><select data-catalog-option="${index}" required><option value="">Choose ${escapeHtml(option.name.toLowerCase())}</option>${(option.values || []).map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>`).join("");
  }

  function specRows(product) {
    const rows = [["Product class", classLabels[product.productClass]], ["Purpose", product.cueType || product.shaftPurpose], ["Joint", values(product, "joint").join(", ")], ["Diameter", values(product, "diameter").join(", ")], ["Length", values(product, "length").join(", ")], ["Weight", values(product, "weight").join(", ")], ["Wrap", values(product, "wrap").join(", ")], ["Tip", values(product, "tip").join(", ")], ["Capacity", values(product, "capacity").join(", ")], ["Hand", product.gloveHand]].filter(row => row[1]);
    return rows.map(row => `<tr><th>${escapeHtml(row[0])}</th><td>${escapeHtml(row[1])}</td></tr>`).join("");
  }

  function renderProductPage() {
    const product = catalog.find(item => item.slug === PAGE || item.id === PAGE);
    const target = $("[data-page-content]");
    if (!target) return;
    if (!product) { target.innerHTML = `<section class="store-section"><div class="container catalog-empty"><h1>Product not found</h1><p>This product is not present in the latest public catalog import.</p><a class="btn" href="${coreRoute.cues}">BROWSE PRODUCTS</a></div></section>`; return; }
    rememberViewed(product.slug);
    const collection = product.collections[0] || (product.productClass === "shaft" ? "carbon-shafts" : product.productClass === "cue-butt" ? "cue-butts" : product.productClass === "case" ? "cases" : product.productClass === "glove" ? "gloves" : product.productClass === "accessory" ? "accessories" : "pool-cues");
    const related = catalog.filter(item => item.slug !== product.slug && (item.productClass === product.productClass || item.tags.some(tag => product.tags.includes(tag)))).slice(0, 4);
    const options = optionMarkup(product);
    const description = (product.description || "Product information is being prepared from the source catalog.").split(/\n+/).map(paragraph => compact(paragraph)).filter(Boolean).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("");
    document.title = `${product.title} | CUEBOTS`;
    target.innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${coreRoute.home}">Home</a><span>/</span><a href="${collectionUrl(collection)}">${escapeHtml(collection.replace(/-/g, " "))}</a><span>/</span><span aria-current="page">${escapeHtml(product.title)}</span></nav>
      <section class="store-section catalog-pdp"><div class="container catalog-pdp-grid"><div class="catalog-gallery"><div class="catalog-gallery-main"><button type="button" data-gallery-zoom aria-label="Open image full screen">${imageMarkup(product, 0, true)}<span>ZOOM</span></button>${product.images.length > 1 ? `<button class="catalog-gallery-arrow prev" type="button" data-gallery-step="-1" aria-label="Previous image">‹</button><button class="catalog-gallery-arrow next" type="button" data-gallery-step="1" aria-label="Next image">›</button>` : ""}</div><div class="catalog-thumbnails" role="list">${product.images.map((image, index) => `<button type="button" role="listitem" data-gallery-index="${index}" class="${index === 0 ? "active" : ""}">${imageMarkup(product, index)}</button>`).join("")}</div></div>
      <div class="catalog-purchase"><p class="eyebrow">${escapeHtml(product.vendor || "CUEBOTS")} · ${escapeHtml(classLabels[product.productClass] || "Equipment")}</p><h1>${escapeHtml(product.title)}</h1><p class="catalog-no-rating">No verified review score available</p><div class="catalog-pdp-price"><strong>${money(product.price)}</strong>${product.compareAtPrice > product.price ? `<del>${money(product.compareAtPrice)}</del>` : ""}</div><p class="catalog-stock-line ${product.available ? "in-stock" : "out-stock"}">${product.available ? "● In stock" : "● Currently unavailable"}</p><p class="catalog-pdp-lead">${escapeHtml(truncate(product.description, 310) || "See the specifications and available options below.")}</p>${product.productClass === "cue-butt" ? `<div class="catalog-butt-warning"><strong>BUTT ONLY</strong><span>A shaft is not included unless the source variant explicitly says otherwise.</span></div>` : ""}
      <form data-catalog-purchase-form>${options}<label class="catalog-product-option"><span>Quantity</span><input type="number" name="quantity" min="1" max="10" value="1"></label><p class="catalog-option-status" aria-live="polite"></p><div class="catalog-pdp-actions"><button class="btn" type="submit"${product.available && !options ? "" : " disabled"}>${product.available ? "ADD TO CART" : "UNAVAILABLE"}</button><button class="btn btn-secondary" type="button" data-catalog-wishlist="${escapeHtml(product.slug)}"><svg class="icon"><use href="#i-heart"></use></svg> SAVE</button></div></form>
      <div class="catalog-purchase-assurance"><span>Shipping terms shown at checkout</span><a href="${path("pages/warranty.html")}">Limited lifetime warranty</a><a href="${path("pages/returns-policy.html")}">Return eligibility</a></div></div></div></section>
      ${["shaft", "cue-butt"].includes(product.productClass) ? compatibilityMarkup(product) : ""}
      <section class="store-section catalog-pdp-content"><div class="container"><div class="catalog-content-grid"><article><p class="eyebrow">PRODUCT OVERVIEW</p><h2>What to know</h2><div class="source-rich-text">${description}</div></article><article><p class="eyebrow">TECHNICAL SPECIFICATIONS</p><h2>Source specifications</h2><table><tbody>${specRows(product) || `<tr><td>Detailed specifications are not supplied in the public source data.</td></tr>`}</tbody></table></article></div></div></section>
      <section class="store-section section-soft catalog-support-grid"><div class="container"><a href="${path("pages/shipping-policy.html")}"><strong>Shipping & Delivery</strong><span>Review current policy →</span></a><a href="${path("pages/warranty.html")}"><strong>Warranty & Returns</strong><span>Read full terms →</span></a><a href="${path("pages/product-care.html")}"><strong>Care Instructions</strong><span>Protect your equipment →</span></a><a href="${path("pages/faq.html")}"><strong>FAQ</strong><span>Get quick answers →</span></a></div></section>
      <section class="store-section" id="reviews"><div class="container catalog-review-empty"><p class="eyebrow">CUSTOMER REVIEWS</p><h2>No reviews yet</h2><p>No attributable public review data was available for this product during import.</p><button class="btn btn-secondary" type="button" data-write-review>WRITE A REVIEW</button></div></section>
      <section class="store-section"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">COMPLETE YOUR SETUP</p><h2>Related equipment</h2></div></div><div class="catalog-live-grid">${related.map(productCard).join("")}</div></div></section>
      <div class="catalog-lightbox" role="dialog" aria-modal="true" aria-hidden="true" data-catalog-lightbox><button type="button" data-lightbox-close aria-label="Close full-screen image">×</button>${imageMarkup(product, 0)}</div>`;
    injectProductSchema(product, collection);
    wireProductGallery(product);
    wireProductForm(product);
  }

  function compatibilityMarkup(product) {
    const sourceJoints = values(product, "joint");
    const allJoints = uniqueOptions(catalog.filter(item => ["shaft", "cue-butt"].includes(item.productClass)), item => values(item, "joint"));
    return `<section class="catalog-compatibility"><div class="container"><div><p class="eyebrow">COMPATIBILITY CHECK</p><h2>Confirm the joint before you buy</h2><p>${sourceJoints.length ? `Source-listed joint: ${escapeHtml(sourceJoints.join(", "))}.` : "The public source does not identify a definitive joint for this product."} Select your current joint for a cautious comparison.</p></div><form data-compatibility-form><label>Your joint / pin<select required><option value="">Choose a joint</option>${allJoints.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label><label>Purpose<select required><option value="">Choose a purpose</option><option>Playing</option><option>Break</option><option>Carom</option></select></label><button class="btn" type="submit">CHECK FIT</button><p data-compatibility-result aria-live="polite"></p><a href="${path("pages/ask-an-expert.html")}">Not certain? Ask an Expert →</a></form></div></section>`;
  }

  function wireProductGallery(product) {
    let index = 0;
    const main = $("[data-gallery-zoom] img");
    const lightbox = $("[data-catalog-lightbox]");
    const setIndex = next => { if (!product.images.length) return; index = (next + product.images.length) % product.images.length; const image = product.images[index]; main.src = path(image.localPath); main.alt = image.alt || product.title; $$('[data-gallery-index]').forEach((button, i) => button.classList.toggle("active", i === index)); if ($("img", lightbox)) { $("img", lightbox).src = main.src; $("img", lightbox).alt = main.alt; } };
    $$('[data-gallery-index]').forEach(button => button.addEventListener("click", () => setIndex(Number(button.dataset.galleryIndex))));
    $$('[data-gallery-step]').forEach(button => button.addEventListener("click", () => setIndex(index + Number(button.dataset.galleryStep))));
    $("[data-gallery-zoom]")?.addEventListener("click", () => { lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden", "false"); document.body.classList.add("lock-scroll"); });
    $("[data-lightbox-close]")?.addEventListener("click", () => closeLightbox());
    lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
    function closeLightbox() { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock-scroll"); }
  }

  function wireProductForm(product) {
    const form = $("[data-catalog-purchase-form]");
    const submit = $("button[type='submit']", form);
    const refresh = () => { const missing = $$('[data-catalog-option]', form).some(select => !select.value); submit.disabled = !product.available || missing; $(".catalog-option-status", form).textContent = missing ? "Choose every required option before adding to cart." : "Configuration ready."; };
    $$('[data-catalog-option]', form).forEach(select => select.addEventListener("change", refresh));
    if ($$('[data-catalog-option]', form).length) refresh();
    form.addEventListener("submit", event => { event.preventDefault(); const variant = $$('[data-catalog-option]', form).map(select => select.value).join(" / "); addCatalogItem(product, Number(form.quantity.value) || 1, variant); });
    $("[data-compatibility-form]")?.addEventListener("submit", event => { event.preventDefault(); const joint = $("select", event.currentTarget).value; const known = values(product, "joint"); const result = $("[data-compatibility-result]", event.currentTarget); result.textContent = !known.length ? "Compatibility cannot be confirmed from the source data. Please ask an expert before ordering." : known.some(value => value.toLowerCase() === joint.toLowerCase()) ? "The selected joint matches the source-listed joint. Confirm diameter and collar details before checkout." : "This selection does not match the source-listed joint. Please ask an expert before ordering."; result.className = known.some(value => value.toLowerCase() === joint.toLowerCase()) ? "match" : "warning"; });
  }

  function injectProductSchema(product, collection) {
    $("#catalog-product-schema")?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "catalog-product-schema";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "Product", name: product.title, image: product.images.map(image => new URL(path(image.localPath), location.href).href), description: product.description, sku: product.variants[0]?.sku || product.id, brand: { "@type": "Brand", name: product.vendor || "CUEBOTS" }, offers: { "@type": "Offer", priceCurrency: "VND", price: product.price, availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: location.href } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: new URL(coreRoute.home, location.href).href }, { "@type": "ListItem", position: 2, name: collection.replace(/-/g, " "), item: new URL(collectionUrl(collection), location.href).href }, { "@type": "ListItem", position: 3, name: product.title, item: location.href }] }] });
    document.head.append(script);
  }

  function renderContentPage() {
    const target = $("[data-page-content]");
    if (!target) return;
    const requested = PAGE.toLowerCase();
    const aliases = { "our-story": ["our story"], about: ["about"], customization: ["custom"], "shipping-policy": ["shipping"], "returns-policy": ["refund", "exchange", "cancellation"], warranty: ["warranty"], contact: ["contact"], faq: ["faq"], "product-care": ["care"], "glove-size-guide": ["glove", "size"], "joint-guide": ["joint"], "shaft-selection-guide": ["shaft"], "buying-guides": ["guide"] };
    const terms = aliases[requested] || [requested.replace(/-/g, " ")];
    const source = contentPages.find(page => terms.every(term => `${page.title} ${page.canonicalUrl}`.toLowerCase().includes(term))) || null;
    const title = source?.title || requested.replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
    const safeBody = source?.body ? source.body.split(/\n+/).map(paragraph => compact(paragraph)).filter(Boolean).map((paragraph, index) => index === 0 ? `<p class="content-lead">${escapeHtml(paragraph)}</p>` : `<p>${escapeHtml(paragraph)}</p>`).join("") : "";
    document.title = `${title} | CUEBOTS`;
    target.innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${coreRoute.home}">Home</a><span>/</span><span aria-current="page">${escapeHtml(title)}</span></nav><section class="content-hero"><div class="container"><p class="eyebrow">${requested.includes("support") ? "PLAYER SUPPORT" : "DISCOVER CUEBOTS"}</p><h1>${escapeHtml(title)}</h1><p>${source ? "Public content imported from CUEBOTS." : "This resource is ready for verified CUEBOTS content and support information."}</p></div></section><section class="store-section"><div class="container content-page-layout"><article class="source-rich-text">${safeBody || `<h2>We are preparing this resource.</h2><p>No verified public source page matched this route during the latest import. Contact CUEBOTS for current information.</p>`}</article><aside><h2>Need help now?</h2><p>Get a product or compatibility recommendation from the CUEBOTS support team.</p><a class="btn" href="${path("pages/ask-an-expert.html")}">ASK AN EXPERT</a><a href="mailto:cs@cuebots.com">cs@cuebots.com</a><a href="tel:+13074501670">+1 307 450 1670</a></aside></div></section>`;
  }

  function renderImportedBlog() {
    const main = $("main");
    if (!main) return;
    const filename = location.pathname.split("/").pop().toLowerCase();
    const articles = contentPages.filter(page => page.type === "article" && page.title).sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    if (filename === "blog.html") {
      const cards = articles.slice(0, 12);
      main.innerHTML = `<section class="content-hero"><div class="container"><p class="eyebrow">CUEBOTS JOURNAL</p><h1>KNOW YOUR EQUIPMENT.</h1><p>Articles and guides imported from the public CUEBOTS journal.</p></div></section><section class="store-section"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">LATEST ARTICLES</p><h2>Guides, stories and product knowledge</h2></div></div><div class="catalog-blog-grid">${cards.length ? cards.map((article, index) => { const words = compact(article.body).split(" ").filter(Boolean).length; const art = catalog[index % Math.max(1, catalog.length)]; return `<article class="catalog-blog-card"><a href="${path(`pages/content-view.html?id=${encodeURIComponent(article.id)}`)}">${imageMarkup(art)}</a><div><p class="eyebrow">${escapeHtml(new URL(article.canonicalUrl).pathname.includes("blogs") ? "JOURNAL" : "GUIDE")}</p><h2><a href="${path(`pages/content-view.html?id=${encodeURIComponent(article.id)}`)}">${escapeHtml(article.title)}</a></h2><p>${escapeHtml(truncate(article.body, 150))}</p><span>${article.publishedAt ? escapeHtml(new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })) : "CUEBOTS"} · ${Math.max(1, Math.ceil(words / 220))} min read</span><a class="text-link" href="${path(`pages/content-view.html?id=${encodeURIComponent(article.id)}`)}">READ MORE →</a></div></article>`; }).join("") : `<div class="catalog-empty"><h2>No public articles found</h2><p>The importer did not return a verifiable blog article.</p></div>`}</div></div></section>`;
      return;
    }
    const termsByFile = { "blog-how-to-choose-the-right-shaft.html": ["choose", "shaft"], "blog-carbon-vs-wood-shaft.html": ["carbon", "wood"], "blog-understanding-joint-types.html": ["joint"], "blog-cue-care-checklist.html": ["care"] };
    const terms = termsByFile[filename] || [];
    const article = articles.find(page => terms.every(term => `${page.title} ${page.body}`.toLowerCase().includes(term)));
    if (!article) { main.innerHTML = `<section class="store-section"><div class="container catalog-empty"><h1>Source article unavailable</h1><p>No verified public article matched this route during import.</p><a class="btn" href="${path("pages/blog.html")}">VIEW CURRENT ARTICLES</a></div></section>`; return; }
    const paragraphs = article.body.split(/\n+/).map(compact).filter(Boolean);
    main.innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${coreRoute.home}">Home</a><span>/</span><a href="${path("pages/blog.html")}">Journal</a><span>/</span><span>${escapeHtml(article.title)}</span></nav><header class="content-hero"><div class="container"><p class="eyebrow">CUEBOTS JOURNAL</p><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(truncate(article.body, 190))}</p></div></header><section class="store-section"><article class="container imported-article">${paragraphs.map((paragraph, index) => index === 0 ? `<p class="content-lead">${escapeHtml(paragraph)}</p>` : `<p>${escapeHtml(paragraph)}</p>`).join("")}<p class="imported-source-note">Source: <a href="${escapeHtml(article.sourceUrl)}">CUEBOTS public website</a></p></article></section>`;
  }

  function renderHomeUpgrade() {
    const topPicks = $(".products-section");
    const trust = $(".trust-strip");
    const categories = $(".categories-section");
    if (topPicks && trust) trust.after(topPicks);
    if (categories && topPicks) topPicks.after(categories);
    renderHomeProductGroup("best");
    const reviewSection = $(".reviews-section");
    if (reviewSection) reviewSection.innerHTML = `<div class="container catalog-review-empty"><p class="eyebrow">PLAYER FEEDBACK</p><h2>Reviews will appear when verified source data is available.</h2><p>We do not publish invented ratings or buyer names.</p><a class="btn btn-secondary" href="${collectionUrl("pool-cues")}">EXPLORE PRODUCTS</a><span class="sr-only" data-review-count>1 / 1</span><div class="review-window sr-only"><div class="review-track" data-review-list></div></div><div class="review-dots sr-only" data-review-dots></div><button class="sr-only" type="button" data-review-step="1">Next</button></div>`;
    const hero = $(".hero");
    if (hero && !$(".catalog-hero-copies", hero)) {
      hero.insertAdjacentHTML("beforeend", `<div class="catalog-hero-copies container">${[["Carbon Shafts", "Compare joint, diameter and purpose before upgrading.", collectionUrl("carbon-shafts"), "SHOP CARBON SHAFTS"], ["Retro II", "Explore complete cues and distinctive series from the current catalog.", collectionUrl("pool-cues"), "EXPLORE CUES"], ["Nebula", "Find a complete playing setup built around your game.", path("pages/buying-guides.html"), "FIND YOUR SETUP"]].map((slide, index) => `<div class="catalog-hero-copy${index === 0 ? " active" : ""}" data-hero-copy="${index}"><p class="eyebrow">CUEBOTS PERFORMANCE</p><h2>${slide[0]}</h2><p>${slide[1]}</p><a class="btn" href="${slide[2]}">${slide[3]}</a></div>`).join("")}</div><button class="catalog-hero-pause" type="button" data-hero-pause aria-pressed="false">PAUSE</button>`);
      const slides = $$(".hero-slide", hero);
      let paused = false;
      let heldIndex = 0;
      const observer = new MutationObserver(() => {
        let active = Math.max(0, slides.findIndex(slide => slide.classList.contains("active")));
        if (paused && active !== heldIndex) {
          observer.disconnect();
          slides.forEach((slide, index) => { slide.classList.toggle("active", index === heldIndex); slide.setAttribute("aria-hidden", String(index !== heldIndex)); });
          active = heldIndex;
          observer.observe($("[data-hero-slider]", hero), { subtree: true, attributes: true, attributeFilter: ["class"] });
        }
        $$('[data-hero-copy]', hero).forEach((copy, index) => copy.classList.toggle("active", index === active));
      });
      observer.observe($("[data-hero-slider]", hero), { subtree: true, attributes: true, attributeFilter: ["class"] });
      $("[data-hero-pause]", hero).addEventListener("click", event => { heldIndex = Math.max(0, slides.findIndex(slide => slide.classList.contains("active"))); paused = !paused; event.currentTarget.textContent = paused ? "PLAY" : "PAUSE"; event.currentTarget.setAttribute("aria-pressed", String(paused)); });
    }
  }

  function renderHomeProductGroup(group) {
    const rail = $("[data-product-list]");
    if (!rail) return;
    let products = catalog.filter(product => product.available && product.images?.length);
    if (group === "best") products = products.filter(product => product.collections.includes("best-seller"));
    if (group === "new") products.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    if (group === "offers") products = products.filter(product => Number(product.compareAtPrice) > Number(product.price));
    products = products.slice(0, 10);
    rail.innerHTML = products.length ? products.map(productCard).join("") : `<div class="catalog-empty"><h3>No verified offers are active.</h3><p>We only show discounts present in the imported source data.</p></div>`;
    $$('[data-product-tab]').forEach(button => { const active = button.dataset.productTab === group; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1; });
    const link = $("[data-product-view-all]");
    if (link) { const labels = { best: "VIEW ALL BEST SELLERS", new: "VIEW ALL NEW ARRIVALS", offers: "VIEW ALL CURRENT OFFERS" }; link.childNodes[0].textContent = `${labels[group]} `; link.href = group === "best" ? collectionUrl("best-seller") : group === "offers" ? collectionUrl("sale") : collectionUrl("all"); }
    const count = $("[data-rail-count='productRail']");
    if (count) count.textContent = products.length ? `1 / ${products.length}` : "0 / 0";
  }

  function searchText(product) {
    return compact([product.title, product.vendor, product.series, product.productClass, product.cueType, product.shaftPurpose, product.tags.join(" "), product.collections.join(" "), Object.values(product.specs || {}).flat().join(" ")].join(" ")).toLowerCase();
  }

  function renderSearch(query = "") {
    const roots = $$('[data-search-results]');
    const value = compact(query).toLowerCase();
    const recent = readJson("cuebotsRecentlyViewed", []).map(slug => catalog.find(product => product.slug === slug)).filter(Boolean).slice(0, 4);
    if (!value) {
      const cards = (recent.length ? recent : catalog.filter(product => product.available).slice(0, 4)).map(product => `<a class="catalog-search-suggestion" href="${detailUrl(product)}">${imageMarkup(product)}<span><small>${escapeHtml(product.vendor)}</small><strong>${escapeHtml(product.title)}</strong><b>${money(product.price)}</b></span></a>`).join("");
      roots.forEach(root => { root.innerHTML = `<div class="catalog-search-empty"><a class="catalog-search-banner" href="${path("pages/compatibility-help.html")}"><span><small>BUYING SUPPORT</small><strong>Check compatibility before choosing a butt or shaft.</strong><b>OPEN THE GUIDE →</b></span></a><div class="catalog-search-heading"><h3>${recent.length ? "RECENTLY VIEWED" : "EXPLORE THE CATALOG"}</h3><a href="${collectionUrl("pool-cues")}">VIEW ALL →</a></div><div class="catalog-search-suggestions">${cards}</div></div>`; });
      return;
    }
    const products = catalog.map(product => ({ product, score: searchText(product).startsWith(value) ? 4 : product.title.toLowerCase().includes(value) ? 3 : searchText(product).includes(value) ? 1 : 0 })).filter(item => item.score).sort((a, b) => b.score - a.score).slice(0, 10).map(item => item.product);
    const matchingCollections = collections.filter(collection => `${collection.title} ${collection.description}`.toLowerCase().includes(value)).slice(0, 4);
    const guides = contentPages.filter(page => page.type === "article" && `${page.title} ${page.body}`.toLowerCase().includes(value)).slice(0, 4);
    const support = contentPages.filter(page => page.type === "page" && `${page.title} ${page.body}`.toLowerCase().includes(value)).slice(0, 4);
    const group = (title, items, markup) => items.length ? `<section class="catalog-search-group"><h3>${title}</h3>${items.map(markup).join("")}</section>` : "";
    const html = `<p class="search-summary">Best matches for “${escapeHtml(query)}”</p>${group("Products", products, product => `<a class="catalog-search-row" href="${detailUrl(product)}">${imageMarkup(product)}<span><strong>${escapeHtml(product.title)}</strong><small>${escapeHtml(product.vendor)} · ${escapeHtml(classLabels[product.productClass])}</small></span><b>${money(product.price)}</b></a>`)}${group("Collections", matchingCollections, collection => `<a class="catalog-search-link" href="${collectionUrl(collection.slug)}"><strong>${escapeHtml(collection.title)}</strong><span>VIEW COLLECTION →</span></a>`)}${group("Guides", guides, page => `<a class="catalog-search-link" href="${path(`pages/content-view.html?id=${encodeURIComponent(page.id)}`)}"><strong>${escapeHtml(page.title)}</strong><span>READ GUIDE →</span></a>`)}${group("Support", support, page => `<a class="catalog-search-link" href="${path(`pages/content-view.html?id=${encodeURIComponent(page.id)}`)}"><strong>${escapeHtml(page.title)}</strong><span>OPEN →</span></a>`)}${!products.length && !matchingCollections.length && !guides.length && !support.length ? `<p class="search-empty">No matching products, collections or guides found.</p>` : ""}`;
    roots.forEach(root => { root.innerHTML = html; });
  }

  function readJson(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
  function rememberViewed(slug) { const recent = readJson("cuebotsRecentlyViewed", []).filter(item => item !== slug); recent.unshift(slug); try { localStorage.setItem("cuebotsRecentlyViewed", JSON.stringify(recent.slice(0, 12))); } catch {} }

  function addCatalogItem(product, quantity = 1, variant = "Standard configuration") {
    const cart = readJson("cuebotsHomeCart", []);
    const item = cart.find(entry => entry.id === product.slug && entry.variant === variant);
    if (item) item.qty += quantity;
    else cart.push({ id: product.slug, name: product.title, price: Number(product.price) / 26150, sourcePriceVnd: Number(product.price), image: localImage(product), qty: quantity, sku: product.variants[0]?.sku || `CB-${product.id}`, variant });
    try { localStorage.setItem("cuebotsHomeCart", JSON.stringify(cart)); } catch {}
    renderCatalogCart();
    showToast(`${product.title} added to your cart.`);
  }

  function renderCatalogCart() {
    const cart = readJson("cuebotsHomeCart", []);
    $$('[data-cart-count]').forEach(node => { node.textContent = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0); });
    const list = $("[data-cart-items]");
    if (!list) return;
    if (!cart.length) list.innerHTML = `<div class="cart-empty"><h3>Your cart is empty</h3><p>Add a cue, shaft or accessory to begin.</p><a class="btn btn-secondary" href="${collectionUrl("pool-cues")}">START SHOPPING</a></div>`;
    else list.innerHTML = `<a class="cart-promo-hero catalog-cart-guide" href="${path("pages/compatibility-help.html")}"><span><small>BEFORE CHECKOUT</small><strong>Confirm compatibility for shafts and butts</strong><em>OPEN THE GUIDE →</em></span></a>${cart.length >= 2 ? '<div class="cart-list-toolbar"><button class="cart-remove-all" type="button" data-catalog-cart-clear>Remove all selected</button></div>' : ""}${cart.map(item => `<article class="cart-item"><img src="${escapeHtml(item.image)}" width="72" height="72" alt=""><div class="cart-item-main"><strong>${escapeHtml(item.name)}</strong><span class="cart-item-option">${escapeHtml(item.variant || "Standard configuration")}</span><span class="cart-item-option">SKU: ${escapeHtml(item.sku || "CUEBOTS")}</span><span class="cart-item-price">${item.sourcePriceVnd ? money(item.sourcePriceVnd * item.qty) : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(item.price * item.qty)}</span><div class="cart-item-controls"><div class="cart-quantity"><button type="button" data-catalog-cart-qty="-1" data-cart-key="${escapeHtml(item.id)}">−</button><output>${item.qty}</output><button type="button" data-catalog-cart-qty="1" data-cart-key="${escapeHtml(item.id)}">+</button></div><button class="cart-remove-item" type="button" data-catalog-cart-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)}"><svg class="icon"><use href="#i-trash"></use></svg></button></div></div></article>`).join("")}`;
    const totalUsd = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
    const summary = $("[data-cart-summary]");
    if (summary) summary.innerHTML = `<p class="shipping-reminder${totalUsd >= 99 ? " unlocked" : ""}">${!cart.length ? "Free shipping terms are shown at checkout." : totalUsd >= 99 ? "Your cart currently meets the prototype free-shipping threshold." : `You're ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(99 - totalUsd)} away from the prototype free-shipping threshold.`}</p><div class="subtotal"><span>Subtotal</span><strong>${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalUsd)}</strong></div><p class="catalog-cart-disclaimer">No discount code is auto-applied unless it is present in verified promotion data.</p>`;
  }

  function openQuick(product) {
    const modal = $("#quickModal,[data-quick-modal]");
    const bodyTarget = $("[data-quick-body]", modal || document);
    if (!modal || !bodyTarget) return;
    bodyTarget.innerHTML = `<div class="catalog-quick-grid"><div>${imageMarkup(product)}</div><div><p class="eyebrow">${escapeHtml(product.vendor)}</p><h2>${escapeHtml(product.title)}</h2><p>${escapeHtml(truncate(product.description, 180))}</p><div class="catalog-price"><strong>${money(product.price)}</strong></div><ul>${productFacts(product).map(fact => `<li>${escapeHtml(fact)}</li>`).join("")}</ul><a class="btn" href="${detailUrl(product)}">VIEW FULL DETAILS →</a></div></div>`;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); $("[data-overlay]")?.classList.add("open"); document.body.classList.add("lock-scroll");
  }

  function showToast(message) { const toast = $("[data-toast]"); if (!toast) return; toast.textContent = message; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600); }

  function ensureMetadata() {
    let canonical = $("link[rel='canonical']");
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = `${location.origin}${location.pathname}${params.get("id") ? `?id=${encodeURIComponent(params.get("id"))}` : ""}`;
    const description = $("meta[name='description']") || document.head.appendChild(Object.assign(document.createElement("meta"), { name: "description" }));
    const lead = $("main p:not(.eyebrow)")?.textContent || "CUEBOTS billiards equipment, buying guidance and player support.";
    description.content = truncate(lead, 158);
    const metaValues = { "og:title": document.title, "og:description": description.content, "og:url": canonical.href };
    Object.entries(metaValues).forEach(([property, content]) => { let meta = $(`meta[property='${property}']`); if (!meta) { meta = document.createElement("meta"); meta.setAttribute("property", property); document.head.append(meta); } meta.content = content; });
  }

  function wireGlobalEvents() {
    document.addEventListener("error", event => { if (event.target instanceof HTMLImageElement && event.target.closest(".catalog-product-card,.catalog-gallery,.catalog-search-suggestion,.catalog-search-row")) { event.target.closest("a,button,div")?.classList.add("is-missing"); event.target.src = path("assets/images/brand/logo-cuebots-horizontal-blue-01.webp"); event.target.alt = "CUEBOTS image unavailable"; } }, true);
    document.addEventListener("input", event => { if (event.target.matches("[data-search-input]")) { event.stopImmediatePropagation(); renderSearch(event.target.value); } }, true);
    document.addEventListener("click", event => {
      const target = event.target.closest("button,a");
      if (!target) return;
      if (target.matches("[data-open-search]")) { event.preventDefault(); event.stopImmediatePropagation(); const dialog = $(".search-dialog"); if (dialog) { $$(".mobile-drawer,.cart-drawer,.quick-modal,.account-modal").forEach(surface => { surface.classList.remove("open"); surface.setAttribute("aria-hidden", "true"); }); dialog.classList.add("open"); dialog.setAttribute("aria-hidden", "false"); $("[data-overlay]")?.classList.add("open"); document.body.classList.add("lock-scroll"); renderSearch($("[data-search-input]")?.value || ""); setTimeout(() => $("[data-search-input]")?.focus(), 20); } }
      if (target.matches("[data-product-tab]")) { event.preventDefault(); event.stopImmediatePropagation(); renderHomeProductGroup(target.dataset.productTab); }
      if (target.matches("[data-catalog-add]")) { event.preventDefault(); event.stopImmediatePropagation(); const product = catalog.find(item => item.slug === target.dataset.catalogAdd); if (product) addCatalogItem(product); }
      if (target.matches("[data-catalog-quick]")) { event.preventDefault(); event.stopImmediatePropagation(); const product = catalog.find(item => item.slug === target.dataset.catalogQuick); if (product) openQuick(product); }
      if (target.matches("[data-catalog-wishlist]")) { event.preventDefault(); const wishlist = readJson("cuebotsCatalogWishlist", []); const slug = target.dataset.catalogWishlist; const next = wishlist.includes(slug) ? wishlist.filter(item => item !== slug) : [...wishlist, slug]; localStorage.setItem("cuebotsCatalogWishlist", JSON.stringify(next)); target.classList.toggle("active", next.includes(slug)); target.setAttribute("aria-pressed", String(next.includes(slug))); showToast(next.includes(slug) ? "Saved to your wishlist." : "Removed from your wishlist."); }
      if (target.matches("[data-catalog-filter-toggle]")) { const panel = $("[data-catalog-filters]"); panel.classList.add("open"); target.setAttribute("aria-expanded", "true"); }
      if (target.matches("[data-catalog-filter-close]")) $("[data-catalog-filters]")?.classList.remove("open");
      if (target.matches("[data-catalog-clear]")) { $$('[data-filter-field]').forEach(field => { field.value = ""; }); visibleLimit = 24; updateCollectionGrid(); }
      if (target.matches("[data-catalog-load-more]")) { visibleLimit += 24; updateCollectionGrid(); }
      if (target.matches("[data-open-cart]")) setTimeout(renderCatalogCart, 0);
      if (target.matches("[data-catalog-cart-qty]")) { event.preventDefault(); event.stopImmediatePropagation(); const cart = readJson("cuebotsHomeCart", []); const item = cart.find(entry => entry.id === target.dataset.cartKey); if (item) item.qty = Math.max(1, item.qty + Number(target.dataset.catalogCartQty)); localStorage.setItem("cuebotsHomeCart", JSON.stringify(cart)); renderCatalogCart(); }
      if (target.matches("[data-catalog-cart-remove]")) { event.preventDefault(); event.stopImmediatePropagation(); localStorage.setItem("cuebotsHomeCart", JSON.stringify(readJson("cuebotsHomeCart", []).filter(item => item.id !== target.dataset.catalogCartRemove))); renderCatalogCart(); }
      if (target.matches("[data-catalog-cart-clear]")) { event.preventDefault(); event.stopImmediatePropagation(); localStorage.setItem("cuebotsHomeCart", "[]"); renderCatalogCart(); }
      if (target.matches("[data-write-review]")) showToast("Review submission is available as a demo only.");
    }, true);
    document.addEventListener("change", event => { if (event.target.matches("[data-filter-field]")) { visibleLimit = 24; updateCollectionGrid(); } if (event.target.matches("[data-currency-select]")) setTimeout(() => { if (PAGE_TYPE === "collection") updateCollectionGrid(); if (PAGE_TYPE === "product") renderProductPage(); renderCatalogCart(); }, 0); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") { const lightbox = $("[data-catalog-lightbox].open"); if (lightbox) { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock-scroll"); } } });
  }

  async function init() {
    try {
      await loadData();
      renderNavigation();
      if (PAGE_TYPE === "collection") renderCollectionPage();
      else if (PAGE_TYPE === "product") renderProductPage();
      else if (PAGE_TYPE === "content") renderContentPage();
      else if (PAGE_TYPE === "chrome-only") renderImportedBlog();
      else if (PAGE_TYPE === "services") renderContentPage();
      else renderHomeUpgrade();
      renderSearch("");
      renderCatalogCart();
      wireGlobalEvents();
      ensureMetadata();
      document.documentElement.classList.add("catalog-ready");
    } catch (error) {
      console.error("CUEBOTS catalog upgrade failed", error);
      document.documentElement.classList.add("catalog-data-error");
    }
  }

  init();
})();
