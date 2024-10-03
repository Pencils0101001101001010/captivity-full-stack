"use client";

import React, { useState, useEffect } from "react";
import { deleteProduct, getProductDetails } from "./actions";
import { useRouter, useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";
import Image from "next/image";

type DeleteProductPageParams = {
  id: string;
};

type ProductDetails = {
  sku: string;
  imageUrl: string;
};

const DeleteProduct = () => {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null,
  );
  const router = useRouter();
  const params = useParams<DeleteProductPageParams>();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!params || !params.id) {
        setError("Product ID is missing");
        return;
      }

      const productId = parseInt(params.id, 10);
      if (isNaN(productId)) {
        setError("Invalid product ID");
        return;
      }

      try {
        const details = await getProductDetails(productId);
        setProductDetails(details);
      } catch (err: any) {
        setError(err.message || "Failed to fetch product details");
      }
    };

    fetchProductDetails();
  }, [params]);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      if (!params || !params.id) {
        throw new Error("Product ID is missing");
      }

      const productId = parseInt(params.id, 10);
      if (isNaN(productId)) {
        throw new Error("Invalid product ID");
      }

      await deleteProduct(productId);
      router.push("/admin");
    } catch (err: any) {
      setError(
        err.message || "Failed to delete the product. Please try again.",
      );
      console.error("Error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Delete Product</h2>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {productDetails && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col gap-4 items-center space-x-4">
            <div className="relative w-[400px] h-[400px]">
              <Image
                src={productDetails.imageUrl}
                alt={productDetails.sku}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Product SKU:</h3>
              <p>{productDetails.sku}</p>
            </div>
          </div>
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isDeleting || !productDetails}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product with SKU: {productDetails?.sku} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteProduct;
