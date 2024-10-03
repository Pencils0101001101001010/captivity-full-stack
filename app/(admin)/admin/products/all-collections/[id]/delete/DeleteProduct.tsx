"use client";

import React, { useState } from "react";
import { deleteProduct } from "./actions";
import { useRouter } from "next/navigation";

const DeleteProduct = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      // Get the product ID from the URL
      const productId = parseInt(
        window.location.pathname.split("/").pop() || "",
        10
      );
      if (isNaN(productId)) {
        throw new Error("Invalid product ID");
      }

      // Call the server-side action to delete the product
      await deleteProduct(productId);

      // If successful, redirect to the admin page
      router.push("/admin");
    } catch (err: any) {
      // Catch any errors and display them
      setError(
        err.message || "Failed to delete the product. Please try again."
      );
      console.error("Error:", err);
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleDelete}>Delete Product</button>
    </div>
  );
};

export default DeleteProduct;
