import React from "react";
import parse from "react-html-parser";
import Image from "next/image";

interface ProductCardProps {
  sku: string;
  description: string;
  imageUrl: string;
  isInStock: boolean;
  isFeatured: boolean;
  allowReviews: boolean;
  categories: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  sku,
  description,
  imageUrl,
  isInStock,
  isFeatured,
  allowReviews,
  categories,
}) => {
  // Replace "\n" with "<br />" in the description for proper line breaks
  const formattedDescription = description.replace(/\n/g, "<br />");

  // Split categories by comma and remove extra spaces
  const formattedCategories = categories.split(",").map((cat) => cat.trim());

  return (
    <div className="border p-4 rounded shadow-lg max-w-md mx-auto bg-white">
      {/* Product Image */}
      <div className="mb-4">
        <Image
          src={imageUrl}
          alt={sku}
          width={400} // Define a specific width
          height={300} // Define a specific height
          style={{ height: "auto", width: "100%" }} // Ensure aspect ratio is maintained
          className="rounded"
        />
      </div>

      {/* SKU */}
      <h2 className="text-2xl font-bold mb-2">SKU: {sku}</h2>

      {/* Description */}
      <div className="mb-4">
        <strong>Description:</strong>
        <div>{parse(formattedDescription)}</div>
      </div>

      {/* Stock Status */}
      <div className="mb-4">
        <strong>Stock Status:</strong> {isInStock ? "In Stock" : "Out of Stock"}
      </div>

      {/* Featured */}
      <div className="mb-4">
        <strong>Featured:</strong> {isFeatured ? "Yes" : "No"}
      </div>

      {/* Reviews Allowed */}
      <div className="mb-4">
        <strong>Reviews Allowed:</strong> {allowReviews ? "Yes" : "No"}
      </div>

      {/* Categories */}
      <div className="mb-4">
        <strong>Categories:</strong>
        <ul>
          {formattedCategories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
