import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CartItem,
  CheckoutForm,
  Product,
  PaymentMethod,
  TimeSlot,
  BouquetAddOn,
  AddOnType,
  ChocolateChoice,
  TeddyBearChoice,
} from "@/types/flower";

interface CartStore {
  // ── Cart items ──────────────────────────────────────────────────────────────
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  increaseQty: (productId: string) => void;
  decreaseQty: (productId: string) => void;
  updateCardMessage: (productId: string, message: string) => void;
  clearCart: () => void;

  // ── Checkout form ────────────────────────────────────────────────────────────
  checkoutForm: CheckoutForm;
  updateSenderField: (field: keyof CheckoutForm["sender"], value: string) => void;
  updateRecipientField: (
    field: keyof CheckoutForm["recipient"],
    value: string | TimeSlot
  ) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setOrderNote: (note: string) => void;
  setBouquetNote: (note: string) => void;
  setAddOnType: (type: AddOnType) => void;
  setChocolateChoice: (choice: ChocolateChoice | "") => void;
  setTeddyBearChoice: (choice: TeddyBearChoice | "") => void;
  resetCheckoutForm: () => void;

  // ── Tracking code ────────────────────────────────────────────────────────────
  trackingCode: string;
  setTrackingCode: (code: string) => void;
}

const defaultAddOn: BouquetAddOn = {
  type: "none",
  chocolateChoice: "",
  teddyBearChoice: "",
};

const defaultCheckoutForm: CheckoutForm = {
  sender: { name: "", phone: "", email: "" },
  recipient: {
    name: "",
    phone: "",
    address: "",
    deliveryDate: "",
    timeSlot: "9:00 AM – 12:00 PM",
  },
  paymentMethod: "gcash",
  orderNote: "",
  bouquetNote: "",
  addOn: defaultAddOn,
};

function generateTrackingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "FLW-";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export { generateTrackingCode };

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      // ── Cart ──────────────────────────────────────────────────────────────────
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, quantity: 1, cardMessage: "" },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      increaseQty: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        })),

      decreaseQty: (productId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      updateCardMessage: (productId, message) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, cardMessage: message } : i
          ),
        })),

      clearCart: () =>
        set({ items: [], checkoutForm: defaultCheckoutForm, trackingCode: "" }),

      // ── Checkout Form ─────────────────────────────────────────────────────────
      checkoutForm: defaultCheckoutForm,

      updateSenderField: (field, value) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            sender: { ...state.checkoutForm.sender, [field]: value },
          },
        })),

      updateRecipientField: (field, value) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            recipient: { ...state.checkoutForm.recipient, [field]: value },
          },
        })),

      setPaymentMethod: (method) =>
        set((state) => ({
          checkoutForm: { ...state.checkoutForm, paymentMethod: method },
        })),

      setOrderNote: (note) =>
        set((state) => ({
          checkoutForm: { ...state.checkoutForm, orderNote: note },
        })),

      setBouquetNote: (note) =>
        set((state) => ({
          checkoutForm: { ...state.checkoutForm, bouquetNote: note },
        })),

      setAddOnType: (type) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            addOn: {
              ...state.checkoutForm.addOn,
              type,
              // Clear irrelevant choices when type changes
              chocolateChoice: type === "none" || type === "teddy_bear" ? "" : state.checkoutForm.addOn.chocolateChoice,
              teddyBearChoice: type === "none" || type === "chocolate" ? "" : state.checkoutForm.addOn.teddyBearChoice,
            },
          },
        })),

      setChocolateChoice: (choice) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            addOn: { ...state.checkoutForm.addOn, chocolateChoice: choice },
          },
        })),

      setTeddyBearChoice: (choice) =>
        set((state) => ({
          checkoutForm: {
            ...state.checkoutForm,
            addOn: { ...state.checkoutForm.addOn, teddyBearChoice: choice },
          },
        })),

      resetCheckoutForm: () =>
        set({ checkoutForm: defaultCheckoutForm }),

      // ── Tracking ──────────────────────────────────────────────────────────────
      trackingCode: "",
      setTrackingCode: (code) => set({ trackingCode: code }),
    }),
    {
      name: "djoy-cart-storage",
      // Deep-merge so new fields always get safe defaults when
      // the stored shape is older and missing them.
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<CartStore>;
        return {
          ...currentState,
          ...persisted,
          checkoutForm: {
            ...currentState.checkoutForm,
            ...(persisted.checkoutForm ?? {}),
            addOn: {
              ...defaultAddOn,
              ...(persisted.checkoutForm?.addOn ?? {}),
            },
            bouquetNote: persisted.checkoutForm?.bouquetNote ?? "",
            orderNote:   persisted.checkoutForm?.orderNote   ?? "",
          },
        };
      },
    }
  )
);
