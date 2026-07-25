"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2.4s, fully unmount at 2.9s
    const fadeTimer = setTimeout(() => setFadeOut(true), 2400);
    const hideTimer = setTimeout(() => setVisible(false), 2900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fff0f3] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Petal burst */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Orbiting petals */}
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl animate-orbit"
            style={{
              animationDelay: `${i * 0.15}s`,
              transform: `rotate(${i * 45}deg) translateY(-38px)`,
            }}
          >
            🌸
          </span>
        ))}

        {/* Center flower */}
        <div className="relative w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center shadow-lg shadow-rose-200 animate-pulse-slow">
          <span className="text-4xl select-none animate-spin-slow">🌹</span>
        </div>
      </div>

      {/* Brand name */}
      <h1 className="text-3xl font-extrabold text-rose-600 tracking-tight animate-fade-up">
        D.JOY <span className="text-gray-700 font-medium">Flower Shop</span>
      </h1>

      {/* Tagline */}
      <p className="mt-2 text-sm text-rose-400 font-medium animate-fade-up-delay">
        Fresh blooms, delivered with love 💕
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-48 h-1.5 bg-rose-100 rounded-full overflow-hidden">
        <div className="h-full bg-rose-400 rounded-full animate-progress" />
      </div>

      {/* Inline keyframes — scoped to this component */}
      <style>{`
        @keyframes orbit {
          0%   { opacity: 0; transform: rotate(var(--r)) translateY(-38px) scale(0.4); }
          30%  { opacity: 1; transform: rotate(var(--r)) translateY(-38px) scale(1); }
          70%  { opacity: 1; transform: rotate(var(--r)) translateY(-38px) scale(1); }
          100% { opacity: 0; transform: rotate(var(--r)) translateY(-38px) scale(0.4); }
        }

        .animate-orbit {
          animation: orbit 2.4s ease-in-out forwards;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(251,113,133,0.4); }
          50%       { transform: scale(1.06); box-shadow: 0 0 0 12px rgba(251,113,133,0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 1.6s ease-in-out infinite;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out 0.3s both;
        }
        .animate-fade-up-delay {
          animation: fade-up 0.6s ease-out 0.6s both;
        }

        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .animate-progress {
          animation: progress 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
