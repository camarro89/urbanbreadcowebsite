/*
 * Urban Bread Co — World Data
 * Single source of truth for the "world of bread" experience: countries
 * (including the three US regions), their stories/ingredients, the map
 * pin positions, and which bread (by id in menu.html's breadsData) came
 * from where.
 *
 * TO ADD A NEW COUNTRY OR REGION:
 *   1. Add an entry to COUNTRIES below (copy an existing "active" one).
 *      mapX/mapY are percentages positioned using a plain equirectangular
 *      projection (x=(lon+180)/360*100, y=(90-lat)/180*100) against a
 *      real city's lat/lon — keeps pins geographically honest.
 *   2. Add a page at /countries/<id>.html (copy countries/germany.html
 *      for a single-bread country, or countries/usa-east.html for a
 *      region with many breads).
 *   3. Add each bread's id from menu.html's breadsData to breadCountry.
 * No other file needs to change — menu.html, the Bread Club builder, and
 * checkout are untouched by any of this.
 */
window.UBC_WORLD = {

  currentlyExploring: "netherlands",

  countries: [
    {
      id: "netherlands", name: "Netherlands", flag: "🇳🇱", status: "active",
      tagline: "Bold caramel. Canal-side bakeries. Sweet nostalgia.",
      cardImage: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
      story: "Dutch baking runs on caramel, spice, and a stubborn sweet tooth — stroopwafels cooling on windowsills, hagelslag on breakfast toast, advocaat poured a little too generously into dessert. When Urban Bread Co. started digging into Dutch flavors, it turned into an entire wing of the menu, seven loaves deep.",
      region: "Northern Europe", lat: 52.37, lon: 4.90,
      addedYear: "2024", blurb: "Added in 2024 — what started as one Stroopwafel-inspired loaf grew into seven Dutch breads.",
      funFact: "🚲 Fun fact: there are more bicycles than people in the Netherlands.",
      ingredients: ["Stroopwafel caramel", "Hazelnut praline", "Dutch chocolate sprinkles", "Advocaat custard", "Brown sugar rum glaze", "Almond paste"]
    },
    {
      id: "el-salvador", name: "El Salvador", flag: "🇸🇻", status: "active",
      tagline: "Sweet cheese, sesame, and Sunday-morning tradition.",
      cardImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      story: "Quesadilla salvadoreña isn't a quesadilla at all — it's a dense, faintly sweet cheese bread found at Salvadoran breakfast tables and bakeries on every corner. It's one of the first international loaves Urban Bread Co. ever baked.",
      region: "Central America", lat: 13.70, lon: -89.20,
      addedYear: "2023", blurb: "One of Urban Bread Co's very first international breads — on the menu since the early days.",
      funFact: "🌋 Fun fact: El Salvador is nicknamed the \"Land of Volcanoes\" — it has over 20 of them.",
      ingredients: ["Quesillo cheese", "Toasted sesame seeds", "Crema", "Rice flour"]
    },
    {
      id: "mexico", name: "Mexico", flag: "🇲🇽", status: "active",
      tagline: "Three milks, one cake, endless comfort.",
      cardImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      story: "Tres leches — cake soaked in three milks and finished with chantilly cream — shows up at birthdays and bakeries across Mexico. It's the first Mexican-inspired loaf on the menu, with more on the way after a planned trip to source ingredients in person.",
      region: "North America", lat: 19.43, lon: -99.13,
      addedYear: "2025", blurb: "The first Mexican-inspired loaf on the menu — more coming after a planned sourcing trip.",
      funFact: "🏙️ Fun fact: Mexico City is sinking up to 20 inches a year — it's built on an ancient lake bed.",
      ingredients: ["Three milks (evaporated, condensed, whole)", "Chantilly cream", "Cinnamon", "Vanilla"]
    },
    {
      id: "germany", name: "Germany", flag: "🇩🇪", status: "active",
      tagline: "Chocolate, coconut, and pecan fudge, done properly.",
      cardImage: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80",
      story: "German Chocolate Bread takes the coconut-pecan-fudge combination everyone loves and bakes it straight into the loaf, glaze and all.",
      region: "Central Europe", lat: 52.52, lon: 13.40,
      addedYear: "2025", blurb: "A one-loaf tribute to the classic coconut-pecan-fudge combination.",
      funFact: "🍞 Fun fact: Germany has over 3,000 registered types of bread — more than any other country.",
      ingredients: ["Dark chocolate", "Toasted coconut", "Pecans", "Fudge glaze"]
    },
    {
      id: "italy", name: "Italy", flag: "🇮🇹", status: "active",
      tagline: "Espresso, mascarpone, and slow Sunday baking.",
      cardImage: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
      story: "Tiramisu Bread borrows Italy's favorite coffee-shop dessert — espresso, mascarpone, a little cocoa — and turns it into a loaf you can slice.",
      region: "Southern Europe", lat: 41.90, lon: 12.50,
      addedYear: "2025", blurb: "One espresso-and-mascarpone loaf so far, with an Italian lineup in early development.",
      funFact: "🏛️ Fun fact: Italy has more UNESCO World Heritage Sites than any other country on Earth.",
      ingredients: ["Espresso", "Mascarpone", "Cocoa", "Marsala-style drizzle"]
    },
    {
      id: "ireland", name: "Ireland", flag: "🇮🇪", status: "active",
      tagline: "Irish cream, without the whiskey.",
      cardImage: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80",
      story: "Irish Cream Bread takes the flavor of a classic Irish cream liqueur — without the alcohol — and bakes it into something you can enjoy any time of day.",
      region: "Northern Europe", lat: 53.35, lon: -6.26,
      addedYear: "2025", blurb: "A non-alcoholic tribute to the classic Irish cream flavor.",
      funFact: "🐍 Fun fact: Ireland has no native snakes — it warmed up after the Ice Age before any could arrive.",
      ingredients: ["Irish cream flavoring", "Vanilla", "Cocoa"]
    },
    {
      id: "japan", name: "Japan", flag: "🇯🇵", status: "coming-soon",
      tagline: "Matcha, yuzu, and precise, patient technique.",
      cardImage: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80",
      story: "In development — a Japanese milk bread lineup exploring matcha, yuzu, and black sesame.",
      region: "East Asia", lat: 35.68, lon: 139.77,
      addedYear: "Planned", blurb: "On the roadmap — a matcha and yuzu milk bread lineup is still in early recipe testing.",
      funFact: "🤖 Fun fact: Japan has over 5 million vending machines — about one for every 23 people.",
      ingredients: ["Matcha", "Yuzu", "Black sesame", "Red bean (anko)"]
    },
    {
      id: "usa-east", name: "USA — East Coast", flag: "🇺🇸", status: "active",
      tagline: "Boston cream, Southern peaches, and New England berries.",
      cardImage: "https://images.unsplash.com/photo-1477763858572-cda7deebd0fe?auto=format&fit=crop&w=800&q=80",
      story: "From Boston Cream Pie to Louisiana's Bananas Foster and Lagniappe, to New England cranberries and Southern peach cobbler — the East Coast lineup is Urban Bread Co's biggest single collection, 20 loaves deep.",
      region: "North America", lat: 40.71, lon: -74.01,
      addedYear: "2024", blurb: "The largest single regional lineup on the menu — 20 loaves rooted in Northeast and Southern classics.",
      funFact: "🍰 Fun fact: Boston Cream Pie is legally a cake, not a pie — and it's Massachusetts' official state dessert.",
      ingredients: ["Maple syrup", "Cranberries", "Pecans", "Peaches", "Blueberries"]
    },
    {
      id: "usa-midwest", name: "USA — Midwest", flag: "🇺🇸", status: "active",
      tagline: "Heartland comfort — pumpkin, cinnamon, and Sunday coffee cake.",
      cardImage: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=800&q=80",
      story: "The Midwest lineup is Urban Bread Co's foundation — the comfort classics: banana bread, pumpkin spice, gingerbread, coffee cake, and Michigan cherries — 29 loaves that started it all.",
      region: "North America", lat: 41.88, lon: -87.63,
      addedYear: "2024", blurb: "The bakery's original core — 29 heartland comfort classics, and still growing.",
      funFact: "🍒 Fun fact: Michigan grows more tart cherries than anywhere else in the U.S. — over 200 million pounds a year.",
      ingredients: ["Michigan cherries", "Pumpkin", "Cinnamon", "Oats", "Brown sugar"]
    },
    {
      id: "usa-west", name: "USA — West Coast", flag: "🇺🇸", status: "active",
      tagline: "California citrus, almonds, and Pacific-grown fruit.",
      cardImage: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
      story: "Lighter, brighter, and fruit-forward — the West Coast lineup leans on California citrus, almonds, pistachios, and Pacific-grown produce across 22 loaves.",
      region: "North America", lat: 34.05, lon: -118.24,
      addedYear: "2024", blurb: "22 loaves built around California citrus, nuts, and coastal-grown fruit.",
      funFact: "🌰 Fun fact: California grows about 80% of the entire world's almonds.",
      ingredients: ["California almonds", "Pistachios", "Lemon", "Lavender", "Coconut"]
    }
  ],

  /* Which country/region each bread (by menu.html breadsData id) came from. */
  breadCountry: {
    0:"usa-east", 1:"usa-midwest", 2:"usa-east", 3:"usa-midwest", 4:"usa-east",
    5:"usa-midwest", 6:"usa-east", 7:"usa-west", 8:"usa-east", 9:"el-salvador",
    10:"usa-midwest", 11:"usa-east", 12:"usa-midwest", 13:"usa-midwest", 14:"usa-midwest",
    15:"usa-west", 16:"usa-east", 17:"usa-midwest", 18:"usa-west", 19:"usa-east",
    20:"usa-midwest", 21:"usa-west", 22:"usa-east", 23:"usa-west", 24:"usa-west",
    25:"usa-west", 26:"usa-midwest", 27:"usa-west", 28:"usa-west", 29:"usa-east",
    30:"usa-east", 31:"usa-east", 32:"usa-midwest", 33:"usa-west", 34:"usa-midwest",
    35:"germany", 36:"usa-midwest", 37:"usa-west", 38:"usa-west", 39:"usa-midwest",
    40:"usa-east", 41:"usa-east", 42:"usa-west", 43:"usa-midwest", 44:"usa-midwest",
    45:"usa-midwest", 46:"usa-east", 47:"usa-midwest", 48:"usa-east", 49:"usa-midwest",
    50:"usa-midwest", 51:"usa-west", 52:"usa-midwest", 53:"usa-midwest", 54:"usa-east",
    55:"italy", 56:"usa-west", 57:"usa-west", 58:"usa-west", 59:"usa-midwest",
    60:"usa-midwest", 61:"ireland", 62:"usa-west", 63:"usa-midwest", 64:"usa-midwest",
    65:"netherlands", 66:"netherlands", 67:"netherlands", 68:"netherlands", 69:"netherlands",
    70:"netherlands", 71:"netherlands", 72:"mexico", 73:"usa-east", 74:"usa-midwest",
    75:"usa-east", 76:"usa-midwest", 77:"usa-east", 78:"usa-west", 79:"usa-west",
    80:"usa-west", 81:"usa-west", 82:"usa-midwest"
  },

  /* Extra storytelling fields for the flagship single-bread countries. */
  breadExtras: {
    9: {
      country: "el-salvador", slug: "salvadoran-quesadilla-bread",
      flavorProfile: ["Sweet", "Cheese", "Sesame", "Delicate"],
      ingredients: ["Quesillo cheese", "Rice flour", "Sesame seeds", "Sour cream", "Butter"],
      inspiration: "A staple of Salvadoran breakfast tables — dense, faintly sweet, and always finished with a scatter of sesame across the top."
    },
    35: {
      country: "germany", slug: "german-chocolate-bread",
      flavorProfile: ["Chocolate", "Coconut", "Pecan", "Fudge"],
      ingredients: ["Dark chocolate", "Toasted coconut", "Pecans", "Fudge glaze"],
      inspiration: "The coconut-pecan-fudge combination that made German chocolate cake a classic, baked into a loaf."
    },
    55: {
      country: "italy", slug: "tiramisu-bread",
      flavorProfile: ["Coffee", "Mascarpone", "Cocoa", "Rich"],
      ingredients: ["Espresso", "Mascarpone", "Cocoa", "Marsala-style drizzle"],
      inspiration: "Italy's favorite coffee-shop dessert, reimagined as a loaf you can slice instead of spoon."
    },
    61: {
      country: "ireland", slug: "irish-cream-bread",
      flavorProfile: ["Cream", "Vanilla", "Cocoa", "Smooth"],
      ingredients: ["Irish cream flavoring", "Vanilla", "Cocoa"],
      inspiration: "All the flavor of a classic Irish cream liqueur, non-alcoholic and bakery-fresh."
    },
    72: {
      country: "mexico", slug: "tres-leches-bread",
      flavorProfile: ["Milk", "Vanilla", "Cinnamon", "Soaked"],
      ingredients: ["Three milks (evaporated, condensed, whole)", "Chantilly cream", "Cinnamon"],
      inspiration: "Mexico's beloved three-milk cake, soaked and finished with chantilly cream."
    },
    65: {
      country: "netherlands", slug: "amsterdam-banana-bread",
      flavorProfile: ["Banana", "Almond", "Rum", "Brown Sugar"],
      ingredients: ["Ripe bananas", "Almond paste", "Dark rum glaze", "Brown sugar"],
      inspiration: "Amsterdam's bakeries lean on almond paste the way American bakeries lean on vanilla — this loaf borrows that instinct."
    },
    66: {
      country: "netherlands", slug: "stroopwafel-bread",
      flavorProfile: ["Caramel", "Cinnamon", "Spiced", "Chewy"],
      ingredients: ["Stroopwafel syrup", "Brown sugar", "Cinnamon", "Butter caramel glaze"],
      inspiration: "Built to taste like the caramel waffle cookies sold warm from carts across the Netherlands, minus the cart."
    },
    67: {
      country: "netherlands", slug: "dutch-apple-rozijnen-bread",
      flavorProfile: ["Apple", "Raisin", "Cinnamon", "Vanilla"],
      ingredients: ["Dutch apples", "Golden raisins", "Cinnamon", "Vanilla glaze"],
      inspiration: "Named for rozijnen — raisins — a fixture of Dutch appelgebak."
    },
    68: {
      country: "netherlands", slug: "amsterdam-pink-roze-koeken-bread",
      flavorProfile: ["Sweet", "Pink Glaze", "Nostalgic"],
      ingredients: ["Pink fondant glaze", "Vanilla sponge", "Butter"],
      inspiration: "A tribute to roze koeken, the pink-glazed cookies found in every Dutch supermarket aisle."
    },
    69: {
      country: "netherlands", slug: "hagelslag-bliss-bread",
      flavorProfile: ["Chocolate", "Sprinkles", "Buttery"],
      ingredients: ["Dutch chocolate sprinkles", "Butter", "Milk glaze"],
      inspiration: "Hagelslag — chocolate sprinkles on buttered bread — is basically a Dutch birthright. This is that, baked in."
    },
    70: {
      country: "netherlands", slug: "brokking-hazelnut-cream-bread",
      flavorProfile: ["Hazelnut", "Praline", "Rich"],
      ingredients: ["Hazelnut praline", "Cream", "Toasted hazelnuts"],
      inspiration: "Named for the hazelnut spread brand that ends up in half of Holland's pantries."
    },
    71: {
      country: "netherlands", slug: "advocaat-custard-bread",
      flavorProfile: ["Custard", "Egg", "Rich", "Warm Spice"],
      ingredients: ["Advocaat-style custard", "Egg yolk", "Nutmeg"],
      inspiration: "Inspired by advocaat, the thick Dutch egg liqueur usually eaten with a spoon, not a straw."
    }
  }
};

/*
 * Renders the flat, full-width interactive world map header. Uses a real
 * country-accurate map (assets/img/world-map-real.svg, traced from
 * Natural Earth data via world-atlas, ISC-licensed) instead of a
 * stylized approximation, with pins placed by real lat/lon using a
 * plain equirectangular projection that matches the image exactly.
 *
 * containerId: id of an empty <div> to render into.
 * opts.pathPrefix: "" on root pages, "../" on pages one folder deep.
 */
window.UBC_WORLD.renderMap = function (containerId, opts) {
  opts = opts || {};
  var prefix = opts.pathPrefix || "";
  var data = window.UBC_WORLD;
  var root = document.getElementById(containerId);
  if (!root) return;

  function pinPos(c) {
    return { left: (c.lon + 180) / 360 * 100, top: (90 - c.lat) / 180 * 100 };
  }

  var pins = data.countries.map(function (c) {
    var soon = c.status === "coming-soon";
    var pos = pinPos(c);
    return '<button type="button" class="wf-pin' + (soon ? " is-soon" : "") + '" style="left:' + pos.left.toFixed(2) + '%;top:' + pos.top.toFixed(2) + '%;" data-id="' + c.id + '" aria-label="' + c.name + '">' +
      '<span class="wf-pin-dot"></span>' +
      '<span class="wf-pin-label">' + c.flag + ' ' + c.name + '</span>' +
    '</button>';
  }).join('');

  root.innerHTML =
    '<div class="wf-map-hero">' +
      '<img class="wf-map-img" src="' + prefix + 'assets/img/world-map-real.svg" alt="World map" loading="eager">' +
      '<div class="wf-map-shade wf-map-shade-top"></div>' +
      '<div class="wf-map-shade wf-map-shade-bottom"></div>' +
      pins +
    '</div>' +
    '<div class="wm-caption" id="wmCaption-' + containerId + '"></div>';

  var caption = document.getElementById('wmCaption-' + containerId);

  function paintCaption(c) {
    var soon = c.status === "coming-soon";
    caption.innerHTML =
      '<span class="wm-caption-flag">' + c.flag + '</span>' +
      '<div class="wm-caption-body">' +
        '<div class="wm-caption-name">' + c.name + ' <span class="wm-caption-year">— ' + c.addedYear + '</span></div>' +
        '<div class="wm-caption-blurb">' + c.blurb + '</div>' +
        (c.funFact ? '<div class="wm-caption-fact">' + c.funFact + '</div>' : '') +
      '</div>' +
      (soon
        ? '<span class="wm-caption-cta wm-caption-soon">Coming Soon</span>'
        : '<a class="wm-caption-cta" href="' + prefix + 'countries/' + c.id + '.html">Discover ' + c.name + ' →</a>');
  }

  var defaultCountry = data.countries.find(function (c) { return c.id === data.currentlyExploring; }) || data.countries[0];
  paintCaption(defaultCountry);

  root.querySelectorAll('.wf-pin').forEach(function (pin) {
    var c = data.countries.find(function (x) { return x.id === pin.getAttribute('data-id'); });
    if (!c) return;
    pin.addEventListener('mouseenter', function () { paintCaption(c); });
    pin.addEventListener('click', function () {
      paintCaption(c);
      if (c.status !== 'coming-soon') {
        window.location.href = prefix + 'countries/' + c.id + '.html';
      }
    });
  });
};

/* Returns { id, name, description, price, features } for a bread id, reading
   from menu.html's breadsData if it's on the current page, else null. */
window.UBC_WORLD.getBreadIdsForCountry = function (countryId) {
  var ids = [];
  var map = window.UBC_WORLD.breadCountry;
  for (var id in map) {
    if (map[id] === countryId) ids.push(parseInt(id, 10));
  }
  return ids.sort(function (a, b) { return a - b; });
};
