import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { RegisterClient } from "@/app/(customer)/register/RegisterClient";

export const metadata = {
  title: "B2B Registration | Mohimaa",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />
      
      <main className="flex-grow pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <RegisterClient />
      </main>
      
      <CustomerFooter />
    </div>
  );
}
