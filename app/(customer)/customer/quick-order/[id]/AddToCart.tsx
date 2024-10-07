import { Button } from "@/components/ui/button";
import React from "react";

interface AddToCartProps {
  quantity: number;
}

const AddToCart: React.FC<AddToCartProps> = ({ quantity }) => {
  return (
    <div>
      <Button>Add to Cart</Button>
    </div>
  );
};

export default AddToCart;
