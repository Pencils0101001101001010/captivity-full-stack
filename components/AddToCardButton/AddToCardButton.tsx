export default function AddToCardButton({ productId }) {
    const handleAddToCart = () => {
      // Handle add to cart logic
      console.log(`Added product ${productId} to cart`);
    };
  
    return (
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Add to Cart
      </button>
    );
  }
  