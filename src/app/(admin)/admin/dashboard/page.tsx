"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Flower2, LogOut, ShoppingBag, Clock, CheckCircle2,
  Truck, XCircle, ChevronDown, ChevronUp, Search,
  Package, Banknote, Smartphone, Gift, NotebookPen,
  Phone, MapPin, User, RefreshCw, LayoutGrid,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { useOrderStore } from "@/store/useOrderStore";
import {
  Order, OrderStatus,
  CHOCOLATE_PRICES, TEDDY_BEAR_PRICES,
  ChocolateChoice, TeddyBearChoice,
} from "@/types/flower";

const STATUS_OPTIONS: OrderStatus[] = [
  "Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled",
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  "Pending":          "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Confirmed":        "bg-blue-100 text-blue-700 border-blue-200",
  "Preparing":        "bg-purple-100 text-purple-700 border-purple-200",
  "Out for Delivery": "bg-orange-100 text-orange-700 border-orange-200",
  "Delivered":        "bg-green-100 text-green-700 border-green-200",
  "Cancelled":        "bg-red-100 text-red-600 border-red-200",
};

const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  "Pending":          <Clock className="w-3.5 h-3.5" />,
  "Confirmed":        <CheckCircle2 className="w-3.5 h-3.5" />,
  "Preparing":        <Package className="w-3.5 h-3.5" />,
  "Out for Delivery": <Truck className="w-3.5 h-3.5" />,
  "Delivered":        <CheckCircle2 className="w-3.5 h-3.5" />,
  "Cancelled":        <XCircle className="w-3.5 h-3.5" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function formatDeliveryDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminStore();
  const { orders, updateStatus } = useOrderStore();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.push("/admin");
  }

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.form.sender.name.toLowerCase().includes(q) ||
      o.form.recipient.name.toLowerCase().includes(q) ||
      o.form.recipient.phone.includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total:      orders.length,
    pending:    orders.filter((o) => o.status === "Pending").length,
    delivering: orders.filter((o) => o.status === "Out for Delivery").length,
    revenue:    orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + o.grandTotal, 0),
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flower2 className="w-6 h-6 text-rose-500" />
              <span className="font-extrabold text-rose-600 text-lg">D.JOY</span>
            </div>
            {/* Nav tabs */}
            <nav className="flex items-center gap-1">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold">
                <ShoppingBag className="w-4 h-4" /> Orders
              </span>
              <Link
                href="/admin/products"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-medium transition-colors"
              >
                <LayoutGrid className="w-4 h-4" /> Products
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">
              Logged in as <strong className="text-gray-600">Florist</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Orders"     value={stats.total}      icon={<ShoppingBag className="w-5 h-5" />} color="rose" />
          <StatCard label="Pending"          value={stats.pending}    icon={<Clock className="w-5 h-5" />}       color="yellow" />
          <StatCard label="Out for Delivery" value={stats.delivering} icon={<Truck className="w-5 h-5" />}       color="orange" />
          <StatCard label="Total Revenue"    value={`₱${stats.revenue.toLocaleString()}`} icon={<Banknote className="w-5 h-5" />} color="green" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tracking code, sender, or recipient…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div className="relative sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "All")}
              className="w-full appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">
              {orders.length === 0 ? "No orders placed yet." : "No orders match your filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedId === order.id}
                onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                onStatusChange={(status) => updateStatus(order.id, status)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string; value: string | number; icon: React.ReactNode;
  color: "rose" | "yellow" | "orange" | "green";
}) {
  const colorMap = {
    rose:   "bg-rose-50   text-rose-500   border-rose-100",
    yellow: "bg-yellow-50 text-yellow-500 border-yellow-100",
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    green:  "bg-green-50  text-green-500  border-green-100",
  };
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${colorMap[color]}`}>
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, onStatusChange }: {
  order: Order; expanded: boolean;
  onToggle: () => void; onStatusChange: (s: OrderStatus) => void;
}) {
  const { form, items, grandTotal, status, id, placedAt, addOnTotal } = order;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <span className="font-mono font-bold text-sm text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg shrink-0">{id}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {form.sender.name}<span className="text-gray-400 font-normal"> → </span>{form.recipient.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {formatDate(placedAt)} · {items.length} item{items.length !== 1 ? "s" : ""} · ₱{grandTotal.toLocaleString()}
          </p>
        </div>
        <span className={`shrink-0 hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border
          ${form.paymentMethod === "gcash" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
          {form.paymentMethod === "gcash" ? <><Smartphone className="w-3 h-3" /> GCash</> : <><Banknote className="w-3 h-3" /> COD</>}
        </span>
        <span className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status]}`}>
          {STATUS_ICON[status]} {status}
        </span>
        <button className="shrink-0 text-gray-400 hover:text-rose-500 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-gray-50/50">
          {/* Status updater */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1">
              <RefreshCw className="w-3 h-3 inline mr-1" />Update Status:
            </span>
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => onStatusChange(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
                  ${status === s ? STATUS_STYLE[s] + " ring-2 ring-offset-1 ring-current" : "bg-white border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoBlock title="Sender" icon={<User className="w-3.5 h-3.5 text-rose-500" />}>
              <InfoLine label="Name"  value={form.sender.name} />
              <InfoLine label="Phone" value={form.sender.phone} />
              {form.sender.email && <InfoLine label="Email" value={form.sender.email} />}
            </InfoBlock>
            <InfoBlock title="Recipient & Delivery" icon={<MapPin className="w-3.5 h-3.5 text-rose-500" />}>
              <InfoLine label="Name"    value={form.recipient.name} />
              <InfoLine label="Phone"   value={form.recipient.phone} />
              <InfoLine label="Address" value={form.recipient.address} />
              <InfoLine label="Delivery" value={`${formatDeliveryDate(form.recipient.deliveryDate)} · ${form.recipient.timeSlot}`} />
            </InfoBlock>
          </div>

          <InfoBlock title="Bouquets" icon={<ShoppingBag className="w-3.5 h-3.5 text-rose-500" />}>
            <div className="space-y-2 mt-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{item.product.name}</p>
                    {item.cardMessage && <p className="text-xs text-rose-400 italic truncate">"{item.cardMessage}"</p>}
                  </div>
                  <div className="text-right text-sm shrink-0">
                    <span className="text-gray-400">×{item.quantity}</span>
                    <span className="font-semibold text-gray-700 ml-2">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </InfoBlock>

          {(form.bouquetNote || form.orderNote || form.addOn?.type !== "none") && (
            <InfoBlock title="Special Requests & Add-ons" icon={<Gift className="w-3.5 h-3.5 text-rose-500" />}>
              {form.bouquetNote && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5 flex items-center gap-1"><NotebookPen className="w-3 h-3" /> Bouquet Request</p>
                  <p className="text-sm text-gray-700 italic bg-white rounded-lg px-3 py-2">"{form.bouquetNote}"</p>
                </div>
              )}
              {form.orderNote && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">Order Note</p>
                  <p className="text-sm text-gray-700 bg-white rounded-lg px-3 py-2">{form.orderNote}</p>
                </div>
              )}
              {form.addOn?.type !== "none" && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {(form.addOn.type === "chocolate" || form.addOn.type === "both") && form.addOn.chocolateChoice && (
                    <span className="text-xs bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
                      🍫 {form.addOn.chocolateChoice} — ₱{CHOCOLATE_PRICES[form.addOn.chocolateChoice as ChocolateChoice]?.toLocaleString()}
                    </span>
                  )}
                  {(form.addOn.type === "teddy_bear" || form.addOn.type === "both") && form.addOn.teddyBearChoice && (
                    <span className="text-xs bg-purple-50 border border-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium">
                      🧸 {form.addOn.teddyBearChoice} — ₱{TEDDY_BEAR_PRICES[form.addOn.teddyBearChoice as TeddyBearChoice]?.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </InfoBlock>
          )}

          <InfoBlock title="Cost Breakdown" icon={<Banknote className="w-3.5 h-3.5 text-rose-500" />}>
            <div className="space-y-1 text-sm mt-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-gray-500">
                  <span>{item.product.name} ×{item.quantity}</span>
                  <span>₱{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-200 mt-1">
                <span>Subtotal</span><span>₱{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span><span>₱{order.deliveryFee.toLocaleString()}</span>
              </div>
              {addOnTotal > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Add-ons</span><span>₱{addOnTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-rose-600">₱{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </InfoBlock>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">{icon} {title}</h3>
      {children}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm mb-1">
      <span className="text-gray-400 w-20 shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}
