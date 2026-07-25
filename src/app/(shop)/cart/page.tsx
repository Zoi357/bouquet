"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Flower2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { DELIVERY_FEE } from "@/data/flowers";

export default function CartPage() {
  const {
    items,
    removeItem,
    increaseQty,
    decreaseQty,
    updateCardMessage,
    setOrderNote,
    checkoutForm,
  } = useCartStore();

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Flower2 className="w-16 h-16 text-rose-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Browse our bouquets and add something beautiful.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" /> Browse Bouquets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Your Cart</h1>
      <p className="text-gray-400 mb-8 text-sm">
        {items.length} item{items.length !== 1 ? "s" : ""} — review before checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Cart Items ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-rose-50 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-rose-50 shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 leading-snug">
                      {item.product.name}
                    </h3>
                    <span className="text-xs text-rose-500 font-medium">
                      {item.product.category}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Qty + Price */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.product.id)}
                      className="w-7 h-7 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 text-rose-500 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-700 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.product.id)}
                      className="w-7 h-7 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 text-rose-500 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-rose-600">
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Card message */}
                <textarea
                  rows={2}
                  placeholder="Add a personal card message for this bouquet… (optional)"
                  value={item.cardMessage}
                  onChange={(e) =>
                    updateCardMessage(item.product.id, e.target.value)
                  }
                  className="mt-3 w-full text-sm rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                />
              </div>
            </div>
          ))}

          {/* Global order note */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-50">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Note / Special Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Any special requests for the whole order? (e.g., include a ribbon, fragrance preference…)"
              value={checkoutForm.orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full text-sm rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
          </div>
        </div>

        {/* ── Order Summary ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 sticky top-28">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-gray-500">
                  <span className="truncate max-w-[160px]">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-700">
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-rose-100 my-4" />

            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Subtotal</span>
              <span className="font-medium text-gray-700">₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>Delivery Fee</span>
              <span className="font-medium text-gray-700">₱{DELIVERY_FEE.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-bold text-gray-800 text-base border-t border-rose-100 pt-3 mb-6">
              <span>Total</span>
              <span className="text-rose-600">₱{(subtotal + DELIVERY_FEE).toLocaleString()}</span>
            </div>

            <Link
              href="/checkout/payment"
              className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-2xl font-semibold text-sm transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full mt-3 flex items-center justify-center gap-2 text-rose-500 hover:text-rose-600 text-sm font-medium transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
