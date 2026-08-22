"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, PhoneCall, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { getPublicStoreSetup, StoreSetup } from "@/lib/api/storeSetup";

export function CustomerFooter() {
  const [storeSetup, setStoreSetup] = useState<StoreSetup | null>(null);

  useEffect(() => {
    getPublicStoreSetup().then((res) => {
      if (res.success && res.resources) {
        setStoreSetup(res.resources);
      }
    });
  }, []);

  const logoUrl = "/mohimaa 1.png";
  const storeName = storeSetup?.store_name || "MOHIMAA";
  const helplinePhone = storeSetup?.phone || "+8801700000000";
  // Assuming email and address exist or using fallbacks
  const email = (storeSetup as any)?.email || "wholesale@mohimaa.com";
  const address = (storeSetup as any)?.address || "Dhaka, Bangladesh & Seoul, S. Korea";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Column 1: Branding & Contact */}
          <div className="flex flex-col gap-5 lg:pr-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="relative h-16 w-56 flex items-center justify-start shrink-0">
                  <Image
                    src={logoUrl}
                    alt={storeName}
                    width={224}
                    height={64}
                    className="object-contain max-h-16 w-auto"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0">
                  <ShoppingBag size={20} />
                </div>
              )}
              {!logoUrl && (
                <span className="text-xl font-extrabold text-white font-mono uppercase tracking-tight">
                  {storeName}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              100% Authentic Korean Beauty Products • Direct from Brand Owners & Trusted Suppliers
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href={`https://wa.me/${helplinePhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium text-slate-400">
              <li><Link href="/" className="hover:text-rose-500 transition-colors">Home</Link></li>
              <li><Link href="/catalog" className="hover:text-rose-500 transition-colors">Wholesale Catalog</Link></li>
              <li><Link href="/brands" className="hover:text-rose-500 transition-colors">All Brands</Link></li>
              <li><Link href="/register" className="hover:text-rose-500 transition-colors">Become a Reseller</Link></li>
              <li><Link href="/contact" className="hover:text-rose-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Customer Service</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium text-slate-400">
              <li><Link href="/faq" className="hover:text-rose-500 transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-rose-500 transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-rose-500 transition-colors">Return Policy</Link></li>
              <li><Link href="/payment" className="hover:text-rose-500 transition-colors">Payment Information</Link></li>
              <li><Link href="/terms" className="hover:text-rose-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect With Us */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">CONTACT US</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Have questions about our Korean beauty products, wholesale pricing, bulk orders, product sourcing, or B2B partnership opportunities? Our dedicated team is here to assist you with reliable information and professional support.
            </p>

            

          </div>
        </div>

        {/* Contact Info Row & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-slate-300">
            <a 
              href={`tel:${helplinePhone}`} 
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:border-rose-500/50 hover:text-white transition-all shadow-sm group w-full md:w-auto justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                <PhoneCall size={14} />
              </div>
              <span className="font-medium tracking-wide">{helplinePhone}</span>
            </a>
            
            <a 
              href={`mailto:${email}`} 
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:border-rose-500/50 hover:text-white transition-all shadow-sm group w-full md:w-auto justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                <Mail size={14} />
              </div>
              <span className="font-medium tracking-wide">{email}</span>
            </a>
            
            <div 
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/80 border border-slate-800 transition-all shadow-sm w-full md:w-auto justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                <MapPin size={14} />
              </div>
              <span className="font-medium tracking-wide text-slate-300">{address}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <p>© {currentYear} {storeName}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>B2B Wholesale Portal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

