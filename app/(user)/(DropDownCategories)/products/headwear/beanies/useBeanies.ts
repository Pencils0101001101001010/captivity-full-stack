"use client";

import { useState, useEffect } from "react";
import { fetchBeanies, ProductWithFeaturedImage } from "./actions";

const useBeanies = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let mounted = true;
    const loadBeanies = async () => {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchBeanies();
        
        if (!mounted) return;
        
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
          // Retry logic
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff
          }
        }
      } catch (err) {
        if (!mounted) return;
        setError("An unexpected error occurred while fetching beanies.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBeanies();

    return () => {
      mounted = false;
    };
  }, [retryCount]);

  return { products, loading, error };
};

export default useBeanies;