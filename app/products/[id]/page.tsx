import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import dynamicImport from "next/dynamic";
import { Footer } from "@/components/footer";
import { AddToCartClient } from "./add-to-cart-client";
import { Bike, Package, Shield, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

const CartHeader = dynamicImport(() => import("@/components/cart-header").then(mod => ({ default: mod.CartHeader })), {
  ssr: false,
  loading: () => <div className="h-16 bg-slate-900" />,
});

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params?.id ?? "");

  if (!product) {
    notFound();
  }

  return (
    <>
      <CartHeader />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8">
              <div className="relative aspect-square bg-slate-800/50 rounded-xl overflow-hidden">
                <Image
                  src={product?.imageUrl ?? ""}
                  alt={product?.name ?? "Product"}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex-1">
                <div className="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm mb-4">
                  {product?.category === "bike" ? "Premium Bike" : "Luxury Car Toy"}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {product?.name}
                </h1>
                <p className="text-3xl font-bold text-blue-500 mb-6">
                  ${product?.price?.toFixed?.(2) ?? "0.00"}
                </p>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  {product?.description}
                </p>

                <div className="bg-slate-900/50 rounded-lg p-6 mb-8">
                  <h3 className="text-white font-semibold mb-4">Product Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Package className="w-5 h-5 text-blue-500 mr-3" />
                      <span>In Stock: {product?.stock ?? 0} units</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Shield className="w-5 h-5 text-blue-500 mr-3" />
                      <span>Quality Guaranteed</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Truck className="w-5 h-5 text-blue-500 mr-3" />
                      <span>Fast Shipping Available</span>
                    </div>
                  </div>
                </div>
              </div>

              <AddToCartClient productId={product?.id ?? ""} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
