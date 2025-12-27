"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function ProductsPage() {
  const { data: session } = useSession() || {};
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const url = filter === "all" ? "/api/products" : `/api/products?category=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data?.products ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItemCount(data?.items?.length ?? 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
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
        fetchCartCount();
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
      <Header cartItemCount={cartItemCount} />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-blue-500">Collection</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Browse through our premium selection of bikes and car toys
            </p>
          </ScrollReveal>

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

          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading products...</div>
          ) : (
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
          )}

          {!loading && products?.length === 0 && (
            <div className="text-center text-gray-400 py-20">
              No products found
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
