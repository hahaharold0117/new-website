export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;          // base price
  badge?: "new" | "spicy" | "veg";
};

export type Category = {
  id: string;
  name: string;
  blurb?: string;
  items: MenuItem[];
};

export const CATEGORIES: Category[] = [
  // 1) Create Your Own
  {
    id: "create-your-own",
    name: "Create Your Own Pizza",
    blurb: "With 4 toppings.",
    items: [
      { id: "cyo-xl", name: 'X-Large 15"', price: 15.99 },
      { id: "cyo-md", name: 'Medium 12"', price: 12.99 },
      { id: "cyo-sm", name: 'Small 10"', price: 7.99 },
    ],
  },

  // 2) Pizzas
  {
    id: "pizzas",
    name: "Pizzas",
    blurb: "Freshly baked, classic favourites.",
    items: [
      { id: "pepperoni", name: "Pepperoni", description: "Double pepperoni", price: 11.99, badge: "spicy" },
      { id: "meat-feast", name: "Meat Feast", description: "Pepperoni, meatballs, bacon, ham, beef. BBQ or tomato base.", price: 11.99 },
      { id: "veg-hot", name: "Veg Hot", description: "Onion, mushrooms, green pepper, sweetcorn, tomato & jalapeño", price: 11.99, badge: "veg" },
      { id: "four-cheese", name: "Four Cheese", description: "Tomato sauce & four cheeses", price: 11.99 },
      { id: "margherita", name: "Margherita", description: "Mozzarella & tomato", price: 8.99, badge: "veg" },
      { id: "bbq-chicken", name: "BBQ Chicken", description: "BBQ base, chicken, onion, peppers", price: 12.49, badge: "new" },
    ],
  },

  // 3) Fresh Pizzas (sizes)
  {
    id: "fresh-pizzas",
    name: "Fresh Pizzas",
    blurb: "Hand-stretched dough.",
    items: [
      { id: "fresh-md", name: "medium–6–slices", price: 6.49 },
      { id: "fresh-lg", name: "large–8–slices", price: 8.99 },
      { id: "fresh-xxl", name: "super–size–12–slices", price: 11.99 },
    ],
  },

  // 4) Starters
  {
    id: "starters",
    name: "Starters",
    blurb: "Perfect to begin.",
    items: [
      { id: "garlic-bread", name: "Garlic Bread", price: 3.49, badge: "veg" },
      { id: "garlic-bread-cheese", name: "Garlic Bread with Cheese", price: 3.99, badge: "veg" },
      { id: "mozzarella-sticks", name: "Mozzarella Sticks (6)", price: 4.99, badge: "veg" },
      { id: "hot-wings", name: "Hot Wings (6)", price: 5.49, badge: "spicy" },
      { id: "onion-rings", name: "Onion Rings (10)", price: 3.49, badge: "veg" },
    ],
  },

  // 5) Burgers
  {
    id: "burgers",
    name: "Burgers",
    blurb: "Served with lettuce & sauce.",
    items: [
      { id: "cheese-burger", name: "Cheeseburger", price: 4.99 },
      { id: "double-cheese-burger", name: "Double Cheeseburger", price: 6.49 },
      { id: "chicken-burger", name: "Chicken Fillet Burger", price: 5.49 },
      { id: "veg-burger", name: "Veggie Burger", price: 4.79, badge: "veg" },
      { id: "spicy-burger", name: "Spicy Chicken Burger", price: 5.79, badge: "spicy" },
    ],
  },

  // 6) Wraps
  {
    id: "wraps",
    name: "Wraps",
    blurb: "Grilled & wrapped fresh.",
    items: [
      { id: "chicken-wrap", name: "Chicken Wrap", price: 5.49 },
      { id: "doner-wrap", name: "Doner Wrap", price: 5.79 },
      { id: "halloumi-wrap", name: "Halloumi Wrap", price: 5.99, badge: "veg" },
      { id: "falafel-wrap", name: "Falafel Wrap", price: 5.49, badge: "veg" },
    ],
  },

  // 7) Kebabs
  {
    id: "kebabs",
    name: "Kebabs",
    blurb: "Served in pitta with salad.",
    items: [
      { id: "doner-kebab", name: "Doner Kebab", price: 7.49 },
      { id: "chicken-kebab", name: "Chicken Shish Kebab", price: 8.49 },
      { id: "lamb-shish", name: "Lamb Shish Kebab", price: 9.49 },
      { id: "mix-kebab", name: "Mixed Kebab", price: 10.99 },
      { id: "veg-kebab", name: "Veg Kebab", price: 6.49, badge: "veg" },
    ],
  },

  // 8) Kebab Meals
  {
    id: "kebab-meals",
    name: "Kebab Meals",
    blurb: "With chips & drink.",
    items: [
      { id: "doner-meal", name: "Doner Kebab Meal", price: 9.99 },
      { id: "chicken-meal", name: "Chicken Shish Meal", price: 10.99 },
      { id: "mix-meal", name: "Mixed Kebab Meal", price: 12.49 },
    ],
  },

  // 9) Combination Kebabs
  {
    id: "combination-kebabs",
    name: "Combination Kebabs",
    blurb: "Two meats, one plate.",
    items: [
      { id: "doner-chicken", name: "Doner & Chicken", price: 10.49 },
      { id: "doner-lamb", name: "Doner & Lamb", price: 10.99 },
      { id: "chicken-lamb", name: "Chicken & Lamb", price: 11.49 },
    ],
  },

  // 10) Chicken & Fish
  {
    id: "chicken-fish",
    name: "Chicken & Fish",
    blurb: "Crispy & tasty.",
    items: [
      { id: "chicken-nuggets", name: "Chicken Nuggets (10)", price: 4.99 },
      { id: "chicken-strips", name: "Chicken Strips (6)", price: 5.49 },
      { id: "scampi", name: "Scampi (10)", price: 5.49 },
      { id: "fish-bites", name: "Fish Bites (6)", price: 5.99 },
    ],
  },

  // 11) Kids Meals
  {
    id: "kids-meals",
    name: "Kids Meals",
    blurb: "Includes drink & fries.",
    items: [
      { id: "kids-nuggets", name: "Kids Nuggets (5)", price: 4.99 },
      { id: "kids-burger", name: "Kids Burger", price: 4.99 },
      { id: "kids-pizza", name: "Kids Margherita 7\"", price: 5.49, badge: "veg" },
    ],
  },

  // 12) Family Meals
  {
    id: "family-meals",
    name: "Family Meals",
    blurb: "Great for sharing.",
    items: [
      { id: "family-pizza", name: "Family Pizza Deal (2x 12\" + 2 sides + drink)", price: 22.99 },
      { id: "family-kebab", name: "Family Kebab Feast (mix kebabs + chips + salad)", price: 24.99 },
    ],
  },

  // 13) Desserts
  {
    id: "desserts",
    name: "Desserts",
    blurb: "Sweet finish.",
    items: [
      { id: "choc-fudge", name: "Chocolate Fudge Cake", price: 3.49 },
      { id: "cheesecake", name: "New York Cheesecake", price: 3.49 },
      { id: "ice-cream", name: "Ice Cream Tub", price: 2.99 },
      { id: "baklava", name: "Baklava (4 pcs)", price: 3.99, badge: "new" },
    ],
  },

  // 14) Drinks
  {
    id: "drinks",
    name: "Drinks",
    blurb: "Chilled soft drinks.",
    items: [
      { id: "cola-can", name: "Coca-Cola (330ml)", price: 1.20 },
      { id: "diet-cola-can", name: "Diet Coke (330ml)", price: 1.20 },
      { id: "fanta-can", name: "Fanta Orange (330ml)", price: 1.20 },
      { id: "water", name: "Still Water (500ml)", price: 1.00 },
      { id: "juice", name: "Orange Juice (250ml)", price: 1.50 },
    ],
  },

  // 15) Salads
  {
    id: "salads",
    name: "Salads",
    blurb: "Fresh & crunchy.",
    items: [
      { id: "house-salad", name: "House Salad", price: 3.49, badge: "veg" },
      { id: "greek-salad", name: "Greek Salad", price: 4.49, badge: "veg" },
      { id: "coleslaw", name: "Coleslaw", price: 2.49, badge: "veg" },
    ],
  },
  // 16) Dips
  {
    id: "dips",
    name: "Dips",
    blurb: "Pick your favourites.",
    items: [
      { id: "dip-garlic", name: "Garlic Mayo", price: 0.70 },
      { id: "dip-chilli", name: "Chilli", price: 0.70, badge: "spicy" },
      { id: "dip-bbq", name: "BBQ", price: 0.70 },
      { id: "dip-ketchup", name: "Ketchup", price: 0.50 },
      { id: "dip-tzatziki", name: "Tzatziki", price: 0.90 },
    ],
  },
];
