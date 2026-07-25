import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, FlowerCategory } from "@/types/flower";
import { flowers as mockFlowers } from "@/data/flowers";

interface ProductStore {
  // Admin-created products (persisted). Mock flowers are always merged in at read time.
  customProducts: Product[];

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleInStock: (id: string) => void;

  // Returns mock + custom combined, custom first
  getAllProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      customProducts: [],

      addProduct: (product) =>
        set((state) => ({
          customProducts: [product, ...state.customProducts],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          customProducts: state.customProducts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          customProducts: state.customProducts.filter((p) => p.id !== id),
        })),

      toggleInStock: (id) =>
        set((state) => ({
          customProducts: state.customProducts.map((p) =>
            p.id === id ? { ...p, inStock: !p.inStock } : p
          ),
        })),

      getAllProducts: () => {
        const custom = get().customProducts;
        // Custom products appear first so admin additions show at the top
        return [...custom, ...mockFlowers];
      },
    }),
    { name: "djoy-products-storage" }
  )
);

// Helper to generate a unique product ID
export function generateProductId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
