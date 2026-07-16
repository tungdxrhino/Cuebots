(() => {
  "use strict";

  const scriptUrl = new URL(document.currentScript?.src || location.href, location.href);
  const offerImage = new URL("../assets/images/products/gloves/prod-pure-pool-glove-pack-5-mixed-alt-1x1-01.webp", scriptUrl).href;
  const KEYS = {
    startedAt: "cuebotsVisitStartedAt",
    nextAt: "cuebotsEmailNextAt",
    dismissCount: "cuebotsEmailDismissCount",
    stopped: "cuebotsEmailStopped",
    submitted: "cuebotsEmailSubmitted",
    submittedEmail: "cuebotsEmailAddress"
  };
  const FIRST_DELAY = 15000;
  const REMINDERS = [45000, 90000];
  let timer = 0;
  let thankTimer = 0;
  let mode = "offer";

  const readSession = key => {
    try { return sessionStorage.getItem(key); }
    catch (error) { return null; }
  };
  const writeSession = (key, value) => {
    try { sessionStorage.setItem(key, String(value)); }
    catch (error) { /* The popup still works for the current page. */ }
  };
  const removeSession = key => {
    try { sessionStorage.removeItem(key); }
    catch (error) { /* Ignore unavailable storage. */ }
  };
  const readLocal = key => {
    try { return localStorage.getItem(key); }
    catch (error) { return null; }
  };
  const writeLocal = (key, value) => {
    try { localStorage.setItem(key, String(value)); }
    catch (error) { /* Submission feedback must not depend on storage access. */ }
  };
  const isSubmitted = () => readLocal(KEYS.submitted) === "true";

  function mount() {
    if (document.querySelector("[data-global-email-popup]")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="global-email-overlay" data-global-email-overlay></div>
      <section class="global-email-popup" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="globalEmailTitle" data-global-email-popup>
        <button class="global-email-close" type="button" aria-label="Close email popup" data-global-email-close>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
        <div class="global-email-media">
          <img src="${offerImage}" width="339" height="339" alt="CUEBOTS Pure Pool Glove five-color pack" loading="eager" decoding="async">
          <span><small>PURE POOL GLOVE</small><strong>Comfort in every shot.</strong></span>
        </div>
        <div class="global-email-content" data-global-email-content></div>
      </section>`);
  }

  function offerMarkup() {
    return `<p class="global-email-eyebrow">PLAYER-ONLY OFFERS</p>
      <h2 id="globalEmailTitle">Get 10% off your first order.</h2>
      <p>Join for equipment tips, new releases, fit advice and early access to bundle offers.</p>
      <form class="global-email-form" data-global-email-form novalidate>
        <label for="globalEmailInput">Email address</label>
        <div class="global-email-form-row">
          <input id="globalEmailInput" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" aria-describedby="globalEmailPrivacy globalEmailStatus" required>
          <button type="submit">UNLOCK 10%</button>
        </div>
        <small id="globalEmailPrivacy">No spam. Unsubscribe any time.</small>
        <p id="globalEmailStatus" class="global-email-status" data-global-email-status aria-live="polite"></p>
      </form>`;
  }

  function thankYouMarkup() {
    return `<div class="global-email-thanks" role="status" aria-live="polite">
      <span class="global-email-check" aria-hidden="true">✓</span>
      <p class="global-email-eyebrow">THANK YOU</p>
      <h2 id="globalEmailTitle">You're on the CUEBOTS list.</h2>
      <p>Your welcome offer and player updates are ready. This message will close automatically in 10 seconds.</p>
    </div>`;
  }

  function anotherSurfaceIsOpen() {
    return Boolean(document.querySelector(".search-dialog.open,.quick-modal.open,.account-modal.open,.benefit-modal.open,.cart-drawer.open,.mobile-drawer.open"));
  }

  function openVisual() {
    mount();
    const popup = document.querySelector("[data-global-email-popup]");
    const overlay = document.querySelector("[data-global-email-overlay]");
    popup.classList.add("open");
    popup.setAttribute("aria-hidden", "false");
    overlay.classList.add("open");
    document.body.classList.add("global-email-lock");
  }

  function closeVisual() {
    clearTimeout(thankTimer);
    const popup = document.querySelector("[data-global-email-popup]");
    const overlay = document.querySelector("[data-global-email-overlay]");
    popup?.classList.remove("open");
    popup?.setAttribute("aria-hidden", "true");
    overlay?.classList.remove("open");
    document.body.classList.remove("global-email-lock");
  }

  function showOffer(force = false) {
    if (isSubmitted()) return;
    if (!force && (readSession(KEYS.stopped) === "true" || document.hidden || anotherSurfaceIsOpen())) {
      schedule(1000);
      return;
    }
    mode = "offer";
    openVisual();
    document.querySelector("[data-global-email-content]").innerHTML = offerMarkup();
    requestAnimationFrame(() => document.querySelector("#globalEmailInput")?.focus());
  }

  function showThankYou() {
    mode = "thanks";
    openVisual();
    document.querySelector("[data-global-email-content]").innerHTML = thankYouMarkup();
    clearTimeout(thankTimer);
    thankTimer = setTimeout(closeVisual, 10000);
  }

  function dismissOffer() {
    closeVisual();
    const count = Math.min(3, (Number(readSession(KEYS.dismissCount)) || 0) + 1);
    writeSession(KEYS.dismissCount, count);
    if (count >= 3) {
      writeSession(KEYS.stopped, "true");
      removeSession(KEYS.nextAt);
      clearTimeout(timer);
      return;
    }
    const nextAt = Date.now() + REMINDERS[count - 1];
    writeSession(KEYS.nextAt, nextAt);
    schedule(Math.max(0, nextAt - Date.now()));
  }

  function requestClose() {
    if (mode === "thanks") closeVisual();
    else dismissOffer();
  }

  function tryShowDue() {
    if (isSubmitted() || readSession(KEYS.stopped) === "true") return;
    if (document.hidden || anotherSurfaceIsOpen()) { schedule(1000); return; }
    showOffer();
  }

  function schedule(delay) {
    clearTimeout(timer);
    if (isSubmitted() || readSession(KEYS.stopped) === "true") return;
    timer = setTimeout(tryShowDue, Math.max(0, delay));
  }

  function initializeSchedule() {
    if (isSubmitted() || readSession(KEYS.stopped) === "true") return;
    const now = Date.now();
    let startedAt = Number(readSession(KEYS.startedAt));
    if (!startedAt) {
      startedAt = now;
      writeSession(KEYS.startedAt, startedAt);
    }
    let nextAt = Number(readSession(KEYS.nextAt));
    if (!nextAt) {
      nextAt = startedAt + FIRST_DELAY;
      writeSession(KEYS.nextAt, nextAt);
    }
    schedule(Math.max(0, nextAt - now));
  }

  document.addEventListener("click", event => {
    const manualTrigger = event.target.closest("[data-open-email]");
    if (manualTrigger) {
      event.preventDefault();
      if (isSubmitted()) showThankYou();
      else showOffer(true);
      return;
    }
    if (event.target.closest("[data-global-email-close]") || event.target.matches("[data-global-email-overlay]")) requestClose();
  });

  document.addEventListener("submit", event => {
    if (!event.target.matches("[data-global-email-form]")) return;
    event.preventDefault();
    const input = event.target.elements.email;
    const status = event.target.querySelector("[data-global-email-status]");
    if (!input.checkValidity()) {
      status.textContent = "Please enter a valid email address.";
      input.focus();
      return;
    }
    writeLocal(KEYS.submitted, "true");
    writeLocal(KEYS.submittedEmail, input.value.trim());
    writeSession(KEYS.stopped, "true");
    removeSession(KEYS.nextAt);
    clearTimeout(timer);
    showThankYou();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.querySelector("[data-global-email-popup].open")) requestClose();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) initializeSchedule();
  });

  initializeSchedule();
})();
