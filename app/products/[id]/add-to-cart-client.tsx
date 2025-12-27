"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export function AddToCartClient({ productId }: { productId: string }) {
  const { data: session } = useSession() || {};
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast.error("Please login to add items to cart");
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        toast.success("Added to cart!");
        router.push("/cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Add to Cart
      </Button>
    </>
  );
}
