import React from "react";
import DeleteProduct from "./DeleteProduct";

const Page = () => {
  return (
    <div>
      <h1>Delete Product</h1>
      <DeleteProduct />
    </div>
  );
};

export default Page;

// Error: Invalid product ID

// Source
// app\(admin)\admin\products\all-collections\[id]\delete\DeleteProduct.tsx (19:15) @ handleDelete

//   17 |       );
//   18 |       if (isNaN(productId)) {
// > 19 |         throw new Error("Invalid product ID");
//      |               ^
//   20 |       }
//   21 |
//   22 |       // Call the server-side action to delete the product
