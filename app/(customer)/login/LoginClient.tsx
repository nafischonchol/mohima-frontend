"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { requestApi } from "@/lib/api/client";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { toast } from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await requestApi("/customer/login", {
        method: "POST",
        body: { login: loginInput, password },
        isPublic: true,
      });

      if (response.success) {
        toast.success(response.message || "Logged in successfully!", {
          style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        });

        const data = response.resources?.data || response.resources;
        if (data?.token) {
          localStorage.setItem("customer_token", data.token);
          localStorage.setItem("customer_user", JSON.stringify(data.client));
          window.dispatchEvent(new Event("customer-auth-changed"));
          
          // Fetch customer wishlist after login
          useWishlistStore.getState().fetchWishlist().catch(() => {});
        }
        router.push(redirectUrl);
      } else {
        toast.error(response.message || "Failed to log in. Please check input fields.", {
          duration: 5000,
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl relative overflow-hidden mt-12">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/10 dark:bg-rose-500/20 blur-[60px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Log in to access your B2B dashboard and wholesale pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-400">Email Address or Username</label>
          <div className="relative">
            <input 
              required 
              type="text" 
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors shadow-inner" 
            />
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-400">Password</label>
            <Link href="/forgot-password" className="text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-rose-500 dark:hover:text-rose-400 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input 
              required 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-11 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors shadow-inner" 
            />
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-rose-500 focus:ring-rose-500 bg-slate-50 dark:bg-slate-950 cursor-pointer" />
          <label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            Remember me for 30 days
          </label>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="mt-4 w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Access Dashboard"
          )}
        </button>

      </form>

      <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-800 pt-6">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Don't have a wholesale account? <br/>
          <Link href="/register" className="text-orange-600 hover:text-orange-700 dark:text-white font-bold hover:underline transition-all mt-1 inline-block">
            Apply for Registration
          </Link>
        </p>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500" />
    </div>
  );
}

export function LoginClient() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-500 font-medium">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

