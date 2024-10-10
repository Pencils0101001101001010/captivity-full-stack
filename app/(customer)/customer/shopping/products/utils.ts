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

    const isExplicitlyFor = (gender: string) =>
      name.includes(gender) ||
      name.includes(gender === "men" ? "male" : "female") ||
      (gender === "women" &&
        (name.includes("ladies") || name.includes("women's")));

    if (categories.includes("new arrivals") || categories.includes("new in")) {
      newProductsData.New.push(product);
    }

    if (categories.includes("kids")) {
      newProductsData.Kids.push(product);
    } else if (
      categories.includes("headwear") ||
      categories.includes("hats") ||
      name.includes("hat") ||
      name.includes("cap") ||
      name.includes("visor")
    ) {
      newProductsData.Headwear.push(product);
    } else if (name.includes("unisex") || name.includes("uni-sex")) {
      newProductsData.Unisex.push(product);
    } else if (
      isExplicitlyFor("women") ||
      name.includes("ladies") ||
      name.includes("woman")
    ) {
      newProductsData.Women.push(product);
    } else if (isExplicitlyFor("men") || name.includes("mens")) {
      newProductsData.Men.push(product);
    } else if (categories.includes("women") && !categories.includes("men")) {
      newProductsData.Women.push(product);
    } else if (categories.includes("men") && !categories.includes("women")) {
      newProductsData.Men.push(product);
    } else if (categories.includes("men") && categories.includes("women")) {
      if (name.includes("women") || name.includes("ladies")) {
        newProductsData.Women.push(product);
      } else {
        newProductsData.Men.push(product);
      }
    } else {
      newProductsData.Unisex.push(product);
    }

    if (
      type.includes("t-shirt") ||
      categories.includes("t-shirts") ||
      name.includes("t-shirt")
    ) {
      newProductsData["T-Shirts"].push(product);
    }
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


