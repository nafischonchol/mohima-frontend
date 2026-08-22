import Link from "next/link";
import { PackageSearch, ArrowLeft, Home, Search } from "lucide-react";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />
      
      <main className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-lg w-full text-center">
          {/* Glowing background circle & Animated Icon */}
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-500/10 dark:bg-rose-500/20 animate-ping opacity-30" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-rose-500/20 via-rose-500/10 to-transparent blur-xl" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-rose-500/10 flex items-center justify-center">
              <PackageSearch className="w-14 h-14 sm:w-16 sm:h-16 text-rose-500 stroke-[1.5]" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest mb-4">
            404 Error • Product Not Found
          </div>

          {/* Title & Description */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            প্রোডাক্টটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            আপনি যে প্রোডাক্টটি খুঁজছেন তা মুছে ফেলা হতে পারে, অথবা লিংকটি সঠিক নয়। অনুগ্রহ করে আমাদের শপের অন্যান্য প্রোডাক্টগুলো এক্সপ্লোর করুন।
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="w-4 h-4" />
              হোমপেজে ফিরে যান
            </Link>
            <Link
              href="/#catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <Search className="w-4 h-4 text-rose-500" />
              প্রোডাক্ট ক্যাটালগ দেখুন
            </Link>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
