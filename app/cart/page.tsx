"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function CartPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    fetchCart();
  }, [session]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Removed from cart");
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <p className="text-gray-400">Loading cart...</p>
        </div>
      </>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some products to get started</p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Header cartItemCount={cart?.items?.length ?? 0} />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart?.items?.map?.((item: any) => (
                <div
                  key={item?.id}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 flex gap-6"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden">
                    <Image
                      src={item?.product?.imageUrl ?? ""}
                      alt={item?.product?.name ?? ""}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item?.product?.name}
                    </h3>
                    <p className="text-blue-500 font-bold">
                      ${item?.product?.price?.toFixed?.(2) ?? "0.00"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item?.id ?? "")}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item?.id ?? "", Math.max(1, (item?.quantity ?? 1) - 1))
                        }
                        className="h-8 w-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-white w-8 text-center">
                        {item?.quantity ?? 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item?.id ?? "", (item?.quantity ?? 1) + 1)
                        }
                        className="h-8 w-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )) ?? null}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${cart?.total?.toFixed?.(2) ?? "0.00"}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>${cart?.total?.toFixed?.(2) ?? "0.00"}</span>
                    </div>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
