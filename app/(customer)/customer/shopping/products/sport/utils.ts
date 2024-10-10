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
  console.log(`Total products received: ${products.length}`);

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

  products.forEach((product, index) => {
    const categories = (product.categories || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const type = (product.type || "").toLowerCase();
    const shortDescription = (product.shortDescription || "").toLowerCase();

    console.log(`Processing product ${index + 1}:`);
    console.log(`  Name: ${product.name}`);
    console.log(`  Categories: ${categories}`);
    console.log(`  Type: ${type}`);
    console.log(`  Short Description: ${shortDescription}`);

    if (!categories.includes("sport collection")) {
      console.log("  Not a sport product, skipping.");
      return;
    }

    console.log("  Is a sport product, categorizing...");

    // Gender categorization
    if (
      womenSpecificProducts.includes(name) ||
      categories.includes("women") ||
      name.includes("women") ||
      shortDescription.includes("women")
    ) {
      sportCategories.Women.push(product);
      console.log("  Categorized as: Women");
    } else if (
      categories.includes("men") ||
      name.includes("men") ||
      shortDescription.includes("men")
    ) {
      sportCategories.Men.push(product);
      console.log("  Categorized as: Men");
    } else if (
      categories.includes("kids") ||
      name.includes("kids") ||
      shortDescription.includes("kids")
    ) {
      sportCategories.Kids.push(product);
      console.log("  Categorized as: Kids");
    } else {
      sportCategories.Unisex.push(product);
      console.log("  Categorized as: Unisex");
    }

    if (
      categories.includes("new") ||
      categories.includes("new in") ||
      shortDescription.includes("new")
    ) {
      sportCategories.New.push(product);
      console.log("  Categorized as: New");
    }
    if (
      categories.includes("hoodie") ||
      type.includes("hoodie") ||
      shortDescription.includes("hoodie")
    ) {
      sportCategories.Hoodies.push(product);
      console.log("  Categorized as: Hoodies");
    }
    if (
      categories.includes("jacket") ||
      type.includes("jacket") ||
      shortDescription.includes("jacket")
    ) {
      sportCategories.Jackets.push(product);
      console.log("  Categorized as: Jackets");
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
      console.log("  Categorized as: Hats");
    }
    if (
      categories.includes("bottoms") ||
      name.includes("pants") ||
      name.includes("shorts") ||
      shortDescription.includes("pants") ||
      shortDescription.includes("shorts")
    ) {
      sportCategories.Bottoms.push(product);
      console.log("  Categorized as: Bottoms");
    }
    if (
      categories.includes("summer") ||
      name.includes("summer") ||
      shortDescription.includes("summer")
    ) {
      sportCategories.Summer.push(product);
      console.log("  Categorized as: Summer");
    }
    if (
      categories.includes("multifunctional") ||
      name.includes("multifunctional") ||
      shortDescription.includes("multifunctional")
    ) {
      sportCategories.Multifunctional.push(product);
      console.log("  Categorized as: Multifunctional");
    }
  });

  console.log("Category counts:");
  Object.entries(sportCategories).forEach(([category, products]) => {
    console.log(`  ${category}: ${products.length}`);
  });

  return sportCategories;
};
