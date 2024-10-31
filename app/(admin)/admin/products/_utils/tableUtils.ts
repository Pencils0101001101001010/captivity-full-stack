import { TableProduct } from "../_types/table";

export const calculateTotals = (variations: TableProduct["variations"]) => {
  const totalQuantity = variations.reduce(
    (sum, var_) => sum + var_.quantity,
    0
  );
  const uniqueColors = new Set(variations.map(var_ => var_.color)).size;
  const uniqueSizes = new Set(variations.map(var_ => var_.size)).size;
  return { totalQuantity, uniqueColors, uniqueSizes };
};

export const filterProducts = (
  products: TableProduct[],
  searchTerm: string,
  filterPublished: "all" | "published" | "unpublished"
) => {
  return products.filter(product => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesPublished =
      filterPublished === "all"
        ? true
        : filterPublished === "published"
          ? product.isPublished
          : !product.isPublished;

    return matchesSearch && matchesPublished;
  });
};

export const sortProducts = (
  products: TableProduct[],
  sortField: keyof TableProduct,
  sortDirection: "asc" | "desc"
) => {
  return [...products].sort((a, b) => {
    if (sortField === "sellingPrice") {
      return sortDirection === "asc"
        ? a.sellingPrice - b.sellingPrice
        : b.sellingPrice - a.sellingPrice;
    }
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return sortDirection === "asc"
      ? a[sortField].toString().localeCompare(b[sortField].toString())
      : b[sortField].toString().localeCompare(a[sortField].toString());
  });
};
