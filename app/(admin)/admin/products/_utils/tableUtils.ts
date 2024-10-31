import { TableVariation } from "../_types/table";

export const filterProducts = (
  products: TableVariation[],
  searchTerm: string,
  filterPublished: "all" | "published" | "unpublished"
) => {
  return products.filter(variation => {
    const matchesSearch =
      variation.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variation.size.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPublished =
      filterPublished === "all"
        ? true
        : filterPublished === "published"
          ? variation.isPublished
          : !variation.isPublished;

    return matchesSearch && matchesPublished;
  });
};

export const sortProducts = (
  products: TableVariation[],
  sortField: keyof TableVariation,
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
