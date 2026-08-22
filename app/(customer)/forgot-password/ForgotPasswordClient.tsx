"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      import("react-hot-toast").then((mod) => {
        mod.toast.success(`Reset link sent successfully!`, {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        });
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/50 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden mt-12">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none -z-10" />

      {!isSubmitted ? (
        <>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">Reset Password</h2>
            <p className="text-slate-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400">Email Address</label>
              <div className="relative">
                <input 
                  required 
                  type="email" 
                  placeholder="Enter your registered email"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-rose-500 transition-colors shadow-inner" 
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Check Your Email</h2>
          <p className="text-slate-400 text-sm mb-8">
            We've sent a password reset link to your email address. Please click the link to choose a new password.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            Didn't receive it? Try again.
          </button>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-slate-800 text-center">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>

    </div>
  );
}
