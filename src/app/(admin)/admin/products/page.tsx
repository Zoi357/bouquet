"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Flower2, LogOut, ShoppingBag, LayoutGrid, Plus, Pencil,
  Trash2, Camera, ImagePlus, X, Check, ToggleLeft, ToggleRight,
  ChevronDown, AlertTriangle,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { useProductStore, generateProductId } from "@/store/useProductStore";
import { flowers as mockFlowers } from "@/data/flowers";
import { FlowerCategory, Product } from "@/types/flower";

const CATEGORIES: FlowerCategory[] = [
  "Romantic", "Birthday", "Sympathy", "Wedding", "Congratulations", "Seasonal",
];

const EMPTY_FORM = {
  name: "", description: "", price: "", category: "Romantic" as FlowerCategory,
  badge: "", inStock: true, image: "",
};

type FormState = typeof EMPTY_FORM;

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAdminStore();
  const { customProducts, addProduct, updateProduct, deleteProduct, toggleInStock } = useProductStore();

  // All products for display (custom + mock)
  const allProducts = [...customProducts, ...mockFlowers];

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Camera modal
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, router]);

  // ── Camera ──────────────────────────────────────────────────────────────────
  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setCameraStream(stream);
      setShowCamera(true);
    } catch {
      alert("Camera access denied or not available on this device.");
    }
  }

  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCamera, cameraStream]);

  function stopCamera() {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setShowCamera(false);
  }

  async function flipCamera() {
    stopCamera();
    const newFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacing);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing }, audio: false,
      });
      setCameraStream(stream);
      setShowCamera(true);
    } catch {
      alert("Could not switch camera.");
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImagePreview(dataUrl);
    setForm((f) => ({ ...f, image: dataUrl }));
    stopCamera();
  }

  // ── Gallery / File picker ───────────────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setForm((f) => ({ ...f, image: dataUrl }));
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  }

  // ── Modal open/close ────────────────────────────────────────────────────────
  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    // Only allow editing custom products
    if (!customProducts.find((p) => p.id === product.id)) return;
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      badge: product.badge ?? "",
      inStock: product.inStock,
      image: product.image,
    });
    setImagePreview(product.image);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!form.name.trim() || !form.price || !form.image) {
      alert("Please fill in name, price, and add an image.");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const productData: Omit<Product, "id"> = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      badge: form.badge.trim() || undefined,
      inStock: form.inStock,
      image: form.image,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct({ id: generateProductId(), ...productData });
    }
    closeModal();
  }

  if (!isAuthenticated) return null;

  const isCustom = (id: string) => !!customProducts.find((p) => p.id === id);

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
            <nav className="flex items-center gap-1">
              <Link href="/admin/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-medium transition-colors">
                <ShoppingBag className="w-4 h-4" /> Orders
              </Link>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-sm font-semibold">
                <LayoutGrid className="w-4 h-4" /> Products
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">
              Logged in as <strong className="text-gray-600">Florist</strong>
            </span>
            <button onClick={() => { logout(); router.push("/admin"); }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors font-medium">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Product Catalog</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {allProducts.length} product{allProducts.length !== 1 ? "s" : ""} — {customProducts.length} added by you
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-rose-200"
          >
            <Plus className="w-4 h-4" /> Add Bouquet
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allProducts.map((product) => (
            <div key={product.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
              {/* Image */}
              <div className="relative h-44 bg-rose-50 overflow-hidden">
                <Image
                  src={product.image} alt={product.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={product.image.startsWith("data:")}
                />
                {/* Custom badge */}
                {isCustom(product.id) && (
                  <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    YOUR POST
                  </span>
                )}
                {/* In stock toggle */}
                <button
                  onClick={() => isCustom(product.id) && toggleInStock(product.id)}
                  disabled={!isCustom(product.id)}
                  title={isCustom(product.id) ? "Toggle stock" : "Cannot edit built-in product"}
                  className={`absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors
                    ${product.inStock
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-600 border-red-200"
                    } ${isCustom(product.id) ? "cursor-pointer hover:opacity-80" : "cursor-default opacity-70"}`}
                >
                  {product.inStock
                    ? <><ToggleRight className="w-3 h-3" /> In Stock</>
                    : <><ToggleLeft className="w-3 h-3" /> Out of Stock</>}
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-1">{product.name}</h3>
                  <span className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full shrink-0">{product.category}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 flex-1 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600">₱{product.price.toLocaleString()}</span>
                  {/* Edit / Delete — only for custom */}
                  {isCustom(product.id) ? (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-300 italic">built-in</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-3xl px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h2 className="font-extrabold text-gray-800 text-lg">
                {editingId ? "Edit Bouquet" : "Add New Bouquet"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* ── Image upload ─────────────────────────────────────────────── */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Bouquet Photo <span className="text-rose-500">*</span>
                </label>

                {/* Preview */}
                {imagePreview ? (
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-rose-50 mb-3">
                    <Image
                      src={imagePreview} alt="Preview" fill
                      className="object-cover"
                      unoptimized={imagePreview.startsWith("data:")}
                      sizes="480px"
                    />
                    <button
                      onClick={() => { setImagePreview(""); setForm((f) => ({ ...f, image: "" })); }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 flex items-center justify-center mb-3">
                    <p className="text-sm text-rose-300 font-medium">No photo selected</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Camera */}
                  <button
                    type="button"
                    onClick={openCamera}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-colors"
                  >
                    <Camera className="w-4 h-4" /> Take Photo
                  </button>

                  {/* Gallery */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-colors"
                  >
                    <ImagePlus className="w-4 h-4" /> Choose from Gallery
                  </button>
                </div>

                {/* Hidden file input — accepts images from camera roll */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture={undefined}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* ── Fields ───────────────────────────────────────────────────── */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Bouquet Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text" placeholder="e.g. Sunset Roses"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="modal-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  rows={3} placeholder="Describe this bouquet…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="modal-input resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Price (₱) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number" min="1" placeholder="e.g. 1299"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="modal-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FlowerCategory }))}
                      className="modal-input appearance-none pr-8"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Badge <span className="text-gray-400 font-normal">(optional — e.g. &quot;New&quot;, &quot;Best Seller&quot;)</span>
                </label>
                <input
                  type="text" placeholder="e.g. New Arrival"
                  value={form.badge}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  className="modal-input"
                />
              </div>

              {/* In stock toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Available / In Stock</p>
                  <p className="text-xs text-gray-400">Customers can add this to cart</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, inStock: !f.inStock }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.inStock ? "bg-rose-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.inStock ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm transition-colors"
                >
                  <Check className="w-4 h-4" /> {editingId ? "Save Changes" : "Post Bouquet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Camera Modal ─────────────────────────────────────────────────────── */}
      {showCamera && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-between">
          {/* Header */}
          <div className="w-full flex items-center justify-between px-5 pt-6 pb-2">
            <button onClick={stopCamera} className="text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <p className="text-white font-semibold text-sm">Take a Photo</p>
            <button
              onClick={flipCamera}
              className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Flip camera"
            >
              {/* Flip icon using rotate */}
              <Camera className="w-6 h-6 scale-x-[-1]" />
            </button>
          </div>

          {/* Viewfinder */}
          <div className="flex-1 flex items-center justify-center w-full px-4">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Corner guides */}
              {["top-2 left-2 border-t-2 border-l-2", "top-2 right-2 border-t-2 border-r-2",
                "bottom-2 left-2 border-b-2 border-l-2", "bottom-2 right-2 border-b-2 border-r-2"
              ].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 border-white/60 rounded-sm ${cls}`} />
              ))}
            </div>
          </div>

          {/* Capture button */}
          <div className="w-full flex items-center justify-center pb-10 pt-6">
            <button
              onClick={capturePhoto}
              className="w-18 h-18 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
              style={{ width: 72, height: 72 }}
            >
              <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* ── Delete Confirm Dialog ────────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete this bouquet?</h3>
            <p className="text-sm text-gray-500 mb-6">This will remove it from the shop. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteProduct(deleteConfirmId); setDeleteConfirmId(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid #fecdd3;
          background: #fff8f8;
          color: #374151;
          font-size: 0.875rem;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .modal-input::placeholder { color: #9ca3af; }
        .modal-input:focus {
          outline: none;
          border-color: #fb7185;
          box-shadow: 0 0 0 3px #fecdd3;
        }
      `}</style>
    </div>
  );
}
