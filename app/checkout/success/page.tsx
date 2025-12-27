"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, [router]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6 bg-green-600/20 rounded-full mb-6">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Order Successful!</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          <div className="space-x-4">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to Home
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Redirecting to home in 5 seconds...
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
