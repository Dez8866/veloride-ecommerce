"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function CheckoutPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [shippingAddress, setShippingAddress] = useState("");
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchCart();
  }, []);

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

  const handleCheckout = async () => {
    if (!shippingAddress) {
      toast.error("Please enter shipping address");
      return;
    }

    if (!session?.user && (!guestInfo.name || !guestInfo.email)) {
      toast.error("Please enter your details");
      return;
    }

    setProcessing(true);

    try {
      const endpoint = paymentMethod === "stripe" ? "/api/checkout/stripe" : "/api/checkout/paypal";
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart?.items,
          shippingAddress,
          guestEmail: guestInfo.email || session?.user?.email,
          guestName: guestInfo.name || session?.user?.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? "Checkout failed");
        return;
      }

      if (paymentMethod === "stripe") {
        if (data?.url) {
          window.location.href = data.url;
        }
      } else {
        const approveLink = data?.links?.find?.((link: any) => link?.rel === "approve");
        if (approveLink?.href) {
          window.location.href = approveLink.href;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
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
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <Button
              onClick={() => router.push("/products")}
              className="bg-blue-600 hover:bg-blue-700 mt-4"
            >
              Browse Products
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

          <div className="space-y-6">
            {!session?.user && (
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guestName" className="text-white">Full Name</Label>
                    <Input
                      id="guestName"
                      type="text"
                      value={guestInfo?.name ?? ""}
                      onChange={(e) => setGuestInfo({ ...guestInfo, name: e?.target?.value ?? "" })}
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestEmail" className="text-white">Email</Label>
                    <Input
                      id="guestEmail"
                      type="email"
                      value={guestInfo?.email ?? ""}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e?.target?.value ?? "" })}
                      className="bg-slate-800 border-slate-700 text-white mt-2"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e?.target?.value ?? "")}
                placeholder="Enter your full shipping address"
                className="w-full min-h-[100px] bg-slate-800 border border-slate-700 rounded-md p-3 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={(e) => setPaymentMethod(e?.target?.value ?? "stripe")}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-white">Credit Card (Stripe)</span>
                </label>
                <label className="flex items-center p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e?.target?.value ?? "paypal")}
                    className="mr-3"
                  />
                  <span className="text-white font-semibold">PayPal</span>
                </label>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart?.items?.map?.((item: any) => (
                  <div key={item?.id} className="flex justify-between text-gray-300">
                    <span>{item?.product?.name} x{item?.quantity}</span>
                    <span>${((item?.product?.price ?? 0) * (item?.quantity ?? 1))?.toFixed?.(2) ?? "0.00"}</span>
                  </div>
                )) ?? null}
              </div>
              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between text-white font-bold text-xl">
                  <span>Total</span>
                  <span>${cart?.total?.toFixed?.(2) ?? "0.00"}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${cart?.total?.toFixed?.(2) ?? "0.00"}`
              )}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
