import { Product } from "@prisma/client";

export type WinterCategory =
  | "Men"
  | "Women"
  | "Unisex"
  | "Kids"
  | "New"
  | "Hoodies"
  | "Jackets"
  | "Hats"
  | "Bottoms";

export type WinterProductCategories = {
  [key in WinterCategory]: Product[];
};

export const categorizeWinterProducts = (
  products: Product[]
): WinterProductCategories => {
  const winterCategories: WinterProductCategories = {
    Men: [],
    Women: [],
    Unisex: [],
    Kids: [],
    New: [],
    Hoodies: [],
    Jackets: [],
    Hats: [],
    Bottoms: [],
  };

  products.forEach(product => {
    const categories = (product.categories || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const type = (product.type || "").toLowerCase();
    const shortDescription = (product.shortDescription || "").toLowerCase();

    // Filter for winter products
    if (!categories.includes("winter collection")) {
      return;
    }

    // Categorize by gender and age
    if (categories.includes("kids") || name.includes("kids")) {
      winterCategories.Kids.push(product);
    } else if (
      name.includes("unisex") ||
      categories.includes("unisex") ||
      shortDescription.includes("unisex")
    ) {
      winterCategories.Unisex.push(product);
    } else if (
      name.includes("women") ||
      name.includes("ladies") ||
      categories.includes("women")
    ) {
      winterCategories.Women.push(product);
    } else if (name.includes("men") || categories.includes("men")) {
      winterCategories.Men.push(product);
    } else {
      // If not explicitly categorized, assume it's unisex
      winterCategories.Unisex.push(product);
    }

    // Categorize by product type
    if (
      name.includes("hoodie") ||
      type.includes("hoodie") ||
      categories.includes("hoodies")
    ) {
      winterCategories.Hoodies.push(product);
    } else if (
      name.includes("jacket") ||
      type.includes("jacket") ||
      categories.includes("jackets")
    ) {
      winterCategories.Jackets.push(product);
    } else if (
      name.includes("hat") ||
      name.includes("cap") ||
      type.includes("headwear") ||
      categories.includes("hats")
    ) {
      winterCategories.Hats.push(product);
    } else if (
      name.includes("pants") ||
      name.includes("trousers") ||
      name.includes("shorts") ||
      categories.includes("bottoms")
    ) {
      winterCategories.Bottoms.push(product);
    }

    // Categorize new arrivals
    if (categories.includes("new arrivals") || categories.includes("new in")) {
      winterCategories.New.push(product);
    }
  });

  return winterCategories;
};
