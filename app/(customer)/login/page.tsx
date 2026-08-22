import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { LoginClient } from "@/app/(customer)/login/LoginClient";

export const metadata = {
  title: "Log In | Mohimaa",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />
      
      <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 w-full relative flex items-center justify-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <LoginClient />
      </main>
      
      <CustomerFooter />
    </div>
  );
}
