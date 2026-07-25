// ─── Product ─────────────────────────────────────────────────────────────────
export type FlowerCategory =
  | "Romantic"
  | "Birthday"
  | "Sympathy"
  | "Wedding"
  | "Congratulations"
  | "Seasonal";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FlowerCategory;
  image: string; // URL or path
  badge?: string; // e.g. "Best Seller", "New"
  inStock: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
  cardMessage: string; // per-item message
}

// ─── Checkout Form ────────────────────────────────────────────────────────────
export type PaymentMethod = "gcash" | "cod";

export type TimeSlot =
  | "9:00 AM – 12:00 PM"
  | "12:00 PM – 3:00 PM"
  | "3:00 PM – 6:00 PM"
  | "6:00 PM – 9:00 PM";

export interface SenderInfo {
  name: string;
  phone: string;
  email: string;
}

export interface RecipientInfo {
  name: string;
  phone: string;
  address: string;
  deliveryDate: string; // ISO date string yyyy-mm-dd
  timeSlot: TimeSlot;
}

// ─── Add-ons ──────────────────────────────────────────────────────────────────
export type ChocolateChoice =
  | "Ferrero Rocher (6 pcs)"
  | "Toblerone (100g)"
  | "Cadbury Dairy Milk (90g)"
  | "Hershey's Kisses Assorted (100g)"
  | "Lindt Lindor Truffles (6 pcs)";

export type TeddyBearChoice =
  | "Small Classic Bear (6\")"
  | "Medium Classic Bear (10\")"
  | "Large Classic Bear (14\")"
  | "Heart Bear (10\")"
  | "Giant Love Bear (20\")";

export type AddOnType = "none" | "chocolate" | "teddy_bear" | "both";

export interface BouquetAddOn {
  type: AddOnType;
  chocolateChoice: ChocolateChoice | "";
  teddyBearChoice: TeddyBearChoice | "";
}

export const CHOCOLATE_PRICES: Record<ChocolateChoice, number> = {
  "Ferrero Rocher (6 pcs)": 299,
  "Toblerone (100g)": 199,
  "Cadbury Dairy Milk (90g)": 149,
  "Hershey's Kisses Assorted (100g)": 179,
  "Lindt Lindor Truffles (6 pcs)": 349,
};

export const TEDDY_BEAR_PRICES: Record<TeddyBearChoice, number> = {
  "Small Classic Bear (6\")": 249,
  "Medium Classic Bear (10\")": 399,
  "Large Classic Bear (14\")": 599,
  "Heart Bear (10\")": 449,
  "Giant Love Bear (20\")": 899,
};

export interface CheckoutForm {
  sender: SenderInfo;
  recipient: RecipientInfo;
  paymentMethod: PaymentMethod;
  orderNote: string;   // global order note / card message
  bouquetNote: string; // specific bouquet arrangement request
  addOn: BouquetAddOn; // chocolate / teddy bear add-on
}

// ─── Order (saved after Place Order) ─────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;              // tracking code e.g. FLW-89X2A
  placedAt: string;        // ISO timestamp
  items: CartItem[];
  form: CheckoutForm;
  subtotal: number;
  addOnTotal: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatus;
}
