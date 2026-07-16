(() => {
  "use strict";

  const CURRENCY_LANGUAGE = {
    USD: { code: "en", locale: "en-US" },
    VND: { code: "vi", locale: "vi-VN" },
    CNY: { code: "zh", locale: "zh-CN" },
    EUR: { code: "fr", locale: "fr-FR" },
    KRW: { code: "ko", locale: "ko-KR" },
    JPY: { code: "ja", locale: "ja-JP" }
  };
  const CURRENCY_KEY = "cuebotsCurrency";
  const LANGUAGE_KEY = "cuebotsLanguage";
  const root = document.body.dataset.root || "";
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const translatedAttributes = ["placeholder", "title", "aria-label"];
  let activePack = { locale: "en-US", strings: {} };
  let activeCurrency = "USD";
  let queued = false;

  const readSession = (key, fallback) => {
    try { return sessionStorage.getItem(key) || fallback; }
    catch (error) { return fallback; }
  };

  const writeSession = (key, value) => {
    try { sessionStorage.setItem(key, value); }
    catch (error) { /* The selected language still applies to the current page. */ }
  };

  const translatedValue = source => activePack.strings?.[source] || source;

  function translateTextNode(node, refreshSource = false) {
    if (!node.nodeValue?.trim()) return;
    if (refreshSource || !textSources.has(node)) textSources.set(node, node.nodeValue);
    const source = textSources.get(node);
    const trimmed = source.trim();
    const translated = translatedValue(trimmed);
    if (translated === trimmed) {
      node.nodeValue = source;
      return;
    }
    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }

  function translateElement(element, refreshSource = false) {
    if (!(element instanceof Element) || element.matches("script,style,noscript,svg,code,pre")) return;
    const explicitKey = element.dataset.i18n;
    if (explicitKey && activePack.strings?.[explicitKey]) element.textContent = activePack.strings[explicitKey];
    let originals = attributeSources.get(element);
    if (!originals) { originals = {}; attributeSources.set(element, originals); }
    translatedAttributes.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (refreshSource || !(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, translatedValue(originals[attribute]));
    });
  }

  function translateTree(rootNode, refreshSource = false) {
    if (rootNode.nodeType === Node.TEXT_NODE) {
      translateTextNode(rootNode, refreshSource);
      return;
    }
    if (!(rootNode instanceof Element) && rootNode !== document.body) return;
    if (rootNode instanceof Element) translateElement(rootNode, refreshSource);
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        return parent?.closest("script,style,noscript,svg,code,pre") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, refreshSource);
      else translateElement(node, refreshSource);
    }
  }

  const observer = new MutationObserver(mutations => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      observer.disconnect();
      mutations.forEach(mutation => {
        if (mutation.type === "characterData") translateTextNode(mutation.target, true);
        if (mutation.type === "attributes") translateElement(mutation.target, true);
        mutation.addedNodes?.forEach(node => translateTree(node, true));
      });
      observe();
    });
  });

  function observe() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: translatedAttributes });
  }

  async function activateCurrency(currency, announce = false) {
    activeCurrency = CURRENCY_LANGUAGE[currency] ? currency : "USD";
    const language = CURRENCY_LANGUAGE[activeCurrency];
    writeSession(CURRENCY_KEY, activeCurrency);
    writeSession(LANGUAGE_KEY, language.code);
    try {
      const url = new URL(`${root}locales/${language.code}.json`, location.href);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Locale ${language.code} failed to load`);
      activePack = await response.json();
    } catch (error) {
      activePack = { locale: language.locale, strings: {} };
    }
    document.documentElement.lang = activePack.locale || language.locale;
    observer.disconnect();
    translateTree(document.body);
    observe();
    document.querySelectorAll("[data-currency-select]").forEach(select => { select.value = activeCurrency; });
    if (announce) window.dispatchEvent(new CustomEvent("cuebots:language-changed", { detail: { currency: activeCurrency, language: language.code } }));
  }

  document.addEventListener("change", event => {
    if (!event.target.matches("[data-currency-select]")) return;
    activateCurrency(event.target.value, true);
  });

  const requestedCurrency = readSession(CURRENCY_KEY, document.querySelector("[data-currency-select]")?.value || "USD");
  window.CUEBOTS_I18N = {
    activateCurrency,
    t: key => translatedValue(key),
    currencyLanguage: CURRENCY_LANGUAGE
  };
  activateCurrency(requestedCurrency);
})();
