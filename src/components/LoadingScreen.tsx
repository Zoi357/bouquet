"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3200);
    const hideTimer = setTimeout(() => setVisible(false), 3900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center
        transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{
        // Pure white background — mix-blend-mode:multiply makes white GIF bg disappear
        background: "#ffffff",
      }}
    >
      {/* ── Rose + glow ───────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Glow rings behind the flower */}
        <div className="absolute w-96 h-96 rounded-full bg-rose-300 blur-3xl opacity-0 animate-glow-outer" />
        <div className="absolute w-72 h-72 rounded-full bg-rose-400 blur-2xl opacity-0 animate-glow-mid" />
        <div className="absolute w-52 h-52 rounded-full bg-pink-300 blur-xl  opacity-0 animate-glow-inner" />

        {/* GIF — mix-blend-mode:multiply removes white background visually */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flowers/bouqbouq.gif"
          alt="Blooming rose"
          className="relative z-10 animate-rose-appear"
          style={{
            width: 340,
            height: 340,
            objectFit: "contain",
            mixBlendMode: "multiply",
            filter:
              "drop-shadow(0 0 24px rgba(239,68,68,0.8)) drop-shadow(0 0 50px rgba(251,113,133,0.5))",
          }}
        />
      </div>

      {/* Brand */}
      <h1 className="text-3xl font-extrabold text-rose-600 tracking-tight animate-fade-up">
        D.JOY <span className="text-gray-700 font-medium">Flower Shop</span>
      </h1>
      <p className="mt-2 text-sm text-rose-400 font-medium animate-fade-up-delay">
        Fresh blooms, delivered with love 🌹
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-48 h-1.5 bg-rose-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 rounded-full animate-progress" />
      </div>

      <style>{`
        @keyframes roseAppear {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-rose-appear {
          animation: roseAppear 0.7s cubic-bezier(0.34,1.4,0.64,1) 0.1s both;
        }

        @keyframes glowIn { from { opacity:0; } to { opacity:1; } }

        @keyframes glowPulseOuter {
          0%,100% { opacity:0.25; transform:scale(1);    }
          50%     { opacity:0.50; transform:scale(1.10); }
        }
        .animate-glow-outer {
          animation: glowIn 0.8s ease-out 1.2s forwards,
                     glowPulseOuter 2.4s ease-in-out 2.0s infinite;
        }

        @keyframes glowPulseMid {
          0%,100% { opacity:0.35; transform:scale(1);    }
          50%     { opacity:0.65; transform:scale(1.07); }
        }
        .animate-glow-mid {
          animation: glowIn 0.7s ease-out 1.4s forwards,
                     glowPulseMid 1.8s ease-in-out 2.1s infinite;
        }

        @keyframes glowPulseInner {
          0%,100% { opacity:0.45; transform:scale(1);    }
          50%     { opacity:0.80; transform:scale(1.13); }
        }
        .animate-glow-inner {
          animation: glowIn 0.6s ease-out 1.6s forwards,
                     glowPulseInner 1.3s ease-in-out 2.2s infinite;
        }

        @keyframes fade-up {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-fade-up       { animation: fade-up 0.6s ease-out 1.6s both; }
        .animate-fade-up-delay { animation: fade-up 0.6s ease-out 1.9s both; }

        @keyframes progress {
          from { width:0%; }
          to   { width:100%; }
        }
        .animate-progress { animation: progress 3.2s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>
    </div>
  );
}
