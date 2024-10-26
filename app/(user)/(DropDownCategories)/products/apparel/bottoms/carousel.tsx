/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
}

// Mock data for preview
const mockProducts: Product[] = [
  
];

const EnhancedCarousel = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const itemsPerView = 3;
  const totalSlides = Math.max(0, products.length - itemsPerView + 1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/new-in-apparel');
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isHovering && !loading && products.length > 0) {
      timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isHovering, loading, products.length, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < totalSlides - 1) {
        setActiveIndex(prev => prev + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
      }
      setTouchStart(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 text-center text-red-600 bg-red-50 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-8 py-12 bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={`p-2 rounded-full transition-all duration-200 ${
              activeIndex === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
            aria-label="Previous products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveIndex(Math.min(totalSlides - 1, activeIndex + 1))}
            disabled={activeIndex === totalSlides - 1}
            className={`p-2 rounded-full transition-all duration-200 ${
              activeIndex === totalSlides - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
            aria-label="Next products"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="w-1/3 flex-shrink-0 px-4"
            >
              <div className="group relative">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.stock < 5 && product.stock > 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        Low Stock
                      </span>
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/20">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-8 h-1 rounded-full transition-all duration-300 ${
              idx === activeIndex 
                ? 'bg-gray-900 w-12' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedCarousel;