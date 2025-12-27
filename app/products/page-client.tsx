"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface ProductsClientProps {
  initialProducts: any[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const { data: session } = useSession() || {};
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const url = filter === "all" ? "/api/products" : `/api/products?category=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data?.products ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!session?.user) {
      toast.error("Please login to add items to cart");
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
      <div className="flex flex-wrap gap-4 mb-12">
        <Button
          onClick={() => setFilter("all")}
          variant={filter === "all" ? "default" : "outline"}
          className={filter === "all" ? "bg-blue-600" : ""}
        >
          All Products
        </Button>
        <Button
          onClick={() => setFilter("bike")}
          variant={filter === "bike" ? "default" : "outline"}
          className={filter === "bike" ? "bg-blue-600" : ""}
        >
          Bikes
        </Button>
        <Button
          onClick={() => setFilter("car-toy")}
          variant={filter === "car-toy" ? "default" : "outline"}
          className={filter === "car-toy" ? "bg-blue-600" : ""}
        >
          Car Toys
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map?.((product) => (
          <ProductCard
            key={product?.id}
            id={product?.id ?? ""}
            name={product?.name ?? ""}
            price={product?.price ?? 0}
            imageUrl={product?.imageUrl ?? ""}
            category={product?.category ?? ""}
            onAddToCart={() => handleAddToCart(product?.id ?? "")}
          />
        )) ?? null}
      </div>

      {products?.length === 0 && (
        <div className="text-center text-gray-400 py-20">No products found</div>
      )}
    </>
  );
}
