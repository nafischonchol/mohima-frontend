"use client";

import React, { useState } from "react";
import { ShieldCheck, HeartHandshake, Truck, RefreshCw, Send } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Welcome to the Glow Circle! A 15% discount code has been sent to ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#121212] text-[#FAF9F6] border-t border-white/[0.05] select-none mt-12">
      {/* Trust Badges Bar */}
      <div className="w-full border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <ShieldCheck size={28} className="text-[#E0A996]" />
            <h3 className="text-xs font-bold tracking-widest uppercase">100% Authentic</h3>
            <p className="text-[10px] text-[#FAF9F6]/60 leading-relaxed font-light max-w-[200px]">
              Directly sourced from trusted brands in South Korea & Japan.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <HeartHandshake size={28} className="text-[#E0A996]" />
            <h3 className="text-xs font-bold tracking-widest uppercase">Cruelty Free</h3>
            <p className="text-[10px] text-[#FAF9F6]/60 leading-relaxed font-light max-w-[200px]">
              We prioritize clean formulas that are never tested on animals.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <Truck size={28} className="text-[#E0A996]" />
            <h3 className="text-xs font-bold tracking-widest uppercase">Express Delivery</h3>
            <p className="text-[10px] text-[#FAF9F6]/60 leading-relaxed font-light max-w-[200px]">
              Carefully packed shipments sent straight to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3">
            <RefreshCw size={28} className="text-[#E0A996]" />
            <h3 className="text-xs font-bold tracking-widest uppercase">Easy Returns</h3>
            <p className="text-[10px] text-[#FAF9F6]/60 leading-relaxed font-light max-w-[200px]">
              Hassle-free 7-day exchange window for undamaged packages.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-white/[0.06]">
        {/* Brand Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 text-left">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-normal tracking-[0.25em] text-white">
            MOHIMA
            <span className="block text-[8px] font-sans font-light tracking-[0.6em] text-[#E0A996] mt-0.5 uppercase">
              PREMIUM BEAUTY
            </span>
          </Link>
          <p className="text-xs text-[#FAF9F6]/65 leading-relaxed tracking-wider font-light max-w-sm">
            Experience the art of mindful self-care. Mohima brings you premium, authentic skincare products carefully curated to deliver the coveted glass skin glow.
          </p>
          {/* Socials placeholder */}
          <div className="flex gap-4 text-xs font-bold tracking-widest uppercase text-[#E0A996]">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>

        {/* Curation Links Column */}
        <div className="lg:col-span-2.5 flex flex-col gap-5 text-left">
          <h4 className="text-xs font-bold tracking-widest uppercase text-white">Curations</h4>
          <ul className="space-y-3 text-xs text-[#FAF9F6]/60 font-light tracking-wide">
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Glass Skin Routine</a></li>
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Centella Calming Care</a></li>
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Vitamin C Brightening</a></li>
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Snail Mucin Essentials</a></li>
          </ul>
        </div>

        {/* Help Links Column */}
        <div className="lg:col-span-2.5 flex flex-col gap-5 text-left">
          <h4 className="text-xs font-bold tracking-widest uppercase text-white">Customer Care</h4>
          <ul className="space-y-3 text-xs text-[#FAF9F6]/60 font-light tracking-wide">
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Contact Support</a></li>
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Track Orders</a></li>
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-[#E0A996] transition-colors">Returns & Refunds</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-3 flex flex-col gap-5 text-left">
          <h4 className="text-xs font-bold tracking-widest uppercase text-white">Join the Glow Circle</h4>
          <p className="text-xs text-[#FAF9F6]/60 leading-relaxed font-light">
            Subscribe to receive editorial curation logs, skincare advice, and 15% off your first purchase.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-white/30 focus-within:border-[#E0A996] py-1.5 transition-colors">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent text-xs text-white placeholder-[#FAF9F6]/40 focus:outline-none w-full pr-10 tracking-wider"
            />
            <button type="submit" className="absolute right-0 text-[#E0A996] hover:text-white transition-colors cursor-pointer" aria-label="Subscribe">
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright & Payments */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <span className="text-[10px] text-[#FAF9F6]/40 tracking-wider" suppressHydrationWarning>
          © {new Date().getFullYear()} Mohima Premium Beauty. Sourced with care. All rights reserved.
        </span>

        {/* Payment Partners placeholder */}
        <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-[#FAF9F6]/40 font-semibold select-none">
          <span>bKash</span>
          <span className="opacity-30">|</span>
          <span>Nagad</span>
          <span className="opacity-30">|</span>
          <span>Visa</span>
          <span className="opacity-30">|</span>
          <span>Mastercard</span>
          <span className="opacity-30">|</span>
          <span>COD</span>
        </div>
      </div>
    </footer>
  );
}
