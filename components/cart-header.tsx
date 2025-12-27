"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "./header";

export function CartHeader() {
  const { data: session } = useSession() || {};
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetchCartCount();
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCartItemCount(data?.items?.length ?? 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  return <Header cartItemCount={cartItemCount} />;
}
