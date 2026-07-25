import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus } from "@/types/flower";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    { name: "djoy-orders-storage" }
  )
);
