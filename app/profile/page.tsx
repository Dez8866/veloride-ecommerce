"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { User, Package, Mail } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    fetchOrders();
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data?.orders ?? []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-semibold">{session?.user?.name ?? "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{session?.user?.email ?? "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-white font-semibold">{orders?.length ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>

          {orders?.length === 0 ? (
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders?.map?.((order) => (
                <div
                  key={order?.id}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-semibold">Order #{order?.id?.substring?.(0, 8) ?? "N/A"}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(order?.createdAt ?? Date.now())?.toLocaleDateString?.() ?? "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-500 font-bold text-lg">
                        ${order?.total?.toFixed?.(2) ?? "0.00"}
                      </p>
                      <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                        {order?.status ?? "pending"}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Items:</p>
                    {order?.items?.map?.((item: any) => (
                      <p key={item?.id} className="text-white text-sm">
                        {item?.product?.name ?? "Product"} x{item?.quantity ?? 1}
                      </p>
                    )) ?? null}
                  </div>
                </div>
              )) ?? null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
