"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  onAddToCart?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  onAddToCart,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-slate-900/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
    >
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square bg-slate-800/50 overflow-hidden">
          <motion.div
            animate={{
              rotateY: isHovered ? 15 : 0,
              rotateX: isHovered ? -10 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full h-full"
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {category === "bike" ? "Bike" : "Car Toy"}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-400">${price?.toFixed?.(2) ?? '0.00'}</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.();
            }}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
