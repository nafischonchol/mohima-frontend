import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch, Home, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export default function NotFound() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#FAF9F6] text-[#121212] flex flex-col justify-between selection:bg-[#CC826A] selection:text-white font-sans antialiased">
        <Suspense fallback={<div className="h-20 bg-white" />}>
          <Header />
        </Suspense>
        
        <main className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
          <div className="max-w-lg w-full text-center">
            {/* Glowing background & Icon container */}
            <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#CC826A]/10 animate-pulse" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-black/[0.05] shadow-md flex items-center justify-center">
                <PackageSearch className="w-12 h-12 text-[#CC826A] stroke-[1.5]" />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#CC826A]/10 border border-[#CC826A]/20 text-[#CC826A] font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4">
              404 Error • Page / Product Not Found
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121212] tracking-tight mb-3">
              প্রোডাক্ট বা পেজটি খুঁজে পাওয়া যায়নি
            </h1>
            <p className="text-black/60 text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto">
              আপনি যে পেজ বা প্রোডাক্টটি খুঁজছেন তা আর উপলব্ধ নাও হতে পারে, অথবা লিংকটি ভুল হতে পারে। অনুগ্রহ করে আমাদের ক্যাটাগরি অথবা অন্যান্য সেরা প্রোডাক্টসমূহ এক্সপ্লোর করুন।
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#121212] hover:bg-[#CC826A] text-[#FAF9F6] font-bold text-xs uppercase tracking-widest transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <Home className="w-4 h-4" />
                হোমপেজে ফিরে যান
              </Link>
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-black/5 text-[#121212] border border-black/10 font-bold text-xs uppercase tracking-widest transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#CC826A]" />
                শপিং করা শুরু করুন
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
