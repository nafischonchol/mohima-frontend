"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  User, 
  LogOut 
} from "lucide-react";

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Dashboard", href: "/account", icon: LayoutDashboard },
    { name: "Order History", href: "/account/orders", icon: Package },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Account Details", href: "/account/details", icon: User },
  ];

  return (
    <div className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 lg:p-6 sticky top-24 shadow-sm">
        <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">My Account</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your B2B profile</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold ${
                  isActive 
                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent"
                }`}
              >
                <Icon size={18} className={isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"} />
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button"
              onClick={() => {
                import("react-hot-toast").then((mod) => {
                  mod.toast.success(`Logged out successfully`, {
                    style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
                  });
                });
                router.push("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/20 border border-transparent"
            >
              <LogOut size={18} className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
