export type MenuItem = {
  name: string;
  description: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    name: "Rice & Sides",
    items: [
      { name: "Adakings Signature Jollof", description: "Smoky, slow-cooked jollof rice with our house spice blend." },
      { name: "Fried Rice", description: "Wok-tossed rice with mixed vegetables and your choice of protein." },
      { name: "Waakye", description: "Rice and beans served with shito, gari, and boiled egg." },
    ],
  },
  {
    name: "Chicken & Grill",
    items: [
      { name: "Crispy Fried Chicken", description: "Marinated overnight, fried fresh to order, always crispy." },
      { name: "Grilled Chicken", description: "Char-grilled chicken with pepper sauce." },
      { name: "Grilled Tilapia Platter", description: "Whole grilled tilapia with pepper sauce and banku or rice." },
    ],
  },
  {
    name: "Swallow & Soup",
    items: [
      { name: "Banku & Okro Stew", description: "Fermented corn and cassava dough with fresh okro stew." },
      { name: "Fufu & Light Soup", description: "Pounded cassava and plantain with spicy light soup." },
    ],
  },
  {
    name: "Drinks & Extras",
    items: [
      { name: "Sobolo", description: "Chilled hibiscus drink with ginger and pineapple." },
      { name: "Fresh Juice", description: "Seasonal fruit juice, made fresh daily." },
    ],
  },
];
