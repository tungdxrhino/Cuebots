(() => {
  "use strict";

  const SESSION_KEY = "cuebotsAccountSession";
  const LIFETIME_SPEND_KEY = "cuebotsLifetimeSpend";
  const ANNUAL_SPEND_KEY = "cuebotsAnnualSpend";
  const ORDER_HISTORY_KEY = "cuebotsOrderHistory";
  const POINTS_PER_DOLLAR = 10;
  const LOYALTY_TIERS = [
    { id: "launch", name: "Launch Member", min: 0, icon: "✦" },
    { id: "orbit", name: "Orbit Member", min: 200, icon: "★" },
    { id: "nova", name: "Nova Member", min: 1000, icon: "✷" },
    { id: "celestial", name: "Celestial VIP", min: 1500, icon: "✧" },
    { id: "dark-voyager", name: "Dark Voyager Elite", min: 2000, icon: "◆" }
  ];
  const root = document.body.dataset.root || "";
  const modal = document.querySelector(".account-modal");
  const form = modal?.querySelector("[data-account-form]");
  if (!modal || !form) return;

  const title = modal.querySelector("[data-account-title]") || modal.querySelector(".drawer-header h2");
  const intro = form.querySelector("[data-account-intro]") || form.querySelector("p");
  const submit = form.querySelector("[data-account-submit]") || form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const status = form.querySelector("[data-account-status]");
  const switcher = form.querySelector(".account-mode-switch");
  const guestPromo = modal.querySelector(".account-modal-promo");
  let mode = "signin";

  form.noValidate = true;
  passwordInput.minLength = 1;
  passwordInput.required = true;
  if (status) {
    status.classList.add("account-form-alert");
    intro.insertAdjacentElement("afterend", status);
  }

  const readSession = () => {
    try {
      const value = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
      return value?.loggedIn && value.email ? value : null;
    } catch (error) {
      return null;
    }
  };

  const writeSession = session => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
    catch (error) { /* The account demo still works on the current page. */ }
  };

  const clearSession = () => {
    try { sessionStorage.removeItem(SESSION_KEY); }
    catch (error) { /* Storage may be unavailable in private contexts. */ }
  };

  const safeReadLocal = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (error) { return fallback; }
  };

  const safeWriteLocal = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { return false; }
  };

  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  const displayName = email => {
    const name = String(email || "player").split("@")[0].replace(/[._-]+/g, " ").trim();
    return name ? name.replace(/\b\w/g, letter => letter.toUpperCase()) : "Player";
  };

  const roundDisplayMoney = value => {
    const amount = Math.round(Math.max(0, Number(value) || 0));
    if (amount < 1000) return amount;
    const step = Math.pow(10, Math.max(0, String(amount).length - 3));
    return Math.floor(amount / step) * step;
  };

  const formatUSD = value => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(roundDisplayMoney(value));

  const loyaltyState = () => {
    const lifetimeSpend = Math.max(0, Number(safeReadLocal(LIFETIME_SPEND_KEY, 0)) || 0);
    const annualRecord = safeReadLocal(ANNUAL_SPEND_KEY, {});
    const currentYear = new Date().getFullYear();
    const annualSpend = Number(annualRecord?.year) === currentYear ? Math.max(0, Number(annualRecord.amount) || 0) : 0;
    const tierIndex = LOYALTY_TIERS.reduce((result, tier, index) => lifetimeSpend >= tier.min ? index : result, 0);
    const tier = LOYALTY_TIERS[tierIndex];
    const nextTier = LOYALTY_TIERS[tierIndex + 1] || null;
    const progress = nextTier
      ? Math.min(100, Math.max(0, ((lifetimeSpend - tier.min) / (nextTier.min - tier.min)) * 100))
      : 100;
    return {
      lifetimeSpend,
      annualSpend,
      points: Math.floor(lifetimeSpend * POINTS_PER_DOLLAR),
      tier,
      tierIndex,
      nextTier,
      progress,
      remaining: nextTier ? Math.max(0, nextTier.min - lifetimeSpend) : 0,
      annualProgress: Math.min(100, (annualSpend / 1500) * 100)
    };
  };

  const progressMarkup = loyalty => {
    const message = loyalty.nextTier
      ? `${formatUSD(loyalty.remaining)} to ${loyalty.nextTier.name}`
      : "Highest membership tier unlocked";
    return `<div class="account-tier-progress" aria-label="${Math.round(loyalty.progress)} percent progress to next tier"><div><span>${message}</span><strong>${Math.round(loyalty.progress)}%</strong></div><span class="account-tier-track"><i style="width:${loyalty.progress}%"></i></span></div>`;
  };

  const tierHighlights = [
    "Earn 10 points for every qualifying $1.",
    "Get early access to limited member offers.",
    "Unlock enhanced point events and setup consultations.",
    "Receive 3 exclusive vouchers and year-round accessory savings.",
    "Enter the black-card tier with samples, private invitations and a bespoke cue program."
  ];

  const loyaltySummaryMarkup = loyalty => {
    const nextIndex = Math.min(LOYALTY_TIERS.length - 1, loyalty.tierIndex + 1);
    const nudge = loyalty.nextTier
      ? `<strong>Only ${formatUSD(loyalty.remaining)} to ${loyalty.nextTier.name}</strong><span>Next reward: ${tierHighlights[nextIndex]}</span>`
      : `<strong>You reached the highest CUEBOTS tier.</strong><span>Keep your annual status active to preserve every Dark Voyager Elite privilege.</span>`;
    return `<section class="account-loyalty-card tier-${loyalty.tier.id}"><div class="account-loyalty-head"><span class="account-tier-icon" aria-hidden="true">${loyalty.tier.icon}</span><div><small>CUEBOTS REWARDS</small><h3>${loyalty.tier.name}</h3></div><strong>${loyalty.points.toLocaleString("en-US")} <small>PTS</small></strong></div><div class="account-loyalty-spend"><span>Lifetime qualifying spend</span><b>${formatUSD(loyalty.lifetimeSpend)}</b></div>${progressMarkup(loyalty)}<p class="account-loyalty-nudge">${nudge}</p><button class="account-loyalty-open" type="button" data-open-account-screen="rewards">VIEW REWARDS & BENEFITS <span>→</span></button></section>`;
  };

  const tierBenefits = [
    ["Launch Member", "Join rewards and earn 10 points for every $1 of qualifying spend."],
    ["Orbit Member", "Unlocked at $200 with early-access member offers."],
    ["Nova Member", "Unlocked at $1,000 with enhanced point events and setup consultations."],
    ["Celestial VIP", "Unlocked at $1,500 with 3 exclusive vouchers, year-round accessory savings and Celebration Privileges."],
    ["Dark Voyager Elite", "Unlocked at $2,000 with the black card, free samples, development invitations and the annual bespoke-cue program."]
  ];

  const rewardsPanelMarkup = loyalty => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);
    const expiryLabel = expiry.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const vouchers = loyalty.tierIndex >= 3
      ? `<div class="account-vouchers"><article><small>CELESTIAL10</small><strong>10% member reward</strong><span>Expires ${expiryLabel}</span></article><article><small>GEAR15</small><strong>15% accessories</strong><span>Expires ${expiryLabel}</span></article><article><small>CELEBRATE20</small><strong>20% celebration reward</strong><span>Expires ${expiryLabel}</span></article></div>`
      : `<p class="account-reward-note">Reach Celestial VIP to unlock 3 exclusive vouchers with a visible expiry date.</p>`;
    const annual = loyalty.tierIndex >= 4
      ? `<section class="account-annual-status"><div><small>ANNUAL BESPOKE CUE ELIGIBILITY</small><strong>${formatUSD(loyalty.annualSpend)} / $1,500 this year</strong></div><span class="account-tier-track"><i style="width:${loyalty.annualProgress}%"></i></span><p>Spend $1,500 in each membership year after reaching Dark Voyager Elite to receive one unique custom-designed cue.</p></section>`
      : "";
    const currentBenefit = tierHighlights[loyalty.tierIndex];
    const nextBenefit = loyalty.nextTier ? tierHighlights[loyalty.tierIndex + 1] : "Every premium privilege is now available to you.";
    return `<section class="rewards-visual tier-${loyalty.tier.id}"><img src="${root}assets/images/heroes/hero-nebula-carbon-pool-cue-desktop-01.webp" width="1920" height="1080" alt="" loading="lazy"><div><small>YOUR CURRENT STATUS</small><span aria-hidden="true">${loyalty.tier.icon}</span><h2>${loyalty.tier.name}</h2><p>${loyalty.points.toLocaleString("en-US")} points · ${formatUSD(loyalty.lifetimeSpend)} qualifying spend</p></div></section><section class="rewards-benefit-first"><p class="eyebrow">YOUR MOST VALUABLE BENEFITS</p><div><article><small>AVAILABLE NOW</small><strong>${currentBenefit}</strong><p>${tierBenefits[loyalty.tierIndex][1]}</p></article><article class="next"><small>${loyalty.nextTier ? `NEXT: ${loyalty.nextTier.name}` : "ELITE STATUS"}</small><strong>${nextBenefit}</strong><p>${loyalty.nextTier ? `${formatUSD(loyalty.remaining)} more qualifying spend to unlock.` : "You have unlocked the complete CUEBOTS rewards experience."}</p></article></div></section><section class="rewards-progress-card">${progressMarkup(loyalty)}</section>${vouchers}${annual}<details class="rewards-tier-details"><summary>Compare all membership tiers <span>+</span></summary><div class="account-tier-ladder">${LOYALTY_TIERS.map((tier, index) => `<article class="${index <= loyalty.tierIndex ? "unlocked" : "locked"}"><span aria-hidden="true">${tier.icon}</span><div><strong>${tierBenefits[index][0]}</strong><small>${tierBenefits[index][1]}</small></div><b>${tier.min ? formatUSD(tier.min) : "ENTRY"}</b></article>`).join("")}</div></details>`;
  };

  const showToast = message => {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
  };

  const setMode = nextMode => {
    mode = nextMode === "signup" ? "signup" : "signin";
    const signup = mode === "signup";
    modal.classList.remove("is-account-dashboard", "is-account-success");
    title.textContent = signup ? "Create your account" : "Account sign in";
    intro.textContent = signup
      ? "Create your player profile to save equipment, track orders and receive better recommendations."
      : "Enter any email and password to continue in this prototype.";
    submit.textContent = signup ? "CREATE ACCOUNT" : "SIGN IN";
    passwordInput.autocomplete = signup ? "new-password" : "current-password";
    if (switcher) {
      switcher.dataset.accountMode = signup ? "signin" : "signup";
      switcher.textContent = signup ? "Already have an account? Sign in" : "New to CUEBOTS? Create an account";
    }
    form.hidden = false;
    if (guestPromo) guestPromo.hidden = false;
    modal.querySelector("[data-account-dashboard]")?.setAttribute("hidden", "");
    modal.querySelector("[data-account-success]")?.setAttribute("hidden", "");
    if (status) status.textContent = "";
  };

  const dashboardMarkup = session => {
    const wishlist = safeReadLocal("cuebotsHomeWishlist", {});
    const cart = safeReadLocal("cuebotsHomeCart", []);
    const savedCount = Object.values(wishlist).filter(Boolean).length;
    const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const name = displayName(session.email);
    return `<div class="account-dashboard-identity"><span class="account-avatar" aria-hidden="true">${name.charAt(0)}</span><div><small>PLAYER ACCOUNT</small><h3>${name}</h3><p>${session.email}</p></div><span class="account-session-badge">ACTIVE SESSION</span></div><div class="account-dashboard-stats"><article><strong>0</strong><span>ORDERS</span></article><article><strong>${savedCount}</strong><span>SAVED</span></article><article><strong>${cartCount}</strong><span>IN CART</span></article></div><nav class="account-dashboard-nav" aria-label="Account management"><button class="active" type="button" data-account-section="overview">Overview</button><button type="button" data-account-section="orders">Orders</button><button type="button" data-account-section="saved">Saved gear</button><button type="button" data-account-section="profile">Profile</button></nav><div class="account-dashboard-panel" data-account-panel><p class="eyebrow">ACCOUNT OVERVIEW</p><h3>Your player space is ready.</h3><p>Use this panel to follow orders, revisit saved equipment and keep your shopping journey connected.</p><div class="account-dashboard-actions"><a class="btn" href="${root}pages/collection-pool-cues.html">CONTINUE SHOPPING</a><a class="btn btn-secondary" href="${root}pages/services.html#contact">PLAYER SUPPORT</a></div></div><a class="account-dashboard-promo" href="${root}pages/collection-upgrade-my-shaft.html"><img src="${root}assets/images/collections/thumb-upgrade-my-shaft-related-5x3-01.webp" width="700" height="420" alt="" loading="lazy"><span><small>RECOMMENDED NEXT STEP</small><strong>Upgrade the response. Keep your cue.</strong><b>FIND YOUR SHAFT →</b></span></a><button class="account-signout" type="button" data-account-signout>SIGN OUT OF THIS SESSION</button>`;
  };

  const enhancedDashboardMarkup = session => {
    const wishlist = safeReadLocal("cuebotsHomeWishlist", {});
    const cart = safeReadLocal("cuebotsHomeCart", []);
    const orderCount = safeReadLocal(ORDER_HISTORY_KEY, []).length;
    const savedCount = Object.values(wishlist).filter(Boolean).length;
    const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const loyalty = loyaltyState();
    const name = displayName(session.email);
    return `<div class="account-dashboard-identity"><span class="account-avatar" aria-hidden="true">${name.charAt(0)}</span><div><small>PLAYER ACCOUNT</small><h3>${name}</h3><p>${session.email}</p></div><span class="account-session-badge">ACTIVE SESSION</span></div><div class="account-dashboard-stats"><article><strong>${orderCount}</strong><span>ORDERS</span></article><article><strong>${savedCount}</strong><span>SAVED</span></article><article><strong>${cartCount}</strong><span>IN CART</span></article></div>${loyaltySummaryMarkup(loyalty)}<nav class="account-dashboard-nav" aria-label="Account management"><button class="active" type="button" data-account-section="overview">Overview</button><button type="button" data-account-section="orders">Orders</button><button type="button" data-account-section="saved">Saved gear</button><button type="button" data-account-section="rewards">Rewards</button><button type="button" data-account-section="profile">Profile</button></nav><div class="account-dashboard-panel" data-account-panel><p class="eyebrow">ACCOUNT OVERVIEW</p><h3>Your player space is ready.</h3><p>Use this panel to follow orders, revisit saved equipment and keep your shopping journey connected.</p><div class="account-dashboard-actions"><a class="btn" href="${root}pages/collection-pool-cues.html">CONTINUE SHOPPING</a><a class="btn btn-secondary" href="${root}pages/services.html#contact">PLAYER SUPPORT</a></div></div><a class="account-dashboard-promo" href="${root}pages/collection-upgrade-my-shaft.html"><img src="${root}assets/images/collections/thumb-upgrade-my-shaft-related-5x3-01.webp" width="700" height="420" alt="" loading="lazy"><span><small>RECOMMENDED NEXT STEP</small><strong>Upgrade the response. Keep your cue.</strong><b>FIND YOUR SHAFT →</b></span></a><button class="account-signout" type="button" data-account-signout>SIGN OUT OF THIS SESSION</button>`;
  };

  const accountDashboardMarkup = session => {
    const wishlist = safeReadLocal("cuebotsHomeWishlist", {});
    const cart = safeReadLocal("cuebotsHomeCart", []);
    const orderValue = safeReadLocal(ORDER_HISTORY_KEY, []);
    const orderCount = Array.isArray(orderValue) ? orderValue.length : 0;
    const savedCount = Object.values(wishlist).filter(Boolean).length;
    const cartCount = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const loyalty = loyaltyState();
    const name = displayName(session.email);
    return `<div class="account-dashboard-identity"><span class="account-avatar" aria-hidden="true">${name.charAt(0)}</span><div><small>PLAYER ACCOUNT</small><h3>${name}</h3><p>${escapeHTML(session.email)}</p></div><span class="account-session-badge">ACTIVE SESSION</span></div><div class="account-dashboard-stats"><article><strong>${orderCount}</strong><span>PURCHASES</span></article><article><strong>${savedCount}</strong><span>WISHLIST</span></article><article><strong>${cartCount}</strong><span>IN CART</span></article></div>${loyaltySummaryMarkup(loyalty)}<div class="account-dashboard-links"><button type="button" data-open-account-screen="orders"><span class="account-link-icon" aria-hidden="true">▤</span><span><strong>Orders & purchase history</strong><small>Receipts, products and delivery details</small></span><b>→</b></button><button type="button" data-open-account-screen="profile"><span class="account-link-icon" aria-hidden="true">◎</span><span><strong>Profile & security</strong><small>Personal information and password controls</small></span><b>→</b></button></div><a class="account-dashboard-promo" href="${root}pages/collection-upgrade-my-shaft.html"><img src="${root}assets/images/collections/thumb-upgrade-my-shaft-related-5x3-01.webp" width="700" height="420" alt="" loading="lazy"><span><small>RECOMMENDED NEXT STEP</small><strong>Upgrade the response. Keep your cue.</strong><b>FIND YOUR SHAFT →</b></span></a><button class="account-signout" type="button" data-account-signout>SIGN OUT OF THIS SESSION</button>`;
  };

  const accountProfile = session => {
    const saved = safeReadLocal("cuebotsAccountProfile", {});
    const fallbackName = displayName(session.email).split(" ");
    return { firstName: saved.firstName || fallbackName[0] || "Player", lastName: saved.lastName || fallbackName.slice(1).join(" "), email: saved.email || session.email, phone: saved.phone || "" };
  };

  const ordersScreenMarkup = () => {
    const value = safeReadLocal(ORDER_HISTORY_KEY, []);
    const orders = Array.isArray(value) ? value : [];
    if (!orders.length) return `<div class="account-empty-state"><span aria-hidden="true">▤</span><h3>No purchases yet</h3><p>Your confirmed orders will appear here with product, delivery and payment-summary information.</p><a class="btn" href="${root}pages/collection-pool-cues.html">START SHOPPING</a></div>`;
    return `<div class="account-orders-list">${orders.map(order => `<article><header><div><small>ORDER ${escapeHTML(order.id)}</small><strong>${new Date(order.placedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</strong></div><span>CONFIRMED</span><b>${formatUSD(order.total)}</b></header><div class="account-order-items">${(order.items || []).map(item => `<p><span>${Number(item.qty) || 1} × ${escapeHTML(item.name)}</span><b>${formatUSD((Number(item.price) || 0) * (Number(item.qty) || 1))}</b></p>`).join("")}</div>${order.shipping ? `<footer><strong>SHIP TO</strong><span>${escapeHTML(order.shipping.name)} · ${escapeHTML(order.shipping.address)}, ${escapeHTML(order.shipping.city)} ${escapeHTML(order.shipping.postalCode)}, ${escapeHTML(order.shipping.country)}</span></footer>` : ""}</article>`).join("")}</div>`;
  };

  const profileScreenMarkup = session => {
    const profile = accountProfile(session);
    return `<form class="account-profile-form" data-account-profile-form novalidate><div class="account-form-section-head"><div><p class="eyebrow">PERSONAL DETAILS</p><h3>Information used for your account</h3></div><span>Editable</span></div><div class="account-profile-fields"><label>First name<input name="firstName" value="${escapeHTML(profile.firstName)}" required></label><label>Last name<input name="lastName" value="${escapeHTML(profile.lastName)}"></label><label class="wide">Email address<input name="email" type="email" value="${escapeHTML(profile.email)}" required></label><label class="wide">Phone number<input name="phone" type="tel" value="${escapeHTML(profile.phone)}" placeholder="Optional"></label></div><button class="btn" type="submit">SAVE PERSONAL DETAILS</button><p class="account-screen-status" data-profile-status aria-live="polite"></p></form>`;
  };

  const securityScreenMarkup = () => `<form class="account-security-form" data-account-security-form novalidate><div class="account-form-section-head"><div><p class="eyebrow">PASSWORD & SECURITY</p><h3>Change your account password</h3></div><span>Protected</span></div><p>This prototype does not store password values. The flow demonstrates the final validation and confirmation experience.</p><label>Current password<input name="currentPassword" type="password" autocomplete="current-password" required></label><label>New password<input name="newPassword" type="password" autocomplete="new-password" minlength="6" required></label><label>Confirm new password<input name="confirmPassword" type="password" autocomplete="new-password" minlength="6" required></label><button class="btn" type="submit">UPDATE PASSWORD</button><p class="account-screen-status" data-security-status aria-live="polite"></p></form>`;

  const accountScreenBodyMarkup = (section, session) => {
    const content = section === "orders" ? ordersScreenMarkup() : section === "profile" ? profileScreenMarkup(session) : section === "security" ? securityScreenMarkup() : rewardsPanelMarkup(loyaltyState());
    return `<nav class="account-screen-nav" aria-label="Account center"><button class="${section === "rewards" ? "active" : ""}" type="button" data-account-screen-tab="rewards">Rewards</button><button class="${section === "orders" ? "active" : ""}" type="button" data-account-screen-tab="orders">Orders</button><button class="${section === "profile" ? "active" : ""}" type="button" data-account-screen-tab="profile">Personal details</button><button class="${section === "security" ? "active" : ""}" type="button" data-account-screen-tab="security">Security</button></nav><div class="account-screen-content ${section === "rewards" ? "is-rewards" : ""}" data-account-screen-content>${content}</div>`;
  };

  const ensureAccountScreen = () => {
    let screen = document.querySelector("[data-account-screen]");
    if (screen) return screen;
    document.body.insertAdjacentHTML("beforeend", `<div class="account-screen-overlay" data-account-screen-overlay hidden></div><section class="account-screen" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="accountScreenTitle" data-account-screen hidden><header><div><small>CUEBOTS PLAYER CENTER</small><h2 id="accountScreenTitle">Account center</h2></div><button type="button" aria-label="Close account center" data-close-account-screen>×</button></header><div data-account-screen-body></div></section>`);
    return document.querySelector("[data-account-screen]");
  };

  const openAccountScreen = section => {
    const session = readSession();
    if (!session) return;
    const screen = ensureAccountScreen();
    const overlay = document.querySelector("[data-account-screen-overlay]");
    screen.querySelector("[data-account-screen-body]").innerHTML = accountScreenBodyMarkup(section, session);
    screen.hidden = false;
    overlay.hidden = false;
    screen.setAttribute("aria-hidden", "false");
    document.body.classList.add("account-screen-lock");
    requestAnimationFrame(() => { screen.classList.add("open"); overlay.classList.add("open"); });
  };

  const closeAccountScreen = () => {
    const screen = document.querySelector("[data-account-screen]");
    const overlay = document.querySelector("[data-account-screen-overlay]");
    if (!screen) return;
    screen.classList.remove("open");
    overlay?.classList.remove("open");
    screen.setAttribute("aria-hidden", "true");
    document.body.classList.remove("account-screen-lock");
    setTimeout(() => { screen.hidden = true; if (overlay) overlay.hidden = true; }, 220);
  };

  const ensureDashboard = () => {
    let dashboard = modal.querySelector("[data-account-dashboard]");
    if (!dashboard) {
      dashboard = document.createElement("div");
      dashboard.className = "account-dashboard";
      dashboard.dataset.accountDashboard = "";
      dashboard.hidden = true;
      modal.appendChild(dashboard);
    }
    return dashboard;
  };

  const ensureSuccess = () => {
    let success = modal.querySelector("[data-account-success]");
    if (!success) {
      success = document.createElement("div");
      success.className = "account-success";
      success.dataset.accountSuccess = "";
      success.hidden = true;
      modal.appendChild(success);
    }
    return success;
  };

  const renderDashboard = session => {
    const dashboard = ensureDashboard();
    const success = ensureSuccess();
    form.hidden = true;
    if (guestPromo) guestPromo.hidden = true;
    success.hidden = true;
    dashboard.hidden = false;
    dashboard.innerHTML = accountDashboardMarkup(session);
    modal.classList.remove("is-account-success");
    modal.classList.add("is-account-dashboard");
    title.textContent = "My account";
    updateAccountChrome(session);
  };

  const renderSignupSuccess = session => {
    const success = ensureSuccess();
    const dashboard = ensureDashboard();
    form.hidden = true;
    if (guestPromo) guestPromo.hidden = true;
    dashboard.hidden = true;
    success.hidden = false;
    success.innerHTML = `<span class="account-success-icon" aria-hidden="true">✓</span><p class="eyebrow">ACCOUNT CREATED</p><h3>Welcome to CUEBOTS.</h3><p>Your account has been created successfully. A confirmation email has been sent to <strong>${session.email}</strong>.</p><button class="btn" type="button" data-account-continue>GO TO MY ACCOUNT</button><a href="${root}pages/collection-first-carbon-cue.html">Explore first-player setups →</a>`;
    modal.classList.remove("is-account-dashboard");
    modal.classList.add("is-account-success");
    title.textContent = "Check your inbox";
    updateAccountChrome(session);
  };

  const updateAccountChrome = session => {
    document.querySelectorAll(".account-entry").forEach(entry => {
      entry.classList.toggle("is-signed-in", Boolean(session));
      const popover = entry.querySelector(".account-popover");
      if (!popover) return;
      if (!session) {
        popover.innerHTML = `<small>PLAYER ACCOUNT</small><h2>Welcome to CUEBOTS</h2><p>Track orders, save equipment and get faster recommendations.</p><button class="btn" type="button" data-open-account data-account-mode="signin">SIGN IN</button><button class="btn btn-secondary" type="button" data-open-account data-account-mode="signup">CREATE NEW ACCOUNT</button><a class="account-promo" href="${root}pages/collection-first-carbon-cue.html"><img src="${root}assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp" width="500" height="300" alt="" loading="lazy"><span><small>NEW PLAYER?</small><strong>Find your first setup</strong><b>EXPLORE →</b></span></a>`;
        return;
      }
      popover.innerHTML = `<small>SIGNED IN</small><h2>Hi, ${displayName(session.email)}</h2><p>${session.email}<br>Your account stays active for this browser session.</p><button class="btn" type="button" data-open-account data-account-mode="dashboard">VIEW MY ACCOUNT</button><button class="account-popover-signout" type="button" data-account-signout>SIGN OUT</button><a class="account-promo" href="${root}pages/collection-upgrade-my-shaft.html"><img src="${root}assets/images/collections/thumb-upgrade-my-shaft-related-5x3-01.webp" width="500" height="300" alt="" loading="lazy"><span><small>FOR YOUR NEXT SESSION</small><strong>Find your shaft upgrade</strong><b>EXPLORE →</b></span></a>`;
    });
  };

  const accountPanels = {
    overview: ["ACCOUNT OVERVIEW", "Your player space is ready.", "Use this panel to follow orders, revisit saved equipment and keep your shopping journey connected."],
    orders: ["ORDER HISTORY", "No orders in this demo yet.", "Completed orders will appear here with delivery status, product details and support links."],
    saved: ["SAVED GEAR", "Your shortlist, in one place.", "Products marked with the heart icon are counted here so you can return to them quickly."],
    profile: ["PROFILE", "Session account details.", "Your email is active for this browser session. Password data is never stored by this prototype."]
  };

  const standardPanelMarkup = content => `<p class="eyebrow">${content[0]}</p><h3>${content[1]}</h3><p>${content[2]}</p><div class="account-dashboard-actions"><a class="btn" href="${root}pages/collection-pool-cues.html">CONTINUE SHOPPING</a><a class="btn btn-secondary" href="${root}pages/services.html#contact">PLAYER SUPPORT</a></div>`;

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-open-account],[data-account-mode],[data-account-signout],[data-account-continue],[data-account-section],[data-open-account-screen],[data-account-screen-tab],[data-close-account-screen],[data-account-screen-overlay]");
    if (!target) return;
    if (target.matches("[data-close-account-screen],[data-account-screen-overlay]")) {
      closeAccountScreen();
      return;
    }
    if (target.matches("[data-open-account-screen]")) {
      openAccountScreen(target.dataset.openAccountScreen || "rewards");
      return;
    }
    if (target.matches("[data-account-screen-tab]")) {
      const session = readSession();
      const screen = document.querySelector("[data-account-screen]");
      if (session && screen) screen.querySelector("[data-account-screen-body]").innerHTML = accountScreenBodyMarkup(target.dataset.accountScreenTab, session);
      return;
    }
    if (target.matches("[data-account-signout]")) {
      closeAccountScreen();
      clearSession();
      updateAccountChrome(null);
      const close = modal.querySelector("[data-close-account],[data-close]");
      if (modal.classList.contains("open")) close?.click();
      setMode("signin");
      showToast("You have signed out of this browser session.");
      return;
    }
    if (target.matches("[data-account-continue]")) {
      const session = readSession();
      if (session) renderDashboard(session);
      return;
    }
    if (target.matches("[data-account-section]")) {
      const key = target.dataset.accountSection;
      const content = accountPanels[key] || accountPanels.overview;
      modal.querySelectorAll("[data-account-section]").forEach(button => button.classList.toggle("active", button === target));
      const panel = modal.querySelector("[data-account-panel]");
      panel.classList.toggle("is-rewards-panel", key === "rewards");
      panel.innerHTML = key === "rewards" ? rewardsPanelMarkup(loyaltyState()) : standardPanelMarkup(content);
      return;
    }
    if (target.matches("[data-open-account]")) {
      const session = readSession();
      if (session) renderDashboard(session);
      else setMode(target.dataset.accountMode || "signin");
      return;
    }
    if (target.matches("[data-account-mode]")) setMode(target.dataset.accountMode);
  });

  const releaseAccountFocus = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    const active = document.activeElement;
    if (active?.closest?.(".account-entry")) active.blur();
  }));

  document.addEventListener("click", event => {
    if (event.target.closest("[data-close-account],.account-modal [data-close],[data-overlay]")) releaseAccountFocus();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (document.querySelector("[data-account-screen].open")) closeAccountScreen();
      releaseAccountFocus();
    }
  });

  document.addEventListener("submit", event => {
    if (event.target.matches("[data-account-profile-form]")) {
      event.preventDefault();
      const profileForm = event.target;
      const profileStatus = profileForm.querySelector("[data-profile-status]");
      if (!profileForm.checkValidity()) {
        profileStatus.textContent = "Please complete the required personal details with a valid email address.";
        profileStatus.classList.add("error");
        profileForm.querySelector(":invalid")?.focus();
        return;
      }
      const profile = { firstName: profileForm.elements.firstName.value.trim(), lastName: profileForm.elements.lastName.value.trim(), email: profileForm.elements.email.value.trim(), phone: profileForm.elements.phone.value.trim() };
      safeWriteLocal("cuebotsAccountProfile", profile);
      const session = readSession();
      if (session) {
        session.email = profile.email;
        writeSession(session);
        updateAccountChrome(session);
        renderDashboard(session);
      }
      profileStatus.textContent = "Personal details saved successfully.";
      profileStatus.classList.remove("error");
      return;
    }
    if (event.target.matches("[data-account-security-form]")) {
      event.preventDefault();
      const securityForm = event.target;
      const securityStatus = securityForm.querySelector("[data-security-status]");
      const next = securityForm.elements.newPassword.value;
      const confirmation = securityForm.elements.confirmPassword.value;
      if (!securityForm.checkValidity() || next !== confirmation) {
        securityStatus.textContent = next !== confirmation ? "The new passwords do not match." : "Complete all fields. Your new password must contain at least 6 characters.";
        securityStatus.classList.add("error");
        return;
      }
      securityForm.reset();
      securityStatus.textContent = "Password updated successfully for this prototype session.";
      securityStatus.classList.remove("error");
    }
  });

  form.addEventListener("input", () => {
    if (!status) return;
    status.textContent = "";
    status.classList.remove("error");
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    event.stopPropagation();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !emailInput.checkValidity() || !password) {
      if (status) {
        status.textContent = "Please enter a valid email address and a password.";
        status.classList.add("error");
      }
      (!email || !emailInput.checkValidity() ? emailInput : passwordInput).focus();
      return;
    }
    if (status) status.classList.remove("error");
    const session = { loggedIn: true, email, created: mode === "signup", signedInAt: Date.now() };
    writeSession(session);
    if (mode === "signup") {
      renderSignupSuccess(session);
      showToast("Account created. Check your email to confirm it.");
    } else {
      renderDashboard(session);
      showToast("Signed in successfully.");
    }
    form.reset();
  });

  const currentSession = readSession();
  updateAccountChrome(currentSession);
  if (!currentSession) setMode("signin");
})();
