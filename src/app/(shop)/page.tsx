"use client";

import { useState, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, Flower, Sparkles, X, ShoppingCart, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/data/flowers";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import ProductCard from "@/components/ProductCard";
import { FlowerCategory } from "@/types/flower";

// ── Petal SVG shape ──────────────────────────────────────────────────────────
function Petal({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 60" aria-hidden="true" className="absolute pointer-events-none" style={style}>
      <ellipse cx="20" cy="30" rx="12" ry="26" />
    </svg>
  );
}

const PETALS = [
  { id: 1,  top: "6%",  left: "4%",  size: 28, rot: -30, dur: 2.5, delay: 0.0,  fill: "rgba(251,113,133,0.45)" },
  { id: 2,  top: "12%", left: "80%", size: 20, rot:  45, dur: 3.2, delay: 0.5,  fill: "rgba(249,168,212,0.40)" },
  { id: 3,  top: "28%", left: "10%", size: 24, rot:  15, dur: 2.8, delay: 0.3,  fill: "rgba(253,164,175,0.55)" },
  { id: 4,  top: "4%",  left: "52%", size: 18, rot: -55, dur: 3.5, delay: 0.8,  fill: "rgba(251,113,133,0.35)" },
  { id: 5,  top: "50%", left: "88%", size: 32, rot:  70, dur: 2.6, delay: 0.2,  fill: "rgba(249,168,212,0.40)" },
  { id: 6,  top: "68%", left: "2%",  size: 22, rot: -20, dur: 3.0, delay: 0.7,  fill: "rgba(253,164,175,0.50)" },
  { id: 7,  top: "78%", left: "68%", size: 26, rot:  35, dur: 3.3, delay: 0.4,  fill: "rgba(251,113,133,0.35)" },
  { id: 8,  top: "38%", left: "45%", size: 16, rot: -65, dur: 2.2, delay: 1.2,  fill: "rgba(249,168,212,0.40)" },
  { id: 9,  top: "88%", left: "28%", size: 30, rot:  10, dur: 2.9, delay: 0.6,  fill: "rgba(253,164,175,0.45)" },
  { id: 10, top: "18%", left: "33%", size: 14, rot:  80, dur: 4.0, delay: 0.1,  fill: "rgba(249,168,212,0.35)" },
  { id: 11, top: "58%", left: "20%", size: 20, rot: -40, dur: 2.7, delay: 1.0,  fill: "rgba(251,113,133,0.40)" },
  { id: 12, top: "42%", left: "73%", size: 18, rot:  55, dur: 3.1, delay: 0.4,  fill: "rgba(253,164,175,0.50)" },
  { id: 13, top: "22%", left: "60%", size: 22, rot: -15, dur: 3.0, delay: 1.4,  fill: "rgba(249,168,212,0.45)" },
  { id: 14, top: "75%", left: "48%", size: 16, rot:  30, dur: 3.8, delay: 0.3,  fill: "rgba(251,113,133,0.35)" },
];

const FLOWER_TYPES = [
  "Roses", "Sunflowers", "Tulips", "Lilies", "Peonies",
  "Orchids", "Carnations", "Daisies", "Lavender", "Mixed Wildflowers",
];

const WRAP_STYLES = [
  "Kraft Paper", "Satin Ribbon Wrap", "Floral Net", "Rustic Twine",
  "Pastel Tissue Paper", "Luxury Box Arrangement",
];

const COLOR_PALETTES = [
  "Red & White", "Pink & Cream", "Purple & Lavender",
  "Yellow & Orange", "Blue & White", "All White",
  "Rainbow Mix", "Pastel Mix",
];

const PRICE_RANGES: { label: string; value: string; min: number; max: number }[] = [
  { label: "All Prices",       value: "all",       min: 0,    max: Infinity },
  { label: "Under ₱400",       value: "under400",  min: 0,    max: 399      },
  { label: "₱400 – ₱700",      value: "400-700",   min: 400,  max: 700      },
  { label: "₱700 – ₱1,000",    value: "700-1000",  min: 700,  max: 1000     },
  { label: "₱1,000 – ₱1,500",  value: "1000-1500", min: 1000, max: 1500     },
  { label: "₱1,500 – ₱2,500",  value: "1500-2500", min: 1500, max: 2500     },
  { label: "Over ₱2,500",      value: "over2500",  min: 2500, max: Infinity },
];

// ── Custom bouquet placeholder product ───────────────────────────────────────
function buildCustomProduct(name: string) {
  return {
    id: `custom-order-${Date.now()}`,
    name: name || "Custom Bouquet",
    description: "Custom-made bouquet as requested.",
    price: 0,          // florist will quote price
    category: "Romantic" as FlowerCategory,
    image: "/flowers/custom-placeholder.jpg",
    inStock: true,
  };
}

export default function HomePage() {
  const getAllProducts = useProductStore((s) => s.getAllProducts);
  const addItem = useCartStore((s) => s.addItem);
  const setBouquetNote = useCartStore((s) => s.setBouquetNote);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | FlowerCategory>("All");
  const [priceRange, setPriceRange] = useState<string>("all");

  // ── Customize modal state ────────────────────────────────────────────────
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedWrap, setSelectedWrap] = useState("");
  const [stemCount, setStemCount] = useState("12");
  const [extraNote, setExtraNote] = useState("");
  const [added, setAdded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const allProducts = getAllProducts();
  const activePriceRange = PRICE_RANGES.find((r) => r.value === priceRange) ?? PRICE_RANGES[0];

  const filtered = useMemo(() => {
    return allProducts.filter((f) => {
      const matchCat   = activeCategory === "All" || f.category === activeCategory;
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());
      const matchPrice = f.price >= activePriceRange.min && f.price <= activePriceRange.max;
      return matchCat && matchSearch && matchPrice;
    });
  }, [allProducts, search, activeCategory, activePriceRange]);

  // ── Pill toggle helpers ───────────────────────────────────────────────────
  function toggleFlower(f: string) {
    setSelectedFlowers((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }
  function toggleColor(c: string) {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  // ── Add custom bouquet to cart ────────────────────────────────────────────
  function handleAddCustom() {
    if (selectedFlowers.length === 0 && !extraNote.trim()) {
      alert("Please pick at least one flower type or describe your bouquet.");
      return;
    }

    // Build a readable note for the florist
    const parts: string[] = [];
    if (customName.trim()) parts.push(`Name: ${customName.trim()}`);
    if (selectedFlowers.length) parts.push(`Flowers: ${selectedFlowers.join(", ")}`);
    if (selectedColors.length)  parts.push(`Colors: ${selectedColors.join(", ")}`);
    if (selectedWrap)            parts.push(`Wrap: ${selectedWrap}`);
    if (stemCount)               parts.push(`Stems: ~${stemCount}`);
    if (extraNote.trim())        parts.push(`Note: ${extraNote.trim()}`);

    const fullNote = parts.join(" | ");

    // Add a placeholder product to cart and store the note
    const product = buildCustomProduct(customName || "Custom Bouquet");
    addItem(product);
    setBouquetNote(fullNote);

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      closeModal();
    }, 1200);
  }

  function closeModal() {
    setShowCustom(false);
    setCustomName("");
    setSelectedFlowers([]);
    setSelectedColors([]);
    setSelectedWrap("");
    setStemCount("12");
    setExtraNote("");
    setAdded(false);
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 px-4">
        <style>{`
          @keyframes petalFloat {
            0%   { transform: translateY(0px)   rotate(var(--rot)); }
            25%  { transform: translateY(-14px) rotate(calc(var(--rot) + 8deg)); }
            50%  { transform: translateY(-8px)  rotate(calc(var(--rot) - 6deg)); }
            75%  { transform: translateY(-18px) rotate(calc(var(--rot) + 4deg)); }
            100% { transform: translateY(0px)   rotate(var(--rot)); }
          }
        `}</style>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {PETALS.map((p) => (
          <Petal key={p.id} style={{
            top: p.top, left: p.left, width: p.size, height: p.size * 1.5,
            fill: p.fill,
            ["--rot" as string]: `${p.rot}deg`,
            animation: `petalFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }} />
        ))}

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Flower className="w-4 h-4" /> Fresh blooms, same-day delivery
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Say it with <span className="text-rose-500">Flowers</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Handcrafted bouquets for every occasion — from heartfelt romances to grand celebrations. Guest checkout, no account needed.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bouquets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-rose-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <section className="sticky top-[61px] z-40 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-rose-400 shrink-0 mr-1" />

          {/* Category pills */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as "All" | FlowerCategory)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all
                ${activeCategory === cat
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
            >
              {cat}
            </button>
          ))}

          {/* Price dropdown */}
          <div className="shrink-0 relative ml-1">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className={`appearance-none pl-4 pr-8 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300
                ${priceRange !== "all"
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
                  : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"
                }`}
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
              ${priceRange !== "all" ? "text-white" : "text-rose-400"}`} />
          </div>

          {/* ── Customize Bouquet button ── */}
          <button
            onClick={() => setShowCustom(true)}
            className="shrink-0 ml-1 flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold
              bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200
              hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Customize Bouquet
          </button>
        </div>
      </section>

      {/* ── Product Grid ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Flower className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No bouquets found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> bouquet{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && (
                <> in <span className="font-semibold text-rose-500">{activeCategory}</span></>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Customize Bouquet Modal ───────────────────────────────────────── */}
      {showCustom && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            ref={modalRef}
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-rose-50 shrink-0">
              <div>
                <h2 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" /> Customize Your Bouquet
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Tell us exactly what you want — our florist will craft it for you.</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

              {/* Bouquet name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Give it a name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder={`e.g. "Anniversary Surprise" or "Mom's Birthday"`}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="custom-input"
                />
              </div>

              {/* Flower types */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Flower Types <span className="text-gray-400 font-normal">(pick one or more)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLOWER_TYPES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFlower(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${selectedFlowers.includes(f)
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-rose-300 hover:text-rose-500"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color palette */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Color Palette <span className="text-gray-400 font-normal">(pick one or more)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleColor(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${selectedColors.includes(c)
                          ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-500"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wrapping style */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Wrapping Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {WRAP_STYLES.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWrap(selectedWrap === w ? "" : w)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all
                        ${selectedWrap === w
                          ? "bg-rose-50 border-rose-400 text-rose-700"
                          : "bg-white border-gray-200 text-gray-600 hover:border-rose-200"
                        }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stem count */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Approximate Stem Count
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="6" max="50" step="2"
                    value={stemCount}
                    onChange={(e) => setStemCount(e.target.value)}
                    className="flex-1 accent-rose-500"
                  />
                  <span className="text-sm font-bold text-rose-600 w-12 text-center bg-rose-50 rounded-lg py-1">
                    ~{stemCount}
                  </span>
                </div>
              </div>

              {/* Extra notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`e.g. "Add a small card, use baby's breath as filler, no strong fragrance please"`}
                  value={extraNote}
                  onChange={(e) => setExtraNote(e.target.value)}
                  className="custom-input resize-none"
                />
              </div>

              {/* Price note */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
                💬 Custom bouquets are <strong>quoted by the florist</strong>. We'll contact you after you place your order to confirm the price and availability.
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-rose-50 shrink-0">
              <button
                onClick={handleAddCustom}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all
                  ${added
                    ? "bg-green-500 text-white"
                    : "bg-rose-500 hover:bg-rose-600 active:scale-[.98] text-white"
                  }`}
              >
                {added ? (
                  <>✓ Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> Add Custom Bouquet to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #fecdd3;
          background: #fff8f8;
          color: #374151;
          font-size: 0.875rem;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .custom-input::placeholder { color: #9ca3af; }
        .custom-input:focus {
          outline: none;
          border-color: #fb7185;
          box-shadow: 0 0 0 3px #fecdd3;
        }
      `}</style>
    </>
  );
}
