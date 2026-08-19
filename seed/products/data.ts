interface MockProduct {
  name: string;
  subcategory_name: string;
  description: string;
  price_cents: number;
  weight_grams: number;
  initial_quantity: number;
}

const mockProducts: MockProduct[] = [
  // Fresh Produce
  {
    name: "Premium Red Apples",
    subcategory_name: "Fruits",
    description: "Crisp and sweet red apples, perfect for snacking or baking.",
    price_cents: 18900,
    weight_grams: 1000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Carrots",
    subcategory_name: "Root Vegetables",
    description:
      "Fresh and crunchy carrots suitable for salads, soups, and cooking.",
    price_cents: 7900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Spinach",
    subcategory_name: "Leafy Greens",
    description:
      "Tender fresh spinach leaves packed with nutrients and flavor.",
    price_cents: 6500,
    weight_grams: 250,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Button Mushrooms",
    subcategory_name: "Mushrooms",
    description: "Fresh button mushrooms with a mild earthy flavor.",
    price_cents: 14900,
    weight_grams: 250,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Meat & Poultry
  {
    name: "Premium Beef Sirloin",
    subcategory_name: "Beef",
    description:
      "Tender beef sirloin cuts ideal for grilling, frying, or roasting.",
    price_cents: 69900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Pork Liempo",
    subcategory_name: "Pork",
    description: "Fresh pork belly with a balanced layer of meat and fat.",
    price_cents: 45900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Chicken Breast",
    subcategory_name: "Chicken",
    description:
      "Boneless and skinless chicken breast suitable for everyday meals.",
    price_cents: 32900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Beef Hotdog",
    subcategory_name: "Processed Meat",
    description:
      "Juicy beef hotdogs that are perfect for breakfast and quick meals.",
    price_cents: 15900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Seafood
  {
    name: "Fresh Bangus",
    subcategory_name: "Fresh Fish",
    description: "Fresh milkfish cleaned and prepared for convenient cooking.",
    price_cents: 29900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Shrimp",
    subcategory_name: "Shellfish",
    description:
      "Fresh medium-sized shrimp perfect for grilling, frying, or pasta.",
    price_cents: 54900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Frozen Salmon Fillet",
    subcategory_name: "Frozen Seafood",
    description: "Individually packed frozen salmon fillets with rich flavor.",
    price_cents: 79900,
    weight_grams: 250,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Dairy & Eggs
  {
    name: "Fresh Whole Milk",
    subcategory_name: "Milk",
    description: "Creamy whole milk with a rich and smooth taste.",
    price_cents: 11900,
    weight_grams: 1000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Cheddar Cheese Block",
    subcategory_name: "Cheese",
    description:
      "Mild cheddar cheese with a smooth texture for sandwiches and cooking.",
    price_cents: 21900,
    weight_grams: 200,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Plain Greek Yogurt",
    subcategory_name: "Yogurt",
    description:
      "Thick and creamy plain Greek yogurt with a naturally tangy flavor.",
    price_cents: 16900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Premium Brown Eggs",
    subcategory_name: "Eggs",
    description: "Farm-fresh brown eggs suitable for breakfast and baking.",
    price_cents: 12900,
    weight_grams: 600,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Bakery
  {
    name: "Classic White Bread",
    subcategory_name: "Bread",
    description: "Soft sliced white bread perfect for sandwiches and toast.",
    price_cents: 8900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Butter Croissant",
    subcategory_name: "Pastries",
    description: "Flaky golden croissant made with rich butter.",
    price_cents: 7900,
    weight_grams: 80,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Chocolate Fudge Cake",
    subcategory_name: "Cakes",
    description: "Moist chocolate cake topped with smooth chocolate frosting.",
    price_cents: 59900,
    weight_grams: 800,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Canned & Packaged Foods
  {
    name: "Premium Canned Corned Beef",
    subcategory_name: "Canned Meat",
    description: "Savory canned corned beef that's quick and easy to prepare.",
    price_cents: 9990,
    weight_grams: 175,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Canned Tuna Flakes",
    subcategory_name: "Canned Fish",
    description:
      "Tender tuna flakes packed in oil for quick and convenient meals.",
    price_cents: 8900,
    weight_grams: 180,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Instant Chicken Noodles",
    subcategory_name: "Instant Meals",
    description: "Quick-cooking chicken-flavored noodles for an easy meal.",
    price_cents: 1590,
    weight_grams: 60,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Macaroni Pasta Pack",
    subcategory_name: "Packaged Foods",
    description:
      "Durable dried macaroni pasta suitable for soups and baked dishes.",
    price_cents: 8900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Rice, Grains & Pasta
  {
    name: "Premium Jasmine Rice",
    subcategory_name: "Rice",
    description:
      "Fragrant long-grain jasmine rice with a soft and fluffy texture.",
    price_cents: 32900,
    weight_grams: 5000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Spaghetti Pasta",
    subcategory_name: "Pasta",
    description:
      "Classic dried spaghetti pasta ideal for everyday pasta dishes.",
    price_cents: 10900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Instant Ramen Noodles",
    subcategory_name: "Noodles",
    description:
      "Springy noodles that cook quickly and pair well with soups and sauces.",
    price_cents: 6900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Rolled Oats",
    subcategory_name: "Grains",
    description:
      "Whole grain rolled oats perfect for breakfast bowls and baking.",
    price_cents: 14900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Snacks
  {
    name: "Original Potato Chips",
    subcategory_name: "Chips",
    description:
      "Crispy golden potato chips with a classic lightly salted flavor.",
    price_cents: 9900,
    weight_grams: 150,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Butter Biscuits",
    subcategory_name: "Biscuits",
    description:
      "Crunchy buttery biscuits that pair perfectly with coffee or tea.",
    price_cents: 7900,
    weight_grams: 200,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Milk Chocolate Bar",
    subcategory_name: "Chocolate",
    description: "Smooth and creamy milk chocolate bar for a sweet treat.",
    price_cents: 8900,
    weight_grams: 100,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Assorted Fruit Candies",
    subcategory_name: "Candy",
    description:
      "A colorful assortment of individually wrapped fruit-flavored candies.",
    price_cents: 5900,
    weight_grams: 150,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Beverages
  {
    name: "Cola Soft Drink",
    subcategory_name: "Soft Drinks",
    description:
      "Refreshing carbonated cola drink with a classic sweet flavor.",
    price_cents: 6900,
    weight_grams: 1500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Orange Juice",
    subcategory_name: "Juices",
    description:
      "Refreshing orange juice with a naturally sweet and citrusy flavor.",
    price_cents: 12900,
    weight_grams: 1000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Purified Drinking Water",
    subcategory_name: "Water",
    description: "Clean and refreshing purified drinking water.",
    price_cents: 3500,
    weight_grams: 1500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Electrolyte Sports Drink",
    subcategory_name: "Sports & Energy Drinks",
    description:
      "Refreshing electrolyte drink designed to help replenish fluids after activity.",
    price_cents: 8900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Coffee & Tea
  {
    name: "Premium Ground Coffee",
    subcategory_name: "Coffee",
    description:
      "Rich roasted ground coffee with a smooth aroma and bold flavor.",
    price_cents: 24900,
    weight_grams: 250,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Earl Grey Tea Bags",
    subcategory_name: "Tea",
    description: "Aromatic black tea infused with fragrant bergamot flavor.",
    price_cents: 17900,
    weight_grams: 40,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Creamy Hot Chocolate Mix",
    subcategory_name: "Hot Chocolate",
    description: "Rich chocolate drink mix for a warm and comforting beverage.",
    price_cents: 15900,
    weight_grams: 300,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Condiments & Sauces
  {
    name: "Classic Tomato Ketchup",
    subcategory_name: "Ketchup",
    description: "Rich tomato ketchup with a balanced sweet and tangy flavor.",
    price_cents: 9900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Creamy Mayonnaise",
    subcategory_name: "Mayonnaise",
    description:
      "Smooth and creamy mayonnaise perfect for sandwiches and salads.",
    price_cents: 14900,
    weight_grams: 470,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Premium Soy Sauce",
    subcategory_name: "Soy Sauce",
    description:
      "Savory soy sauce that adds depth and umami to everyday dishes.",
    price_cents: 7900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Cane Vinegar",
    subcategory_name: "Vinegar",
    description:
      "Mild cane vinegar suitable for marinades, dipping sauces, and cooking.",
    price_cents: 5900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Cooking Essentials
  {
    name: "Premium Cooking Oil",
    subcategory_name: "Cooking Oil",
    description:
      "Light and versatile cooking oil suitable for frying and everyday cooking.",
    price_cents: 19900,
    weight_grams: 1000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fine Iodized Salt",
    subcategory_name: "Salt & Sugar",
    description: "Fine iodized salt for seasoning and everyday cooking.",
    price_cents: 3900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "All-Purpose Flour",
    subcategory_name: "Flour",
    description: "Versatile all-purpose flour suitable for baking and cooking.",
    price_cents: 8900,
    weight_grams: 1000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Ground Black Pepper",
    subcategory_name: "Spices",
    description:
      "Aromatic ground black pepper for seasoning meat, vegetables, and soups.",
    price_cents: 9900,
    weight_grams: 100,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Frozen Foods
  {
    name: "Frozen Mixed Vegetables",
    subcategory_name: "Frozen Vegetables",
    description:
      "Convenient frozen mix of carrots, peas, corn, and green beans.",
    price_cents: 12900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Frozen Chicken Nuggets",
    subcategory_name: "Frozen Meat",
    description:
      "Crispy breaded chicken nuggets that are easy to prepare at home.",
    price_cents: 22900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Vanilla Ice Cream",
    subcategory_name: "Ice Cream",
    description: "Smooth and creamy vanilla ice cream with a classic flavor.",
    price_cents: 29900,
    weight_grams: 1000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Frozen Beef Lasagna",
    subcategory_name: "Frozen Meals",
    description:
      "Convenient frozen lasagna layered with pasta, beef, tomato sauce, and cheese.",
    price_cents: 24900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Breakfast Foods
  {
    name: "Honey Corn Flakes",
    subcategory_name: "Cereal",
    description: "Crunchy corn flakes lightly coated with sweet honey flavor.",
    price_cents: 19900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Instant Oatmeal",
    subcategory_name: "Oatmeal",
    description: "Quick-cooking oatmeal that's convenient for busy mornings.",
    price_cents: 13900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Creamy Peanut Butter",
    subcategory_name: "Spreads",
    description:
      "Smooth creamy peanut butter perfect for toast, sandwiches, and snacks.",
    price_cents: 17900,
    weight_grams: 340,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Personal Care
  {
    name: "Daily Moisture Shampoo",
    subcategory_name: "Shampoo & Conditioner",
    description:
      "Gentle shampoo formulated for everyday cleansing and soft hair.",
    price_cents: 19900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Moisturizing Body Wash",
    subcategory_name: "Soap & Body Wash",
    description:
      "Gentle body wash that cleanses while helping maintain skin moisture.",
    price_cents: 15900,
    weight_grams: 400,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Mint Toothpaste",
    subcategory_name: "Oral Care",
    description: "Refreshing mint toothpaste for everyday oral hygiene.",
    price_cents: 8900,
    weight_grams: 150,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Fresh Deodorant Roll-On",
    subcategory_name: "Deodorants",
    description:
      "Long-lasting roll-on deodorant with a clean and refreshing scent.",
    price_cents: 10900,
    weight_grams: 50,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Household Essentials
  {
    name: "Premium Toilet Tissue",
    subcategory_name: "Paper Products",
    description: "Soft and absorbent toilet tissue for everyday household use.",
    price_cents: 19900,
    weight_grams: 700,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Stackable Storage Container",
    subcategory_name: "Storage & Organization",
    description:
      "Durable plastic storage container for organizing household items.",
    price_cents: 24900,
    weight_grams: 300,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Non-Stick Frying Pan",
    subcategory_name: "Kitchen Essentials",
    description: "Durable non-stick frying pan suitable for everyday cooking.",
    price_cents: 59900,
    weight_grams: 900,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Cleaning Supplies
  {
    name: "Liquid Laundry Detergent",
    subcategory_name: "Laundry Detergent",
    description:
      "Powerful liquid detergent designed to remove everyday stains and odors.",
    price_cents: 24900,
    weight_grams: 1500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Dishwashing Liquid",
    subcategory_name: "Dishwashing",
    description:
      "Concentrated dishwashing liquid that cuts through grease and food residue.",
    price_cents: 9900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Multi-Surface Cleaner",
    subcategory_name: "Surface Cleaners",
    description: "Versatile cleaner for everyday household surfaces.",
    price_cents: 12900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Household Disinfectant",
    subcategory_name: "Disinfectants",
    description:
      "Multi-purpose disinfectant for cleaning and sanitizing household surfaces.",
    price_cents: 15900,
    weight_grams: 500,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Baby Care
  {
    name: "Baby Diapers Medium",
    subcategory_name: "Diapers",
    description:
      "Soft and absorbent diapers designed to keep babies comfortable and dry.",
    price_cents: 39900,
    weight_grams: 900,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Baby Rice Cereal",
    subcategory_name: "Baby Food",
    description:
      "Gentle rice cereal suitable as an introductory solid food for babies.",
    price_cents: 18900,
    weight_grams: 250,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Gentle Baby Shampoo",
    subcategory_name: "Baby Hygiene",
    description: "Mild baby shampoo designed for gentle everyday cleansing.",
    price_cents: 15900,
    weight_grams: 200,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },

  // Pet Supplies
  {
    name: "Premium Chicken Dog Food",
    subcategory_name: "Dog Food",
    description:
      "Complete dry dog food with chicken flavor for everyday nutrition.",
    price_cents: 34900,
    weight_grams: 2000,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Tuna Cat Food",
    subcategory_name: "Cat Food",
    description:
      "Moist cat food with tuna flavor formulated for everyday feeding.",
    price_cents: 7900,
    weight_grams: 85,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Crunchy Dog Treats",
    subcategory_name: "Pet Treats",
    description:
      "Crunchy bite-sized treats suitable for rewarding dogs during training.",
    price_cents: 12900,
    weight_grams: 200,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "Pet Grooming Shampoo",
    subcategory_name: "Pet Care",
    description:
      "Gentle pet shampoo designed to clean fur while leaving it soft and fresh.",
    price_cents: 19900,
    weight_grams: 250,
    initial_quantity: Math.floor(Math.random() * 100) + 1,
  },
];

export default mockProducts;
