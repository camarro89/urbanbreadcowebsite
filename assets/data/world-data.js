/*
 * Urban Bread Co — World Data
 * Single source of truth for the "world of bread" experience: countries,
 * their stories/ingredients, and the extra storytelling fields layered on
 * top of the existing bread records in menu.html (breadsData).
 *
 * TO ADD A NEW COUNTRY:
 *   1. Add an entry to COUNTRIES below (copy an existing "active" one).
 *   2. Add a page at /countries/<id>.html (copy countries/netherlands.html).
 *   3. For each bread from that country already in menu.html's breadsData,
 *      add a matching entry to BREAD_EXTRAS keyed by that bread's id.
 *   4. Add the country card to explore.html's grid (and the homepage teaser
 *      grid if you want it featured there).
 * No other file needs to change — menu.html, the Bread Club builder, and
 * checkout are untouched by any of this.
 */
window.UBC_WORLD = {

  currentlyExploring: "netherlands",

  countries: [
    {
      id: "netherlands",
      name: "Netherlands",
      flag: "🇳🇱",
      status: "active",
      tagline: "Bold caramel. Canal-side bakeries. Sweet nostalgia.",
      heroImage: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&q=80",
      cardImage: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
      story: "Dutch baking runs on caramel, spice, and a stubborn sweet tooth — stroopwafels cooling on windowsills, hagelslag on breakfast toast, advocaat poured a little too generously into dessert. It's a tradition built on small, deliberate indulgences. When Urban Bread Co. started digging into Dutch flavors, it wasn't research — it turned into an entire wing of the menu, seven loaves deep and still growing.",
      region: "Northern Europe",
      ingredients: ["Stroopwafel caramel", "Hazelnut praline", "Dutch chocolate sprinkles", "Advocaat custard", "Brown sugar rum glaze", "Almond paste"],
      breadIds: [65, 66, 67, 68, 69, 70, 71]
    },
    {
      id: "el-salvador",
      name: "El Salvador",
      flag: "🇸🇻",
      status: "active",
      tagline: "Sweet cheese, sesame, and Sunday-morning tradition.",
      heroImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80",
      cardImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      story: "Quesadilla salvadoreña isn't a quesadilla at all — it's a dense, faintly sweet cheese bread that shows up at Salvadoran breakfast tables, church gatherings, and bakeries on every corner, usually with a cup of coffee close by. It's one of the first international loaves Urban Bread Co. ever baked, born from a conversation about the breads people grew up on and missed. It's stayed on the menu ever since.",
      region: "Central America",
      ingredients: ["Quesillo cheese", "Toasted sesame seeds", "Crema", "Rice flour"],
      breadIds: [9]
    },
    {
      id: "mexico",
      name: "Mexico",
      flag: "🇲🇽",
      status: "coming-soon",
      tagline: "Chocolate, cinnamon, and chiles — next up on the map.",
      cardImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      story: "We're actively sourcing ingredients and inspiration for a Mexican bread lineup — read where that trip stands on the Journal.",
      region: "North America",
      ingredients: ["Mexican chocolate", "Cinnamon (canela)", "Vanilla", "Chile ancho"],
      breadIds: []
    },
    {
      id: "italy",
      name: "Italy",
      flag: "🇮🇹",
      status: "coming-soon",
      tagline: "Olive oil, espresso, and slow Sunday baking.",
      cardImage: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80",
      story: "In development — an Italian lineup built around espresso, citrus, and olive oil is on our bake list.",
      region: "Southern Europe",
      ingredients: ["Espresso", "Blood orange", "Olive oil", "Mascarpone"],
      breadIds: []
    },
    {
      id: "japan",
      name: "Japan",
      flag: "🇯🇵",
      status: "coming-soon",
      tagline: "Matcha, yuzu, and precise, patient technique.",
      cardImage: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80",
      story: "In development — a Japanese milk bread lineup exploring matcha, yuzu, and black sesame.",
      region: "East Asia",
      ingredients: ["Matcha", "Yuzu", "Black sesame", "Red bean (anko)"],
      breadIds: []
    }
  ],

  /* Extra storytelling fields per bread, keyed by the bread's numeric id
     in menu.html's breadsData. Merge with that record — country pages
     read name/description/price from menu.html and flavor/ingredients/
     inspiration/slug from here, so there is exactly one place that owns
     "is this bread purchasable" (menu.html) and one place that owns
     "what's the story" (here). */
  breadExtras: {
    9: {
      country: "el-salvador",
      slug: "salvadoran-quesadilla-bread",
      flavorProfile: ["Sweet", "Cheese", "Sesame", "Delicate"],
      ingredients: ["Quesillo cheese", "Rice flour", "Sesame seeds", "Sour cream", "Butter"],
      inspiration: "A staple of Salvadoran breakfast tables — dense, faintly sweet, and always finished with a scatter of sesame across the top."
    },
    65: {
      country: "netherlands",
      slug: "amsterdam-banana-bread",
      flavorProfile: ["Banana", "Almond", "Rum", "Brown Sugar"],
      ingredients: ["Ripe bananas", "Almond paste", "Dark rum glaze", "Brown sugar"],
      inspiration: "Amsterdam's bakeries lean on almond paste the way American bakeries lean on vanilla — this loaf borrows that instinct."
    },
    66: {
      country: "netherlands",
      slug: "stroopwafel-bread",
      flavorProfile: ["Caramel", "Cinnamon", "Spiced", "Chewy"],
      ingredients: ["Stroopwafel syrup", "Brown sugar", "Cinnamon", "Butter caramel glaze"],
      inspiration: "Built to taste like the caramel waffle cookies sold warm from carts across the Netherlands, minus the cart."
    },
    67: {
      country: "netherlands",
      slug: "dutch-apple-rozijnen-bread",
      flavorProfile: ["Apple", "Raisin", "Cinnamon", "Vanilla"],
      ingredients: ["Dutch apples", "Golden raisins", "Cinnamon", "Vanilla glaze"],
      inspiration: "Named for rozijnen — raisins — a fixture of Dutch appelgebak."
    },
    68: {
      country: "netherlands",
      slug: "amsterdam-pink-roze-koeken-bread",
      flavorProfile: ["Sweet", "Pink Glaze", "Nostalgic"],
      ingredients: ["Pink fondant glaze", "Vanilla sponge", "Butter"],
      inspiration: "A tribute to roze koeken, the pink-glazed cookies found in every Dutch supermarket aisle."
    },
    69: {
      country: "netherlands",
      slug: "hagelslag-bliss-bread",
      flavorProfile: ["Chocolate", "Sprinkles", "Buttery"],
      ingredients: ["Dutch chocolate sprinkles", "Butter", "Milk glaze"],
      inspiration: "Hagelslag — chocolate sprinkles on buttered bread — is basically a Dutch birthright. This is that, baked in."
    },
    70: {
      country: "netherlands",
      slug: "brokking-hazelnut-cream-bread",
      flavorProfile: ["Hazelnut", "Praline", "Rich"],
      ingredients: ["Hazelnut praline", "Cream", "Toasted hazelnuts"],
      inspiration: "Named for the hazelnut spread brand that ends up in half of Holland's pantries."
    },
    71: {
      country: "netherlands",
      slug: "advocaat-custard-bread",
      flavorProfile: ["Custard", "Egg", "Rich", "Warm Spice"],
      ingredients: ["Advocaat-style custard", "Egg yolk", "Nutmeg"],
      inspiration: "Inspired by advocaat, the thick Dutch egg liqueur usually eaten with a spoon, not a straw."
    }
  }
};
