"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  User, MapPin, CreditCard, ArrowRight,
  Phone, Mail, Calendar, Clock,
  NotebookPen, Gift, ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import {
  TimeSlot,
  AddOnType,
  ChocolateChoice,
  TeddyBearChoice,
  CHOCOLATE_PRICES,
  TEDDY_BEAR_PRICES,
} from "@/types/flower";

const TIME_SLOTS: TimeSlot[] = [
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 9:00 PM",
];

const CHOCOLATE_OPTIONS = Object.keys(CHOCOLATE_PRICES) as ChocolateChoice[];
const TEDDY_OPTIONS = Object.keys(TEDDY_BEAR_PRICES) as TeddyBearChoice[];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function PaymentPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const {
    checkoutForm,
    updateSenderField,
    updateRecipientField,
    setPaymentMethod,
    setOrderNote,
    setBouquetNote,
    setAddOnType,
    setChocolateChoice,
    setTeddyBearChoice,
  } = useCartStore();

  useEffect(() => {
    if (items.length === 0) router.replace("/");
  }, [items, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/checkout/summary");
  }

  const { sender, recipient, paymentMethod, bouquetNote, orderNote, addOn } = checkoutForm;
  const needsChocolate = addOn.type === "chocolate" || addOn.type === "both";
  const needsTeddy    = addOn.type === "teddy_bear"  || addOn.type === "both";

  // Live add-on price preview
  const addOnTotal =
    (needsChocolate && addOn.chocolateChoice
      ? CHOCOLATE_PRICES[addOn.chocolateChoice as ChocolateChoice]
      : 0) +
    (needsTeddy && addOn.teddyBearChoice
      ? TEDDY_BEAR_PRICES[addOn.teddyBearChoice as TeddyBearChoice]
      : 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8 text-xs font-medium">
        <span className="text-gray-400">Cart</span>
        <div className="h-px flex-1 bg-rose-200" />
        <span className="bg-rose-500 text-white px-3 py-1 rounded-full">Delivery & Payment</span>
        <div className="h-px flex-1 bg-rose-200" />
        <span className="text-gray-400">Summary</span>
        <div className="h-px flex-1 bg-rose-200" />
        <span className="text-gray-400">Done</span>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Delivery & Payment</h1>
      <p className="text-gray-400 text-sm mb-8">No account needed — fill in the details below.</p>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Sender Info ─────────────────────────────────────────────────────── */}
        <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <legend className="flex items-center gap-2 font-bold text-gray-800 text-base mb-5">
            <User className="w-4 h-4 text-rose-500" /> Sender Information
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required placeholder="e.g. Maria Santos"
                value={sender.name}
                onChange={(e) => updateSenderField("name", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="tel" required placeholder="09XX XXX XXXX"
                value={sender.phone}
                onChange={(e) => updateSenderField("phone", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                  <span className="text-gray-400 font-normal">(optional)</span>
                </span>
              </label>
              <input
                type="email" placeholder="you@example.com"
                value={sender.email}
                onChange={(e) => updateSenderField("email", e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </fieldset>

        {/* ── Recipient Info ───────────────────────────────────────────────────── */}
        <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <legend className="flex items-center gap-2 font-bold text-gray-800 text-base mb-5">
            <MapPin className="w-4 h-4 text-rose-500" /> Recipient & Delivery Details
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Recipient Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text" required placeholder="e.g. Juan Dela Cruz"
                value={recipient.name}
                onChange={(e) => updateRecipientField("name", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Recipient Phone <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="tel" required placeholder="09XX XXX XXXX"
                value={recipient.phone}
                onChange={(e) => updateRecipientField("phone", e.target.value)}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required rows={2}
                placeholder="Full address including barangay, city, and landmark"
                value={recipient.address}
                onChange={(e) => updateRecipientField("address", e.target.value)}
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Delivery Date <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="date" required min={getToday()}
                value={recipient.deliveryDate}
                onChange={(e) => updateRecipientField("deliveryDate", e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time Slot <span className="text-rose-500">*</span>
                </span>
              </label>
              <div className="relative">
                <select
                  required
                  value={recipient.timeSlot}
                  onChange={(e) => updateRecipientField("timeSlot", e.target.value as TimeSlot)}
                  className="input-field appearance-none pr-8"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* ── Bouquet Request / Note ───────────────────────────────────────────── */}
        <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <legend className="flex items-center gap-2 font-bold text-gray-800 text-base mb-2">
            <NotebookPen className="w-4 h-4 text-rose-500" /> Bouquet Request
          </legend>
          <p className="text-xs text-gray-400 mb-4">
            Any specific arrangement, color preference, flower type, or styling request for your bouquet?
          </p>
          <textarea
            rows={3}
            placeholder='e.g. "Please use mostly white roses, wrap in kraft paper, and add a small ribbon bow."'
            value={bouquetNote}
            onChange={(e) => setBouquetNote(e.target.value)}
            className="input-field resize-none"
          />
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Order Note / Special Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Any other notes for the whole order… (e.g. keep it a surprise, ring doorbell twice)"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="input-field resize-none"
            />
          </div>
        </fieldset>

        {/* ── Add-ons ──────────────────────────────────────────────────────────── */}
        <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <legend className="flex items-center gap-2 font-bold text-gray-800 text-base mb-2">
            <Gift className="w-4 h-4 text-rose-500" /> Add-ons
          </legend>
          <p className="text-xs text-gray-400 mb-5">
            Make it extra special! Pair your bouquet with chocolates, a teddy bear, or both.
          </p>

          {/* Add-on type selector — card radio buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {(
              [
                { value: "none",      emoji: "🚫", label: "None" },
                { value: "chocolate", emoji: "🍫", label: "Chocolates" },
                { value: "teddy_bear",emoji: "🧸", label: "Teddy Bear" },
                { value: "both",      emoji: "🎁", label: "Both!" },
              ] as { value: AddOnType; emoji: string; label: string }[]
            ).map(({ value, emoji, label }) => (
              <label
                key={value}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-xl border-2 cursor-pointer transition-all text-center
                  ${addOn.type === value
                    ? "border-rose-400 bg-rose-50 shadow-md shadow-rose-100"
                    : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
                  }`}
              >
                <input
                  type="radio" name="addon" value={value}
                  checked={addOn.type === value}
                  onChange={() => setAddOnType(value)}
                  className="sr-only"
                />
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Chocolate picker */}
          {needsChocolate && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                🍫 Choose Chocolate <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required={needsChocolate}
                  value={addOn.chocolateChoice}
                  onChange={(e) => setChocolateChoice(e.target.value as ChocolateChoice)}
                  className="input-field appearance-none pr-8"
                >
                  <option value="">— Select a chocolate —</option>
                  {CHOCOLATE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c} — ₱{CHOCOLATE_PRICES[c].toLocaleString()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Teddy bear picker */}
          {needsTeddy && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                🧸 Choose Teddy Bear <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required={needsTeddy}
                  value={addOn.teddyBearChoice}
                  onChange={(e) => setTeddyBearChoice(e.target.value as TeddyBearChoice)}
                  className="input-field appearance-none pr-8"
                >
                  <option value="">— Select a teddy bear —</option>
                  {TEDDY_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t} — ₱{TEDDY_BEAR_PRICES[t].toLocaleString()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Live add-on price preview */}
          {addOn.type !== "none" && addOnTotal > 0 && (
            <div className="mt-4 flex items-center justify-between bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm">
              <span className="text-gray-500">Add-on Total</span>
              <span className="font-bold text-rose-600">+₱{addOnTotal.toLocaleString()}</span>
            </div>
          )}
        </fieldset>

        {/* ── Payment Method ───────────────────────────────────────────────────── */}
        <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <legend className="flex items-center gap-2 font-bold text-gray-800 text-base mb-5">
            <CreditCard className="w-4 h-4 text-rose-500" /> Payment Method
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${paymentMethod === "gcash" ? "border-rose-400 bg-rose-50" : "border-gray-200 hover:border-rose-200"}`}>
              <input
                type="radio" name="payment" value="gcash"
                checked={paymentMethod === "gcash"}
                onChange={() => setPaymentMethod("gcash")}
                className="mt-1 accent-rose-500"
              />
              <div>
                <p className="font-semibold text-gray-800">GCash</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  You will receive GCash payment details after placing your order.
                </p>
              </div>
            </label>
            <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${paymentMethod === "cod" ? "border-rose-400 bg-rose-50" : "border-gray-200 hover:border-rose-200"}`}>
              <input
                type="radio" name="payment" value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mt-1 accent-rose-500"
              />
              <div>
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pay in cash when your bouquet arrives at your door.
                </p>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-[.98] text-white py-4 rounded-2xl font-bold text-base transition-all"
        >
          Review Order <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #fecdd3;
          background: #fff8f8;
          color: #374151;
          font-size: 0.875rem;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input-field::placeholder { color: #9ca3af; }
        .input-field:focus {
          outline: none;
          border-color: #fb7185;
          box-shadow: 0 0 0 3px #fecdd3;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease-out both; }
      `}</style>
    </div>
  );
}
