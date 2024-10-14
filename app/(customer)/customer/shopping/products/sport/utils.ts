import { Product } from "@prisma/client";

export type SportSubcategory =
  | "Men"
  | "Women"
  | "Kids"
  | "Unisex"
  | "New"
  | "Hoodies"
  | "Jackets"
  | "Hats"
  | "Bottoms"
  | "Summer"
  | "Multifunctional";

export type SportProductCategories = {
  [key in SportSubcategory]: Product[];
};

export const categorizeSportProducts = (
  products: Product[]
): SportProductCategories => {
  const sportCategories: SportProductCategories = {
    Men: [],
    Women: [],
    Kids: [],
    Unisex: [],
    New: [],
    Hoodies: [],
    Jackets: [],
    Hats: [],
    Bottoms: [],
    Summer: [],
    Multifunctional: [],
  };

  const womenSpecificProducts = ["sunvisor", "liberty cap", "putter cap"];

  products.forEach(product => {
    const categories = (product.categories || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const type = (product.type || "").toLowerCase();
    const shortDescription = (product.shortDescription || "").toLowerCase();

    if (!categories.includes("sport collection")) {
      return;
    }

    // Gender categorization
    if (
      womenSpecificProducts.includes(name) ||
      categories.includes("women") ||
      name.includes("women") ||
      shortDescription.includes("women")
    ) {
      sportCategories.Women.push(product);
    } else if (
      categories.includes("men") ||
      name.includes("men") ||
      shortDescription.includes("men")
    ) {
      sportCategories.Men.push(product);
    } else if (
      categories.includes("kids") ||
      name.includes("kids") ||
      shortDescription.includes("kids")
    ) {
      sportCategories.Kids.push(product);
    } else {
      sportCategories.Unisex.push(product);
    }

    if (
      categories.includes("new") ||
      categories.includes("new in") ||
      shortDescription.includes("new")
    ) {
      sportCategories.New.push(product);
    }
    if (
      categories.includes("hoodie") ||
      type.includes("hoodie") ||
      shortDescription.includes("hoodie")
    ) {
      sportCategories.Hoodies.push(product);
    }
    if (
      categories.includes("jacket") ||
      type.includes("jacket") ||
      shortDescription.includes("jacket")
    ) {
      sportCategories.Jackets.push(product);
    }
    if (
      categories.includes("hat") ||
      type.includes("hat") ||
      name.includes("cap") ||
      name.includes("visor") ||
      shortDescription.includes("hat") ||
      shortDescription.includes("cap") ||
      shortDescription.includes("visor")
    ) {
      sportCategories.Hats.push(product);
    }
    if (
      categories.includes("bottoms") ||
      name.includes("pants") ||
      name.includes("shorts") ||
      shortDescription.includes("pants") ||
      shortDescription.includes("shorts")
    ) {
      sportCategories.Bottoms.push(product);
    }
    if (
      categories.includes("summer") ||
      name.includes("summer") ||
      shortDescription.includes("summer")
    ) {
      sportCategories.Summer.push(product);
    }
    if (
      categories.includes("multifunctional") ||
      name.includes("multifunctional") ||
      shortDescription.includes("multifunctional")
    ) {
      sportCategories.Multifunctional.push(product);
    }
  });

  return sportCategories;
};
