import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D.JOY Flower Shop — Fresh Blooms Delivered",
  description:
    "Order beautiful bouquets for every occasion. No account needed — easy guest checkout with delivery across the metro.",
};

// Root layout — bare wrapper only. Child route groups add their own chrome.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fff8f8]">
        {children}
      </body>
    </html>
  );
}
