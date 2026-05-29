export const filters = {
  categories: ["Outerwear", "Knitwear", "Suits", "Trousers"],
  priceRanges: [
    { label: "Under $150",    min: 0,   max: 150      },
    { label: "$150 – $250",   min: 150, max: 250      },
    { label: "$250 – $400",   min: 250, max: 400      },
    { label: "$400+",         min: 400, max: Infinity },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "36"],
  colors: [
    "Obsidian Black",
    "Camel Tan",
    "Warm Sand",
    "Sage Green",
    "Midnight Navy",
    "Ash Grey",
    "Storm Grey",
    "Ivory",
    "Alabaster White",
    "Charcoal Silk",
  ],
  ratings: [5, 4, 3],
  availability: ["In Stock", "Limited Edition", "New Arrivals"],
};
