"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-6 bg-red-600/20 rounded-full mb-6">
            <XCircle className="w-24 h-24 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Checkout Cancelled</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <div className="space-x-4">
            <Link href="/cart">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Return to Cart
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
