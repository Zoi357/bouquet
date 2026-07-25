"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flower2, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAdminStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) router.replace("/admin/dashboard");
  }, [isAuthenticated, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(password);
    if (ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password. Please try again.");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300 rounded-full blur-3xl opacity-15 pointer-events-none" />

      <div
        className={`relative bg-white rounded-3xl shadow-xl shadow-rose-100 border border-rose-100 p-8 w-full max-w-sm
          ${shaking ? "animate-shake" : ""}`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-3 shadow-sm">
            <Flower2 className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800">D.JOY Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Florist Dashboard — Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Admin Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-rose-200 bg-rose-50 text-gray-700 text-sm
                  focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400
                  placeholder-gray-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600
              active:scale-[.98] text-white py-3 rounded-xl font-bold text-sm transition-all"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          This panel is for the florist only. Customers do not need an account.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
