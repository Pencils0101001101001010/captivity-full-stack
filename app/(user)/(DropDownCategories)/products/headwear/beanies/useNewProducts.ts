// import { useState, useEffect } from "react";
// import { fetchNewInHeadwear } from "../../_global/actions";

// interface NewProduct {
//   id: string;
//   name: string;
//   imageUrl: string;
//   stock: number;
// }

// // Define the expected response type
// interface ProductResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

// const useNewProducts = () => {
//   const [newProducts, setNewProducts] = useState<NewProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadNewProducts = async () => {
//       setLoading(true);
//       try {
//         const result = await fetchNewInHeadwear();
//         if (result.success && result.data) {
//           // Ensure we have data before setting state
//           setNewProducts(result.data);
//         } else {
//           setError(result.error || "Failed to load new products");
//         }
//       } catch (err) {
//         setError("Failed to load new products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadNewProducts();
//   }, []);

//   return { newProducts, loading, error };
// };

// export default useNewProducts;