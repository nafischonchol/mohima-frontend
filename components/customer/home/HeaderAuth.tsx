"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useCustomerAuth } from "@/lib/hooks/useCustomerAuth";

export function HeaderAuth() {
  const { isLoggedIn, customerUser } = useCustomerAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    window.dispatchEvent(new Event("customer-auth-changed"));
    toast.success(`Logged out successfully`, {
      style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
    });
    router.push("/login");
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2 sm:gap-4 text-slate-300">
        <Link 
          href="/account" 
          className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
        >
          <User size={16} />
          <span className="font-medium text-sm">My Account</span>
        </Link>
        <span className="text-slate-600">|</span>
        <button 
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-4 text-slate-300">
      <Link href="/register" className="hover:text-orange-400 transition-colors">
        Register
      </Link>
      <span className="text-slate-600">|</span>
      <Link href="/login" className="hover:text-orange-400 transition-colors">
        Log In
      </Link>
    </div>
  );
}
