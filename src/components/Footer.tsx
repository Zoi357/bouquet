import { Flower2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-rose-950 text-rose-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <Flower2 className="w-5 h-5 text-rose-400" />
          D.JOY Flower Shop
        </div>
        <p className="text-rose-300 text-center">
          Fresh blooms delivered with love. © {new Date().getFullYear()} D.JOY Flower Shop.
        </p>
        <p className="text-rose-400 text-xs">All orders are guest checkout — no account needed.</p>
      </div>
    </footer>
  );
}
