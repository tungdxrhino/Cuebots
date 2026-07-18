const ROUTES = {
  cues: "pages/collection-pool-cues.html",
  butts: "pages/collection-cue-butts.html",
  shafts: "pages/collection-carbon-shafts.html",
  cases: "pages/collection-cases.html",
  gloves: "pages/collection-gloves.html",
  accessories: "pages/collection-accessories.html",
  services: "pages/services.html",
  resources: "pages/blog.html"
};

const DETAIL_ROUTES = {
  "rhino-30-125": "pages/product-rhino-30-125.html",
  "z-fusion": "pages/product-z-fusion-limited.html",
  "nebula-carbon": "pages/product-nebula-carbon-cue.html",
  "carbon-break": "pages/product-rhino-carbon-break-cue.html",
  "retro-set": "pages/product-retro-ii-carbon-set.html",
  "shaft-starter": "pages/product-carbon-shaft-starter-bundle.html",
  "nebula-bundle": "pages/product-nebula-pro-bundle.html",
  "break-jump-duo": "pages/product-break-jump-power-duo.html"
};

function productDetailTag(id, name) {
  const value = `${id} ${name}`.toLowerCase();
  if (value.includes("shaft")) return "shaft";
  if (value.includes("break")) return "break";
  if (value.includes("jump")) return "jump";
  if (value.includes("butt")) return "butt";
  if (value.includes("case")) return "case";
  if (value.includes("glove")) return "glove";
  if (value.includes("bundle") || value.includes("set") || value.includes("pack")) return "bundle";
  return "play";
}

function sharedProductDetailUrl(id, name, price, oldPrice, image) {
  const params = new URLSearchParams({
    id,
    name,
    price: String(price),
    old: String(oldPrice),
    image: image
      .replace(/^.*assets[\\/]images[\\/]/i, "")
      .replace(/\\/g, "/"),
    tag: productDetailTag(id, name)
  });
  return `pages/product-view.html?${params.toString()}`;
}

const ASSETS = {
  poolCues: "assets/images/catalog/thumb-pool-cues-catalog-1x1-01.webp",
  breakCues: "assets/images/catalog/thumb-break-cues-catalog-1x1-01.webp",
  jumpCues: "assets/images/catalog/thumb-jump-cues-catalog-1x1-01.webp",
  shafts: "assets/images/catalog/thumb-carbon-shafts-catalog-1x1-01.webp",
  butts: "assets/images/catalog/thumb-cue-butts-catalog-1x1-01.webp",
  accessories: "assets/images/catalog/thumb-accessories-catalog-1x1-01.webp",
  firstCue: "assets/images/recommendations/poster-first-carbon-cue-recommendation-4x5-01.webp",
  firstCueProduct: "assets/images/products/prod-first-carbon-cue-collection-1x1-01.webp",
  upgradeShaft: "assets/images/recommendations/poster-upgrade-my-shaft-recommendation-4x5-01.webp",
  upgradeShaftProduct: "assets/images/products/prod-upgrade-my-shaft-collection-1x1-01.webp",
  shopButts: "assets/images/recommendations/poster-shop-cue-butts-recommendation-4x5-01.webp",
  shopButtsProduct: "assets/images/products/prod-shop-cue-butts-collection-1x1-01.webp",
  breakPower: "assets/images/recommendations/poster-break-power-recommendation-4x5-01.webp",
  breakPowerProduct: "assets/images/products/prod-break-power-collection-1x1-01.webp",
  difficultShots: "assets/images/recommendations/poster-difficult-shots-recommendation-4x5-01.webp",
  retroDesktop: "assets/images/heroes/hero-retro-ii-carbon-pool-cue-desktop-01.webp",
  retroMobile: "assets/images/heroes/hero-retro-ii-carbon-pool-cue-mobile-01.webp",
  retroCard: "assets/images/products/prod-retro-ii-carbon-pool-cue-collection-1x1-01.webp",
  nebulaDesktop: "assets/images/heroes/hero-nebula-carbon-pool-cue-desktop-01.webp",
  nebulaMobile: "assets/images/heroes/hero-nebula-carbon-pool-cue-mobile-01.webp",
  nebulaCard: "assets/images/products/prod-nebula-carbon-pool-cue-collection-1x1-01.webp",
  zFusionDesktop: "assets/images/heroes/hero-z-fusion-carbon-pool-cue-desktop-01.webp",
  zFusionMobile: "assets/images/heroes/hero-z-fusion-carbon-pool-cue-mobile-01.webp",
  guideShaft: "assets/images/guides/thumb-how-to-choose-right-shaft-buying-guide-3x2-01.webp",
  guideCarbonWood: "assets/images/guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp",
  guideJoints: "assets/images/guides/thumb-understanding-cue-joint-types-buying-guide-3x2-01.webp",
  guideCare: "assets/images/guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp",
  guideCueTip: "assets/images/guides/thumb-choosing-right-cue-tip-buying-guide-3x2-01.webp",
  setupFirstHook: "assets/images/setups/thumb-first-cue-setup-recommended-1x1-01.webp",
  setupFirstDetail: "assets/images/setups/poster-first-cue-setup-detail-5x4-01.webp",
  setupLeagueHook: "assets/images/setups/thumb-league-night-setup-recommended-1x1-01.webp",
  setupLeagueDetail: "assets/images/setups/poster-league-night-setup-detail-5x4-01.webp",
  setupShaftHook: "assets/images/setups/thumb-shaft-upgrade-setup-recommended-1x1-01.webp",
  setupShaftDetail: "assets/images/setups/poster-shaft-upgrade-setup-detail-5x4-01.webp",
  setupTournamentHook: "assets/images/setups/thumb-tournament-setup-recommended-1x1-01.webp",
  setupTournamentDetail: "assets/images/setups/poster-tournament-setup-detail-5x4-01.webp",
  setupBreakHook: "assets/images/setups/thumb-break-jump-setup-recommended-1x1-01.webp",
  setupBreakDetail: "assets/images/setups/poster-break-jump-setup-detail-5x4-01.webp"
};

const NAVIGATION = [
  { label: "Cues", url: ROUTES.cues, eyebrow: "Build your game", description: "Find a complete cue by shot, playing style or experience level.", groups: [{ title: "Shop by cue", links: [["All pool cues", ROUTES.cues, "Complete playing cues"], ["Break cues", "pages/collection-break-cues.html", "Power with control"], ["Jump cues", "pages/collection-jump-cues.html", "Clear difficult obstacles"]] }, { title: "Start by goal", links: [["My first carbon cue", "pages/collection-first-carbon-cue.html", "A ready-to-play starting point"], ["More break power", "pages/collection-break-power.html", "Purpose-built opening shots"], ["Make difficult shots", "pages/collection-difficult-shots.html", "Control for demanding positions"]] }], assist: ["Not sure where to start?", "Use the player-first cue finder", "pages/collection-difficult-shots.html"], feature: { badge: "Player-ready setup", title: "Your first carbon cue, simplified", copy: "A balanced cue and essential gear selected to remove the guesswork.", cta: "Explore the setup", url: "pages/collection-first-carbon-cue.html", image: "assets/images/products/prod-first-carbon-cue-collection-1x1-01.webp" } },
  { label: "Butts", url: ROUTES.butts, eyebrow: "Create your combination", description: "Choose the look, balance and purpose of the back half of your cue.", groups: [{ title: "Shop cue butts", links: [["All butts", ROUTES.butts, "See every available style"], ["Playing butts", "pages/collection-shop-cue-butts.html", "Balanced for everyday control"], ["Break butts", "pages/collection-break-power.html", "A firmer power platform"]] }, { title: "Build with confidence", links: [["Single butts", ROUTES.butts, "Start a custom pairing"], ["Match a carbon shaft", ROUTES.shafts, "Complete your setup"], ["Joint compatibility", "pages/blog-understanding-joint-types.html", "Check fit before you buy"]] }], assist: ["Building a mixed setup?", "Check joint compatibility first", "pages/blog-understanding-joint-types.html"], feature: { badge: "Mix + match", title: "Build a cue around your stroke", copy: "Pair a distinctive butt with the carbon shaft profile that feels right.", cta: "Shop cue butts", url: "pages/collection-shop-cue-butts.html", image: "assets/images/products/prod-shop-cue-butts-collection-1x1-01.webp" } },
  { label: "Shafts", url: ROUTES.shafts, eyebrow: "Upgrade the response", description: "Compare diameter, purpose and fit before changing your whole cue.", groups: [{ title: "Carbon shafts", links: [["All shafts", ROUTES.shafts, "Compare the complete range"], ["Pool shafts", ROUTES.shafts, "Control and low deflection"], ["Break shafts", "pages/collection-break-power.html", "Stiffness for energy transfer"]] }, { title: "Shop by fit", links: [["Upgrade my shaft", "pages/collection-upgrade-my-shaft.html", "Keep your current butt"], ["11.8–12.5 mm", ROUTES.shafts, "Slim to familiar profiles"], ["12.8 mm", ROUTES.shafts, "A fuller, solid feel"]] }], assist: ["Diameter, taper or joint?", "Read the shaft selection guide", "pages/blog-how-to-choose-the-right-shaft.html"], feature: { badge: "Most useful upgrade", title: "Change the feel. Keep your cue.", copy: "A focused carbon upgrade for cleaner feedback and more predictable cue-ball control.", cta: "Find your shaft", url: "pages/collection-upgrade-my-shaft.html", image: "assets/images/products/prod-upgrade-my-shaft-collection-1x1-01.webp" } },
  { label: "Cases", url: ROUTES.cases, eyebrow: "Protect the setup", description: "Carry cues and accessories with the right balance of access and protection.", groups: [{ title: "Shop cases", links: [["All cue cases", ROUTES.cases, "Compare every format"], ["Soft cases", ROUTES.cases, "Lightweight daily carry"], ["Hard cases", ROUTES.cases, "Structured protection"]] }, { title: "Choose by use", links: [["League night", ROUTES.cases, "Fast access and simple storage"], ["Tournament travel", `${ROUTES.cases}#products`, "Protection for longer days"], ["Complete setups", "pages/collection-first-carbon-cue.html", "Cue, glove and case together"]] }], assist: ["How much should you carry?", "Start with your regular playing routine", `${ROUTES.cases}#products`], feature: { badge: "Travel-ready", title: "Arrive with every piece protected", copy: "Organize your playing cue, break cue and essentials without unnecessary bulk.", cta: "Explore cue cases", url: ROUTES.cases, image: "assets/images/catalog/thumb-accessories-catalog-1x1-01.webp" } },
  { label: "Gloves", url: ROUTES.gloves, eyebrow: "A smoother bridge", description: "Choose hand, size and color for consistent cue delivery in every condition.", groups: [{ title: "Shop gloves", links: [["All pool gloves", ROUTES.gloves, "Singles and player packs"], ["Left hand", `${ROUTES.gloves}#products`, "Fits the bridge hand"], ["Right hand", `${ROUTES.gloves}#products`, "A mirrored performance fit"]] }, { title: "Find your fit", links: [["Size guide", `${ROUTES.gloves}#size-guide`, "Measure before you order"], ["Glove packs", `${ROUTES.gloves}#packs`, "Stay prepared for every session"], ["Complete the setup", `${ROUTES.gloves}#complete-setup`, "Pair with player essentials"]] }], assist: ["Left or right glove?", "Choose the glove worn on your bridge hand", `${ROUTES.gloves}#hand-guide`], feature: { badge: "Pure pool glove", title: "Consistent glide, less distraction", copy: "Breathable performance fabric with a secure fit across long practice and match sessions.", cta: "Find your glove", url: ROUTES.gloves, image: "assets/images/products/gloves/prod-pure-pool-glove-left-grey-1x1-01.webp" } },
  { label: "Accessories", url: ROUTES.accessories, eyebrow: "Keep every detail ready", description: "Small essentials that protect consistency before, during and after play.", groups: [{ title: "Shop accessories", links: [["Shop all", ROUTES.accessories, "Browse every essential"], ["Chalk", ROUTES.accessories, "Reliable tip contact"], ["Joint protectors", ROUTES.accessories, "Protect threads in transit"]] }, { title: "Care + prepare", links: [["Cue maintenance", `${ROUTES.accessories}#products`, "Keep surfaces match-ready"], ["Cases", ROUTES.cases, "Organize and protect"], ["Cue care checklist", "pages/blog-cue-care-checklist.html", "A simple maintenance routine"]] }], assist: ["Building a useful kit?", "Start with protection, chalk and care", `${ROUTES.accessories}#products`], feature: { badge: "Match-day essentials", title: "The small gear that saves a session", copy: "Keep your cue clean, protected and ready when the next match begins.", cta: "Shop accessories", url: ROUTES.accessories, image: "assets/images/catalog/thumb-accessories-catalog-1x1-01.webp" } },
  { label: "Services", url: ROUTES.services, eyebrow: "Player support", description: "Get the right fit before purchase and dependable help after it.", groups: [{ title: "Choose with confidence", links: [["Cue finder", "pages/collection-difficult-shots.html", "Start from how you play"], ["Shaft compatibility", "pages/services.html#compatibility", "Confirm joint and fit"], ["Our story", "pages/services.html#our-story", "How CUEBOTS is built for players"]] }, { title: "After your order", links: [["Warranty", "pages/services.html#warranty", "Understand your coverage"], ["Easy exchange", "pages/services.html#warranty", "Get the fit corrected"], ["Contact us", "pages/services.html#contact", "Talk to player support"]] }], assist: ["Need a human recommendation?", "Player support can help narrow the choice", "pages/services.html#contact"], feature: { badge: "Limited lifetime warranty", title: "Support that stays with your setup", copy: "Compatibility guidance, straightforward exchanges and product help when you need it.", cta: "Visit player support", url: ROUTES.services, image: "assets/images/recommendations/poster-difficult-shots-recommendation-4x5-01.webp" } },
  { label: "Blog", url: ROUTES.resources, eyebrow: "Play with more context", description: "Practical guidance for choosing, maintaining and understanding your equipment.", groups: [{ title: "Explore", links: [["Latest articles", ROUTES.resources, "New ideas from CUEBOTS"], ["Buying guides", ROUTES.resources, "Compare before you purchase"], ["Player stories", ROUTES.resources, "Real setups and experience"]] }, { title: "Popular guides", links: [["Choose the right shaft", "pages/blog-how-to-choose-the-right-shaft.html", "Diameter, taper, joint and feel"], ["Carbon vs wood", "pages/blog-carbon-vs-wood-shaft.html", "Compare two playing experiences"], ["Cue care checklist", "pages/blog-cue-care-checklist.html", "Keep equipment ready"]] }], assist: ["One decision, clearly explained", "Start with the shaft buying guide", "pages/blog-how-to-choose-the-right-shaft.html"], feature: { badge: "Editor's guide", title: "How to choose the right shaft", copy: "Build a shortlist around your stroke instead of choosing from specifications alone.", cta: "Read the guide", url: "pages/blog-how-to-choose-the-right-shaft.html", image: "assets/images/guides/thumb-how-to-choose-right-shaft-buying-guide-3x2-01.webp" } }
];

const MEGA_VISUALS = {
  Cues: [["assets/images/collections/thumb-pool-cues-related-5x3-01.webp", "assets/images/collections/thumb-break-cues-related-5x3-01.webp", "assets/images/collections/thumb-jump-cues-related-5x3-01.webp"], ["assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp", "assets/images/collections/thumb-break-power-related-5x3-01.webp", "assets/images/collections/thumb-difficult-shots-related-5x3-01.webp"]],
  Butts: [["assets/images/collections/thumb-cue-butts-related-5x3-01.webp", "assets/images/collections/thumb-shop-cue-butts-related-5x3-01.webp", "assets/images/collections/thumb-break-power-related-5x3-01.webp"], ["assets/images/catalog/thumb-cue-butts-catalog-1x1-01.webp", "assets/images/collections/thumb-carbon-shafts-related-5x3-01.webp", "assets/images/guides/thumb-understanding-cue-joint-types-buying-guide-3x2-01.webp"]],
  Shafts: [["assets/images/collections/thumb-carbon-shafts-related-5x3-01.webp", "assets/images/products/prod-upgrade-my-shaft-collection-1x1-01.webp", "assets/images/collections/thumb-break-power-related-5x3-01.webp"], ["assets/images/collections/thumb-upgrade-my-shaft-related-5x3-01.webp", "assets/images/products/prod-carbon-shaft-starter-bundle-1x1-01.webp", "assets/images/catalog/thumb-carbon-shafts-catalog-1x1-01.webp"]],
  Cases: [["assets/images/collections/thumb-cases-related-5x3-01.webp", "assets/images/collections/hero-cases-collection-desktop-01.webp", "assets/images/products/prod-carbon-shaft-starter-bundle-1x1-01.webp"], ["assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp", "assets/images/collections/thumb-cases-related-5x3-01.webp", "assets/images/promotions/poster-retro-ii-complete-setups-desktop-01.webp"]],
  Gloves: [["assets/images/collections/thumb-pure-pool-glove-related-5x3-01.webp", "assets/images/products/gloves/prod-pure-pool-glove-left-grey-1x1-01.webp", "assets/images/products/gloves/prod-pure-pool-glove-right-black-1x1-01.webp"], ["assets/images/promotions/poster-pure-pool-glove-single-navigation-desktop-01.webp", "assets/images/products/gloves/prod-pure-pool-glove-pack-3-mixed-1x1-01.webp", "assets/images/promotions/poster-pure-pool-glove-complete-setup-desktop-01.webp"]],
  Accessories: [["assets/images/collections/thumb-accessories-related-5x3-01.webp", "assets/images/catalog/thumb-accessories-catalog-1x1-01.webp", "assets/images/products/prod-carbon-shaft-starter-bundle-1x1-01.webp"], ["assets/images/guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp", "assets/images/collections/thumb-cases-related-5x3-01.webp", "assets/images/products/prod-first-carbon-cue-collection-1x1-01.webp"]],
  Services: [["assets/images/collections/thumb-difficult-shots-related-5x3-01.webp", "assets/images/guides/thumb-understanding-cue-joint-types-buying-guide-3x2-01.webp", "assets/images/services/des-factory-direct-carbon-service-5x4-01.webp"], ["assets/images/recommendations/poster-difficult-shots-recommendation-4x5-01.webp", "assets/images/catalog/thumb-accessories-catalog-1x1-01.webp", "assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp"]],
  Blog: [["assets/images/guides/thumb-how-to-choose-right-shaft-buying-guide-3x2-01.webp", "assets/images/guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp", "assets/images/guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp"], ["assets/images/guides/thumb-how-to-choose-right-shaft-buying-guide-3x2-01.webp", "assets/images/guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp", "assets/images/guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp"]]
};

const MEGA_PROMOTIONS = {
  Cues: [["Complete setup", "First carbon cue kit", "pages/collection-first-carbon-cue.html", "assets/images/recommendations/poster-first-carbon-cue-recommendation-4x5-01.webp"], ["Player solution", "Control difficult shots", "pages/collection-difficult-shots.html", "assets/images/recommendations/poster-difficult-shots-recommendation-4x5-01.webp"]],
  Butts: [["Build your cue", "Mix butt + shaft", "pages/collection-shop-cue-butts.html", "assets/images/recommendations/poster-shop-cue-butts-recommendation-4x5-01.webp"], ["Fit guide", "Check your joint", "pages/blog-understanding-joint-types.html", "assets/images/promotions/poster-understanding-cue-joint-types-store-4x5-01.webp"]],
  Shafts: [["Upgrade path", "Keep the butt you love", "pages/collection-upgrade-my-shaft.html", "assets/images/recommendations/poster-upgrade-my-shaft-recommendation-4x5-01.webp"], ["Editor's guide", "Choose the right shaft", "pages/blog-how-to-choose-the-right-shaft.html", "assets/images/promotions/poster-how-to-choose-right-shaft-store-4x5-01.webp"]],
  Cases: [["Travel ready", "Protect the complete setup", ROUTES.cases, "assets/images/collections/hero-cases-collection-desktop-01.webp"], ["Recommended setup", "Pack for league night", "pages/collection-first-carbon-cue.html", "assets/images/promotions/poster-retro-ii-complete-setups-desktop-01.webp"]],
  Gloves: [["Pure glove", "Smooth, repeatable delivery", ROUTES.gloves, "assets/images/promotions/poster-pure-pool-glove-single-navigation-desktop-01.webp"], ["Multi-buy", "Build your glove rotation", `${ROUTES.gloves}#packs`, "assets/images/promotions/poster-pure-pool-glove-multibuy-desktop-01.webp"]],
  Accessories: [["Player essentials", "Complete the match-day kit", ROUTES.accessories, "assets/images/collections/hero-accessories-collection-desktop-01.webp"], ["Quick guide", "Cue care checklist", "pages/blog-cue-care-checklist.html", "assets/images/guides/thumb-cue-care-checklist-buying-guide-3x2-01.webp"]],
  Services: [["Free guidance", "Find the right setup", "pages/services.html#contact", "assets/images/recommendations/poster-difficult-shots-recommendation-4x5-01.webp"], ["Player promise", "Warranty + easy exchange", "pages/services.html#warranty", "assets/images/collections/thumb-first-carbon-cue-related-5x3-01.webp"]],
  Blog: [["Start here", "How to choose the right shaft", "pages/blog-how-to-choose-the-right-shaft.html", "assets/images/promotions/poster-how-to-choose-right-shaft-store-4x5-01.webp"], ["Popular read", "Carbon shaft vs wood shaft", "pages/blog-carbon-vs-wood-shaft.html", "assets/images/guides/thumb-carbon-vs-wood-shaft-buying-guide-3x2-01.webp"]]
};

const pageData = {
  trust: [
    { icon: "i-star", label: "4.4/5 from 2,000+ players" },
    { icon: "i-box", label: "Free shipping over $99" },
    { icon: "i-shield", label: "Limited lifetime warranty" },
    { icon: "i-exchange", label: "Easy exchange" }
  ],
  categories: [
    { name: "Pool cues", image: ASSETS.poolCues, alt: "CUEBOTS pool cue collection", url: "pages/collection-pool-cues.html" },
    { name: "Break cues", image: ASSETS.breakCues, alt: "CUEBOTS carbon break cue", url: "pages/collection-break-cues.html" },
    { name: "Jump cues", image: ASSETS.jumpCues, alt: "CUEBOTS compact jump cue", url: "pages/collection-jump-cues.html" },
    { name: "Carbon shafts", image: ASSETS.shafts, alt: "CUEBOTS black carbon shafts", url: ROUTES.shafts },
    { name: "Single butts", image: ASSETS.butts, alt: "CUEBOTS single cue butt collection", url: ROUTES.butts },
    { name: "Accessories", image: ASSETS.accessories, alt: "CUEBOTS cue accessories", url: ROUTES.accessories }
  ],
  intents: [
    { title: "First carbon cue", description: "Start with a complete, ready-to-play setup.", image: ASSETS.firstCue, alt: "Complete first carbon cue setup", url: "pages/collection-first-carbon-cue.html" },
    { title: "Upgrade my shaft", description: "Improve performance without changing your cue butt.", image: ASSETS.upgradeShaft, alt: "Carbon shaft upgrade", url: "pages/collection-upgrade-my-shaft.html" },
    { title: "Shop cue butts", description: "Mix and match your own playing combination.", image: ASSETS.shopButts, alt: "Custom cue butt selection", url: "pages/collection-shop-cue-butts.html" },
    { title: "Get more break power", description: "Find a cue designed for stronger, more efficient breaks.", image: ASSETS.breakPower, alt: "Carbon break cue setup", url: "pages/collection-break-power.html" },
    { title: "Make more difficult shots", description: "Get more control and confidence on difficult shots.", image: ASSETS.difficultShots, alt: "Cue selected for control on difficult shots", url: "pages/collection-difficult-shots.html" }
  ],
  products: {
    best: [
      ["rhino-30-125", "Rhino — 30-inch 12.5mm Carbon Pool Cue Single Shaft", 199, 229, ASSETS.shafts, ROUTES.shafts],
      ["rhino-30-128", "Rhino — 30-inch 12.8mm Carbon Pool Cue Single Shaft", 199, 229, ASSETS.shafts, ROUTES.shafts],
      ["rhino-29-118", "Rhino — 29-inch 11.8mm Carbon Pool Cue Single Shaft", 199, 229, ASSETS.shafts, ROUTES.shafts],
      ["rhino-29-125", "Rhino — 29-inch 12.5mm Carbon Pool Cue Single Shaft", 199, 229, ASSETS.shafts, ROUTES.shafts],
      ["nebula-carbon", "Rhino Nebula Carbon Pool Cue", 299, 349, ASSETS.nebulaCard, "pages/product-nebula-carbon-cue.html"],
      ["retro-set", "Retro II Carbon Cue Set", 329, 369, ASSETS.retroCard, "pages/product-retro-ii-carbon-set.html"],
      ["z-fusion", "Z Fusion Limited Pool Cue", 319, 359, ASSETS.poolCues, ROUTES.cues],
      ["carbon-break", "Rhino Carbon Break Cue", 249, 289, ASSETS.breakPowerProduct, "pages/product-rhino-carbon-break-cue.html"],
      ["nebula-bundle", "Nebula Pro Player Bundle", 359, 419, ASSETS.nebulaCard, "pages/product-nebula-pro-bundle.html"],
      ["shaft-starter", "Carbon Shaft Starter Bundle", 279, 319, ASSETS.accessories, "pages/product-carbon-shaft-starter-bundle.html"]
    ],
    new: [
      ["nebula-competition", "Nebula Competition Carbon Cue", 329, 379, ASSETS.nebulaCard, "pages/collection-pool-cues.html"],
      ["retro-signature", "Retro II Signature Cue", 349, 399, ASSETS.retroCard, "pages/product-retro-ii-carbon-set.html"],
      ["z-fusion-custom", "Z Fusion Custom Pool Cue", 319, 359, ASSETS.poolCues, ROUTES.cues],
      ["tournament-starter", "Rhino Tournament Starter Kit", 299, 329, ASSETS.accessories, "pages/collection-first-carbon-cue.html"],
      ["break-power", "Carbon Break Power Cue", 249, 289, ASSETS.breakPowerProduct, "pages/collection-break-cues.html"],
      ["luk-uni", "LUK Uni Carbon Shaft", 209, 239, ASSETS.shafts, ROUTES.shafts],
      ["luk-radial", "LUK Radial Carbon Shaft", 219, 249, ASSETS.shafts, ROUTES.shafts],
      ["nitro-38", "Nitro 3/8 Carbon Shaft", 229, 259, ASSETS.shafts, ROUTES.shafts],
      ["z-fusion-emerald", "Z Fusion Emerald Cue", 329, 379, ASSETS.poolCues, ROUTES.cues],
      ["retro-competition", "Retro II Competition Set", 369, 419, ASSETS.retroCard, "pages/product-retro-ii-carbon-set.html"]
    ],
    offers: [
      ["first-carbon-bundle", "Complete First Carbon Cue Bundle", 299, 369, ASSETS.firstCueProduct, "pages/collection-first-carbon-cue.html"],
      ["shaft-upgrade-bundle", "Shaft Upgrade Limited Bundle", 219, 279, ASSETS.upgradeShaftProduct, "pages/collection-upgrade-my-shaft.html"],
      ["butt-builder", "Cue Butt Builder Special", 189, 239, ASSETS.shopButtsProduct, ROUTES.butts],
      ["break-jump-duo", "Break and Jump Power Duo", 399, 479, ASSETS.jumpCues, "pages/product-break-jump-power-duo.html"],
      ["nebula-pack", "Nebula Player Pack", 309, 369, ASSETS.nebulaCard, "pages/collection-pool-cues.html"],
      ["retro-offer", "Retro II Signature Offer", 339, 399, ASSETS.retroCard, "pages/product-retro-ii-carbon-set.html"],
      ["z-fusion-offer", "Z Fusion Custom Offer", 299, 359, ASSETS.poolCues, ROUTES.cues],
      ["shaft-double", "Carbon Shaft Double Pack", 379, 458, ASSETS.shafts, ROUTES.shafts],
      ["tournament-set", "Tournament Essentials Set", 289, 349, ASSETS.accessories, "pages/collection-cases.html"],
      ["break-limited", "Break Power Limited Set", 369, 449, ASSETS.breakPowerProduct, "pages/collection-break-cues.html"]
    ]
  },
  benefits: [
    { icon: "i-box", title: "Factory-direct value", description: "Premium carbon equipment without traditional dealer markups.", video: "assets/videos/trust/vid-factory-direct-carbon-benefit-01.mp4" },
    { icon: "i-star", title: "Performance you can trust", description: "Reliable straightness, feel and consistency from cue to cue.", video: "assets/videos/trust/vid-performance-trust-benefit-01.mp4" },
    { icon: "i-shield", title: "Built to a higher standard", description: "Quality materials and consistent construction you can trust.", video: "assets/videos/trust/vid-higher-standard-benefit-01.mp4" },
    { icon: "i-exchange", title: "Easy exchange", description: "Get the right fit with straightforward exchange support.", video: "assets/videos/trust/vid-easy-exchange-benefit-01.mp4" }
  ],
  setups: [
    { id: "setup-first", title: "First cue setup", hook: "START STRONG. SKIP THE GUESSWORK.", subtitle: "A complete first carbon setup for players ready to build consistent fundamentals.", price: 299, oldPrice: 329, image: ASSETS.setupFirstHook, hookImage: ASSETS.setupFirstHook, detailImage: ASSETS.setupFirstDetail, url: "pages/collection-first-carbon-cue.html", items: ["Full carbon cue", "Pure glove", "1× cue case", "Performance chalk"] },
    { id: "setup-league", title: "League night setup", hook: "WALK IN READY FOR THE SET.", subtitle: "Balanced equipment and protection for dependable weekly competition.", price: 329, oldPrice: 369, image: ASSETS.setupLeagueHook, hookImage: ASSETS.setupLeagueHook, detailImage: ASSETS.setupLeagueDetail, url: "pages/collection-pool-cues.html", items: ["Full carbon cue", "Pure glove", "1× hard cue case", "Performance chalk"] },
    { id: "setup-shaft", title: "Shaft upgrade setup", hook: "CHANGE THE FEEL. KEEP YOUR BUTT.", subtitle: "A focused performance upgrade without rebuilding your complete cue.", price: 299, oldPrice: 329, image: ASSETS.setupShaftHook, hookImage: ASSETS.setupShaftHook, detailImage: ASSETS.setupShaftDetail, url: "pages/collection-upgrade-my-shaft.html", items: ["Carbon shaft", "Pure glove", "Joint protector", "Performance chalk"] },
    { id: "setup-tournament", title: "Tournament setup", hook: "PACK FOR THE LONG RUN.", subtitle: "A protected, competition-ready system for travel and pressure matches.", price: 399, oldPrice: 449, image: ASSETS.setupTournamentHook, hookImage: ASSETS.setupTournamentHook, detailImage: ASSETS.setupTournamentDetail, url: "pages/collection-cases.html", items: ["Playing cue", "Break cue", "2× cue case", "Glove and chalk"] },
    { id: "setup-break", title: "Break & jump setup", hook: "OWN THE FIRST AND HARDEST SHOT.", subtitle: "Purpose-built power and control for breaks, jumps and tactical recovery.", price: 379, oldPrice: 429, image: ASSETS.setupBreakHook, hookImage: ASSETS.setupBreakHook, detailImage: ASSETS.setupBreakDetail, url: "pages/collection-break-power.html", items: ["Carbon break cue", "Compact jump cue", "Joint protectors", "Break chalk"] }
  ],
  collections: [
    { eyebrow: "Just dropped", title: "Retro II", description: "Classic detail meets refined carbon performance in a competition-ready series.", desktop: ASSETS.retroDesktop, mobile: ASSETS.retroMobile, alt: "Retro II carbon cue collection", url: "pages/product-retro-ii-carbon-set.html", theme: "warm" },
    { eyebrow: "Player favorite", title: "Nebula", description: "A cosmic color story built around consistent control and confident play.", desktop: ASSETS.nebulaDesktop, mobile: ASSETS.nebulaMobile, alt: "Nebula carbon cue collection", url: "pages/product-nebula-carbon-cue.html", theme: "cosmic" },
    { eyebrow: "Signature performance", title: "Z Fusion", description: "Distinctive finishes, carbon construction and a profile made to stand out.", desktop: ASSETS.zFusionDesktop, mobile: ASSETS.zFusionMobile, alt: "Z Fusion cue collection", url: "pages/product-z-fusion-limited.html", theme: "electric" }
  ],
  reviews: [
    { customer: "John Forde", product: "Rhino 30-inch 12.5mm Carbon Shaft", rating: 5, text: "The hit feels clean and predictable. It settled into my game quickly and the lower deflection is easy to trust.", image: ASSETS.shafts, alt: "Rhino carbon shaft", url: "pages/product-rhino-30-125.html#review-rhino-30-125" },
    { customer: "Robert M.", product: "Z Fusion Limited Pool Cue", rating: 5, text: "The finish looks even better in person. Straight, solid and comfortable through long practice sessions.", image: ASSETS.poolCues, alt: "Z Fusion pool cue", url: "pages/product-z-fusion-limited.html#review-z-fusion-limited" },
    { customer: "Donald Jones", product: "Rhino Nebula Carbon Pool Cue", rating: 5, text: "Arrived well packed and ready to play. The balance feels natural and the colors get attention every league night.", image: ASSETS.nebulaCard, alt: "Nebula carbon pool cue", url: "pages/product-nebula-carbon-cue.html#review-nebula-carbon-cue" },
    { customer: "Marcus Lee", product: "Rhino Carbon Break Cue", rating: 4, text: "Plenty of power without feeling difficult to control. My cue-ball placement on the break has become more consistent.", image: ASSETS.breakPowerProduct, alt: "Rhino carbon break cue", url: "pages/product-rhino-carbon-break-cue.html#review-rhino-carbon-break-cue" },
    { customer: "Sarah K.", product: "Retro II Carbon Cue Set", rating: 5, text: "A complete setup that feels considered from cue to case. I was able to take it straight to a tournament weekend.", image: ASSETS.retroCard, alt: "Retro II carbon cue set", url: "pages/product-retro-ii-carbon-set.html#review-retro-ii-carbon-set" },
    { customer: "Daniel Cruz", product: "Carbon Shaft Starter Bundle", rating: 5, text: "Everything I needed for the upgrade was in one package. The shaft response is crisp and the accessories are useful.", image: ASSETS.accessories, alt: "Carbon shaft starter bundle", url: "pages/product-carbon-shaft-starter-bundle.html#review-carbon-shaft-starter-bundle" },
    { customer: "Tina Walker", product: "Nebula Pro Player Bundle", rating: 5, text: "The bundle removed the guesswork. Every piece works together and the cue has stayed consistent across different tables.", image: ASSETS.nebulaCard, alt: "Nebula Pro Player Bundle", url: "pages/product-nebula-pro-bundle.html#review-nebula-pro-bundle" },
    { customer: "Alex Nguyen", product: "Break and Jump Power Duo", rating: 4, text: "The jump cue gets up cleanly and the break cue transfers power well. A practical pair for competitive play.", image: ASSETS.jumpCues, alt: "Break and jump cue duo", url: "pages/product-break-jump-power-duo.html#review-break-jump-power-duo" }
  ],
  guides: [
    { featured: true, category: "Editor's guide", title: "How to choose the right shaft", subtitle: "Diameter, taper, joint and feel — explained in one practical framework.", description: "Build a shaft shortlist around the way you actually deliver the cue instead of choosing from specifications alone.", image: ASSETS.guideShaft, alt: "Guide to choosing a carbon shaft", url: "pages/blog-how-to-choose-the-right-shaft.html", cta: "EXPLORE THE GUIDE" },
    { category: "Comparison", title: "Carbon vs wood", subtitle: "Two materials, two distinct playing experiences.", description: "Compare feedback, deflection and care before your next upgrade.", image: ASSETS.guideCarbonWood, alt: "Carbon shaft beside a wood shaft", url: "pages/blog-carbon-vs-wood-shaft.html", cta: "READ MORE" },
    { category: "Compatibility", title: "Understanding joint types", subtitle: "Get the connection right before you buy.", description: "Recognize common joints and measure your current setup correctly.", image: ASSETS.guideJoints, alt: "Common pool cue joint types", url: "pages/blog-understanding-joint-types.html", cta: "VIEW DETAILS" },
    { category: "Care", title: "Cue care checklist", subtitle: "Keep your equipment straight, clean and match-ready.", description: "A simple routine for shafts, tips, joints and cases.", image: ASSETS.guideCare, alt: "Cue maintenance accessories", url: "pages/blog-cue-care-checklist.html", cta: "READ THE CHECKLIST" },
    { category: "Technique", title: "Choosing the right cue tip", subtitle: "Match tip feel and response to your stroke.", description: "Understand hardness, diameter and maintenance before replacing your tip.", image: ASSETS.guideCueTip, alt: "Close view of a pool cue tip", url: "pages/blog.html", cta: "READ MORE" }
  ],
  footer: {
    Shop: [["All cues", ROUTES.cues], ["Shafts", ROUTES.shafts], ["Butts", ROUTES.butts], ["Break & jump cues", "pages/collection-break-power.html"], ["Accessories", ROUTES.accessories], ["New arrivals", "pages/collection-first-carbon-cue.html"]],
    Support: [["About us", "pages/services.html#our-story"], ["Refund & exchange", "pages/services.html#warranty"], ["Shipping policy", "pages/services.html"], ["Warranty", "pages/services.html#warranty"], ["FAQ", "pages/services.html#compatibility"], ["Contact us", "pages/services.html#contact"]],
    Resources: [["Buying guide", ROUTES.resources], ["Cue finder", "pages/collection-difficult-shots.html"], ["Joint compatibility", "pages/blog-understanding-joint-types.html"], ["Cue building guide", "pages/blog-how-to-choose-the-right-shaft.html"], ["Blog", "pages/blog.html"], ["Videos", "pages/services.html"]]
  }
};

const CURRENCY = {
  USD: { rate: 1, locale: "en-US", currency: "USD" },
  VND: { rate: 26150, locale: "vi-VN", currency: "VND" },
  CNY: { rate: 7.18, locale: "zh-CN", currency: "CNY" },
  EUR: { rate: .86, locale: "fr-FR", currency: "EUR" },
  KRW: { rate: 1390, locale: "ko-KR", currency: "KRW" },
  JPY: { rate: 156, locale: "ja-JP", currency: "JPY" }
};

const state = {
  currency: readCurrency(),
  cart: readStorage("cuebotsHomeCart", []),
  wishlist: readStorage("cuebotsHomeWishlist", {}),
  activeProducts: "best",
  heroIndex: 0,
  reviewIndex: 0,
  setupIndex: 0,
  collectionIndex: 0,
  lastFocus: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function readTextStorage(key, fallback) {
  try { return localStorage.getItem(key) || fallback; }
  catch (error) { return fallback; }
}

function readCurrency() {
  try {
    const value = sessionStorage.getItem("cuebotsCurrency") || "USD";
    return CURRENCY[value] ? value : "USD";
  } catch (error) { return "USD"; }
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed : fallback;
    if (fallback && typeof fallback === "object") return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
    return parsed ?? fallback;
  } catch (error) { return fallback; }
}

function saveState() {
  try {
    sessionStorage.setItem("cuebotsCurrency", state.currency);
    localStorage.setItem("cuebotsHomeCart", JSON.stringify(state.cart));
    localStorage.setItem("cuebotsHomeWishlist", JSON.stringify(state.wishlist));
  } catch (error) { /* The page remains usable when storage is unavailable. */ }
}

const MONEY_FORMATTERS = Object.fromEntries(Object.entries(CURRENCY).map(([key, config]) => [key, new Intl.NumberFormat(config.locale, { style: "currency", currency: config.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })]));

function roundDisplayMoney(value) {
  const amount = Math.round(Math.max(0, Number(value) || 0));
  if (amount < 1000) return amount;
  const step = Math.pow(10, Math.max(0, String(amount).length - 3));
  return Math.floor(amount / step) * step;
}

function money(value) {
  const key = CURRENCY[state.currency] ? state.currency : "USD";
  const config = CURRENCY[key];
  const roundedValue = roundDisplayMoney(value * config.rate);
  return MONEY_FORMATTERS[key].format(roundedValue);
}

function imageMarkup(src, alt, options = {}) {
  const loading = options.eager ? "eager" : "lazy";
  return `<span class="image-shell"><img src="${src}" width="${options.width || 1200}" height="${options.height || 1200}" alt="${alt}" loading="${loading}" decoding="async"></span>`;
}

function productFromRow(row) {
  const [id, name, price, oldPrice, image, url] = row;
  return { id, name, price, oldPrice, image, url: DETAIL_ROUTES[id] || sharedProductDetailUrl(id, name, price, oldPrice, image), collectionUrl: url, description: "Performance equipment engineered for a consistent, confident stroke." };
}

let productCatalog;

function allProducts() {
  if (productCatalog) return productCatalog;
  const map = new Map();
  Object.values(pageData.products).flat().map(productFromRow).forEach(product => map.set(product.id, product));
  pageData.setups.forEach(setup => map.set(setup.id, { ...setup, name: setup.title, description: setup.subtitle, url: setup.url }));
  productCatalog = [...map.values()];
  return productCatalog;
}

function findProduct(id) { return allProducts().find(item => item.id === id); }

function renderNavigation() {
  const desktopMarkup = `<div class="nav-item"><a class="nav-link" href="index.html" aria-current="page">Home</a></div>` + NAVIGATION.map(item => {
    const menuId = `mega-${item.label.toLowerCase()}`;
    const tabs = item.groups.map((group, index) => `<button class="mega-menu-tab${index === 0 ? " active" : ""}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="${menuId}-panel-${index}" data-mega-panel-index="${index}"><span>${group.title}</span><span aria-hidden="true">→</span></button>`).join("");
    const panels = item.groups.map((group, groupIndex) => {
      const images = MEGA_VISUALS[item.label][groupIndex];
      const promo = MEGA_PROMOTIONS[item.label][groupIndex];
      const cards = group.links.map(([label, url], linkIndex) => `<a class="mega-visual-card" href="${url}"><span class="mega-visual-media"><img src="${images[linkIndex]}" width="500" height="300" alt="" loading="lazy" decoding="async"></span><span class="mega-visual-label">${label}<span aria-hidden="true">→</span></span></a>`).join("");
      return `<section class="mega-menu-panel${groupIndex === 0 ? " active" : ""}" id="${menuId}-panel-${groupIndex}" role="tabpanel" data-mega-panel="${groupIndex}"${groupIndex === 0 ? "" : " hidden"}><div class="mega-panel-title"><span>${group.title}</span><a href="${item.url}">VIEW ALL <span aria-hidden="true">→</span></a></div><div class="mega-visual-grid">${cards}<a class="mega-promo-card" href="${promo[2]}"><img src="${promo[3]}" width="500" height="600" alt="" loading="lazy" decoding="async"><span><small>${promo[0]}</small><strong>${promo[1]}</strong><b>EXPLORE <span aria-hidden="true">→</span></b></span></a></div></section>`;
    }).join("");
    const dropdown = `<div class="nav-dropdown mega-menu" id="${menuId}" aria-label="${item.label} mega menu"><div class="mega-menu-shell"><aside class="mega-menu-sidebar"><small>EXPLORE ${item.label.toUpperCase()}</small><div class="mega-menu-tabs" role="tablist" aria-label="${item.label} navigation groups">${tabs}</div><a class="mega-menu-view-all" href="${item.url}">VIEW ALL ${item.label.toUpperCase()} <span aria-hidden="true">→</span></a></aside><div class="mega-menu-content">${panels}</div></div></div>`;
    return `<div class="nav-item has-dropdown"><a class="nav-link" href="${item.url}" aria-haspopup="true" aria-expanded="false" aria-controls="mega-${item.label.toLowerCase()}" data-mega-trigger${item.current ? ' aria-current="page"' : ""}>${item.label}</a>${dropdown}</div>`;
  }).join("");
  const mobileMarkup = `<a class="mobile-nav-card" href="index.html" aria-current="page"><img src="assets/images/heroes/hero-carbon-pool-shaft-desktop-01.webp" width="500" height="300" alt="" loading="lazy"><span><strong>Home</strong><small>RETURN →</small></span></a>` + NAVIGATION.map(item => `<a class="mobile-nav-card" href="${item.url}"${item.current ? ' aria-current="page"' : ""}><img src="${MEGA_VISUALS[item.label][0][0]}" width="500" height="300" alt="" loading="lazy"><span><strong>${item.label}</strong><small>EXPLORE →</small></span></a>`).join("");
  $("[data-desktop-nav]").innerHTML = desktopMarkup;
  $("[data-mobile-nav]").innerHTML = mobileMarkup;
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
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      panels.forEach((panel, panelIndex) => {
        const selected = panelIndex === index;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("mouseenter", () => selectPanel(index));
      tab.addEventListener("focus", () => selectPanel(index));
      tab.addEventListener("click", () => selectPanel(index));
      tab.addEventListener("keydown", event => {
        if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowDown") next = (index + 1) % tabs.length;
        if (event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        tabs[next].focus();
      });
    });
    item.addEventListener("mouseenter", () => openItem(item));
    item.addEventListener("mouseleave", () => closeItem(item));
    item.addEventListener("focusin", () => openItem(item));
    item.addEventListener("focusout", () => requestAnimationFrame(() => {
      if (!item.contains(document.activeElement)) closeItem(item);
    }));
    trigger.addEventListener("keydown", event => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openItem(item);
        $("a", menu)?.focus();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeItem(item);
      }
    });
    menu.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeItem(item);
      trigger.focus();
    });
  });
  document.addEventListener("pointerdown", event => {
    if (!event.target.closest(".desktop-nav")) items.forEach(closeItem);
  });
}

function renderStaticSections() {
  $("[data-trust-list]").innerHTML = pageData.trust.map(item => `<div class="trust-item"><svg class="icon" aria-hidden="true"><use href="#${item.icon}"></use></svg><span>${item.label}</span></div>`).join("");

  $("[data-category-list]").innerHTML = pageData.categories.map(item => `<a class="category-card" href="${item.url}">${imageMarkup(item.image, item.alt)}<h3>${item.name}</h3></a>`).join("");

  $("#intentRail").innerHTML = pageData.intents.map(item => `<a class="intent-card" href="${item.url}">${imageMarkup(item.image, item.alt, { width: 1200, height: 1500 })}<span class="intent-copy"><h3>${item.title}</h3><p>${item.description}</p><span>SHOP NOW →</span></span></a>`).join("");

  $("[data-benefit-list]").innerHTML = pageData.benefits.map((item, index) => `<button class="benefit-card-compact" type="button" data-benefit-video-index="${index}" aria-haspopup="dialog"><span class="benefit-icon"><svg class="icon" aria-hidden="true"><use href="#${item.icon}"></use></svg></span><span class="benefit-card-content"><span class="benefit-title">${item.title}</span><span class="benefit-description">${item.description}</span></span></button>`).join("");

  renderSetup(false);

  renderCollections(false);

  $("[data-guide-list]").innerHTML = pageData.guides.map(item => `<article class="guide-story${item.featured ? " guide-featured" : ""}"><a class="guide-media" href="${item.url}" aria-label="Read ${item.title}">${imageMarkup(item.image, item.alt, item.featured ? { width: 1200, height: 1200 } : { width: 1000, height: 1250 })}</a><div class="guide-copy"><p class="eyebrow">${item.category}</p><h3><a href="${item.url}">${item.title}</a></h3><h4>${item.subtitle}</h4><p>${item.description}</p><a class="text-link" href="${item.url}">${item.cta} →</a></div></article>`).join("");

  $("[data-footer-links]").innerHTML = Object.entries(pageData.footer).map(([title, links]) => `<section class="footer-column"><h2>${title.toUpperCase()}</h2><ul>${links.map(([label, url]) => `<li><a href="${url}">${label}</a></li>`).join("")}</ul></section>`).join("");
}

let setupRenderTimer;

function renderSetup(animate = true) {
  const item = pageData.setups[state.setupIndex];
  const root = $("[data-setup-list]");
  if (animate) root.classList.add("is-changing");
  const update = () => {
    root.innerHTML = `<article class="setup-master"><div class="setup-hook-media">${imageMarkup(item.hookImage, `${item.title} setup banner`, { width: 1200, height: 1200 })}</div><div class="setup-master-copy"><div><h3>${item.title}</h3><p class="price">${money(item.price)} <del>${money(item.oldPrice)}</del></p></div><a class="btn" href="${item.url}">VIEW SETUP</a></div></article><aside class="setup-detail"><div class="setup-detail-media">${imageMarkup(item.detailImage, `All products included in ${item.title}`, { width: 1500, height: 1200 })}</div><div class="setup-navigation" aria-label="Recommended setup navigation"><button class="icon-btn" type="button" data-setup-step="-1" aria-label="Previous setup"><svg class="icon"><use href="#i-chevron-left"></use></svg></button><div class="setup-dots" data-setup-dots aria-label="Choose a setup"></div><span class="rail-count" data-setup-count>1 / ${pageData.setups.length}</span><button class="icon-btn" type="button" data-setup-step="1" aria-label="Next setup"><svg class="icon"><use href="#i-chevron-right"></use></svg></button></div></aside>`;
    $("[data-setup-count]").textContent = `${state.setupIndex + 1} / ${pageData.setups.length}`;
    $("[data-setup-dots]").innerHTML = pageData.setups.map((setup, index) => `<button class="setup-dot${index === state.setupIndex ? " active" : ""}" type="button" data-setup-index="${index}" aria-label="Show ${setup.title}" aria-current="${index === state.setupIndex}">${index + 1}</button>`).join("");
    wireImageFallbacks(root);
    requestAnimationFrame(() => root.classList.remove("is-changing"));
  };
  clearTimeout(setupRenderTimer);
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) setupRenderTimer = setTimeout(update, 130);
  else update();
}

function changeSetup(step, directIndex = null) {
  const total = pageData.setups.length;
  state.setupIndex = directIndex === null ? (state.setupIndex + step + total) % total : directIndex;
  renderSetup();
}

function renderCollections(animate = true) {
  const root = $("[data-collection-list]");
  if (root.children.length !== pageData.collections.length) {
    root.innerHTML = pageData.collections.map((item, index) => `<article class="collection-slide theme-${item.theme}" aria-hidden="true"><picture class="collection-slide-media"><source media="(max-width: 767px)" srcset="${item.mobile}"><img src="${item.desktop}" width="1920" height="1080" alt="${item.alt}" loading="lazy" decoding="async"></picture><div class="container collection-slide-copy"><p class="eyebrow">${item.eyebrow}</p><h3>${item.title}</h3><p>${item.description}</p><a class="btn" href="${item.url}">EXPLORE COLLECTION</a></div></article>`).join("");
    $("[data-collection-dots]").innerHTML = pageData.collections.map((item, index) => `<button class="collection-dot" type="button" data-collection-index="${index}" aria-label="Show ${item.title}" aria-current="false"></button>`).join("");
    wireImageFallbacks(root);
  }
  $$(".collection-slide", root).forEach((slide, index) => {
    const active = index === state.collectionIndex;
    slide.classList.toggle("active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  $$('[data-collection-index]').forEach((dot, index) => {
    const active = index === state.collectionIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", String(active));
  });
  $("[data-collection-count]").textContent = `${state.collectionIndex + 1} / ${pageData.collections.length}`;
}

function changeCollection(step, directIndex = null, manual = false) {
  const total = pageData.collections.length;
  state.collectionIndex = directIndex === null ? (state.collectionIndex + step + total) % total : directIndex;
  renderCollections();
  if (manual) scheduleCollectionAuto(8000);
}

function updateHero() {
  const slides = $$(".hero-slide");
  if (!slides.length) return;
  state.heroIndex = (state.heroIndex + slides.length) % slides.length;
  slides.forEach((slide, index) => {
    const active = index === state.heroIndex;
    slide.classList.toggle("active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  $$('[data-hero-index]').forEach((dot, index) => {
    const active = index === state.heroIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", String(active));
  });
}

function changeHero(step, directIndex = null, manual = false) {
  const total = $$(".hero-slide").length;
  if (!total) return;
  state.heroIndex = directIndex === null ? (state.heroIndex + step + total) % total : directIndex;
  updateHero();
  if (manual) scheduleHeroAuto(8000);
}

function renderProducts(group = state.activeProducts) {
  state.activeProducts = group;
  const products = pageData.products[group].map(productFromRow);
  $("[data-product-list]").innerHTML = products.map(product => `<article class="product-card"><div class="product-media"><a class="product-image-trigger" href="${product.url}" aria-label="View details for ${product.name}">${imageMarkup(product.image, product.name)}</a><span class="product-badge">${group === "new" ? "New" : group === "offers" ? "Offer" : "Popular"}</span><button class="icon-btn wishlist-btn${state.wishlist[product.id] ? " active" : ""}" type="button" aria-label="${state.wishlist[product.id] ? "Remove" : "Add"} ${product.name} ${state.wishlist[product.id] ? "from" : "to"} wishlist" aria-pressed="${Boolean(state.wishlist[product.id])}" data-wishlist="${product.id}"><svg class="icon"><use href="#i-heart"></use></svg></button></div><div class="product-body"><h3>${product.name}</h3><p class="price">${money(product.price)} <del>${money(product.oldPrice)}</del></p><div class="product-actions"><button class="btn" type="button" data-add-cart="${product.id}">QUICK ADD</button><button class="btn btn-secondary" type="button" data-quick-product="${product.id}">QUICK VIEW</button></div></div></article>`).join("");
  const panel = $("#product-panel");
  const activeTab = $(`[data-product-tab="${group}"]`);
  panel.setAttribute("aria-labelledby", activeTab.id);
  const viewAll = $("[data-product-view-all]");
  const viewAllRoutes = { best: ["VIEW ALL BEST SELLERS", "pages/collection-pool-cues.html"], new: ["VIEW ALL NEW ARRIVALS", "pages/collection-first-carbon-cue.html"], offers: ["VIEW ALL EXCLUSIVE OFFERS", "pages/collection-break-power.html"] };
  viewAll.firstChild.textContent = `${viewAllRoutes[group][0]} `;
  viewAll.href = viewAllRoutes[group][1];
  const rail = $("#productRail");
  rail.scrollLeft = 0;
  wireImageFallbacks(rail);
  updateRail(rail);
}

function renderReviews() {
  $("[data-review-list]").innerHTML = pageData.reviews.map(item => `<a class="review-card review-card-link" href="${item.url}" aria-label="Read ${item.customer}'s review for ${item.product}"><span class="review-product-image">${imageMarkup(item.image, item.alt)}</span><span class="review-stars" aria-label="${item.rating} out of 5 stars">${Array.from({ length: 5 }, (_, index) => `<svg class="icon${index >= item.rating ? " empty" : ""}" aria-hidden="true"><use href="#i-star"></use></svg>`).join("")}</span><blockquote>“${item.text}”</blockquote><strong>${item.customer}</strong><span class="review-product-name">${item.product}</span></a>`).join("");
  $("[data-review-dots]").innerHTML = pageData.reviews.map((_, index) => `<button class="review-dot${index === state.reviewIndex ? " active" : ""}" type="button" aria-label="Show review ${index + 1}" aria-current="${index === state.reviewIndex ? "true" : "false"}" data-review-index="${index}"></button>`).join("");
  wireImageFallbacks($("[data-review-list]"));
  updateReviews(false);
}

function visibleReviews() {
  if (matchMedia("(max-width: 479px)").matches) return 1;
  if (matchMedia("(max-width: 767px)").matches) return 2;
  if (matchMedia("(max-width: 1180px)").matches) return 3;
  if (matchMedia("(max-width: 1439px)").matches) return 4;
  return 6;
}

function updateReviews(animate = true) {
  const visible = visibleReviews();
  const maxIndex = Math.max(0, pageData.reviews.length - visible);
  state.reviewIndex = Math.min(state.reviewIndex, maxIndex);
  const track = $("[data-review-list]");
  if (!animate) track.style.transition = "none";
  track.style.transform = `translateX(-${state.reviewIndex * (100 / visible)}%)`;
  if (!animate) requestAnimationFrame(() => { track.style.transition = ""; });
  $("[data-review-count]").textContent = `${state.reviewIndex + 1} / ${pageData.reviews.length}`;
  $$('[data-review-step]').forEach(button => { button.disabled = false; });
  $$("[data-review-index]").forEach((dot, index) => {
    const current = index === state.reviewIndex;
    dot.classList.toggle("active", current);
    dot.setAttribute("aria-current", String(current));
    dot.hidden = index > maxIndex;
  });
}

function changeReview(step, manual = false) {
  const maxIndex = Math.max(0, pageData.reviews.length - visibleReviews());
  const next = state.reviewIndex + step;
  state.reviewIndex = next > maxIndex ? 0 : next < 0 ? maxIndex : next;
  updateReviews();
  if (manual) pauseReviewAuto(10000);
}

let reviewAutoTimer;
let reviewResumeTimer;
let heroAutoTimer;
let heroResumeTimer;
let collectionAutoTimer;
let collectionResumeTimer;

function startReviewAuto() {
  clearInterval(reviewAutoTimer);
  clearTimeout(reviewResumeTimer);
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  reviewAutoTimer = setInterval(() => changeReview(1), 3000);
}

function pauseReviewAuto(delay = 10000) {
  clearInterval(reviewAutoTimer);
  clearTimeout(reviewResumeTimer);
  reviewResumeTimer = setTimeout(startReviewAuto, delay);
}

function startHeroAuto() {
  clearInterval(heroAutoTimer);
  clearTimeout(heroResumeTimer);
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  heroAutoTimer = setInterval(() => changeHero(1), 5000);
}

function scheduleHeroAuto(delay = 8000) {
  clearInterval(heroAutoTimer);
  clearTimeout(heroResumeTimer);
  heroResumeTimer = setTimeout(startHeroAuto, delay);
}

function startCollectionAuto() {
  clearInterval(collectionAutoTimer);
  clearTimeout(collectionResumeTimer);
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  collectionAutoTimer = setInterval(() => changeCollection(1), 5000);
}

function scheduleCollectionAuto(delay = 8000) {
  clearInterval(collectionAutoTimer);
  clearTimeout(collectionResumeTimer);
  collectionResumeTimer = setTimeout(startCollectionAuto, delay);
}

function wireSwipe(element, onLeft, onRight, onInteract) {
  let startX = 0;
  let startY = 0;
  let tracking = false;
  element.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX = event.clientX;
    startY = event.clientY;
    tracking = true;
  });
  element.addEventListener("pointerup", event => {
    if (!tracking) return;
    tracking = false;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) onLeft(); else onRight();
    onInteract?.();
  });
  element.addEventListener("pointercancel", () => { tracking = false; });
}

const FREE_SHIPPING_THRESHOLD = 99;

function cartSku(id) {
  return `CB-${String(id || "ITEM").replace(/[^a-z0-9]+/gi, "-").toUpperCase()}`;
}

function cartVariant(item, product = {}) {
  if (item.variant) return item.variant;
  const name = `${item.name || product.name || ""}`;
  const glove = name.match(/Glove[^—]*—\s*(Left|Right) Hand\s*\/\s*([A-Za-z]+)/i);
  if (glove) return `Pure ${glove[2]} / ${glove[1]} Hand / Size M`;
  if (/shaft/i.test(name)) return "Carbon shaft / Standard joint selection";
  if (/break/i.test(name)) return "Break setup / Performance configuration";
  if (/cue|set|bundle/i.test(name)) return "CUEBOTS standard configuration";
  return "Standard product configuration";
}

function renderCart() {
  const body = $("[data-cart-items]");
  if (!state.cart.length) {
    body.innerHTML = `<div class="empty-state"><svg class="icon" aria-hidden="true"><use href="#i-cart"></use></svg><p>Your cart is empty.</p><a class="btn" href="${ROUTES.cues}">SHOP CUES</a></div>`;
  } else {
    const toolbar = state.cart.length >= 2 ? '<div class="cart-list-toolbar"><button class="cart-remove-all" type="button" data-remove-all-cart>Remove all selected</button></div>' : "";
    body.innerHTML = toolbar + state.cart.map(item => {
      const product = findProduct(item.id) || {};
      const name = item.name || product.name || product.title || "CUEBOTS product";
      const price = Number(item.price ?? product.price) || 0;
      const image = item.image || product.image || ASSETS.accessories;
      const sku = item.sku || cartSku(item.id);
      return `<article class="cart-item"><img src="${image}" width="72" height="72" alt=""><div class="cart-item-main"><strong>${name}</strong><span class="cart-item-option">${cartVariant(item, product)}</span><span class="cart-item-option">SKU: ${sku}</span><span class="cart-item-price">${money(price * item.qty)}</span><div class="cart-item-controls"><div class="cart-quantity" aria-label="Quantity for ${name}"><button type="button" data-cart-qty="-1" data-cart-id="${item.id}" aria-label="Decrease ${name} quantity">−</button><output aria-label="Quantity">${item.qty}</output><button type="button" data-cart-qty="1" data-cart-id="${item.id}" aria-label="Increase ${name} quantity">+</button></div><button class="cart-remove-item" type="button" aria-label="Remove ${name} from cart" data-remove-cart="${item.id}"><svg class="icon"><use href="#i-trash"></use></svg></button></div></div></article>`;
    }).join("");
  }
  const count = state.cart.reduce((total, item) => total + item.qty, 0);
  const subtotal = state.cart.reduce((total, item) => total + (Number(item.price ?? findProduct(item.id)?.price) || 0) * item.qty, 0);
  $("[data-cart-count]").textContent = count;
  $("[data-cart-subtotal]").textContent = money(subtotal);
  const shipping = $("[data-shipping-reminder]");
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  shipping.textContent = count === 0 ? `Free shipping on orders over ${money(FREE_SHIPPING_THRESHOLD)}.` : remaining > 0 ? `You're ${money(remaining)} away from free shipping.` : "You've unlocked free shipping.";
  shipping.classList.toggle("unlocked", count > 0 && remaining === 0);
  $("[data-checkout]").disabled = count === 0;
}

function addToCart(id, closeQuick = false) {
  const product = findProduct(id);
  if (!product) return;
  const existing = state.cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, name: product.name || product.title, price: product.price, image: product.image, qty: 1, sku: cartSku(id), variant: cartVariant({}, product) });
  saveState();
  renderCart();
  if (closeQuick) closeSurface($("#quickModal"));
  showToast(`${product.name || product.title} added to your cart.`);
}

function toggleWishlist(id, button) {
  state.wishlist[id] = !state.wishlist[id];
  saveState();
  const product = findProduct(id);
  button.classList.toggle("active", state.wishlist[id]);
  button.setAttribute("aria-pressed", String(Boolean(state.wishlist[id])));
  button.setAttribute("aria-label", `${state.wishlist[id] ? "Remove" : "Add"} ${product.name} ${state.wishlist[id] ? "from" : "to"} wishlist`);
  showToast(`${product.name} ${state.wishlist[id] ? "saved to" : "removed from"} your wishlist.`);
}

function openQuick(id, opener) {
  const product = findProduct(id);
  if (!product) return;
  $("[data-quick-body]").innerHTML = `<div class="quick-grid">${imageMarkup(product.image, product.name || product.title, { eager: true })}<div class="quick-copy"><p class="eyebrow">CUEBOTS PERFORMANCE EQUIPMENT</p><h3>${product.name || product.title}</h3><p>${product.description || product.subtitle}</p>${product.items ? `<ul>${product.items.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}<p class="price">${money(product.price)}${product.oldPrice ? ` <del>${money(product.oldPrice)}</del>` : ""}</p><button class="btn" type="button" data-add-cart="${product.id}" data-close-after-add>ADD TO CART</button><a class="text-link" href="${product.url}">VIEW FULL DETAILS →</a></div></div>`;
  wireImageFallbacks($("[data-quick-body]"));
  openSurface($("#quickModal"), opener);
}

function openBenefitVideo(index, opener) {
  const benefit = pageData.benefits[index];
  const modal = $("#benefitModal");
  const video = $("[data-benefit-video]", modal);
  if (!benefit || !modal || !video) return;
  $("[data-benefit-video-title]", modal).textContent = benefit.title;
  $("[data-benefit-video-description]", modal).textContent = benefit.description;
  video.pause();
  video.querySelector("source").src = benefit.video;
  video.load();
  openSurface(modal, opener);
}

function showToast(message) {
  const toast = $("[data-toast]");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function wireImageFallbacks(root = document) {
  $$(".image-shell img", root).forEach(image => {
    const shell = image.closest(".image-shell");
    const loaded = () => shell.classList.remove("is-missing");
    const failed = () => shell.classList.add("is-missing");
    if (image.complete) image.naturalWidth ? loaded() : failed();
    if (image.dataset.fallbackBound === "true") return;
    image.dataset.fallbackBound = "true";
    image.addEventListener("load", loaded, { once: true });
    image.addEventListener("error", failed, { once: true });
  });
}

function updateRail(rail) {
  if (!rail || !rail.children.length) return;
  const card = rail.children[0];
  const gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
  const step = card.getBoundingClientRect().width + gap;
  const current = Math.min(rail.children.length, Math.max(1, Math.round(rail.scrollLeft / step) + 1));
  const count = $(`[data-rail-count="${rail.id}"]`);
  if (count) count.textContent = `${current} / ${rail.children.length}`;
  const isAtEnd = Math.ceil(rail.scrollLeft + rail.clientWidth) >= rail.scrollWidth - 2;
  rail.classList.toggle("at-end", isAtEnd);
}

function stepRail(id, direction) {
  const rail = document.getElementById(id);
  if (!rail || !rail.children.length) return;
  const card = rail.children[0];
  const gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
  rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
}

function setupRails() {
  $$('[data-rail]').forEach(rail => {
    if (rail.dataset.railBound !== "true") {
      let raf;
      rail.dataset.railBound = "true";
      rail.addEventListener("scroll", () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => updateRail(rail));
      }, { passive: true });
      rail.addEventListener("keydown", event => {
        if (event.key === "ArrowRight") { event.preventDefault(); stepRail(rail.id, 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); stepRail(rail.id, -1); }
      });
    }
    updateRail(rail);
  });
}

function isElementVisible(element) {
  return element instanceof HTMLElement && !element.hidden && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
}

function focusable(surface) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])', surface).filter(isElementVisible);
}

function surfaceTrigger(surface) {
  if (!surface?.id) return null;
  return $$(`[aria-controls="${surface.id}"]`).find(control => !surface.contains(control) && isElementVisible(control)) || null;
}

function activeSurface() {
  return $(".benefit-modal.open") || $(".account-modal.open") || $(".quick-modal.open") || $(".search-dialog.open") || $(".cart-drawer.open") || $(".mobile-drawer.open");
}

function openSurface(surface, opener) {
  if (!surface) return;
  const current = activeSurface();
  let restoreTarget = opener || document.activeElement;
  if (current && current !== surface) {
    const openerWasInsideCurrent = Boolean(opener && current.contains(opener));
    const currentTrigger = surfaceTrigger(current);
    closeSurface(current, false);
    if (openerWasInsideCurrent && currentTrigger) restoreTarget = currentTrigger;
  }
  state.lastFocus = restoreTarget;
  surface.classList.add("open");
  surface.setAttribute("aria-hidden", "false");
  $("[data-overlay]").classList.add("open");
  document.body.classList.add("lock-scroll");
  const expanded = opener && opener.getAttribute("aria-expanded") !== null;
  if (expanded) opener.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => focusable(surface)[0]?.focus());
}

function closeSurface(surface, restore = true) {
  if (!surface) return;
  const restoreTarget = state.lastFocus;
  if (surface.matches(".benefit-modal")) {
    const video = $("[data-benefit-video]", surface);
    video?.pause();
    if (video) video.currentTime = 0;
  }
  surface.classList.remove("open");
  surface.setAttribute("aria-hidden", "true");
  $$('[aria-controls]', document).forEach(control => {
    if (control.getAttribute("aria-controls") === surface.id) control.setAttribute("aria-expanded", "false");
  });
  if (!activeSurface()) {
    $("[data-overlay]").classList.remove("open");
    document.body.classList.remove("lock-scroll");
  }
  if (restore) requestAnimationFrame(() => {
    if (isElementVisible(restoreTarget)) restoreTarget.focus();
    else surfaceTrigger(surface)?.focus();
  });
}

function closeAllSurfaces() {
  const surface = activeSurface();
  if (surface) closeSurface(surface);
}

function trapFocus(event) {
  const surface = activeSurface();
  if (!surface || event.key !== "Tab") return;
  const items = focusable(surface);
  if (!items.length) return;
  const first = items[0];
  const last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function additionalSearchEntries() {
  const gloveColors = ["black", "blue", "grey", "olive", "red"];
  const gloveSingles = gloveColors.flatMap(color => ["left", "right"].map(hand => {
    const colorLabel = color[0].toUpperCase() + color.slice(1);
    const handLabel = hand[0].toUpperCase() + hand.slice(1);
    const name = `Pure Pool Glove — ${handLabel} Hand / ${colorLabel}`;
    const image = `assets/images/products/gloves/prod-pure-pool-glove-${hand}-${color}-1x1-01.webp`;
    return {
      name,
      price: 12,
      image,
      type: "Pool glove",
      description: `${colorLabel} low-friction billiard glove for the ${hand} bridge hand`,
      keywords: `glove gloves pool billiard bridge hand ${hand} ${color} pure performance accessory`,
      url: sharedProductDetailUrl(`pure-glove-${hand}-${color}`, name, 12, 15, image)
    };
  }));
  const glovePacks = [
    ["pure-glove-pack-3-black", "Pure Glove 3-Pack — Black", 30, 36, "prod-pure-pool-glove-pack-3-black-1x1-01.webp"],
    ["pure-glove-pack-3-grey", "Pure Glove 3-Pack — Grey", 30, 36, "prod-pure-pool-glove-pack-3-grey-1x1-01.webp"],
    ["pure-glove-pack-3-olive", "Pure Glove 3-Pack — Olive", 30, 36, "prod-pure-pool-glove-pack-3-olive-1x1-01.webp"],
    ["pure-glove-pack-3-mixed", "Pure Glove 3-Pack — Mixed", 32, 39, "prod-pure-pool-glove-pack-3-mixed-1x1-01.webp"],
    ["pure-glove-pack-5-mixed", "Pure Glove 5-Pack — Full Color", 48, 60, "prod-pure-pool-glove-pack-5-mixed-1x1-01.webp"]
  ].map(([id, name, price, oldPrice, file]) => {
    const image = `assets/images/products/gloves/${file}`;
    return { name, price, image, type: "Glove bundle", description: "Multi-buy pool glove pack", keywords: "glove gloves billiard pool pack bundle multibuy colors accessory", url: sharedProductDetailUrl(id, name, price, oldPrice, image) };
  });
  return [
    { name: "Pool Gloves", price: null, image: "assets/images/collections/thumb-pure-pool-glove-related-5x3-01.webp", type: "Category", description: "Single gloves, colors, hand fit and multi-packs", keywords: "glove gloves pool billiard bridge hand left right size pure performance", url: "pages/collection-gloves.html" },
    { name: "Cue Cases", price: null, image: "assets/images/collections/thumb-cases-related-5x3-01.webp", type: "Category", description: "Protection for cues, shafts and travel", keywords: "case cases cue storage bag travel protection hard soft", url: "pages/collection-cases.html" },
    ...gloveSingles,
    ...glovePacks
  ];
}

function searchRelevance(item, query) {
  const term = normalizeSearch(query);
  const name = normalizeSearch(item.name);
  const context = normalizeSearch(`${item.type} ${item.description || ""} ${item.keywords || ""}`);
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

function renderSearch(query = "") {
  const results = $("[data-search-results]");
  const term = normalizeSearch(query);
  if (!term) {
    let recentlyViewed = [];
    try { recentlyViewed = JSON.parse(localStorage.getItem("cuebotsRecentlyViewed") || "[]"); } catch (error) { recentlyViewed = []; }
    const activityIds = [...recentlyViewed, ...state.cart.map(item => item.id), ...Object.keys(state.wishlist).filter(id => state.wishlist[id])];
    const recommendations = [...activityIds.map(findProduct).filter(Boolean), ...allProducts()].filter((item, index, items) => items.findIndex(candidate => candidate.id === item.id) === index).slice(0, 4);
    results.innerHTML = `<div class="search-discovery"><a class="search-promo" href="pages/collection-first-carbon-cue.html"><img src="assets/images/collections/hero-first-carbon-cue-collection-desktop-01.webp" width="1200" height="420" alt="" loading="lazy" decoding="async"><span><small>PLAYER-READY BUNDLE</small><strong>Start with a complete carbon setup</strong><b>SHOP THE SETUP →</b></span></a><section class="search-suggestions"><div class="search-suggestions-head"><h3>${activityIds.length ? "BASED ON YOUR ACTIVITY" : "YOU MAY ALSO LIKE"}</h3><a href="pages/collection-pool-cues.html">VIEW ALL →</a></div><div class="search-suggestion-row">${recommendations.map(item => `<a href="${item.url}" class="search-suggestion-card"><img src="${item.image}" width="120" height="120" alt="" loading="lazy" decoding="async"><span><strong>${item.name || item.title}</strong><small>${money(item.price)}</small></span></a>`).join("")}</div></section></div>`;
    return;
  }
  const entries = [
    ...pageData.categories.map(item => ({ name: item.name, price: null, url: item.url, image: item.image, type: "Category", description: `Browse the ${item.name} collection`, keywords: `${item.name} shop collection equipment` })),
    ...pageData.intents.map(item => ({ name: item.title, price: null, url: item.url, image: item.image, type: "Shopping guide", description: item.description, keywords: `${item.title} recommendation setup finder` })),
    ...allProducts().map(item => ({ name: item.name || item.title, price: item.price, url: item.url || "pages/collection-first-carbon-cue.html", image: item.image, type: "Product", description: item.description || "CUEBOTS performance equipment", keywords: `${item.id || ""} cue shaft butt break jump case glove accessory bundle setup` })),
    ...additionalSearchEntries()
  ].filter((item, index, items) => items.findIndex(candidate => candidate.name === item.name && candidate.url === item.url) === index)
    .map(item => ({ ...item, score: searchRelevance(item, term) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.name.length - b.name.length || a.name.localeCompare(b.name))
    .slice(0, 8);
  results.innerHTML = entries.length
    ? `<p class="search-summary">${entries.length} best matches</p>${entries.map(item => `<a class="search-result" href="${item.url}"><span class="search-result-thumb"><img src="${item.image}" width="48" height="48" alt="" loading="lazy" decoding="async"></span><span class="search-result-copy"><strong>${item.name}</strong><small>${item.type}${item.description ? ` · ${item.description}` : ""}</small></span>${item.price ? `<span class="search-result-meta">${money(item.price)}</span>` : '<span class="search-result-meta">View</span>'}</a>`).join("")}`
    : '<p class="search-empty">No matching products or categories found.</p>';
}

function setAccountMode(mode = "signin") {
  const signup = mode === "signup";
  $("[data-account-title]").textContent = signup ? "Create your account" : "Account sign in";
  $("[data-account-intro]").textContent = signup ? "Save equipment, track orders and receive more relevant recommendations." : "Enter your account details to continue.";
  $("[data-account-submit]").textContent = signup ? "CREATE ACCOUNT" : "SIGN IN";
  const password = $("#accountPassword");
  password.autocomplete = signup ? "new-password" : "current-password";
  const switcher = $(".account-mode-switch");
  switcher.dataset.accountMode = signup ? "signin" : "signup";
  switcher.textContent = signup ? "Already have an account? Sign in" : "New to CUEBOTS? Create an account";
  $("[data-account-status]").textContent = "";
}

function updateCurrency(value) {
  state.currency = CURRENCY[value] ? value : "USD";
  saveState();
  $$('[data-currency-select]').forEach(select => { select.value = state.currency; });
  renderProducts();
  renderSetup(false);
  renderCart();
}

function init() {
  renderNavigation();
  wireMegaMenus();
  renderStaticSections();
  renderProducts();
  renderReviews();
  renderCart();
  $$('[data-currency-select]').forEach(select => { select.value = state.currency; });
  wireImageFallbacks();
  setupRails();
  updateHero();
  wireSwipe($("[data-hero-slider]"), () => changeHero(1, null, true), () => changeHero(-1, null, true));
  wireSwipe($(".review-window"), () => changeReview(1, true), () => changeReview(-1, true));
  wireSwipe($("[data-collection-list]"), () => changeCollection(1, null, true), () => changeCollection(-1, null, true));
  startReviewAuto();
  startHeroAuto();
  startCollectionAuto();
}

document.addEventListener("click", event => {
  const target = event.target.closest("button, a, [data-overlay]");
  if (!target) return;

  if (target.matches("[data-open-menu]")) openSurface($("#mobileMenu"), target);
  if (target.matches("[data-close-menu]")) closeSurface($("#mobileMenu"));
  if (target.matches("[data-open-search]")) { openSurface($("#searchDialog"), target); renderSearch(); }
  if (target.matches("[data-close-search]")) closeSurface($("#searchDialog"));
  if (target.matches("[data-open-cart]")) openSurface($("#cartDrawer"), target);
  if (target.matches("[data-close-cart]")) closeSurface($("#cartDrawer"));
  if (target.matches("[data-close-quick]")) closeSurface($("#quickModal"));
  if (target.matches("[data-account-mode]")) setAccountMode(target.dataset.accountMode);
  if (target.matches("[data-open-account]")) { setAccountMode(target.dataset.accountMode || "signin"); openSurface($("#accountModal"), target); }
  if (target.matches("[data-close-account]")) closeSurface($("#accountModal"));
  if (target.matches("[data-benefit-video-index]")) openBenefitVideo(Number(target.dataset.benefitVideoIndex), target);
  if (target.matches("[data-close-benefit]")) closeSurface($("#benefitModal"));
  if (target.matches("[data-overlay]")) closeAllSurfaces();
  if (target.matches("[data-clear-search]")) { const input = $("[data-search-input]"); input.value = ""; renderSearch(); input.focus(); }

  if (target.matches("[data-rail-prev]")) stepRail(target.dataset.railPrev, -1);
  if (target.matches("[data-rail-next]")) stepRail(target.dataset.railNext, 1);

  if (target.matches("[data-product-tab]")) {
    const tabs = $$('[data-product-tab]');
    tabs.forEach(tab => {
      const selected = tab === target;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    renderProducts(target.dataset.productTab);
  }

  if (target.matches("[data-wishlist]")) toggleWishlist(target.dataset.wishlist, target);
  if (target.matches("[data-add-cart]")) addToCart(target.dataset.addCart, target.hasAttribute("data-close-after-add"));
  if (target.matches("[data-cart-qty]")) {
    const item = state.cart.find(entry => entry.id === target.dataset.cartId);
    if (item) {
      item.qty += Number(target.dataset.cartQty);
      if (item.qty <= 0) state.cart = state.cart.filter(entry => entry !== item);
      saveState(); renderCart();
    }
  }
  if (target.matches("[data-remove-cart]")) {
    state.cart = state.cart.filter(item => item.id !== target.dataset.removeCart);
    saveState(); renderCart(); showToast("Item removed from your cart.");
  }
  if (target.matches("[data-remove-all-cart]")) {
    state.cart = [];
    saveState(); renderCart(); showToast("Selected items removed from your cart.");
  }
  if (target.matches("[data-quick-product]")) openQuick(target.dataset.quickProduct, target);
  if (target.matches("[data-checkout]")) window.location.href = "pages/checkout.html";
  if (target.matches("[data-review-step]")) changeReview(Number(target.dataset.reviewStep), true);
  if (target.matches("[data-review-index]")) { state.reviewIndex = Number(target.dataset.reviewIndex); updateReviews(); pauseReviewAuto(10000); }
  if (target.matches("[data-hero-index]")) changeHero(0, Number(target.dataset.heroIndex), true);
  if (target.matches("[data-setup-step]")) changeSetup(Number(target.dataset.setupStep));
  if (target.matches("[data-setup-index]")) changeSetup(0, Number(target.dataset.setupIndex));
  if (target.matches("[data-collection-step]")) changeCollection(Number(target.dataset.collectionStep), null, true);
  if (target.matches("[data-collection-index]")) changeCollection(0, Number(target.dataset.collectionIndex), true);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeAllSurfaces();
  trapFocus(event);
});

$$('[data-product-tab]').forEach((tab, index, tabs) => {
  tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    tabs[next].focus(); tabs[next].click();
  });
});

$("[data-search-input]").addEventListener("input", event => renderSearch(event.target.value));

$$('[data-currency-select]').forEach(select => select.addEventListener("change", event => updateCurrency(event.target.value)));

$("[data-newsletter]").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#newsletterEmail");
  const status = $("[data-newsletter-status]");
  status.classList.remove("error");
  if (!input.value.trim() || !input.checkValidity()) {
    input.setAttribute("aria-invalid", "true");
    status.textContent = "Please enter a valid email address.";
    status.classList.add("error");
    input.focus();
    return;
  }
  input.removeAttribute("aria-invalid");
  status.textContent = "Thanks — you're on the list.";
  showToast("Welcome to the CUEBOTS player community.");
  event.currentTarget.reset();
});

$("[data-account-form]").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $("[data-account-status]", form);
  const firstInvalid = $$("input", form).find(input => !input.checkValidity());
  status.classList.remove("error");
  if (firstInvalid) {
    status.textContent = "Please enter a valid email and a password of at least 6 characters.";
    status.classList.add("error");
    firstInvalid.focus();
    return;
  }
  status.textContent = "Account details are ready to submit.";
  showToast("Sign-in form completed.");
});

$$('input', $("[data-account-form]")).forEach(input => input.addEventListener("input", () => {
  const status = $("[data-account-status]");
  status.textContent = "";
  status.classList.remove("error");
}));

$("#newsletterEmail").addEventListener("input", event => {
  event.target.removeAttribute("aria-invalid");
  const status = $("[data-newsletter-status]");
  status.textContent = "";
  status.classList.remove("error");
});

$(".review-window").addEventListener("keydown", event => {
  if (event.key === "ArrowRight") { event.preventDefault(); changeReview(1, true); }
  if (event.key === "ArrowLeft") { event.preventDefault(); changeReview(-1, true); }
});

$("[data-hero-slider]").addEventListener("keydown", event => {
  if (event.key === "ArrowRight") { event.preventDefault(); changeHero(1, null, true); }
  if (event.key === "ArrowLeft") { event.preventDefault(); changeHero(-1, null, true); }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(reviewAutoTimer); clearTimeout(reviewResumeTimer);
    clearInterval(heroAutoTimer); clearTimeout(heroResumeTimer);
    clearInterval(collectionAutoTimer); clearTimeout(collectionResumeTimer);
  }
  else { startReviewAuto(); startHeroAuto(); startCollectionAuto(); }
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { updateReviews(false); $$('[data-rail]').forEach(updateRail); }, 120);
});

init();
