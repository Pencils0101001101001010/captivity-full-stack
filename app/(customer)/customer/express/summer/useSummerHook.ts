// hooks/useSummerCollection.ts

import { useState, useEffect } from "react";
import { FetchSummerCollectionResult, FilteredCollection } from "../types";
import { fetchSummerCollection } from "./actions";

export const useSummerCollection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<FilteredCollection>({
    men: [],
    women: [],
    kids: [],
    unisex: [],
    hats: [],
    caps: [],
    tShirts: [],
  });

  useEffect(() => {
    const loadSummerCollection = async () => {
      try {
        setLoading(true);
        const result: FetchSummerCollectionResult =
          await fetchSummerCollection();

        if (result.success) {
          const filteredCollection: FilteredCollection = {
            men: [],
            women: [],
            kids: [],
            unisex: [],
            hats: [],
            caps: [],
            tShirts: [],
          };

          result.data.forEach(product => {
            if (product.category.includes("men"))
              filteredCollection.men.push(product);
            if (product.category.includes("women"))
              filteredCollection.women.push(product);
            if (product.category.includes("kids"))
              filteredCollection.kids.push(product);
            if (product.category.includes("unisex"))
              filteredCollection.unisex.push(product);
            if (product.category.includes("hats"))
              filteredCollection.hats.push(product);
            if (product.category.includes("caps"))
              filteredCollection.caps.push(product);
            if (product.category.includes("t-shirts"))
              filteredCollection.tShirts.push(product);
          });

          setCollection(filteredCollection);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadSummerCollection();
  }, []);

  return { collection, loading, error };
};
