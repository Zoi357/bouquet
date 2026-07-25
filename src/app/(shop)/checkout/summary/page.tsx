"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import {
  User,
  MapPin,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Calendar,
  Clock,
  Phone,
  Mail,
  NotebookPen,
  Gift,
} from "lucide-react";
import { useCartStore, generateTrackingCode } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { DELIVERY_FEE } from "@/data/flowers";
import {
  ChocolateChoice,
  TeddyBearChoice,
  CHOCOLATE_PRICES,
  TEDDY_BEAR_PRICES,
} from "@/types/flower";

export default function SummaryPage() {
  const router = useRouter();
  const { items, checkoutForm, clearCart, setTrackingCode } = useCartStore();
  const addOrder = useOrderStore((s) => s.addOrder);

  // Redirect if cart or form incomplete
  useEffect(() => {
    if (items.length === 0) router.replace("/");
  }, [items, router]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const { sender, recipient, paymentMethod, orderNote, bouquetNote, addOn } = checkoutForm;

  // Calculate add-on cost
  const chocolateCost =
    (addOn.type === "chocolate" || addOn.type === "both") && addOn.chocolateChoice
      ? CHOCOLATE_PRICES[addOn.chocolateChoice as ChocolateChoice]
      : 0;
  const teddyCost =
    (addOn.type === "teddy_bear" || addOn.type === "both") && addOn.teddyBearChoice
      ? TEDDY_BEAR_PRICES[addOn.teddyBearChoice as TeddyBearChoice]
      : 0;
  const addOnTotal = chocolateCost + teddyCost;

  function handlePlaceOrder() {
    const code = generateTrackingCode();
    // Save full order snapshot to the orders store (admin will read this)
    addOrder({
      id: code,
      placedAt: new Date().toISOString(),
      items: [...items],
      form: { ...checkoutForm },
      subtotal,
      addOnTotal,
      deliveryFee: DELIVERY_FEE,
      grandTotal: subtotal + DELIVERY_FEE + addOnTotal,
      status: "Pending",
    });
    setTrackingCode(code);
    clearCart();
    router.push(`/success/${code}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8 text-xs font-medium">
        <span className="text-gray-400">Cart</span>
        <div className="h-px flex-1 bg-rose-300" />
        <span className="text-gray-400">Delivery & Payment</span>
        <div className="h-px flex-1 bg-rose-300" />
        <span className="bg-rose-500 text-white px-3 py-1 rounded-full">Summary</span>
        <div className="h-px flex-1 bg-rose-200" />
        <span className="text-gray-400">Done</span>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Order Summary</h1>
      <p className="text-gray-400 text-sm mb-8">
        Please review all details before placing your order.
      </p>

      <div className="space-y-5">
        {/* ── Items ──────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
          <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
            <ShoppingBag className="w-4 h-4 text-rose-500" /> Bouquets Ordered
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 text-sm leading-snug truncate">
                    {item.product.name}
                  </p>
                  {item.cardMessage && (
                    <p className="text-xs text-rose-400 italic truncate">
                      "{item.cardMessage}"
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">× {item.quantity}</p>
                  <p className="font-semibold text-gray-700 text-sm">
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {orderNote && (
            <div className="mt-4 bg-rose-50 rounded-xl p-3 text-xs text-rose-700">
              <strong>Order Note:</strong> {orderNote}
            </div>
          )}
        </div>

        {/* ── Bouquet Request & Add-ons ───────────────────────────────────────── */}
        {(bouquetNote || addOn.type !== "none") && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
            <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
              <Gift className="w-4 h-4 text-rose-500" /> Special Requests & Add-ons
            </h2>

            {bouquetNote && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                  <NotebookPen className="w-3 h-3" /> Bouquet Request
                </div>
                <p className="text-sm text-gray-700 bg-rose-50 rounded-xl px-3 py-2 italic">
                  &quot;{bouquetNote}&quot;
                </p>
              </div>
            )}

            {addOn.type !== "none" && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                  <Gift className="w-3 h-3" /> Add-ons Selected
                </div>
                {(addOn.type === "chocolate" || addOn.type === "both") && addOn.chocolateChoice && (
                  <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-gray-700">🍫 {addOn.chocolateChoice}</span>
                    <span className="font-semibold text-amber-700">
                      +₱{CHOCOLATE_PRICES[addOn.chocolateChoice as ChocolateChoice].toLocaleString()}
                    </span>
                  </div>
                )}
                {(addOn.type === "teddy_bear" || addOn.type === "both") && addOn.teddyBearChoice && (
                  <div className="flex justify-between items-center bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-gray-700">🧸 {addOn.teddyBearChoice}</span>
                    <span className="font-semibold text-purple-700">
                      +₱{TEDDY_BEAR_PRICES[addOn.teddyBearChoice as TeddyBearChoice].toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Sender ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
          <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
            <User className="w-4 h-4 text-rose-500" /> Sender
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <InfoRow label="Name" value={sender.name} />
            <InfoRow
              label={<><Phone className="w-3 h-3 inline mr-1" />Phone</>}
              value={sender.phone}
            />
            {sender.email && (
              <InfoRow
                label={<><Mail className="w-3 h-3 inline mr-1" />Email</>}
                value={sender.email}
              />
            )}
          </div>
        </div>

        {/* ── Recipient ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
          <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
            <MapPin className="w-4 h-4 text-rose-500" /> Recipient & Delivery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <InfoRow label="Name" value={recipient.name} />
            <InfoRow
              label={<><Phone className="w-3 h-3 inline mr-1" />Phone</>}
              value={recipient.phone}
            />
            <InfoRow label="Address" value={recipient.address} className="sm:col-span-2" />
            <InfoRow
              label={<><Calendar className="w-3 h-3 inline mr-1" />Date</>}
              value={new Date(recipient.deliveryDate + "T00:00:00").toLocaleDateString("en-PH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <InfoRow
              label={<><Clock className="w-3 h-3 inline mr-1" />Time Slot</>}
              value={recipient.timeSlot}
            />
          </div>
        </div>

        {/* ── Payment ────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
          <h2 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
            <CreditCard className="w-4 h-4 text-rose-500" /> Payment Method
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                paymentMethod === "gcash"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {paymentMethod === "gcash" ? "GCash" : "Cash on Delivery"}
            </span>
            <span className="text-xs text-gray-400">
              {paymentMethod === "gcash"
                ? "Payment details will be sent after order confirmation."
                : "Pay in cash upon delivery."}
            </span>
          </div>
        </div>

        {/* ── Cost Breakdown ─────────────────────────────────────────────────── */}
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
          <h2 className="font-bold text-gray-800 mb-3">Cost Breakdown</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-gray-500">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₱{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-gray-500 pt-2 border-t border-rose-200">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span>₱{DELIVERY_FEE.toLocaleString()}</span>
            </div>
            {addOnTotal > 0 && (
              <>
                {chocolateCost > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>🍫 Chocolate Add-on</span>
                    <span>₱{chocolateCost.toLocaleString()}</span>
                  </div>
                )}
                {teddyCost > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>🧸 Teddy Bear Add-on</span>
                    <span>₱{teddyCost.toLocaleString()}</span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-rose-200">
              <span>Grand Total</span>
              <span className="text-rose-600">
                ₱{(subtotal + DELIVERY_FEE + addOnTotal).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePlaceOrder}
          className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-[.98] text-white py-4 rounded-2xl font-bold text-base transition-all"
        >
          <CheckCircle className="w-5 h-5" /> Place Order
        </button>
        <p className="text-center text-xs text-gray-400">
          By placing this order you agree to our delivery terms and policies.
        </p>
      </div>
    </div>
  );
}

// ── Helper component ────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  className = "",
}: {
  label: React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-gray-400 text-xs">{label}</span>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}
