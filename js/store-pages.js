(() => {
  "use strict";

  const body = document.body;
  const ROOT = body.dataset.root || "";
  const QUERY = new URLSearchParams(location.search);
  const PAGE = QUERY.get("id") || body.dataset.page || "pool-cues";
  const TYPE = body.dataset.pageType || "collection";
  const path = value => `${ROOT}${value}`;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const CURRENCY = {
    USD: { rate: 1, locale: "en-US", currency: "USD" },
    VND: { rate: 26150, locale: "vi-VN", currency: "VND" },
    CNY: { rate: 7.18, locale: "zh-CN", currency: "CNY" },
    EUR: { rate: .86, locale: "fr-FR", currency: "EUR" },
    KRW: { rate: 1390, locale: "ko-KR", currency: "KRW" },
    JPY: { rate: 156, locale: "ja-JP", currency: "JPY" }
  };

  const PRODUCTS = [
    { id: "rhino-30-125", slug: "rhino-30-125", name: "Rhino 30-inch 12.5mm Carbon Shaft", price: 199, oldPrice: 229, image: "catalog/thumb-carbon-shafts-catalog-1x1-01.webp", tags: ["shaft", "play", "upgrade"], detail: true, copy: "Low-deflection carbon response with a stable, familiar 12.5 mm profile." },
    { id: "z-fusion-limited", slug: "z-fusion-limited", name: "Z Fusion Limited Pool Cue", price: 319, oldPrice: 359, image: "catalog/thumb-pool-cues-catalog-1x1-01.webp", tags: ["play", "butt", "control"], detail: true, copy: "A distinctive playing cue balanced for smooth delivery and confident cue-ball control." },
    { id: "nebula-carbon-cue", slug: "nebula-carbon-cue", name: "Rhino Nebula Carbon Pool Cue", price: 299, oldPrice: 349, image: "products/prod-nebula-carbon-pool-cue-collection-1x1-01.webp", tags: ["play", "bundle", "control"], detail: true, copy: "Cosmic color, carbon consistency and a natural balance for league and tournament play." },
    { id: "rhino-carbon-break-cue", slug: "rhino-carbon-break-cue", name: "Rhino Carbon Break Cue", price: 249, oldPrice: 289, image: "products/prod-break-power-collection-1x1-01.webp", tags: ["break", "power"], detail: true, copy: "Purpose-built stiffness and efficient energy transfer for a stronger, controlled break." },
    { id: "retro-ii-carbon-set", slug: "retro-ii-carbon-set", name: "Retro II Carbon Cue Set", price: 329, oldPrice: 369, image: "products/prod-retro-ii-carbon-pool-cue-collection-1x1-01.webp", tags: ["play", "bundle", "control"], detail: true, copy: "Classic visual detail paired with modern carbon performance in a complete setup." },
    { id: "carbon-shaft-starter-bundle", slug: "carbon-shaft-starter-bundle", name: "Carbon Shaft Starter Bundle", price: 279, oldPrice: 319, image: "products/prod-carbon-shaft-starter-bundle-1x1-01.webp", tags: ["shaft", "upgrade", "bundle", "accessory"], detail: true, copy: "A focused shaft upgrade with the accessories needed to keep your setup match-ready." },
    { id: "nebula-pro-bundle", slug: "nebula-pro-bundle", name: "Nebula Pro Player Bundle", price: 359, oldPrice: 419, image: "products/prod-nebula-carbon-pool-cue-collection-1x1-01.webp", tags: ["play", "bundle", "control"], detail: true, copy: "A coordinated cue, case and playing essentials package with no guesswork." },
    { id: "break-jump-power-duo", slug: "break-jump-power-duo", name: "Break and Jump Power Duo", price: 399, oldPrice: 479, image: "products/prod-break-jump-power-duo-1x1-01.webp", tags: ["break", "jump", "power", "bundle"], detail: true, copy: "Two purpose-built cues for the opening shot and difficult recovery situations." },
    { id: "rhino-118-shaft", name: "Rhino 11.8mm Carbon Shaft", price: 199, oldPrice: 229, image: "catalog/thumb-carbon-shafts-catalog-1x1-01.webp", tags: ["shaft", "upgrade", "control"], copy: "A slim, precise profile for players who prefer maximum visual feedback." },
    { id: "nitro-128-shaft", name: "Nitro 12.8mm Carbon Shaft", price: 229, oldPrice: 259, image: "products/prod-nitro-128-carbon-pool-shaft-1x1-01.webp", tags: ["shaft", "break", "power"], copy: "A robust carbon profile tuned for a solid hit and confident acceleration." },
    { id: "z-fusion-emerald", name: "Z Fusion Emerald Cue", price: 329, oldPrice: 379, image: "catalog/thumb-pool-cues-catalog-1x1-01.webp", tags: ["play", "butt", "control"], copy: "A statement finish over a stable, competition-ready playing platform." },
    { id: "carbon-jump-cue", name: "Compact Carbon Jump Cue", price: 169, oldPrice: 199, image: "catalog/thumb-jump-cues-catalog-1x1-01.webp", tags: ["jump", "control"], copy: "Compact handling and fast elevation for controlled jump-shot execution." },
    { id: "first-carbon-kit", name: "First Carbon Cue Starter Kit", price: 299, oldPrice: 369, image: "products/prod-first-carbon-cue-collection-1x1-01.webp", tags: ["play", "bundle", "starter"], copy: "A complete first setup designed to remove uncertainty from your first carbon cue." },
    { id: "single-playing-butt", name: "Carbon Playing Butt — Midnight", price: 189, oldPrice: 229, image: "catalog/thumb-cue-butts-catalog-1x1-01.webp", tags: ["butt", "play"], copy: "A balanced single butt ready to pair with your preferred shaft and joint." },
    { id: "hard-travel-case", name: "Tournament Hard Cue Case", price: 119, oldPrice: 139, image: "setups/thumb-tournament-setup-recommended-1x1-01.webp", tags: ["case", "accessory"], copy: "Protective storage for travel, league nights and long tournament weekends." },
    { id: "soft-cue-case", name: "Lightweight Soft Cue Case", price: 69, oldPrice: 79, image: "setups/thumb-league-night-setup-recommended-1x1-01.webp", tags: ["case", "accessory"], copy: "Streamlined everyday protection with room for the equipment you use most." },
    { id: "pure-glove-grey", name: "Pure Performance Glove — Grey", price: 24, oldPrice: 29, image: "reviews/thumb-pure-pool-glove-grey-review-1x1-01.webp", tags: ["glove", "accessory", "control"], copy: "Low-friction bridge movement with a close, comfortable competition fit." },
    { id: "evo-glove-black", name: "Evo Player Glove — Black", price: 29, oldPrice: 34, image: "reviews/thumb-evo-pool-glove-black-review-1x1-01.webp", tags: ["glove", "accessory", "control"], copy: "Breathable support and consistent glide through long practice sessions." },
    { id: "joint-protector-set", name: "Carbon Joint Protector Set", price: 19, oldPrice: 24, image: "catalog/thumb-accessories-catalog-1x1-01.webp", tags: ["accessory", "shaft", "case"], copy: "Simple protection for cue joints during transport and storage." },
    { id: "performance-care-kit", name: "Cue Performance Care Kit", price: 39, oldPrice: 49, image: "catalog/thumb-accessories-catalog-1x1-01.webp", tags: ["accessory", "case", "glove"], copy: "Compact maintenance essentials for clean, consistent equipment." }
  ];

  const GLOVE_COLORS = [
    { name: "Black", hex: "#151515", left: "products/gloves/prod-pure-pool-glove-left-black-1x1-01.webp", right: "products/gloves/prod-pure-pool-glove-right-black-1x1-01.webp" },
    { name: "Blue", hex: "#315f9a", left: "products/gloves/prod-pure-pool-glove-left-blue-1x1-01.webp", right: "products/gloves/prod-pure-pool-glove-right-blue-1x1-01.webp" },
    { name: "Grey", hex: "#8b9199", left: "products/gloves/prod-pure-pool-glove-left-grey-1x1-01.webp", right: "products/gloves/prod-pure-pool-glove-right-grey-1x1-01.webp" },
    { name: "Olive", hex: "#73745a", left: "products/gloves/prod-pure-pool-glove-left-olive-1x1-01.webp", right: "products/gloves/prod-pure-pool-glove-right-olive-1x1-01.webp" },
    { name: "Red", hex: "#a53336", left: "products/gloves/prod-pure-pool-glove-left-red-1x1-01.webp", right: "products/gloves/prod-pure-pool-glove-right-red-1x1-01.webp" }
  ];

  const GLOVE_PRODUCTS = ["Left", "Right"].flatMap(hand => GLOVE_COLORS.map(color => ({
    id: `pure-glove-${hand.toLowerCase()}-${color.name.toLowerCase()}`,
    slug: `pure-glove-${hand.toLowerCase()}-${color.name.toLowerCase()}`,
    name: `Pure Pool Glove — ${hand} Hand / ${color.name}`,
    price: 12,
    oldPrice: 15,
    image: hand === "Left" ? color.left : color.right,
    tags: ["glove", "accessory", "control"],
    hand,
    color: color.name,
    colorHex: color.hex,
    sizes: ["M", "L", "XL", "2XL"],
    copy: "Four-way stretch, breathable mesh and a smooth bridge-hand feel for repeatable cue delivery."
  })));

  const GLOVE_PACKS = [
    { id: "pure-glove-pack-3-black", name: "Pure Glove 3-Pack — Black", price: 30, oldPrice: 36, image: "products/gloves/prod-pure-pool-glove-pack-3-black-1x1-01.webp", tags: ["glove", "bundle"], hand: "Both", color: "Black", sizes: ["M", "L", "XL", "2XL"], copy: "Three dependable black gloves for regular practice, league and tournament rotation." },
    { id: "pure-glove-pack-3-grey", name: "Pure Glove 3-Pack — Grey", price: 30, oldPrice: 36, image: "products/gloves/prod-pure-pool-glove-pack-3-grey-1x1-01.webp", tags: ["glove", "bundle"], hand: "Both", color: "Grey", sizes: ["M", "L", "XL", "2XL"], copy: "A practical three-glove pack with the same low-friction performance in grey." },
    { id: "pure-glove-pack-3-olive", name: "Pure Glove 3-Pack — Olive", price: 30, oldPrice: 36, image: "products/gloves/prod-pure-pool-glove-pack-3-olive-1x1-01.webp", tags: ["glove", "bundle"], hand: "Both", color: "Olive", sizes: ["M", "L", "XL", "2XL"], copy: "Three olive Pure gloves that keep a fresh match-ready option close at hand." },
    { id: "pure-glove-pack-3-mixed", name: "Pure Glove 3-Pack — Mixed", price: 32, oldPrice: 39, image: "products/gloves/prod-pure-pool-glove-pack-3-mixed-1x1-01.webp", tags: ["glove", "bundle"], hand: "Both", color: "Mixed", sizes: ["M", "L", "XL", "2XL"], copy: "Three core colors in one easy-value pack for players who like to rotate their look." },
    { id: "pure-glove-pack-5-mixed", name: "Pure Glove 5-Pack — Full Color", price: 48, oldPrice: 60, image: "products/gloves/prod-pure-pool-glove-pack-5-mixed-1x1-01.webp", tags: ["glove", "bundle"], hand: "Both", color: "Mixed", sizes: ["M", "L", "XL", "2XL"], copy: "The full Pure color lineup with stronger multi-buy value for frequent players." }
  ];

  PRODUCTS.push(...GLOVE_PRODUCTS, ...GLOVE_PACKS);

  function productFromQuery() {
    const rawId = QUERY.get("id") || "";
    const id = /^[a-z0-9-]{1,80}$/i.test(rawId) ? rawId.toLowerCase() : "";
    const name = String(QUERY.get("name") || "").replace(/[<>&"']/g, "").trim().slice(0, 160);
    const rawImage = String(QUERY.get("image") || "");
    const imageFile = /^(?:[a-z0-9-]+\/){0,3}[a-z0-9@._ -]+\.(?:jpe?g|png|webp)$/i.test(rawImage) ? rawImage : "catalog/thumb-accessories-catalog-1x1-01.webp";
    const allowedTags = ["shaft", "break", "jump", "butt", "case", "glove", "bundle", "play", "accessory"];
    const tag = allowedTags.includes(QUERY.get("tag")) ? QUERY.get("tag") : "accessory";
    const price = Math.max(0, Math.min(100000, Number(QUERY.get("price")) || 0));
    const oldPrice = Math.max(price, Math.min(100000, Number(QUERY.get("old")) || price));
    if (!id || !name || !price) return null;
    const copyByTag = {
      shaft: "Carbon shaft performance engineered for predictable feedback and a confident, repeatable delivery.",
      break: "Purpose-built equipment selected for efficient power and better cue-ball control on the opening shot.",
      jump: "A compact, responsive setup designed for cleaner elevation and difficult recovery shots.",
      butt: "A balanced cue component ready to pair with the shaft and playing feel you prefer.",
      case: "Practical protection designed to keep your equipment organized during regular play and travel.",
      glove: "A low-friction playing essential created for a comfortable, consistent bridge.",
      bundle: "A coordinated CUEBOTS setup that brings the key playing and protection essentials together.",
      play: "Player-focused equipment balanced for consistent feedback, control and confident competition use.",
      accessory: "A practical CUEBOTS accessory selected to keep your equipment protected and match-ready."
    };
    return { id, slug: id, name, price, oldPrice, image: imageFile, tags: [tag], copy: copyByTag[tag] };
  }

  const queryProduct = productFromQuery();
  if (queryProduct && !PRODUCTS.some(product => product.id === queryProduct.id)) PRODUCTS.push(queryProduct);

  const COLLECTIONS = {
    "pool-cues": { title: "Pool Cues", eyebrow: "Build your playing setup", description: "Complete carbon cues selected for consistent feedback, balance and cue-ball control.", image: "collections/hero-pool-cues-collection-desktop-01.webp", mobileImage: "collections/hero-pool-cues-collection-mobile-01.webp", relatedImage: "collections/thumb-pool-cues-related-5x3-01.webp", tags: ["play", "control"], related: ["carbon-shafts", "cue-butts", "accessories"] },
    "break-cues": { title: "Break Cues", eyebrow: "Own the opening shot", description: "Purpose-built cues that deliver efficient power without sacrificing cue-ball control.", image: "collections/hero-break-cues-collection-desktop-01.webp", mobileImage: "collections/hero-break-cues-collection-mobile-01.webp", relatedImage: "collections/thumb-break-cues-related-5x3-01.webp", tags: ["break", "power"], related: ["jump-cues", "break-power", "cases"] },
    "jump-cues": { title: "Jump Cues", eyebrow: "Create a way out", description: "Compact, responsive jump cues for clean elevation and difficult recovery shots.", image: "collections/hero-jump-cues-collection-desktop-01.webp", mobileImage: "collections/hero-jump-cues-collection-mobile-01.webp", relatedImage: "collections/thumb-jump-cues-related-5x3-01.webp", tags: ["jump"], related: ["break-cues", "difficult-shots", "accessories"] },
    "carbon-shafts": { title: "Carbon Shafts", eyebrow: "Change the feel, keep your butt", description: "Low-deflection carbon shafts in player-focused profiles for a more predictable stroke.", image: "collections/hero-carbon-shafts-collection-desktop-01.webp", mobileImage: "collections/hero-carbon-shafts-collection-mobile-01.webp", relatedImage: "collections/thumb-carbon-shafts-related-5x3-01.webp", tags: ["shaft"], related: ["upgrade-my-shaft", "cue-butts", "accessories"] },
    "cue-butts": { title: "Single Butts", eyebrow: "Build it your way", description: "Balanced cue butts ready to pair with the shaft, joint and playing feel you prefer.", image: "collections/hero-cue-butts-collection-desktop-01.webp", mobileImage: "collections/hero-cue-butts-collection-mobile-01.webp", relatedImage: "collections/thumb-cue-butts-related-5x3-01.webp", tags: ["butt"], related: ["shop-cue-butts", "carbon-shafts", "cases"] },
    "accessories": { title: "Accessories", eyebrow: "Keep every setup match-ready", description: "Gloves, cases, protectors and care essentials that support consistent performance.", image: "collections/hero-accessories-collection-desktop-01.webp", mobileImage: "collections/hero-accessories-collection-mobile-01.webp", relatedImage: "collections/thumb-accessories-related-5x3-01.webp", tags: ["accessory"], related: ["cases", "gloves", "carbon-shafts"] },
    "first-carbon-cue": { title: "First Carbon Cue", eyebrow: "Start strong", description: "Complete cue and accessory combinations chosen to make your first carbon setup simple.", image: "collections/hero-first-carbon-cue-collection-desktop-01.webp", mobileImage: "collections/hero-first-carbon-cue-collection-mobile-01.webp", relatedImage: "collections/thumb-first-carbon-cue-related-5x3-01.webp", tags: ["starter", "bundle", "play"], related: ["pool-cues", "cases", "gloves"] },
    "upgrade-my-shaft": { title: "Upgrade My Shaft", eyebrow: "A focused performance upgrade", description: "Shafts and supporting essentials for a meaningful change without replacing your cue butt.", image: "collections/hero-upgrade-my-shaft-collection-desktop-01.webp", mobileImage: "collections/hero-upgrade-my-shaft-collection-mobile-01.webp", relatedImage: "collections/thumb-upgrade-my-shaft-related-5x3-01.webp", tags: ["upgrade", "shaft", "accessory"], related: ["carbon-shafts", "cue-butts", "accessories"] },
    "shop-cue-butts": { title: "Shop Cue Butts", eyebrow: "Mix, match and refine", description: "Cue butts, shafts and protection selected for players building a personalized combination.", image: "collections/hero-shop-cue-butts-collection-desktop-01.webp", mobileImage: "collections/hero-shop-cue-butts-collection-mobile-01.webp", relatedImage: "collections/thumb-shop-cue-butts-related-5x3-01.webp", tags: ["butt", "shaft", "play"], related: ["cue-butts", "carbon-shafts", "cases"] },
    "break-power": { title: "Get More Break Power", eyebrow: "Power with a plan", description: "Break cues, shafts and paired setups selected for stronger, more efficient opening shots.", image: "collections/hero-break-power-collection-desktop-01.webp", mobileImage: "collections/hero-break-power-collection-mobile-01.webp", relatedImage: "collections/thumb-break-power-related-5x3-01.webp", tags: ["break", "power", "bundle"], related: ["break-cues", "jump-cues", "gloves"] },
    "difficult-shots": { title: "Make Difficult Shots", eyebrow: "Control under pressure", description: "Equipment suggestions for precise speed, cleaner delivery and greater confidence on demanding shots.", image: "collections/hero-difficult-shots-collection-desktop-01.webp", mobileImage: "collections/hero-difficult-shots-collection-mobile-01.webp", relatedImage: "collections/thumb-difficult-shots-related-5x3-01.webp", tags: ["control", "jump", "shaft"], related: ["pool-cues", "jump-cues", "upgrade-my-shaft"] },
    "cases": { title: "Cue Cases", eyebrow: "Protect the equipment you trust", description: "Everyday and tournament protection sized for practical, organized travel.", image: "collections/hero-cases-collection-desktop-01.webp", mobileImage: "collections/hero-cases-collection-mobile-01.webp", relatedImage: "collections/thumb-cases-related-5x3-01.webp", tags: ["case"], related: ["accessories", "gloves", "pool-cues"] },
    "gloves": { title: "Pool Gloves", eyebrow: "A consistent bridge on every table", description: "Performance gloves selected for low-friction movement, comfort and dependable fit.", image: "collections/hero-pure-pool-glove-collection-desktop-01.webp", mobileImage: "collections/hero-pure-pool-glove-collection-mobile-01.webp", relatedImage: "collections/thumb-pure-pool-glove-related-5x3-01.webp", tags: ["glove"], related: ["accessories", "cases", "difficult-shots"] }
  };

  const REVIEWS = {
    "rhino-30-125": { customer: "John Forde", rating: 5, text: "The hit feels clean and predictable. It settled into my game quickly and the lower deflection is easy to trust." },
    "z-fusion-limited": { customer: "Robert M.", rating: 5, text: "The finish looks even better in person. Straight, solid and comfortable through long practice sessions." },
    "nebula-carbon-cue": { customer: "Donald Jones", rating: 5, text: "Arrived well packed and ready to play. The balance feels natural and the colors get attention every league night." },
    "rhino-carbon-break-cue": { customer: "Marcus Lee", rating: 4, text: "Plenty of power without feeling difficult to control. My cue-ball placement on the break has become more consistent." },
    "retro-ii-carbon-set": { customer: "Sarah K.", rating: 5, text: "A complete setup that feels considered from cue to case. I was able to take it straight to a tournament weekend." },
    "carbon-shaft-starter-bundle": { customer: "Daniel Cruz", rating: 5, text: "Everything I needed for the upgrade was in one package. The shaft response is crisp and the accessories are useful." },
    "nebula-pro-bundle": { customer: "Tina Walker", rating: 5, text: "The bundle removed the guesswork. Every piece works together and the cue has stayed consistent across different tables." },
    "break-jump-power-duo": { customer: "Alex Nguyen", rating: 4, text: "The jump cue gets up cleanly and the break cue transfers power well. A practical pair for competitive play." }
  };

  const NAV = [
    { label: "Cues", url: "pages/collection-pool-cues.html", groups: [{ title: "Shop by cue", links: [["Pool cues", "pages/collection-pool-cues.html"], ["Break cues", "pages/collection-break-cues.html"], ["Jump cues", "pages/collection-jump-cues.html"]] }, { title: "Shop by goal", links: [["First carbon cue", "pages/collection-first-carbon-cue.html"], ["Break power", "pages/collection-break-power.html"], ["Difficult shots", "pages/collection-difficult-shots.html"]] }], visuals: [["collections/thumb-pool-cues-related-5x3-01.webp", "collections/thumb-break-cues-related-5x3-01.webp", "collections/thumb-jump-cues-related-5x3-01.webp"], ["collections/thumb-first-carbon-cue-related-5x3-01.webp", "collections/thumb-break-power-related-5x3-01.webp", "collections/thumb-difficult-shots-related-5x3-01.webp"]], promos: [["Complete setup", "First carbon cue kit", "pages/collection-first-carbon-cue.html", "recommendations/poster-first-carbon-cue-recommendation-4x5-01.webp"], ["Player solution", "Control difficult shots", "pages/collection-difficult-shots.html", "recommendations/poster-difficult-shots-recommendation-4x5-01.webp"]] },
    { label: "Butts", url: "pages/collection-cue-butts.html", groups: [{ title: "Shop cue butts", links: [["All butts", "pages/collection-cue-butts.html"], ["Playing butts", "pages/collection-shop-cue-butts.html"], ["Break butts", "pages/collection-break-power.html"]] }, { title: "Build your cue", links: [["Single butts", "pages/collection-cue-butts.html"], ["Match a shaft", "pages/collection-carbon-shafts.html"], ["Joint compatibility", "pages/blog-understanding-joint-types.html"]] }], visuals: [["collections/thumb-cue-butts-related-5x3-01.webp", "collections/thumb-shop-cue-butts-related-5x3-01.webp", "collections/thumb-break-power-related-5x3-01.webp"], ["catalog/thumb-cue-butts-catalog-1x1-01.webp", "collections/thumb-carbon-shafts-related-5x3-01.webp", "guides/thumb-understanding-cue-joint-types-buying-guide-3x2-01.webp"]], promos: [["Build your cue", "Mix butt + shaft", "pages/collection-shop-cue-butts.html", "recommendations/poster-shop-cue-butts-recommendation-4x5-01.webp"], ["Fit guide", "Check your joint", "pages/blog-understanding-joint-types.html", "promotions/poster-understanding-cue-joint-types-store-4x5-01.webp"]] },
    { label: "Shafts", url: "pages/collection-carbon-shafts.html", groups: [{ title: "Carbon shafts", links: [["All shafts", "pages/collection-carbon-shafts.html"], ["Pool shafts", "pages/collection-carbon-shafts.html#products"], ["Break shafts", "pages/collection-break-power.html"]] }, { title: "Shop by fit", links: [["Upgrade my shaft", "pages/collection-upgrade-my-shaft.html"], ["11.8–12.5 mm", "pages/collection-carbon-shafts.html#products"], ["12.8 mm", "pages/collection-carbon-shafts.html#products"]] }], visuals: [["collections/thumb-carbon-shafts-related-5x3-01.webp", "products/prod-upgrade-my-shaft-collection-1x1-01.webp", "collections/thumb-break-power-related-5x3-01.webp"], ["collections/thumb-upgrade-my-shaft-related-5x3-01.webp", "products/prod-carbon-shaft-starter-bundle-1x1-01.webp", "catalog/thumb-carbon-shafts-catalog-1x1-01.webp"]], promos: [["Upgrade path", "Keep the butt you love", "pages/collection-upgrade-my-shaft.html", "recommendations/poster-upgrade-my-shaft-recommendation-4x5-01.webp"], ["Editor's guide", "Choose the right shaft", "pages/blog-how-to-choose-the-right-shaft.html", "promotions/poster-how-to-choose-right-shaft-store-4x5-01.webp"]] },
    { label: "Cases", url: "pages/collection-cases.html", groups: [{ title: "Shop cases", links: [["All cue cases", "pages/collection-cases.html"], ["Soft cases", "pages/collection-cases.html#products"], ["Hard cases", "pages/collection-cases.html#products"]] }, { title: "Choose by use", links: [["League night", "pages/collection-cases.html#products"], ["Tournament travel", "pages/collection-cases.html#products"], ["Complete setups", "pages/collection-first-carbon-cue.html"]] }], visuals: [["collections/thumb-cases-related-5x3-01.webp", "collections/hero-cases-collection-desktop-01.webp", "products/prod-carbon-shaft-starter-bundle-1x1-01.webp"], ["collections/thumb-first-carbon-cue-related-5x3-01.webp", "collections/thumb-cases-related-5x3-01.webp", "promotions/poster-retro-ii-complete-setups-desktop-01.webp"]], promos: [["Travel ready", "Protect the complete setup", "pages/collection-cases.html", "collections/hero-cases-collection-desktop-01.webp"], ["Recommended setup", "Pack for league night", "pages/collection-first-carbon-cue.html", "promotions/poster-retro-ii-complete-setups-desktop-01.webp"]] },
    { label: "Gloves", url: "pages/collection-gloves.html", groups: [{ title: "Shop gloves", links: [["All pool gloves", "pages/collection-gloves.html"], ["Left hand", "pages/collection-gloves.html#products"], ["Right hand", "pages/collection-gloves.html#products"]] }, { title: "Find your fit", links: [["Size guide", "pages/collection-gloves.html#size-guide"], ["Glove packs", "pages/collection-gloves.html#packs"], ["Complete setup", "pages/collection-gloves.html#complete-setup"]] }], visuals: [["collections/thumb-pure-pool-glove-related-5x3-01.webp", "products/gloves/prod-pure-pool-glove-left-grey-1x1-01.webp", "products/gloves/prod-pure-pool-glove-right-black-1x1-01.webp"], ["promotions/poster-pure-pool-glove-single-navigation-desktop-01.webp", "products/gloves/prod-pure-pool-glove-pack-3-mixed-1x1-01.webp", "promotions/poster-pure-pool-glove-complete-setup-desktop-01.webp"]], promos: [["Pure glove", "Smooth, repeatable delivery", "pages/collection-gloves.html", "promotions/poster-pure-pool-glove-single-navigation-desktop-01.webp"], ["Multi-buy", "Build your glove rotation", "pages/collection-gloves.html#packs", "promotions/poster-pure-pool-glove-multibuy-desktop-01.webp"]] },
    { label: "Accessories", url: "pages/collection-accessories.html", groups: [{ title: "Shop accessories", links: [["Shop all", "pages/collection-accessories.html"], ["Chalk", "pages/collection-accessories.html#products"], ["Joint protectors", "pages/collection-accessories.html#products"]] }, { title: "Care + prepare", links: [["Cue maintenance", "pages/collection-accessories.html#products"], ["Cases", "pages/collection-cases.html"], ["Care checklist", "pages/blog-cue-care-checklist.html"]] }], visuals: [["collections/thumb-accessories-related-5x3-01.webp", "catalog/thumb-accessories-catalog-1x1-01.webp", "products/prod-carbon-shaft-starter-bundle-1x1-01.webp"], ["guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp", "collections/thumb-cases-related-5x3-01.webp", "products/prod-first-carbon-cue-collection-1x1-01.webp"]], promos: [["Player essentials", "Complete the match-day kit", "pages/collection-accessories.html", "collections/hero-accessories-collection-desktop-01.webp"], ["Quick guide", "Cue care checklist", "pages/blog-cue-care-checklist.html", "guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp"]] },
    { label: "Services", url: "pages/services.html", groups: [{ title: "Choose with confidence", links: [["Cue finder", "pages/collection-difficult-shots.html"], ["Shaft compatibility", "pages/services.html#compatibility"], ["Our story", "pages/services.html#our-story"]] }, { title: "After your order", links: [["Warranty", "pages/services.html#warranty"], ["Easy exchange", "pages/services.html#warranty"], ["Contact us", "pages/services.html#contact"]] }], visuals: [["collections/thumb-difficult-shots-related-5x3-01.webp", "guides/thumb-understanding-cue-joint-types-buying-guide-3x2-01.webp", "services/des-factory-direct-carbon-service-5x4-01.webp"], ["recommendations/poster-difficult-shots-recommendation-4x5-01.webp", "catalog/thumb-accessories-catalog-1x1-01.webp", "collections/thumb-first-carbon-cue-related-5x3-01.webp"]], promos: [["Free guidance", "Find the right setup", "pages/services.html#contact", "recommendations/poster-difficult-shots-recommendation-4x5-01.webp"], ["Player promise", "Warranty + easy exchange", "pages/services.html#warranty", "collections/thumb-first-carbon-cue-related-5x3-01.webp"]] },
    { label: "Blog", url: "pages/blog.html", groups: [{ title: "Explore", links: [["Latest articles", "pages/blog.html"], ["Buying guides", "pages/blog.html"], ["Player stories", "pages/blog.html"]] }, { title: "Popular guides", links: [["Choose the right shaft", "pages/blog-how-to-choose-the-right-shaft.html"], ["Carbon vs wood", "pages/blog-carbon-vs-wood-shaft.html"], ["Cue care checklist", "pages/blog-cue-care-checklist.html"]] }], visuals: [["guides/thumb-how-to-choose-right-shaft-buying-guide-3x2-01.webp", "guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp", "guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp"], ["guides/thumb-how-to-choose-right-shaft-buying-guide-3x2-01.webp", "guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp", "guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp"]], promos: [["Start here", "How to choose the right shaft", "pages/blog-how-to-choose-the-right-shaft.html", "promotions/poster-how-to-choose-right-shaft-store-4x5-01.webp"], ["Popular read", "Carbon shaft vs wood shaft", "pages/blog-carbon-vs-wood-shaft.html", "guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp"]] }
  ];

  const safeRead = (key, fallback) => {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
    catch (error) { return fallback; }
  };
  const state = {
    currency: (() => { try { const value = sessionStorage.getItem("cuebotsCurrency") || "USD"; return CURRENCY[value] ? value : "USD"; } catch (error) { return "USD"; } })(),
    cart: safeRead("cuebotsHomeCart", []),
    wishlist: safeRead("cuebotsHomeWishlist", {}),
    filter: "all",
    sort: "featured",
    gloveHand: "Left",
    gloveColor: "All",
    gloveSize: "All",
    gloveSort: "featured",
    quantity: 1,
    lastFocus: null
  };
  const formatters = Object.fromEntries(Object.entries(CURRENCY).map(([key, item]) => [key, new Intl.NumberFormat(item.locale, { style: "currency", currency: item.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })]));
  const roundDisplayMoney = value => {
    const amount = Math.round(Math.max(0, Number(value) || 0));
    if (amount < 1000) return amount;
    const step = Math.pow(10, Math.max(0, String(amount).length - 3));
    return Math.floor(amount / step) * step;
  };
  const money = value => {
    const roundedValue = roundDisplayMoney(value * CURRENCY[state.currency].rate);
    return formatters[state.currency].format(roundedValue);
  };
  const assetPath = file => path(`assets/images/${file}`);
  const image = (file, alt, eager = false) => `<span class="image-shell"><img src="${assetPath(file)}" width="1200" height="1200" alt="${alt}" loading="${eager ? "eager" : "lazy"}" decoding="async"></span>`;
  const responsiveImage = (desktop, mobile, alt, eager = false) => `<span class="image-shell"><picture><source media="(max-width: 767px)" srcset="${assetPath(mobile)}"><img src="${assetPath(desktop)}" width="1920" height="640" alt="${alt}" loading="${eager ? "eager" : "lazy"}" decoding="async"></picture></span>`;
  const detailUrl = product => {
    if (product.detail) return path(`pages/product-${product.slug}.html`);
    const params = new URLSearchParams({ id: product.id, name: product.name, price: String(product.price), old: String(product.oldPrice), image: product.image, tag: product.tags[0] || "accessory" });
    return path(`pages/product-view.html?${params.toString()}`);
  };
  const bestCollection = product => product.tags.includes("break") ? "break-cues" : product.tags.includes("jump") ? "jump-cues" : product.tags.includes("shaft") ? "carbon-shafts" : product.tags.includes("butt") ? "cue-butts" : product.tags.includes("case") ? "cases" : product.tags.includes("glove") ? "gloves" : "accessories";

  function save() {
    try {
      sessionStorage.setItem("cuebotsCurrency", state.currency);
      localStorage.setItem("cuebotsHomeCart", JSON.stringify(state.cart));
      localStorage.setItem("cuebotsHomeWishlist", JSON.stringify(state.wishlist));
    } catch (error) { /* Keep the demo usable when storage is blocked. */ }
  }

  function iconSprite() {
    return `<svg class="svg-sprite" aria-hidden="true"><symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol><symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></symbol><symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7"/></symbol><symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4h2l2.2 11h10.6l2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></symbol><symbol id="i-x" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol><symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></symbol><symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></symbol><symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></symbol><symbol id="i-mail" viewBox="0 0 24 24"><path d="M3 5h18v14H3zM3 6l9 7 9-7"/></symbol><symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol></svg>`;
  }

  function renderSharedChrome() {
    const nav = `<div class="nav-item"><a class="nav-link" href="${path("index.html")}">Home</a></div>` + NAV.map(item => {
      const menuId = `mega-${item.label.toLowerCase()}`;
      const tabs = item.groups.map((group, index) => `<button class="mega-menu-tab${index === 0 ? " active" : ""}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="${menuId}-panel-${index}" data-mega-panel-index="${index}"><span>${group.title}</span><span aria-hidden="true">→</span></button>`).join("");
      const panels = item.groups.map((group, groupIndex) => {
        const promo = item.promos[groupIndex];
        const cards = group.links.map(([label, url], linkIndex) => `<a class="mega-visual-card" href="${path(url)}"><span class="mega-visual-media"><img src="${path(`assets/images/${item.visuals[groupIndex][linkIndex]}`)}" width="500" height="300" alt="" loading="lazy" decoding="async"></span><span class="mega-visual-label">${label}<span aria-hidden="true">→</span></span></a>`).join("");
        return `<section class="mega-menu-panel${groupIndex === 0 ? " active" : ""}" id="${menuId}-panel-${groupIndex}" role="tabpanel" data-mega-panel="${groupIndex}"${groupIndex === 0 ? "" : " hidden"}><div class="mega-panel-title"><span>${group.title}</span><a href="${path(item.url)}">VIEW ALL <span aria-hidden="true">→</span></a></div><div class="mega-visual-grid">${cards}<a class="mega-promo-card" href="${path(promo[2])}"><img src="${path(`assets/images/${promo[3]}`)}" width="500" height="600" alt="" loading="lazy" decoding="async"><span><small>${promo[0]}</small><strong>${promo[1]}</strong><b>EXPLORE <span aria-hidden="true">→</span></b></span></a></div></section>`;
      }).join("");
      return `<div class="nav-item has-dropdown"><a class="nav-link" href="${path(item.url)}" aria-haspopup="true" aria-expanded="false" aria-controls="${menuId}" data-mega-trigger>${item.label}</a><div class="nav-dropdown mega-menu store-dropdown" id="${menuId}" aria-label="${item.label} mega menu"><div class="mega-menu-shell"><aside class="mega-menu-sidebar"><small>EXPLORE ${item.label.toUpperCase()}</small><div class="mega-menu-tabs" role="tablist" aria-label="${item.label} navigation groups">${tabs}</div><a class="mega-menu-view-all" href="${path(item.url)}">VIEW ALL ${item.label.toUpperCase()} <span aria-hidden="true">→</span></a></aside><div class="mega-menu-content">${panels}</div></div></div></div>`;
    }).join("");
    const mobile = `<a class="mobile-nav-card" href="${path("index.html")}"><img src="${path("assets/images/heroes/hero-carbon-pool-shaft-desktop-01.webp")}" width="500" height="300" alt="" loading="lazy"><span><strong>Home</strong><small>RETURN →</small></span></a>` + NAV.map(item => `<a class="mobile-nav-card" href="${path(item.url)}"><img src="${path(`assets/images/${item.visuals[0][0]}`)}" width="500" height="300" alt="" loading="lazy"><span><strong>${item.label}</strong><small>EXPLORE →</small></span></a>`).join("");
    $("[data-shared-header]").innerHTML = `${iconSprite()}<div id="top" class="announcement"><div class="announcement-row"><span>FREE SHIPPING ON ORDERS OVER $99</span><label><span class="sr-only">Currency</span><select class="locale-select" aria-label="Currency" data-currency-select>${Object.keys(CURRENCY).map(key => `<option value="${key}"${key === state.currency ? " selected" : ""}>${key}</option>`).join("")}</select></label></div></div><header class="site-header"><div class="container header-row"><button class="icon-btn mobile-menu-btn" type="button" aria-label="Open menu" aria-controls="storeMobileMenu" aria-expanded="false" data-open-menu><svg class="icon"><use href="#i-menu"></use></svg></button><a class="brand" href="${path("index.html")}" aria-label="CUEBOTS home"><img src="${path("assets/images/brand/logo-cuebots-horizontal-blue-01.webp")}" width="138" height="34" alt="CUEBOTS"></a><nav class="desktop-nav" aria-label="Main navigation">${nav}</nav><div class="header-actions"><button class="icon-btn" type="button" aria-label="Search products" data-open-search><svg class="icon"><use href="#i-search"></use></svg></button><div class="account-entry hide-mobile"><button class="icon-btn" type="button" aria-label="Open account sign in" data-open-account><svg class="icon"><use href="#i-user"></use></svg></button><div class="account-popover" aria-label="Account options"><small>PLAYER ACCOUNT</small><h2>Welcome to CUEBOTS</h2><p>Track orders, save equipment and get faster recommendations.</p><button class="btn" type="button" data-open-account data-account-mode="signin">SIGN IN</button><button class="btn btn-secondary" type="button" data-open-account data-account-mode="signup">CREATE NEW ACCOUNT</button><a class="account-promo" href="${path("pages/collection-first-carbon-cue.html")}"><img src="${path("assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp")}" width="500" height="300" alt="" loading="lazy"><span><small>NEW PLAYER?</small><strong>Find your first setup</strong><b>EXPLORE →</b></span></a></div></div><button class="icon-btn cart-trigger" type="button" aria-label="Open cart" data-open-cart><svg class="icon"><use href="#i-cart"></use></svg><span class="cart-badge" data-cart-count>0</span></button></div></div></header>`;
    $("[data-shared-footer]").innerHTML = `<section class="newsletter" aria-labelledby="store-newsletter"><div class="container newsletter-row"><div class="newsletter-copy"><svg class="icon" aria-hidden="true"><use href="#i-mail"></use></svg><div><h2 id="store-newsletter">JOIN 10,000+ PLAYERS</h2><p>Get tips, new releases and exclusive offers.</p></div></div><form class="newsletter-form" data-newsletter><label class="sr-only" for="storeEmail">Email address</label><input id="storeEmail" type="email" placeholder="Enter your email" required><button class="btn" type="submit">SUBSCRIBE</button><p class="form-status" data-newsletter-status aria-live="polite"></p></form></div></section><footer class="site-footer"><div class="container footer-grid"><section class="footer-brand"><a href="#top" aria-label="Scroll to the top of this page"><img src="${path("assets/images/brand/logo-cuebots-horizontal-white-01.webp")}" width="190" height="48" alt="CUEBOTS — Powered by Carbon"></a><p>Engineered for performance. Built for players. Premium carbon cues, shafts and accessories designed to help you play your best.</p><a class="footer-story" href="${path("pages/services.html#our-story")}"><span>OUR STORY</span><span class="footer-story-icon" aria-hidden="true"><svg class="icon"><use href="#i-chevron-right"></use></svg></span></a></section><section><h2>CUEBOTS COMPANY LIMITED</h2><address><p>N03-T1 Spring Tower, Gold Season, 47 Nguyen Tuan Street, Thanh Xuan District, Hanoi, Vietnam</p><p>US Office: 30 N Gould St Ste N, Sheridan, WY 82801, US</p><p><a href="mailto:cs@cuebots.com">cs@cuebots.com</a></p><p><a href="tel:+13074501670">+1 307 450 1670</a></p><p>9:00 AM – 5:30 PM, Monday to Saturday</p></address></section><div class="footer-links"><section class="footer-column"><h2>SHOP</h2><ul><li><a href="${path("pages/collection-pool-cues.html")}">All cues</a></li><li><a href="${path("pages/collection-carbon-shafts.html")}">Shafts</a></li><li><a href="${path("pages/collection-cue-butts.html")}">Butts</a></li><li><a href="${path("pages/collection-accessories.html")}">Accessories</a></li></ul></section><section class="footer-column"><h2>SUPPORT</h2><ul><li><a href="${path("pages/services.html#our-story")}">About us</a></li><li><a href="${path("pages/services.html#warranty")}">Warranty</a></li><li><a href="${path("pages/services.html#contact")}">Contact us</a></li></ul></section><section class="footer-column"><h2>RESOURCES</h2><ul><li><a href="${path("pages/blog.html")}">Buying guides</a></li><li><a href="${path("pages/collection-difficult-shots.html")}">Cue finder</a></li><li><a href="${path("pages/blog-understanding-joint-types.html")}">Joint compatibility</a></li></ul></section></div></div><div class="container footer-bottom"><p>© 2026 CUEBOTS. All rights reserved.</p><div class="payment-list" aria-label="Accepted payment methods">${["logo-visa-payment-color-01.webp", "logo-mastercard-payment-color-01.webp", "logo-american-express-payment-color-01.webp", "logo-paypal-payment-color-01.webp", "logo-apple-pay-payment-color-01.webp", "logo-google-pay-payment-color-01.webp", "logo-shop-pay-payment-color-01.webp"].map((file, index) => `<span class="payment-item"><img src="${path(`assets/images/payments/${file}`)}" width="54" height="27" alt="${["Visa", "Mastercard", "American Express", "PayPal", "Apple Pay", "Google Pay", "Shop Pay"][index]}"></span>`).join("")}</div><div class="social-links" aria-label="Social media"><a class="social-facebook" href="https://www.facebook.com/" aria-label="Facebook">f</a><a class="social-youtube" href="https://www.youtube.com/" aria-label="YouTube">▶</a><a class="social-instagram" href="https://www.instagram.com/" aria-label="Instagram">◎</a><a class="social-tiktok" href="https://www.tiktok.com/" aria-label="TikTok">♪</a></div></div></footer>`;
    $(".social-links").innerHTML = `<a class="social-facebook" href="https://www.facebook.com/" aria-label="Facebook"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path class="social-fill" d="M14.2 8H12.5c-1.2 0-1.5.6-1.5 1.5V12h3l-.5 3H11v7H7.5v-7H5v-3h2.5V9.2C7.5 6.1 9.4 4 12.8 4h1.4v4Z"/></svg></a><a class="social-youtube" href="https://www.youtube.com/" aria-label="YouTube"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3"/><path class="social-fill" d="m10 9 5 3-5 3V9Z"/></svg></a><a class="social-instagram" href="https://www.instagram.com/" aria-label="Instagram"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle class="social-fill" cx="17.4" cy="6.7" r="1"/></svg></a><a class="social-tiktok" href="https://www.tiktok.com/" aria-label="TikTok"><svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a4.3 4.3 0 1 1-3.4-4.2v3.2a1.5 1.5 0 1 0 .6 1.2V3H14Zm0 0c.7 2.5 2.5 4.3 5 5v3.2a9 9 0 0 1-5-2.1"/></svg></a>`;
    $("[data-shared-surfaces]").innerHTML = `<div class="overlay" data-overlay></div><aside class="mobile-drawer" id="storeMobileMenu" role="dialog" aria-modal="true" aria-hidden="true"><div class="drawer-header"><h2>Menu</h2><button class="icon-btn" type="button" aria-label="Close menu" data-close><svg class="icon"><use href="#i-x"></use></svg></button></div><nav class="mobile-nav" aria-label="Mobile navigation">${mobile}</nav><button class="mobile-account-button" type="button" data-open-account><svg class="icon"><use href="#i-user"></use></svg><span>ACCOUNT SIGN IN</span></button></aside><section class="search-dialog" role="dialog" aria-modal="true" aria-hidden="true" data-search-dialog><div class="drawer-header"><h2>Search products</h2><button class="icon-btn" type="button" aria-label="Close search" data-close><svg class="icon"><use href="#i-x"></use></svg></button></div><div class="search-input-row"><svg class="icon"><use href="#i-search"></use></svg><input type="search" placeholder="Search cues, shafts and accessories" aria-label="Search products" data-search-input><button type="button" data-clear-search>Clear</button></div><div class="search-results" data-search-results></div></section><aside class="cart-drawer" role="dialog" aria-modal="true" aria-hidden="true" data-cart-drawer><div class="drawer-header"><h2>Your cart</h2><button class="icon-btn" type="button" aria-label="Close cart" data-close><svg class="icon"><use href="#i-x"></use></svg></button></div><div class="drawer-body" data-cart-items></div><div class="drawer-footer"><p class="shipping-reminder" data-shipping-reminder></p><div class="subtotal"><span>Subtotal</span><strong data-cart-subtotal>${money(0)}</strong></div><button class="btn" type="button" data-checkout>CHECKOUT</button><p>Secure demo checkout. No payment will be processed.</p></div></aside><section class="quick-modal" role="dialog" aria-modal="true" aria-hidden="true" data-quick-modal><div class="drawer-header"><h2>Quick view</h2><button class="icon-btn" type="button" aria-label="Close quick view" data-close><svg class="icon"><use href="#i-x"></use></svg></button></div><div class="quick-body" data-quick-body></div></section><section class="account-modal" role="dialog" aria-modal="true" aria-hidden="true" data-account-modal><div class="drawer-header"><h2 data-account-title>Account sign in</h2><button class="icon-btn" type="button" aria-label="Close account" data-close><svg class="icon"><use href="#i-x"></use></svg></button></div><form class="account-form" data-account-form><p data-account-intro>Enter your account details to continue.</p><label>Email address<input type="email" autocomplete="email" required></label><label>Password<input type="password" minlength="6" autocomplete="current-password" required data-account-password></label><button class="btn" type="submit" data-account-submit>SIGN IN</button><button class="account-mode-switch" type="button" data-account-mode="signup">New to CUEBOTS? Create an account</button><p class="form-status" data-account-status></p></form><a class="account-modal-promo" href="${path("pages/collection-first-carbon-cue.html")}"><img src="${path("assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp")}" width="600" height="360" alt="" loading="lazy"><span><small>PLAYER STARTER</small><strong>Build your first carbon setup</strong><b>EXPLORE →</b></span></a></section><div class="toast" data-toast role="status" aria-live="polite"></div>`;
  }

  function stars(rating) {
    return `<span class="store-stars" aria-label="${rating} out of 5 stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>`;
  }

  function productCard(product) {
    return `<article class="store-product-card"><div class="store-product-media"><a class="store-product-image" href="${detailUrl(product)}" aria-label="View details for ${product.name}">${image(product.image, product.name)}</a><button type="button" class="icon-btn wishlist-btn${state.wishlist[product.id] ? " active" : ""}" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist" aria-pressed="${Boolean(state.wishlist[product.id])}"><svg class="icon"><use href="#i-heart"></use></svg></button></div><div class="store-product-copy"><p class="store-product-kicker">CUEBOTS PERFORMANCE</p><h3><a href="${detailUrl(product)}">${product.name}</a></h3><p>${product.copy}</p><p class="price">${money(product.price)} <del>${money(product.oldPrice)}</del></p><div class="store-product-actions"><button class="btn" type="button" data-add-cart="${product.id}">QUICK ADD</button><button class="btn btn-secondary" type="button" data-quick-product="${product.id}">QUICK VIEW</button></div></div></article>`;
  }

  function collectionProducts(collection) {
    let products = PRODUCTS.filter(product => collection.tags.some(tag => product.tags.includes(tag)));
    if (state.filter === "under") products = products.filter(product => product.price < 250);
    if (state.filter === "premium") products = products.filter(product => product.price >= 250);
    if (state.sort === "price-low") products.sort((a, b) => a.price - b.price);
    if (state.sort === "price-high") products.sort((a, b) => b.price - a.price);
    if (state.sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }

  function gloveProducts() {
    let products = GLOVE_PRODUCTS.filter(product => product.hand === state.gloveHand);
    if (state.gloveColor !== "All") products = products.filter(product => product.color === state.gloveColor);
    if (state.gloveSize !== "All") products = products.filter(product => product.sizes.includes(state.gloveSize));
    if (state.gloveSort === "price-low") products.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    if (state.gloveSort === "price-high") products.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    if (state.gloveSort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }

  function renderGloveProducts() {
    const grid = $("[data-glove-products]");
    if (!grid) return;
    const products = gloveProducts();
    grid.innerHTML = products.length ? products.map(productCard).join("") : `<div class="glove-empty"><h3>No exact match yet</h3><p>Clear the filters to see all available Pure gloves.</p><button class="btn btn-secondary" type="button" data-glove-clear>CLEAR FILTERS</button></div>`;
    $("[data-glove-count]").textContent = `${products.length} ${state.gloveHand.toLowerCase()}-hand styles shown${state.gloveSize === "All" ? "" : ` in size ${state.gloveSize}`}`;
    $$("[data-glove-hand]").forEach(button => {
      const active = button.dataset.gloveHand === state.gloveHand;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderGloveCollection() {
    const collection = COLLECTIONS.gloves;
    const setupProducts = ["hard-travel-case", "performance-care-kit", "joint-protector-set", "carbon-shaft-starter-bundle"].map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);
    document.title = "Pool Gloves | CUEBOTS";
    $("[data-page-content]").innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${path("index.html")}">Home</a><span>/</span><span aria-current="page">Pool Gloves</span></nav><section class="catalog-hero glove-hero"><div class="catalog-hero-media">${responsiveImage(collection.image, collection.mobileImage, "CUEBOTS Pure pool gloves", true)}</div><div class="container catalog-hero-copy"><p class="eyebrow">${collection.eyebrow}</p><h1>${collection.title}</h1><p>${collection.description}</p><a class="btn catalog-hero-cta" href="#glove-products">FIND YOUR GLOVE</a></div></section><section class="store-category-nav" aria-label="Shop other categories"><div class="container store-chip-rail">${Object.entries(COLLECTIONS).slice(0, 8).map(([slug, item]) => `<a class="store-chip${slug === PAGE ? " active" : ""}" href="${path(`pages/collection-${slug}.html`)}">${item.title}</a>`).join("")}</div></section>
      <section class="store-section glove-discovery"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Shop your way</p><h2>One glove or a ready-to-rotate pack</h2><p>Start with an individual color or save with a multi-pack built for regular play.</p></div></div><div class="glove-nav-grid"><a class="glove-nav-card" href="#glove-products">${responsiveImage("promotions/poster-pure-pool-glove-single-navigation-desktop-01.webp", "promotions/poster-pure-pool-glove-single-navigation-mobile-01.webp", "Shop individual CUEBOTS pool gloves")}<span><small>CHOOSE YOUR FIT</small><strong>Single gloves</strong><em>SHOP NOW →</em></span></a><a class="glove-nav-card" href="#glove-packs">${responsiveImage("promotions/poster-pure-pool-glove-pack-navigation-desktop-01.webp", "promotions/poster-pure-pool-glove-pack-navigation-mobile-01.webp", "Shop CUEBOTS pool glove packs")}<span><small>MORE VALUE, MORE COLORS</small><strong>Multi-buy packs</strong><em>SHOP PACKS →</em></span></a></div></div></section>
      <section class="store-section section-soft glove-hand-section"><div class="container glove-hand-panel"><div><p class="eyebrow">Fit starts here</p><h2>Which hand wears your glove?</h2><p>Select the hand that forms your bridge on the table. Your playing hand normally holds the cue without a glove.</p><div class="glove-hand-actions" role="group" aria-label="Choose glove hand"><button class="btn active" type="button" data-glove-hand="Left" aria-pressed="true">LEFT HAND</button><button class="btn btn-secondary" type="button" data-glove-hand="Right" aria-pressed="false">RIGHT HAND</button><button class="glove-guide-toggle" type="button" data-glove-guide aria-expanded="false">Not sure? See the hand guide</button></div></div><div class="glove-hand-visual">${image("sizing/size-pure-pool-glove-left-hand-en-1x1-01.webp", "Left hand glove fit illustration")}${image("sizing/size-pure-pool-glove-right-hand-en-1x1-01.webp", "Right hand glove fit illustration")}</div><div class="glove-hand-help" data-glove-hand-help hidden><strong>Quick check:</strong><span>If your left hand rests on the cloth and guides the shaft, choose Left Hand. If your right hand makes the bridge, choose Right Hand.</span></div></div></section>
      <section class="store-section" id="glove-products"><div class="container"><div class="store-section-heading glove-commerce-heading"><div><p class="eyebrow">Pure performance glove</p><h2>Choose your color and fit</h2><p>Every Pure glove uses breathable four-way stretch fabric and a low-friction bridge surface.</p></div><div class="glove-filter-toolbar"><label class="glove-field"><span>Color</span><select data-glove-color><option>All</option>${GLOVE_COLORS.map(color => `<option>${color.name}</option>`).join("")}</select></label><label class="glove-field"><span>Size</span><select data-glove-size><option>All</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></label><label class="glove-field"><span>Sort</span><select data-glove-sort><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label><button class="glove-clear" type="button" data-glove-clear>Clear</button></div></div><p class="catalog-count" data-glove-count></p><div class="store-product-grid glove-product-grid" data-glove-products></div></div></section>
      <section class="store-section glove-packs-section" id="glove-packs"><div class="container"><a class="glove-promo-banner" href="#glove-pack-products">${responsiveImage("promotions/poster-pure-pool-glove-multibuy-desktop-01.webp", "promotions/poster-pure-pool-glove-multibuy-mobile-01.webp", "Save more with CUEBOTS glove multi-buy packs")}<span><small>PLAY MORE. SAVE MORE.</small><strong>Build your glove rotation</strong><em>SHOP MULTI-BUY PACKS →</em></span></a><div class="store-section-heading"><div><p class="eyebrow">Multi-buy value</p><h2>Packs for practice and competition</h2><p>Keep a fresh glove in your case or share a color pack with your team.</p></div></div><div class="store-product-grid glove-pack-grid" id="glove-pack-products">${GLOVE_PACKS.map(productCard).join("")}</div></div></section>
      <section class="store-section section-soft"><div class="container"><a class="glove-promo-banner glove-complete-banner" href="#complete-your-game">${responsiveImage("promotions/poster-pure-pool-glove-complete-setup-desktop-01.webp", "promotions/poster-pure-pool-glove-complete-setup-mobile-01.webp", "Complete your CUEBOTS pool setup")}<span><small>COMPLETE YOUR GAME</small><strong>Pair a smoother bridge with protected, match-ready gear</strong><em>EXPLORE THE SETUP →</em></span></a><div id="complete-your-game" class="store-section-heading"><div><p class="eyebrow">Complete the setup</p><h2>Useful additions for your cue case</h2></div></div><div class="store-product-grid glove-setup-grid">${setupProducts.map(productCard).join("")}</div></div></section>
      <section class="store-section glove-proof"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Played. Tested. Trusted.</p><h2>A small upgrade players feel immediately</h2></div></div><div class="glove-review-grid"><article>${stars(5)}<p>“The bridge feels the same on every table now. The fit stayed comfortable through a full tournament day.”</p><strong>Randy B.</strong><span>Verified Pure glove buyer</span></article><article>${stars(5)}<p>“Light, breathable and easy to keep in the case. I bought the mixed pack after trying the first one.”</p><strong>Mia T.</strong><span>Verified Pure glove buyer</span></article><article>${stars(5)}<p>“The hand selector made ordering simple, and the glide is noticeably smoother than playing bare-handed.”</p><strong>Daniel C.</strong><span>Verified Pure glove buyer</span></article><article class="glove-review-invite"><p class="eyebrow">First-order offer</p><h3>Find your color, then save 10%.</h3><button class="btn" type="button" data-open-email>GET THE OFFER</button></article></div></div></section>
      <section class="store-section section-soft glove-faq-section"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Glove guide</p><h2>Questions before you choose</h2><p>Clear answers on hand selection, sizing and care.</p></div></div><div class="glove-faq-grid"><article class="glove-faq-item"><button type="button" data-glove-faq aria-expanded="false"><span>Which hand should wear the glove?</span><b>+</b></button><div class="glove-faq-answer"><p>Wear it on the hand that forms your bridge on the table. Choose Left if your left hand guides the shaft, or Right if your right hand does.</p></div></article><article class="glove-faq-item"><button type="button" data-glove-faq aria-expanded="false"><span>How should a pool glove fit?</span><b>+</b></button><div class="glove-faq-answer"><p>A glove should feel close and smooth without pinching, bunching at the fingers or limiting movement. If between sizes, choose the more comfortable option.</p></div></article><article class="glove-faq-item"><button type="button" data-glove-faq aria-expanded="false"><span>Can I wash my Pure glove?</span><b>+</b></button><div class="glove-faq-answer"><p>Hand wash in cool water with mild soap, then air dry flat. Avoid bleach, high heat and machine drying to protect the stretch fabric.</p></div></article><article class="glove-faq-item"><button type="button" data-glove-faq aria-expanded="false"><span>Why choose a multi-pack?</span><b>+</b></button><div class="glove-faq-answer"><p>A multi-pack gives frequent players a fresh backup, more color choice and a lower per-glove price.</p></div></article></div></div></section>`;
    renderGloveProducts();
  }

  function renderCollection() {
    if (PAGE === "gloves") {
      renderGloveCollection();
      return;
    }
    const collection = COLLECTIONS[PAGE] || COLLECTIONS["pool-cues"];
    document.title = `${collection.title} | CUEBOTS`;
    $("[data-page-content]").innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${path("index.html")}">Home</a><span>/</span><span aria-current="page">${collection.title}</span></nav><section class="catalog-hero"><div class="catalog-hero-media">${responsiveImage(collection.image, collection.mobileImage, collection.title, true)}</div><div class="container catalog-hero-copy"><p class="eyebrow">${collection.eyebrow}</p><h1>${collection.title}</h1><p>${collection.description}</p><a class="btn catalog-hero-cta" href="#products">SHOP THE EDIT</a></div></section><section class="store-category-nav" aria-label="Shop other categories"><div class="container store-chip-rail">${Object.entries(COLLECTIONS).slice(0, 8).map(([slug, item]) => `<a class="store-chip${slug === PAGE ? " active" : ""}" href="${path(`pages/collection-${slug}.html`)}">${item.title}</a>`).join("")}</div></section><section class="store-section" id="products"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Curated for your game</p><h2>${collection.title} selection</h2><p>Products are combined across playing, shaft and accessory groups to make comparison faster.</p></div><div class="catalog-tools"><div class="store-filter" role="group" aria-label="Price filter"><button class="active" type="button" data-filter="all">ALL</button><button type="button" data-filter="under">UNDER $250</button><button type="button" data-filter="premium">$250+</button></div><label>Sort <select data-sort><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label></div></div><p class="catalog-count" data-catalog-count></p><div class="store-product-grid" data-catalog-grid></div></div></section><section class="store-section store-promo-section"><div class="container store-promo-grid"><a class="store-wide-promo" href="${path("pages/collection-first-carbon-cue.html")}">${responsiveImage("promotions/poster-retro-ii-complete-setups-desktop-01.webp", "promotions/poster-retro-ii-complete-setups-mobile-01.webp", "Retro II complete carbon setup")}<span><small>COMPLETE SETUPS</small><strong>Build a match-ready system</strong><em>SHOP SETUPS →</em></span></a><a class="store-poster" href="${path("pages/collection-upgrade-my-shaft.html")}">${image("promotions/poster-how-to-choose-right-shaft-store-4x5-01.webp", "Carbon shaft upgrade guide")}<span><small>UPGRADE</small><strong>Find your next shaft</strong></span></a><a class="store-poster" href="${path("pages/blog.html")}">${image("promotions/poster-understanding-cue-joint-types-store-4x5-01.webp", "Cue joint buying guide")}<span><small>BUYING GUIDE</small><strong>Check compatibility first</strong></span></a></div></section><section class="store-section store-related"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Keep exploring</p><h2>Recommended next</h2></div></div><div class="store-related-grid">${collection.related.map(slug => { const item = COLLECTIONS[slug]; return `<a href="${path(`pages/collection-${slug}.html`)}">${image(item.relatedImage, item.title)}<span>${item.title}<small>${item.eyebrow}</small></span></a>`; }).join("")}</div></div></section>`;
    renderCatalog();
  }

  function renderCatalog() {
    if (TYPE !== "collection" || PAGE === "gloves") return;
    const collection = COLLECTIONS[PAGE] || COLLECTIONS["pool-cues"];
    const products = collectionProducts(collection);
    $("[data-catalog-grid]").innerHTML = products.map(productCard).join("");
    $("[data-catalog-count]").textContent = `${products.length} products selected for this collection`;
  }

  function rememberProduct(id) {
    const recent = safeRead("cuebotsRecentlyViewed", []).filter(itemId => itemId !== id);
    recent.unshift(id);
    try { localStorage.setItem("cuebotsRecentlyViewed", JSON.stringify(recent.slice(0, 8))); } catch (error) { /* Storage can be unavailable in private contexts. */ }
  }

  function renderProduct() {
    const product = PRODUCTS.find(item => item.slug === PAGE || item.id === PAGE) || PRODUCTS[0];
    rememberProduct(product.id);
    const review = REVIEWS[product.slug] || { customer: "Verified player", rating: 5, text: "A dependable addition to my setup with the consistent feel I was looking for." };
    const recommendations = PRODUCTS.filter(item => item.id !== product.id && item.tags.some(tag => product.tags.includes(tag))).slice(0, 4);
    document.title = `${product.name} | CUEBOTS`;
    $("[data-page-content]").innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${path("index.html")}">Home</a><span>/</span><a href="${path(`pages/collection-${bestCollection(product)}.html`)}">${COLLECTIONS[bestCollection(product)].title}</a><span>/</span><span aria-current="page">${product.name}</span></nav><section class="store-section product-detail-section"><div class="container product-detail-grid"><div class="product-gallery">${image(product.image, product.name, true)}<div class="product-gallery-trust"><span>✓ Free shipping over $99</span><span>✓ Limited lifetime warranty</span><span>✓ Easy exchange</span></div></div><div class="product-detail-copy"><p class="eyebrow">CUEBOTS PERFORMANCE EQUIPMENT</p><h1>${product.name}</h1>${stars(REVIEWS[product.slug]?.rating || 5)}<p class="product-detail-lead">${product.copy}</p><p class="price product-detail-price">${money(product.price)} <del>${money(product.oldPrice)}</del></p><div class="product-option"><span>Quantity</span><div class="quantity-control"><button type="button" data-qty="-1" aria-label="Decrease quantity">−</button><strong data-quantity>1</strong><button type="button" data-qty="1" aria-label="Increase quantity">+</button></div></div><div class="product-detail-actions"><button class="btn" type="button" data-add-cart="${product.id}" data-use-quantity>ADD TO CART</button><button class="btn btn-secondary product-wishlist${state.wishlist[product.id] ? " active" : ""}" type="button" data-wishlist="${product.id}"><svg class="icon"><use href="#i-heart"></use></svg> SAVE</button></div><ul class="product-feature-list"><li>Carbon performance construction</li><li>Quality checked before dispatch</li><li>Support for fit and compatibility</li></ul></div></div></section><section class="store-section purchased-review-section" id="review-${product.slug}"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Verified purchase</p><h2>Customer reviews</h2><p>Feedback from players who bought and used this product.</p></div></div><div class="featured-purchase-review">${image(product.image, `${product.name} customer review`)}<div>${stars(review.rating)}<blockquote>“${review.text}”</blockquote><strong>${review.customer}</strong><span>Verified buyer · ${product.name}</span></div></div><div class="review-demo-grid"><article>${stars(5)}<p>Well packed, straight and exactly as described. The setup guidance made the first session easy.</p><strong>Mia T.</strong><span>Verified buyer</span></article><article>${stars(5)}<p>The balance felt natural quickly and the finish has held up well through regular league play.</p><strong>Chris P.</strong><span>Verified buyer</span></article><article>${stars(4)}<p>Support helped confirm compatibility before shipping. A simple and reassuring buying experience.</p><strong>Lee A.</strong><span>Verified buyer</span></article></div></div></section><section class="store-section store-related"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Complete your setup</p><h2>You may also like</h2></div></div><div class="store-product-grid">${recommendations.map(productCard).join("")}</div></div></section>`;
  }

  function renderServices() {
    document.title = "Services & Support | CUEBOTS";
    $("[data-page-content]").innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${path("index.html")}">Home</a><span>/</span><span>Services</span></nav><section class="service-hero"><div class="container"><p class="eyebrow">Player support</p><h1>Make every equipment decision with confidence.</h1><p>Compatibility guidance, straightforward warranty support and a team that helps you find the right setup.</p></div></section><section class="store-section" id="our-story"><div class="container service-split">${image("services/des-factory-direct-carbon-service-5x4-01.webp", "CUEBOTS factory-direct quality control")}<div><p class="eyebrow">Our story</p><h2>Built for players, refined through play.</h2><p>CUEBOTS focuses on accessible carbon performance, dependable construction and practical support from first setup through competition.</p><a class="btn" href="${path("pages/collection-pool-cues.html")}">SHOP CUES</a></div></div></section><section class="store-section section-soft" id="compatibility"><div class="container"><div class="store-section-heading"><div><p class="eyebrow">Compatibility</p><h2>Find the right shaft connection</h2><p>Use your current joint style, pin and shaft diameter to narrow the correct fit.</p></div></div><div class="service-card-grid"><article><strong>1</strong><h3>Identify the joint</h3><p>Compare the pin profile and thread pattern with our visual guide.</p></article><article><strong>2</strong><h3>Confirm diameter</h3><p>Measure at the joint collar for a clean visual and physical match.</p></article><article><strong>3</strong><h3>Ask before ordering</h3><p>Send a clear photo to support if you are not completely certain.</p></article></div></div></section><section class="store-section" id="warranty"><div class="container service-split reverse"><div><p class="eyebrow">Limited lifetime warranty</p><h2>Support that stays with your setup.</h2><p>We help assess eligible construction issues, compatibility concerns and exchanges with a clear, documented process.</p><a class="btn btn-secondary" href="#contact">START A SUPPORT REQUEST</a></div>${image("services/des-easy-exchange-service-5x4-01.webp", "CUEBOTS customer support and easy exchange")}</div></section><section class="store-section section-soft" id="contact"><div class="container contact-layout"><div><p class="eyebrow">Contact us</p><h2>Tell us what you need.</h2><p>Include your cue model, joint type and a photo when asking about compatibility.</p><p><a href="mailto:cs@cuebots.com">cs@cuebots.com</a><br><a href="tel:+13074501670">+1 307 450 1670</a></p></div><form class="store-contact-form" data-contact-form><label>Name<input type="text" required></label><label>Email<input type="email" required></label><label>Topic<select><option>Product compatibility</option><option>Warranty support</option><option>Exchange</option><option>General question</option></select></label><label>Message<textarea rows="5" required></textarea></label><button class="btn" type="submit">SEND REQUEST</button><p class="form-status" data-contact-status></p></form></div></section>`;
  }

  function renderCheckout() {
    document.title = "Checkout | CUEBOTS";
    const items = state.cart.map(item => ({ ...item, product: cartItemProduct(item.id) })).filter(item => item.product);
    const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    $("[data-page-content]").innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${path("index.html")}">Home</a><span>/</span><span>Checkout</span></nav><section class="store-section"><div class="container checkout-layout"><form class="checkout-form" data-checkout-form><div><p class="eyebrow">Secure demo checkout</p><h1>Delivery details</h1><p>No payment will be processed in this prototype.</p></div><div class="checkout-fields"><label>First name<input type="text" required></label><label>Last name<input type="text" required></label><label class="full">Email<input type="email" required></label><label class="full">Address<input type="text" required></label><label>City<input type="text" required></label><label>Postal code<input type="text" required></label><label class="full">Country<select required><option>United States</option><option>Vietnam</option><option>Canada</option><option>Australia</option></select></label></div><button class="btn" type="submit"${items.length ? "" : " disabled"}>PLACE DEMO ORDER</button><p class="form-status" data-checkout-status></p></form><aside class="checkout-summary"><h2>Order summary</h2>${items.length ? items.map(item => `<div class="checkout-item">${image(item.product.image, item.product.name)}<div><strong>${item.product.name}</strong><span>Qty ${item.qty}</span></div><b>${money(item.product.price * item.qty)}</b></div>`).join("") : `<div class="cart-empty"><h3>Your cart is empty</h3><p>Add a product before checking out.</p><a class="btn btn-secondary" href="${path("pages/collection-pool-cues.html")}">CONTINUE SHOPPING</a></div>`}<div class="checkout-total"><span>Total</span><strong>${money(total)}</strong></div></aside></div></section>`;
  }

  function renderModernCheckout() {
    document.title = "Secure Checkout | CUEBOTS";
    const items = state.cart.map(item => ({ ...item, product: cartItemProduct(item.id) })).filter(item => item.product);
    const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const itemMarkup = items.length ? items.map(item => `<div class="checkout-item">${image(item.product.image, item.product.name)}<div><strong>${item.product.name}</strong><span>${cartVariant(item, item.product)} · Qty ${item.qty}</span></div><b>${money(item.product.price * item.qty)}</b></div>`).join("") : `<div class="cart-empty"><h3>Your cart is empty</h3><p>Add a product before checking out.</p><a class="btn btn-secondary" href="${path("pages/collection-pool-cues.html")}">CONTINUE SHOPPING</a></div>`;
    $("[data-page-content]").innerHTML = `<nav class="store-breadcrumb container" aria-label="Breadcrumb"><a href="${path("index.html")}">Home</a><span>/</span><span>Secure checkout</span></nav><section class="store-section checkout-section"><div class="container"><div class="checkout-head"><div><p class="eyebrow">SECURE DEMO CHECKOUT</p><h1>Review before you place the order.</h1><p>Enter delivery details first. You will see one final confirmation screen before the order is placed.</p></div><span>🔒 SECURE SESSION</span></div><div class="checkout-process" aria-label="Checkout progress"><div class="active" data-checkout-step="details"><span>1</span><strong>Delivery</strong><small>Address & contact</small></div><i></i><div data-checkout-step="review"><span>2</span><strong>Review</strong><small>Confirm every detail</small></div><i></i><div data-checkout-step="complete"><span>3</span><strong>Complete</strong><small>Order confirmation</small></div></div><div class="checkout-layout"><form class="checkout-form checkout-form-modern" data-checkout-form data-checkout-stage="details" novalidate><section data-checkout-details><div class="checkout-form-title"><span>1</span><div><h2>Delivery information</h2><p>Fields marked required must be completed before review.</p></div></div><div class="checkout-fields"><label>First name<input name="firstName" type="text" autocomplete="given-name" required></label><label>Last name<input name="lastName" type="text" autocomplete="family-name" required></label><label class="full">Email address<input name="email" type="email" autocomplete="email" required></label><label class="full">Street address<input name="address" type="text" autocomplete="street-address" required></label><label>City<input name="city" type="text" autocomplete="address-level2" required></label><label>Postal code<input name="postalCode" type="text" autocomplete="postal-code" required></label><label class="full">Country<select name="country" autocomplete="country-name" required><option>United States</option><option>Vietnam</option><option>Canada</option><option>Australia</option></select></label></div><fieldset class="checkout-delivery-method"><legend>Delivery method</legend><label><input name="deliveryMethod" type="radio" value="Standard tracked shipping" checked><span><strong>Standard tracked shipping</strong><small>Estimated 5–8 business days</small></span><b>FREE</b></label><label><input name="deliveryMethod" type="radio" value="Express shipping"><span><strong>Express shipping</strong><small>Estimated 2–4 business days</small></span><b>$18</b></label></fieldset><div class="checkout-payment-note"><span aria-hidden="true">✓</span><div><strong>Payment confirmation comes next</strong><p>No payment is processed in this prototype. The final screen clearly identifies the action that places the demo order.</p></div></div><button class="btn checkout-primary-action" type="submit"${items.length ? "" : " disabled"}>REVIEW ADDRESS & ORDER <span>→</span></button></section><section class="checkout-review" data-checkout-review hidden><div class="checkout-form-title"><span>2</span><div><h2>Confirm your order</h2><p>Check the delivery address and products before placing the order.</p></div></div><div class="checkout-review-card"><header><strong>Delivery address</strong><button type="button" data-edit-checkout>EDIT</button></header><p data-checkout-review-name></p><p data-checkout-review-address></p><p data-checkout-review-contact></p><p data-checkout-review-method></p></div><label class="checkout-confirm-check"><input type="checkbox" name="confirmation" required disabled><span>I confirm that the delivery address and order details are correct.</span></label><button class="btn checkout-primary-action checkout-confirm-action" type="submit">CONFIRM & PLACE ORDER · ${money(total)}</button><button class="checkout-edit-link" type="button" data-edit-checkout>← EDIT DELIVERY INFORMATION</button></section><p class="form-status checkout-status" data-checkout-status aria-live="polite"></p></form><aside class="checkout-summary"><div class="checkout-summary-head"><h2>Order summary</h2><span>${items.reduce((sum, item) => sum + item.qty, 0)} items</span></div>${itemMarkup}<div class="checkout-cost-row"><span>Subtotal</span><b>${money(total)}</b></div><div class="checkout-cost-row"><span>Standard shipping</span><b>${total >= FREE_SHIPPING_THRESHOLD ? "FREE" : "Calculated"}</b></div><div class="checkout-total"><span>Order total</span><strong>${money(total)}</strong></div><p class="checkout-assurance">Limited lifetime warranty · Easy exchange · Secure order review</p></aside></div></div></section>`;
  }

  function renderPage() {
    if (TYPE === "collection") renderCollection();
    if (TYPE === "product") renderProduct();
    if (TYPE === "services") renderServices();
    if (TYPE === "checkout") renderModernCheckout();
  }

  function cartItemProduct(id) {
    const product = PRODUCTS.find(item => item.id === id);
    if (product) return product;
    const saved = state.cart.find(item => item.id === id);
    if (!saved?.name || !Number.isFinite(Number(saved.price))) return null;
    return {
      id,
      name: saved.name,
      price: Number(saved.price),
      oldPrice: Number(saved.price),
      image: String(saved.image || "assets/images/catalog/thumb-accessories-catalog-1x1-01.webp").replace(/^.*assets[\\/]images[\\/]/i, "").replace(/\\/g, "/"),
      tags: ["accessory"],
      copy: "CUEBOTS performance equipment selected from the home collection."
    };
  }
  const FREE_SHIPPING_THRESHOLD = 99;

  function cartSku(id) {
    return `CB-${String(id || "ITEM").replace(/[^a-z0-9]+/gi, "-").toUpperCase()}`;
  }

  function cartVariant(item, product) {
    if (item.variant) return item.variant;
    if (product.tags.includes("glove")) {
      const color = product.color && product.color !== "Mixed" ? product.color : "Mixed colors";
      const hand = product.hand && product.hand !== "Both" ? `${product.hand} Hand` : "Both hands";
      return `Pure ${color} / ${hand} / Size ${item.size || product.sizes?.[0] || "M"}`;
    }
    if (product.tags.includes("shaft")) return "Carbon shaft / Standard joint selection";
    if (product.tags.includes("break")) return "Break setup / Performance configuration";
    if (product.tags.includes("case")) return "Cue case / Standard configuration";
    if (product.tags.includes("bundle")) return "Complete bundle / Standard configuration";
    return "CUEBOTS standard configuration";
  }

  const STORE_LOYALTY_TIERS = [
    { id: "launch", name: "Launch Member", min: 0, icon: "✦", headline: "Your rewards journey has begun." },
    { id: "orbit", name: "Orbit Member", min: 200, icon: "★", headline: "You have entered a new orbit." },
    { id: "nova", name: "Nova Member", min: 1000, icon: "✷", headline: "Your player status just went Nova." },
    { id: "celestial", name: "Celestial VIP", min: 1500, icon: "✧", headline: "Celestial privileges are now yours." },
    { id: "dark-voyager", name: "Dark Voyager Elite", min: 2000, icon: "◆", headline: "The black card has chosen you." }
  ];

  const spendTierIndex = spend => STORE_LOYALTY_TIERS.reduce((result, tier, index) => Number(spend) >= tier.min ? index : result, 0);

  function checkoutShipping(form) {
    const data = new FormData(form);
    const value = name => String(data.get(name) || "").trim();
    return {
      name: `${value("firstName")} ${value("lastName")}`.trim(),
      email: value("email"),
      address: value("address"),
      city: value("city"),
      postalCode: value("postalCode"),
      country: value("country"),
      deliveryMethod: value("deliveryMethod")
    };
  }

  function showCheckoutReview(form) {
    const shipping = checkoutShipping(form);
    form.dataset.checkoutStage = "review";
    form.querySelector("[data-checkout-details]").hidden = true;
    form.querySelector("[data-checkout-review]").hidden = false;
    form.querySelector('[name="confirmation"]').disabled = false;
    form.querySelector("[data-checkout-review-name]").textContent = shipping.name;
    form.querySelector("[data-checkout-review-address]").textContent = `${shipping.address}, ${shipping.city} ${shipping.postalCode}, ${shipping.country}`;
    form.querySelector("[data-checkout-review-contact]").textContent = shipping.email;
    form.querySelector("[data-checkout-review-method]").textContent = shipping.deliveryMethod;
    document.querySelector("[data-checkout-step='details']")?.classList.add("complete");
    document.querySelector("[data-checkout-step='review']")?.classList.add("active");
    form.closest(".checkout-layout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function editCheckout(form) {
    form.dataset.checkoutStage = "details";
    form.querySelector("[data-checkout-review]").hidden = true;
    form.querySelector("[data-checkout-details]").hidden = false;
    const confirmation = form.querySelector('[name="confirmation"]');
    if (confirmation) {
      confirmation.checked = false;
      confirmation.disabled = true;
    }
    document.querySelector("[data-checkout-step='review']")?.classList.remove("active");
  }

  function recordDemoOrder(shipping = null) {
    const items = state.cart.map(item => {
      const product = cartItemProduct(item.id);
      return product ? { id: product.id, name: product.name, qty: item.qty, price: product.price } : null;
    }).filter(Boolean);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (!items.length || total <= 0) return null;
    const previousSpend = Math.max(0, Number(safeRead("cuebotsLifetimeSpend", 0)) || 0);
    const newSpend = previousSpend + total;
    const previousTierIndex = spendTierIndex(previousSpend);
    const newTierIndex = spendTierIndex(newSpend);
    const order = {
      id: `CB-${Date.now().toString(36).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      total,
      items,
      shipping
    };
    const historyValue = safeRead("cuebotsOrderHistory", []);
    const history = Array.isArray(historyValue) ? historyValue : [];
    const currentYear = new Date().getFullYear();
    const annualRecord = safeRead("cuebotsAnnualSpend", {});
    const annualBase = Number(annualRecord?.year) === currentYear ? Math.max(0, Number(annualRecord.amount) || 0) : 0;
    try {
      localStorage.setItem("cuebotsOrderHistory", JSON.stringify([order, ...history].slice(0, 50)));
      localStorage.setItem("cuebotsLifetimeSpend", JSON.stringify(newSpend));
      localStorage.setItem("cuebotsAnnualSpend", JSON.stringify({ year: currentYear, amount: annualBase + total }));
    } catch (error) { /* Checkout confirmation remains available when storage is restricted. */ }
    return { order, previousSpend, newSpend, rankUp: newTierIndex > previousTierIndex ? STORE_LOYALTY_TIERS[newTierIndex] : null };
  }

  function showRankUpCelebration(tier) {
    const benefits = {
      orbit: "Early access to member-only offers is now active.",
      nova: "Enhanced point events and personal setup consultations are unlocked.",
      celestial: "Three exclusive vouchers, year-round accessory savings and Celebration Privileges are now yours.",
      "dark-voyager": "Your Dark Voyager black card, private invitations, product samples and bespoke-cue program are unlocked."
    };
    document.querySelector("[data-rank-up]")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="rank-up-universe tier-${tier.id}" data-rank-up><div class="rank-stars" aria-hidden="true"></div><div class="rank-orbit orbit-one" aria-hidden="true"><i></i></div><div class="rank-orbit orbit-two" aria-hidden="true"><i></i></div><div class="rank-glow" aria-hidden="true"></div><section class="rank-up-card" role="dialog" aria-modal="true" aria-labelledby="rankUpTitle"><span class="rank-up-icon" aria-hidden="true">${tier.icon}</span><p>MEMBERSHIP UPGRADED</p><h2 id="rankUpTitle">${tier.headline}</h2><h3>${tier.name}</h3><div class="rank-up-benefit"><small>NEW PRIVILEGE</small><strong>${benefits[tier.id] || "A new level of CUEBOTS rewards is now available."}</strong></div><button class="btn" type="button" data-close-rank-up data-open-account-screen="rewards">EXPLORE MY REWARDS</button><button class="rank-up-dismiss" type="button" data-close-rank-up>CONTINUE SHOPPING</button></section></div>`);
    const universe = document.querySelector("[data-rank-up]");
    document.body.classList.add("rank-up-lock");
    requestAnimationFrame(() => universe.classList.add("open"));
  }

  function closeRankUp() {
    const universe = document.querySelector("[data-rank-up]");
    if (!universe) return;
    universe.classList.remove("open");
    document.body.classList.remove("rank-up-lock");
    setTimeout(() => universe.remove(), 420);
  }

  function renderCart() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    $$('[data-cart-count]').forEach(node => { node.textContent = count; });
    const list = $("[data-cart-items]");
    if (!list) return;
    if (!state.cart.length) list.innerHTML = `<div class="cart-empty"><h3>Your cart is empty</h3><p>Add a cue, shaft or accessory to start your setup.</p><a class="btn btn-secondary" href="${path("pages/collection-pool-cues.html")}">START SHOPPING</a></div>`;
    else {
      const toolbar = state.cart.length >= 2 ? '<div class="cart-list-toolbar"><button class="cart-remove-all" type="button" data-remove-all-cart>Remove all selected</button></div>' : "";
      list.innerHTML = toolbar + state.cart.map(item => {
        const product = cartItemProduct(item.id);
        if (!product) return "";
        const sku = item.sku || cartSku(product.id);
        return `<article class="cart-item">${image(product.image, product.name)}<div class="cart-item-main"><strong>${product.name}</strong><span class="cart-item-option">${cartVariant(item, product)}</span><span class="cart-item-option">SKU: ${sku}</span><span class="cart-item-price">${money(product.price * item.qty)}</span><div class="cart-item-controls"><div class="cart-quantity" aria-label="Quantity for ${product.name}"><button type="button" data-cart-qty="-1" data-cart-id="${product.id}" aria-label="Decrease ${product.name} quantity">−</button><output aria-label="Quantity">${item.qty}</output><button type="button" data-cart-qty="1" data-cart-id="${product.id}" aria-label="Increase ${product.name} quantity">+</button></div><button class="cart-remove-item" type="button" data-remove-cart="${product.id}" aria-label="Remove ${product.name}"><svg class="icon"><use href="#i-trash"></use></svg></button></div></div></article>`;
      }).join("");
    }
    const total = state.cart.reduce((sum, item) => { const product = cartItemProduct(item.id); return sum + (product ? product.price * item.qty : 0); }, 0);
    $("[data-cart-subtotal]").textContent = money(total);
    const shipping = $("[data-shipping-reminder]");
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
    shipping.textContent = count === 0 ? `Free shipping on orders over ${money(FREE_SHIPPING_THRESHOLD)}.` : remaining > 0 ? `You're ${money(remaining)} away from free shipping.` : "You've unlocked free shipping.";
    shipping.classList.toggle("unlocked", count > 0 && remaining === 0);
    $("[data-checkout]").disabled = !state.cart.length;
  }

  function addToCart(id, quantity = 1) {
    const product = cartItemProduct(id);
    if (!product) return;
    const found = state.cart.find(item => item.id === id);
    if (found) found.qty += quantity;
    else state.cart.push({ id, qty: quantity, name: product.name, price: product.price, image: assetPath(product.image), sku: cartSku(id), variant: cartVariant({}, product) });
    save();
    renderCart();
    showToast(`${product.name} added to your cart.`);
  }

  function showToast(message) {
    const toast = $("[data-toast]");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function openSurface(surface, opener) {
    closeSurfaces(false);
    state.lastFocus = opener || document.activeElement;
    surface.classList.add("open");
    surface.setAttribute("aria-hidden", "false");
    $("[data-overlay]").classList.add("open");
    document.body.classList.add("lock-scroll");
    setTimeout(() => $("input,button,a", surface)?.focus(), 20);
  }

  function closeSurfaces(restore = true) {
    $$(".mobile-drawer,.search-dialog,.cart-drawer,.quick-modal,.account-modal").forEach(surface => { surface.classList.remove("open"); surface.setAttribute("aria-hidden", "true"); });
    $("[data-overlay]")?.classList.remove("open");
    document.body.classList.remove("lock-scroll");
    if (restore && state.lastFocus?.focus) state.lastFocus.focus();
  }

  function openQuick(id, opener) {
    const product = cartItemProduct(id);
    if (!product) return;
    rememberProduct(product.id);
    $("[data-quick-body]").innerHTML = `<div class="quick-grid">${image(product.image, product.name, true)}<div class="quick-copy"><p class="eyebrow">CUEBOTS PERFORMANCE EQUIPMENT</p><h3>${product.name}</h3><p>${product.copy}</p><p class="price">${money(product.price)} <del>${money(product.oldPrice)}</del></p><button class="btn" type="button" data-add-cart="${product.id}">ADD TO CART</button><a class="text-link" href="${detailUrl(product)}">VIEW FULL DETAILS →</a></div></div>`;
    openSurface($("[data-quick-modal]"), opener);
  }

  function normalizeSearch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function searchRelevance(product, query) {
    const term = normalizeSearch(query);
    const name = normalizeSearch(product.name);
    const context = normalizeSearch(`${product.tags.join(" ")} ${product.copy || ""} ${product.hand || ""} ${product.color || ""}`);
    if (!term) return 0;
    let score = 0;
    if (name === term) score += 1200;
    if (name.startsWith(term)) score += 900;
    if (name.split(" ").some(word => word === term)) score += 760;
    if (name.split(" ").some(word => word.startsWith(term))) score += 620;
    const nameIndex = name.indexOf(term);
    if (nameIndex >= 0) score += 480 - Math.min(nameIndex, 80);
    const contextIndex = context.indexOf(term);
    if (contextIndex >= 0) score += 220 - Math.min(contextIndex, 80);
    term.split(" ").forEach(token => {
      if (name.includes(token)) score += 120;
      else if (context.includes(token)) score += 45;
    });
    return score;
  }

  function searchType(product) {
    const labels = { shaft: "Carbon shaft", break: "Break equipment", jump: "Jump equipment", butt: "Cue butt", case: "Cue case", glove: "Pool glove", bundle: "Bundle", play: "Playing cue", accessory: "Accessory" };
    return product.tags.map(tag => labels[tag]).find(Boolean) || "CUEBOTS product";
  }

  function updateSearch(query) {
    const value = normalizeSearch(query);
    const resultRoot = $("[data-search-results]");
    if (!value) {
      const activityIds = [...safeRead("cuebotsRecentlyViewed", []), ...state.cart.map(item => item.id), ...Object.keys(state.wishlist).filter(id => state.wishlist[id])];
      const recommendations = [...activityIds.map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean), ...PRODUCTS].filter((item, index, items) => items.findIndex(candidate => candidate.id === item.id) === index).slice(0, 4);
      resultRoot.innerHTML = `<div class="search-discovery"><a class="search-promo" href="${path("pages/collection-first-carbon-cue.html")}"><img src="${path("assets/images/collections/hero-first-carbon-cue-collection-desktop-01.webp")}" width="1200" height="420" alt="" loading="lazy" decoding="async"><span><small>PLAYER-READY BUNDLE</small><strong>Start with a complete carbon setup</strong><b>SHOP THE SETUP →</b></span></a><section class="search-suggestions"><div class="search-suggestions-head"><h3>${activityIds.length ? "BASED ON YOUR ACTIVITY" : "YOU MAY ALSO LIKE"}</h3><a href="${path("pages/collection-pool-cues.html")}">VIEW ALL →</a></div><div class="search-suggestion-row">${recommendations.map(product => `<a href="${detailUrl(product)}" class="search-suggestion-card"><img src="${assetPath(product.image)}" width="120" height="120" alt="" loading="lazy" decoding="async"><span><strong>${product.name}</strong><small>${money(product.price)}</small></span></a>`).join("")}</div></section></div>`;
      return;
    }
    const results = PRODUCTS.map(product => ({ product, score: searchRelevance(product, value) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.length - b.product.name.length || a.product.name.localeCompare(b.product.name))
      .slice(0, 8);
    resultRoot.innerHTML = results.length
      ? `<p class="search-summary">${results.length} best matches</p>${results.map(({ product }) => `<button type="button" class="search-result" data-quick-product="${product.id}"><span class="search-result-thumb"><img src="${assetPath(product.image)}" width="48" height="48" alt="" loading="lazy" decoding="async"></span><span class="search-result-copy"><strong>${product.name}</strong><small>${searchType(product)} · ${product.copy}</small></span><span class="search-result-meta">${money(product.price)}</span></button>`).join("")}`
      : '<p class="search-empty">No matching products found.</p>';
  }

  function setAccountMode(mode = "signin") {
    const signup = mode === "signup";
    $("[data-account-title]").textContent = signup ? "Create your account" : "Account sign in";
    $("[data-account-intro]").textContent = signup ? "Save equipment, track orders and receive more relevant recommendations." : "Enter your account details to continue.";
    $("[data-account-submit]").textContent = signup ? "CREATE ACCOUNT" : "SIGN IN";
    const password = $("[data-account-password]");
    password.autocomplete = signup ? "new-password" : "current-password";
    const switcher = $(".account-mode-switch");
    switcher.dataset.accountMode = signup ? "signin" : "signup";
    switcher.textContent = signup ? "Already have an account? Sign in" : "New to CUEBOTS? Create an account";
    $("[data-account-status]").textContent = "";
  }

  function wireMegaMenus() {
    const items = $$(".desktop-nav .nav-item.has-dropdown");
    const closeItem = item => {
      item.classList.remove("is-mega-open");
      $("[data-mega-trigger]", item)?.setAttribute("aria-expanded", "false");
    };
    const openItem = item => {
      if (!matchMedia("(min-width: 1181px)").matches) return;
      items.forEach(other => { if (other !== item) closeItem(other); });
      item.classList.add("is-mega-open");
      $("[data-mega-trigger]", item)?.setAttribute("aria-expanded", "true");
    };
    items.forEach(item => {
      const trigger = $("[data-mega-trigger]", item);
      const menu = $(".mega-menu", item);
      const tabs = $$("[data-mega-panel-index]", item);
      const panels = $$("[data-mega-panel]", item);
      const selectPanel = index => {
        tabs.forEach((tab, tabIndex) => { const selected = tabIndex === index; tab.classList.toggle("active", selected); tab.setAttribute("aria-selected", String(selected)); });
        panels.forEach((panel, panelIndex) => { const selected = panelIndex === index; panel.classList.toggle("active", selected); panel.hidden = !selected; });
      };
      tabs.forEach((tab, index) => {
        tab.addEventListener("mouseenter", () => selectPanel(index));
        tab.addEventListener("focus", () => selectPanel(index));
        tab.addEventListener("click", () => selectPanel(index));
      });
      item.addEventListener("mouseenter", () => openItem(item));
      item.addEventListener("mouseleave", () => closeItem(item));
      item.addEventListener("focusin", () => openItem(item));
      item.addEventListener("focusout", () => requestAnimationFrame(() => { if (!item.contains(document.activeElement)) closeItem(item); }));
      trigger.addEventListener("keydown", event => {
        if (event.key === "ArrowDown") { event.preventDefault(); openItem(item); $("a,button", menu)?.focus(); }
        if (event.key === "Escape") { event.preventDefault(); closeItem(item); }
      });
      menu.addEventListener("keydown", event => { if (event.key === "Escape") { event.preventDefault(); closeItem(item); trigger.focus(); } });
    });
    document.addEventListener("pointerdown", event => { if (!event.target.closest(".desktop-nav")) items.forEach(closeItem); });
  }

  renderSharedChrome();
  wireMegaMenus();
  renderPage();
  renderCart();
  const scrollToHashTarget = () => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ block: "start" });
  };
  requestAnimationFrame(scrollToHashTarget);
  window.addEventListener("hashchange", scrollToHashTarget);

  document.addEventListener("click", event => {
    const target = event.target.closest("button,a,[data-overlay]");
    if (!target) return;
    if (target.matches("[data-open-menu]")) openSurface($(".mobile-drawer"), target);
    if (target.matches("[data-open-search]")) { updateSearch(""); openSurface($("[data-search-dialog]"), target); }
    if (target.matches("[data-account-mode]")) setAccountMode(target.dataset.accountMode);
    if (target.matches("[data-open-account]")) { setAccountMode(target.dataset.accountMode || "signin"); openSurface($("[data-account-modal]"), target); }
    if (target.matches("[data-open-cart]")) openSurface($("[data-cart-drawer]"), target);
    if (target.matches("[data-close]")) closeSurfaces();
    if (target.matches("[data-overlay]")) closeSurfaces();
    if (target.matches("[data-quick-product]")) openQuick(target.dataset.quickProduct, target);
    if (target.matches("[data-add-cart]")) addToCart(target.dataset.addCart, target.hasAttribute("data-use-quantity") ? state.quantity : 1);
    if (target.matches("[data-cart-qty]")) {
      const item = state.cart.find(entry => entry.id === target.dataset.cartId);
      if (item) {
        item.qty += Number(target.dataset.cartQty);
        if (item.qty <= 0) state.cart = state.cart.filter(entry => entry !== item);
        save(); renderCart();
      }
    }
    if (target.matches("[data-remove-cart]")) { state.cart = state.cart.filter(item => item.id !== target.dataset.removeCart); save(); renderCart(); }
    if (target.matches("[data-remove-all-cart]")) { state.cart = []; save(); renderCart(); showToast("Selected items removed from your cart."); }
    if (target.matches("[data-wishlist]")) { const id = target.dataset.wishlist; state.wishlist[id] = !state.wishlist[id]; target.classList.toggle("active", state.wishlist[id]); target.setAttribute("aria-pressed", String(state.wishlist[id])); save(); showToast(state.wishlist[id] ? "Saved to your wishlist." : "Removed from your wishlist."); }
    if (target.matches("[data-filter]")) { state.filter = target.dataset.filter; $$('[data-filter]').forEach(button => button.classList.toggle("active", button === target)); renderCatalog(); }
    if (target.matches("[data-qty]")) { state.quantity = Math.max(1, Math.min(9, state.quantity + Number(target.dataset.qty))); $("[data-quantity]").textContent = state.quantity; }
    if (target.matches("[data-checkout]")) window.location.href = path("pages/checkout.html");
    if (target.matches("[data-clear-search]")) { const input = $("[data-search-input]"); input.value = ""; updateSearch(""); input.focus(); }
    if (target.matches("[data-glove-hand]")) { state.gloveHand = target.dataset.gloveHand; renderGloveProducts(); }
    if (target.matches("[data-glove-clear]")) {
      state.gloveColor = "All";
      state.gloveSize = "All";
      state.gloveSort = "featured";
      $("[data-glove-color]").value = "All";
      $("[data-glove-size]").value = "All";
      $("[data-glove-sort]").value = "featured";
      renderGloveProducts();
    }
    if (target.matches("[data-glove-guide]")) {
      const help = $("[data-glove-hand-help]");
      const expanded = target.getAttribute("aria-expanded") === "true";
      target.setAttribute("aria-expanded", String(!expanded));
      help.hidden = expanded;
    }
    if (target.matches("[data-glove-faq]")) {
      const item = target.closest(".glove-faq-item");
      const expanded = target.getAttribute("aria-expanded") === "true";
      item.classList.toggle("open", !expanded);
      target.setAttribute("aria-expanded", String(!expanded));
      $("b", target).textContent = expanded ? "+" : "−";
    }
  });

  document.addEventListener("input", event => {
    if (event.target.matches("[data-search-input]")) updateSearch(event.target.value);
  });
  document.addEventListener("change", event => {
    if (event.target.matches("[data-currency-select]")) { state.currency = event.target.value; save(); renderPage(); renderCart(); $$('[data-currency-select]').forEach(select => { select.value = state.currency; }); }
    if (event.target.matches("[data-sort]")) { state.sort = event.target.value; renderCatalog(); }
    if (event.target.matches("[data-glove-color]")) { state.gloveColor = event.target.value; renderGloveProducts(); }
    if (event.target.matches("[data-glove-size]")) { state.gloveSize = event.target.value; renderGloveProducts(); }
    if (event.target.matches("[data-glove-sort]")) { state.gloveSort = event.target.value; renderGloveProducts(); }
  });
  document.addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-checkout]");
    if (editButton) {
      const checkoutForm = editButton.closest("[data-checkout-form]");
      if (checkoutForm) editCheckout(checkoutForm);
    }
    if (event.target.closest("[data-close-rank-up]")) closeRankUp();
  });
  document.addEventListener("submit", event => {
    if (event.target.matches("[data-newsletter]")) { event.preventDefault(); $("[data-newsletter-status]").textContent = "Thank you — your player updates are on the way."; event.target.reset(); }
    if (event.target.matches("[data-account-form]")) { event.preventDefault(); $("[data-account-status]").textContent = "Demo sign-in received. Connect this form to your customer platform when ready."; }
    if (event.target.matches("[data-contact-form]")) { event.preventDefault(); $("[data-contact-status]").textContent = "Request received. Support will respond by email in this demo flow."; event.target.reset(); }
    if (event.target.matches("[data-checkout-form]")) {
      event.preventDefault();
      const checkoutForm = event.target;
      if (checkoutForm.dataset.checkoutStage !== "review") {
        const invalidField = [...checkoutForm.querySelectorAll("[data-checkout-details] [required]")]
          .find(field => !field.checkValidity());
        if (invalidField) {
          invalidField.reportValidity();
          return;
        }
        showCheckoutReview(checkoutForm);
        return;
      }
      const result = recordDemoOrder(checkoutShipping(checkoutForm));
      if (!result) {
        $("[data-checkout-status]").textContent = "Add a product before placing an order.";
        return;
      }
      state.cart = [];
      save();
      document.querySelector("[data-checkout-step='review']")?.classList.add("complete");
      document.querySelector("[data-checkout-step='complete']")?.classList.add("active");
      checkoutForm.dataset.checkoutStage = "complete";
      checkoutForm.innerHTML = `<div class="checkout-complete"><span aria-hidden="true">✓</span><p class="eyebrow">ORDER CONFIRMED</p><h2>Thank you. Your order is placed.</h2><p>Order <strong>${result.order.id}</strong> has been confirmed for <strong>${money(result.order.total)}</strong>. A confirmation summary has been prepared for ${result.order.shipping.email}.</p><div><a class="btn" href="${path("pages/collection-pool-cues.html")}">CONTINUE SHOPPING</a><button class="btn btn-secondary" type="button" data-open-account-screen="orders">VIEW ORDER HISTORY</button></div><small>This is a demo checkout. No payment was processed.</small></div>`;
      renderCart();
      if (result.rankUp) setTimeout(() => showRankUpCelebration(result.rankUp), 420);
    }
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeSurfaces(); });
})();
