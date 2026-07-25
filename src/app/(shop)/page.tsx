"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Flower } from "lucide-react";
import { CATEGORIES } from "@/data/flowers";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ProductCard";
import { FlowerCategory } from "@/types/flower";

// ── Petal SVG shape ──────────────────────────────────────────────────────────
function Petal({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 40 60"
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={style}
    >
      <ellipse cx="20" cy="30" rx="12" ry="26" />
    </svg>
  );
}

// Each petal: position, size, base rotation, animation duration, delay, color
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

export default function HomePage() {
  const getAllProducts = useProductStore((s) => s.getAllProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | FlowerCategory>("All");
  const [priceRange, setPriceRange] = useState<string>("all");

  const allProducts = getAllProducts();

  const PRICE_RANGES: { label: string; value: string; min: number; max: number }[] = [
    { label: "All Prices", value: "all", min: 0, max: Infinity },
    { label: "Under ₱400", value: "under400", min: 0, max: 399 },
    { label: "₱400 – ₱700", value: "400-700", min: 400, max: 700 },
    { label: "₱700 – ₱1,000", value: "700-1000", min: 700, max: 1000 },
    { label: "₱1,000 – ₱1,500", value: "1000-1500", min: 1000, max: 1500 },
    { label: "₱1,500 – ₱2,500", value: "1500-2500", min: 1500, max: 2500 },
    { label: "Over ₱2,500", value: "over2500", min: 2500, max: Infinity },
  ];


  
  


  const activePriceRange = PRICE_RANGES.find((r) => r.value === priceRange) ?? PRICE_RANGES[0];

  const filtered = useMemo(() => {
    return allProducts.filter((f) => {
      const matchCat = activeCategory === "All" || f.category === activeCategory;
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());
      const matchPrice = f.price >= activePriceRange.min && f.price <= activePriceRange.max;
      return matchCat && matchSearch && matchPrice;
    });
  }, [allProducts, search, activeCategory, activePriceRange]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 px-4">
        {/* CSS keyframes for petal float animation */}
        <style>{`
          @keyframes petalFloat {
            0%   { transform: translateY(0px)   rotate(var(--rot)); }
            25%  { transform: translateY(-14px) rotate(calc(var(--rot) + 8deg)); }
            50%  { transform: translateY(-8px)  rotate(calc(var(--rot) - 6deg)); }
            75%  { transform: translateY(-18px) rotate(calc(var(--rot) + 4deg)); }
            100% { transform: translateY(0px)   rotate(var(--rot)); }
          }
        `}</style>

        {/* Soft blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* ── Floating petals ── */}
        {PETALS.map((p) => (
          <Petal
            key={p.id}
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.5,
              fill: p.fill,
              ["--rot" as string]: `${p.rot}deg`,
              animation: `petalFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
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

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <section className="sticky top-[61px] z-40 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <SlidersHorizontal className="w-4 h-4 text-rose-400 shrink-0 mr-1" />
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

          {/* ── Price Range Dropdown ── */}
          <div className="shrink-0 ml-1">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-300
                ${priceRange !== "all"
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200"
                  : "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100"
                }`}
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Product Grid ──────────────────────────────────────────────────────── */}
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
    </>
  );
}
