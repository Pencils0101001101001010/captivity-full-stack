import { mockProducts } from "@/lib/db";
import DetailPage from "../components/DetailPage";

export default function ProductPage({ params }) {
  const { id } = params || {};

  // Extracting all products
  const allProducts = Object.values(mockProducts).flatMap(
    (category) => category.products
  );

  // Finding the product by ID
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return <p>Product not found</p>;
  }

  return <DetailPage product={product} />;
}

// Use Next.js dynamic routing to pass params to the component
export async function generateStaticParams() {
  // Generate a list of possible values for `id` (optional)
  return Object.values(mockProducts).flatMap((category) =>
    category.products.map((product) => ({ id: product.id }))
  );
}
