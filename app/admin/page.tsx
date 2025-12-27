"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Mail, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    if (session.user.role !== "admin") {
      router.push("/");
      toast.error("Unauthorized access");
      return;
    }
    fetchData();
  }, [session, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products") {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(data?.products ?? []);
      } else if (activeTab === "orders") {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data?.orders ?? []);
      } else if (activeTab === "contacts") {
        const res = await fetch("/api/admin/contacts");
        const data = await res.json();
        setContacts(data?.contacts ?? []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (res.ok) {
        toast.success("Order status updated");
        fetchData();
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("An error occurred");
    }
  };

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, status }),
      });

      if (res.ok) {
        toast.success("Contact status updated");
        fetchData();
      } else {
        toast.error("Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => setActiveTab("products")}
              variant={activeTab === "products" ? "default" : "outline"}
              className={activeTab === "products" ? "bg-blue-600" : ""}
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </Button>
            <Button
              onClick={() => setActiveTab("orders")}
              variant={activeTab === "orders" ? "default" : "outline"}
              className={activeTab === "orders" ? "bg-blue-600" : ""}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </Button>
            <Button
              onClick={() => setActiveTab("contacts")}
              variant={activeTab === "contacts" ? "default" : "outline"}
              className={activeTab === "contacts" ? "bg-blue-600" : ""}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contacts
            </Button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading...</div>
          ) : (
            <>
              {activeTab === "products" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Products ({products?.length ?? 0})</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-white py-3 px-4">Name</th>
                          <th className="text-left text-white py-3 px-4">Category</th>
                          <th className="text-left text-white py-3 px-4">Price</th>
                          <th className="text-left text-white py-3 px-4">Stock</th>
                          <th className="text-left text-white py-3 px-4">Featured</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products?.map?.((product) => (
                          <tr key={product?.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                            <td className="text-white py-3 px-4">{product?.name ?? "N/A"}</td>
                            <td className="text-gray-400 py-3 px-4">{product?.category ?? "N/A"}</td>
                            <td className="text-blue-400 py-3 px-4">${product?.price?.toFixed?.(2) ?? "0.00"}</td>
                            <td className="text-gray-400 py-3 px-4">{product?.stock ?? 0}</td>
                            <td className="text-gray-400 py-3 px-4">
                              {product?.featured ? "Yes" : "No"}
                            </td>
                          </tr>
                        )) ?? null}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white mb-6">Orders ({orders?.length ?? 0})</h2>
                  {orders?.map?.((order) => (
                    <div
                      key={order?.id}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-white font-semibold">
                            Order #{order?.id?.substring?.(0, 8) ?? "N/A"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {order?.user?.email ?? order?.guestEmail ?? "Guest"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(order?.createdAt ?? Date.now())?.toLocaleDateString?.() ?? "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-500 font-bold text-lg">
                            ${order?.total?.toFixed?.(2) ?? "0.00"}
                          </p>
                          <select
                            value={order?.status ?? "pending"}
                            onChange={(e) => updateOrderStatus(order?.id ?? "", e?.target?.value ?? "pending")}
                            className="mt-2 bg-slate-800 text-white px-3 py-1 rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      <div className="border-t border-slate-800 pt-4">
                        <p className="text-gray-400 text-sm mb-2">Items:</p>
                        {order?.items?.map?.((item: any) => (
                          <p key={item?.id} className="text-white text-sm">
                            {item?.product?.name ?? "Product"} x{item?.quantity ?? 1} - ${(item?.price ?? 0)?.toFixed?.(2) ?? "0.00"}
                          </p>
                        )) ?? null}
                      </div>
                    </div>
                  )) ?? null}
                </div>
              )}

              {activeTab === "contacts" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Contact Submissions ({contacts?.length ?? 0})
                  </h2>
                  {contacts?.map?.((contact) => (
                    <div
                      key={contact?.id}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-white font-semibold">{contact?.name ?? "N/A"}</p>
                          <p className="text-gray-400 text-sm">{contact?.email ?? "N/A"}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(contact?.createdAt ?? Date.now())?.toLocaleDateString?.() ?? "N/A"}
                          </p>
                        </div>
                        <select
                          value={contact?.status ?? "new"}
                          onChange={(e) => updateContactStatus(contact?.id ?? "", e?.target?.value ?? "new")}
                          className="bg-slate-800 text-white px-3 py-1 rounded text-sm"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="border-t border-slate-800 pt-4">
                        <p className="text-white font-medium mb-2">{contact?.subject ?? "N/A"}</p>
                        <p className="text-gray-300 text-sm">{contact?.message ?? "N/A"}</p>
                      </div>
                    </div>
                  )) ?? null}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
