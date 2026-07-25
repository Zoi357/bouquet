"use client";

import Image from "next/image";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/flower";
import { useCartStore } from "@/store/useCartStore";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const inCart = items.some((i) => i.product.id === product.id);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-rose-50 hover:border-rose-200 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-rose-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            {product.badge}
          </span>
        )}
        {/* Category chip */}
        <span className="absolute top-3 right-3 bg-white/90 text-rose-600 text-xs font-medium px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-base leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-rose-600 font-bold text-lg">
            ₱{product.price.toLocaleString()}
          </span>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
              ${
                added
                  ? "bg-green-500 text-white scale-95"
                  : inCart
                  ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                  : "bg-rose-500 text-white hover:bg-rose-600 active:scale-95"
              }
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <CheckCircle className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {inCart ? "Add More" : "Add to Cart"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
