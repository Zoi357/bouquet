"use client";

import Link from "next/link";
import { ShoppingCart, Flower2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Flower2 className="text-rose-500 w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold text-xl tracking-tight text-rose-600">
            D.JOY <span className="text-gray-700 font-medium">Flower Shop</span>
          </span>
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors font-medium text-sm"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Cart</span>
          {totalQty > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalQty > 99 ? "99+" : totalQty}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
