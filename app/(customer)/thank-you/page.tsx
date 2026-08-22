import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import Link from "next/link";
import { CheckCircle, PackageSearch, ShoppingBag, Download } from "lucide-react";

export const metadata = {
  title: "Order Successful | Mohimaa",
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 max-w-2xl w-full text-center shadow-xl dark:shadow-2xl relative overflow-hidden">
          {/* Confetti / background decorations */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
          
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-[4px] border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <CheckCircle size={64} className="text-emerald-500" />
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
            Thank you for your purchase. We've received your B2B wholesale order and are currently processing it.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-10 max-w-sm mx-auto">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Order Reference</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-200">SW-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button 
              className="w-full sm:w-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Download size={20} /> Download Invoice
            </button>
            <Link 
              href="/" 
              className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95"
            >
              <ShoppingBag size={20} /> Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  );
}
