import { Product } from "@prisma/client";

export type ProductCategories = {
  Men: Product[];
  Women: Product[];
  Unisex: Product[];
  Kids: Product[];
  New: Product[];
  "T-Shirts": Product[];
  Headwear: Product[];
};

export const categorizeProducts = (products: Product[]): ProductCategories => {
  const newProductsData: ProductCategories = {
    Men: [],
    Women: [],
    Unisex: [],
    Kids: [],
    New: [],
    "T-Shirts": [],
    Headwear: [],
  };

  products.forEach(product => {
    const categories = (product.categories || "").toLowerCase();
    const name = (product.name || "").toLowerCase();
    const type = (product.type || "").toLowerCase();
    const shortDescription = (product.shortDescription || "").toLowerCase();

    console.log(`\nProcessing product: ${product.name}`);
    console.log(`Categories: ${categories}`);
    console.log(`Name: ${name}`);
    console.log(`Type: ${type}`);
    console.log(`Short Description: ${shortDescription}`);

    const isExplicitlyFor = (gender: string) =>
      name.includes(gender) ||
      name.includes(gender === "men" ? "male" : "female") ||
      (gender === "women" &&
        (name.includes("ladies") || name.includes("women's")));

    if (categories.includes("new arrivals") || categories.includes("new in")) {
      newProductsData.New.push(product);
      console.log("Categorized as: New");
    }

    if (categories.includes("kids")) {
      newProductsData.Kids.push(product);
      console.log("Categorized as: Kids");
    } else if (
      categories.includes("headwear") ||
      categories.includes("hats") ||
      name.includes("hat") ||
      name.includes("cap") ||
      name.includes("visor")
    ) {
      newProductsData.Headwear.push(product);
      console.log("Categorized as: Headwear");
    } else if (
      name.includes("unisex") ||
      name.includes("uni-sex") ||
      shortDescription.includes("unisex")
    ) {
      newProductsData.Unisex.push(product);
      console.log("Categorized as: Unisex (explicit)");
    } else if (
      isExplicitlyFor("women") ||
      name.includes("ladies") ||
      name.includes("woman") ||
      name.includes("women") ||
      (categories.includes("women") && !categories.includes("men")) ||
      shortDescription.includes("women's") ||
      shortDescription.includes("ladies")
    ) {
      newProductsData.Women.push(product);
      console.log("Categorized as: Women");
    } else if (
      isExplicitlyFor("men") ||
      name.includes("mens") ||
      categories.includes("men") ||
      shortDescription.includes("men's")
    ) {
      newProductsData.Men.push(product);
      console.log("Categorized as: Men");
    } else {
      newProductsData.Unisex.push(product);
      console.log("Categorized as: Unisex (default)");
    }

    if (
      type.includes("t-shirt") ||
      categories.includes("t-shirts") ||
      name.includes("t-shirt") ||
      name.includes("tee")
    ) {
      newProductsData["T-Shirts"].push(product);
      console.log("Also categorized as: T-Shirts");
    }
  });

  console.log("\nFinal category counts:");
  Object.entries(newProductsData).forEach(([category, products]) => {
    console.log(`${category}: ${products.length}`);
  });

  return newProductsData;
};

export const formatPrice = (price: number | null) =>
  price === null ? "Price not available" : `R${price.toFixed(2)}`;

export const getFirstValidImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return "/placeholder-image.jpg";
  const urls = imageUrl.split(",").map(url => url.trim());
  return (
    urls.find(url => url && !url.endsWith("404")) || "/placeholder-image.jpg"
  );
};
