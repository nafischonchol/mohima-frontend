import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { CartClient } from "@/app/(customer)/cart/CartClient";

export const metadata = {
  title: "Your Cart | Mohimaa",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />
      <main className="flex-grow pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Your Cart</h1>
        <CartClient />
      </main>
      <CustomerFooter />
    </div>
  );
}
