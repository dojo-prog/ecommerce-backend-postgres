interface MockSubcategory {
  category_name: string;
  name: string;
}

const mockSubcategories: MockSubcategory[] = [
  // Fresh Produce
  { category_name: "Fresh Produce", name: "Fruits" },
  { category_name: "Fresh Produce", name: "Vegetables" },
  { category_name: "Fresh Produce", name: "Leafy Greens" },
  { category_name: "Fresh Produce", name: "Root Vegetables" },
  { category_name: "Fresh Produce", name: "Herbs & Spices" },
  { category_name: "Fresh Produce", name: "Mushrooms" },

  // Meat & Poultry
  { category_name: "Meat & Poultry", name: "Beef" },
  { category_name: "Meat & Poultry", name: "Pork" },
  { category_name: "Meat & Poultry", name: "Chicken" },
  { category_name: "Meat & Poultry", name: "Processed Meat" },

  // Seafood
  { category_name: "Seafood", name: "Fresh Fish" },
  { category_name: "Seafood", name: "Shellfish" },
  { category_name: "Seafood", name: "Frozen Seafood" },

  // Dairy & Eggs
  { category_name: "Dairy & Eggs", name: "Milk" },
  { category_name: "Dairy & Eggs", name: "Cheese" },
  { category_name: "Dairy & Eggs", name: "Yogurt" },
  { category_name: "Dairy & Eggs", name: "Eggs" },

  // Bakery
  { category_name: "Bakery", name: "Bread" },
  { category_name: "Bakery", name: "Pastries" },
  { category_name: "Bakery", name: "Cakes" },

  // Canned & Packaged Foods
  { category_name: "Canned & Packaged Foods", name: "Canned Meat" },
  { category_name: "Canned & Packaged Foods", name: "Canned Fish" },
  { category_name: "Canned & Packaged Foods", name: "Instant Meals" },
  { category_name: "Canned & Packaged Foods", name: "Packaged Foods" },

  // Rice, Grains & Pasta
  { category_name: "Rice, Grains & Pasta", name: "Rice" },
  { category_name: "Rice, Grains & Pasta", name: "Pasta" },
  { category_name: "Rice, Grains & Pasta", name: "Noodles" },
  { category_name: "Rice, Grains & Pasta", name: "Grains" },

  // Snacks
  { category_name: "Snacks", name: "Chips" },
  { category_name: "Snacks", name: "Biscuits" },
  { category_name: "Snacks", name: "Chocolate" },
  { category_name: "Snacks", name: "Candy" },

  // Beverages
  { category_name: "Beverages", name: "Soft Drinks" },
  { category_name: "Beverages", name: "Juices" },
  { category_name: "Beverages", name: "Water" },
  { category_name: "Beverages", name: "Sports & Energy Drinks" },

  // Coffee & Tea
  { category_name: "Coffee & Tea", name: "Coffee" },
  { category_name: "Coffee & Tea", name: "Tea" },
  { category_name: "Coffee & Tea", name: "Hot Chocolate" },

  // Condiments & Sauces
  { category_name: "Condiments & Sauces", name: "Ketchup" },
  { category_name: "Condiments & Sauces", name: "Mayonnaise" },
  { category_name: "Condiments & Sauces", name: "Soy Sauce" },
  { category_name: "Condiments & Sauces", name: "Vinegar" },

  // Cooking Essentials
  { category_name: "Cooking Essentials", name: "Cooking Oil" },
  { category_name: "Cooking Essentials", name: "Salt & Sugar" },
  { category_name: "Cooking Essentials", name: "Flour" },
  { category_name: "Cooking Essentials", name: "Spices" },

  // Frozen Foods
  { category_name: "Frozen Foods", name: "Frozen Vegetables" },
  { category_name: "Frozen Foods", name: "Frozen Meat" },
  { category_name: "Frozen Foods", name: "Ice Cream" },
  { category_name: "Frozen Foods", name: "Frozen Meals" },

  // Breakfast Foods
  { category_name: "Breakfast Foods", name: "Cereal" },
  { category_name: "Breakfast Foods", name: "Oatmeal" },
  { category_name: "Breakfast Foods", name: "Spreads" },

  // Personal Care
  { category_name: "Personal Care", name: "Shampoo & Conditioner" },
  { category_name: "Personal Care", name: "Soap & Body Wash" },
  { category_name: "Personal Care", name: "Oral Care" },
  { category_name: "Personal Care", name: "Deodorants" },

  // Household Essentials
  { category_name: "Household Essentials", name: "Paper Products" },
  { category_name: "Household Essentials", name: "Storage & Organization" },
  { category_name: "Household Essentials", name: "Kitchen Essentials" },

  // Cleaning Supplies
  { category_name: "Cleaning Supplies", name: "Laundry Detergent" },
  { category_name: "Cleaning Supplies", name: "Dishwashing" },
  { category_name: "Cleaning Supplies", name: "Surface Cleaners" },
  { category_name: "Cleaning Supplies", name: "Disinfectants" },

  // Baby Care
  { category_name: "Baby Care", name: "Diapers" },
  { category_name: "Baby Care", name: "Baby Food" },
  { category_name: "Baby Care", name: "Baby Hygiene" },

  // Pet Supplies
  { category_name: "Pet Supplies", name: "Dog Food" },
  { category_name: "Pet Supplies", name: "Cat Food" },
  { category_name: "Pet Supplies", name: "Pet Treats" },
  { category_name: "Pet Supplies", name: "Pet Care" },
];

export default mockSubcategories;
