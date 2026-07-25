"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Flower } from "lucide-react";
import { CATEGORIES } from "@/data/flowers";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ProductCard";
import { FlowerCategory } from "@/types/flower";

export default function HomePage() {
  const getAllProducts = useProductStore((s) => s.getAllProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | FlowerCategory>("All");

  const allProducts = getAllProducts();

  const filtered = useMemo(() => {
    return allProducts.filter((f) => {
      const matchCat = activeCategory === "All" || f.category === activeCategory;
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProducts, search, activeCategory]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 px-4">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

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
