import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

// Shop layout — public-facing pages get Navbar + Footer + loading screen
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
