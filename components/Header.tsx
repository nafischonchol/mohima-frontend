"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, Menu, X, Phone, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.028 0 12 0 12s0 3.972.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.972 24 12 24 12s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.2 1.25 1.48 3.04 2.4 4.95 2.6v3.85c-1.8-.1-3.52-.82-4.9-1.92-.09-.07-.17-.16-.29-.27v7.03c.03 5.48-4.56 9.87-10.02 9.77-5.07-.1-9.25-4.22-9.43-9.29C-.07 10.63 4.14 6 9.61 6.01c1.23.01 2.45.29 3.56.84V10.7c-.89-.54-1.92-.83-2.98-.82-2.73.01-4.95 2.22-4.97 4.95-.02 2.92 2.43 5.25 5.35 5.17 2.45-.06 4.54-1.89 4.79-4.32.06-.59.03-1.18.03-1.77V.02h.13z"/>
  </svg>
);

const navCategories = [
  "Skin",
  "Health & Hygiene",
  "Body",
  "Hair",
  "Mom & Baby",
  "Oral Care",
  "Makeup",
  "Fragrance",
  "Men",
  "Accessories",
  "Supplement",
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, wishlist, setCartOpen } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const onCartClick = () => setCartOpen(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");

  useEffect(() => {
    setSearchQuery(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search_text=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/catalog`);
    }
  };

  const onCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (category) {
      params.set("category", category);
      params.delete("concern");
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onConcernClick = (concern: string | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (concern) {
      params.set("concern", concern);
      params.delete("category");
    } else {
      params.delete("concern");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="w-full flex flex-col z-50 bg-white">
      {/* 1. Top Announcement/Info Bar (Hot Pink) */}
      <div className="w-full bg-[#D49783] text-white text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        {/* Left Side: Call & Social Media */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:+8801790-270066"
            className="flex items-center gap-1 hover:opacity-90 font-medium whitespace-nowrap transition-opacity"
          >
            <Phone size={13} className="fill-current" />
            <span>Call Now: +8801790-270066</span>
          </a>
          <span className="text-white/40 hidden sm:inline">|</span>
          <div className="flex items-center gap-2.5">
            <span className="text-white/90">Follow us on</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform"
              aria-label="TikTok"
            >
              <TiktokIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Side: FAQ, Sign In */}
        <div className="flex items-center gap-4">
          <Link
            href="/faq"
            className="flex items-center gap-1 hover:opacity-90 transition-opacity font-medium"
          >
            <FileText size={13} />
            <span>FAQ</span>
          </Link>
          <span className="text-white/40">|</span>
          <Link
            href="/signin"
            className="font-bold hover:underline transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* 2. Main Header Row (Logo, Search, Actions) */}
      <div className="w-full border-b border-black/[0.06] bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
          {/* Logo & Mobile Menu Toggle */}
          <div className="w-full md:w-auto flex justify-between items-center">
            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-black hover:opacity-75 transition-opacity"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Previous Serif Logo Centered/Left-aligned */}
            <div className="text-center md:text-left flex-1 md:flex-none">
              <Link
                href="/"
                className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.2em] text-[#121212] select-none hover:opacity-90 transition-opacity block"
              >
                MOHIMA
                <span className="block text-[8px] sm:text-[9px] font-sans font-light tracking-[0.55em] text-[#CC826A] mt-0.5 uppercase pl-0.5">
                  PREMIUM BEAUTY
                </span>
              </Link>
            </div>

            {/* Mobile Cart Counter Shortcut */}
            <button
              onClick={onCartClick}
              className="md:hidden text-[#e91b5c] hover:opacity-75 transition-opacity flex items-center gap-1"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              <span className="text-sm font-bold text-black">{cartCount}</span>
            </button>
          </div>

          {/* Search Bar (Rounded pill) */}
          <div className="w-full md:flex-1 max-w-xl">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-black/15 focus:border-[#e91b5c] focus:outline-none rounded-full py-2.5 pl-6 pr-12 text-sm transition-all text-black placeholder-black/40 shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#e91b5c] hover:opacity-80 transition-opacity"
                aria-label="Search Submit"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Action Links & Badges (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* DEALS Link */}
            <Link
              href="/deals"
              className="text-[#e91b5c] font-extrabold text-sm tracking-wider hover:opacity-85 transition-opacity flex items-center gap-0.5"
            >
              <span>DEALS</span>
              <span className="text-xs">⚡</span>
            </Link>

            {/* Wishlist Icon with count */}
            <button
              onClick={() => {
                onConcernClick(null);
                window.scrollTo({ top: 1200, behavior: "smooth" });
              }}
              className="flex items-center gap-1 text-black hover:text-[#e91b5c] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-[#e91b5c]" />
              <span className="text-sm font-bold">{wishlistCount}</span>
            </button>

            {/* Shopping Bag Icon with count */}
            <button
              onClick={onCartClick}
              className="flex items-center gap-1 text-black hover:text-[#e91b5c] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={22} className="text-[#e91b5c]" />
              <span className="text-sm font-bold">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Bar (Categories & Badges) */}
      <div className="w-full border-b border-black/[0.04] bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          {/* Scrollable Categories List */}
          <nav className="flex items-center gap-5 lg:gap-7">
            {navCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryClick(category);
                  const elem = document.getElementById("products-catalog");
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-xs font-bold text-black/70 hover:text-[#e91b5c] tracking-wide uppercase transition-colors whitespace-nowrap cursor-pointer"
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Right side Badge/Pills */}
          <div className="flex items-center gap-2 pl-4 ml-4 border-l border-black/[0.08] shrink-0">
            <Link
              href="/brands"
              className="bg-[#e91b5c] text-white text-[10px] font-extrabold tracking-wider px-3.5 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap uppercase"
            >
              BRANDS
            </Link>
            <Link
              href="/blog"
              className="bg-[#6366f1] text-white text-[10px] font-extrabold tracking-wider px-3.5 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap uppercase"
            >
              BLOG
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex justify-start">
          <div className="w-80 h-full bg-white p-6 shadow-2xl flex flex-col animate-slide-in">
            {/* Sidebar Header */}
            <div className="flex justify-between items-center border-b border-black/[0.06] pb-4 mb-6">
              <span className="font-serif text-lg font-normal tracking-widest uppercase">
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#121212] p-1"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex flex-col gap-4 text-sm font-bold tracking-wider text-black/85 uppercase overflow-y-auto no-scrollbar flex-1">
              {navCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryClick(category);
                    setMobileMenuOpen(false);
                    const elem = document.getElementById("products-catalog");
                    if (elem) {
                      elem.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-left py-2 border-b border-black/[0.02] hover:text-[#e91b5c] transition-colors"
                >
                  {category}
                </button>
              ))}
              
              {/* Additional Sidebar Links */}
              <div className="border-t border-black/[0.06] pt-4 mt-2 flex flex-col gap-3">
                <Link
                  href="/deals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#e91b5c] font-extrabold py-1"
                >
                  DEALS ⚡
                </Link>

                <Link
                  href="/brands"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-black/80 hover:text-[#e91b5c] py-1"
                >
                  BRANDS
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-black/80 hover:text-[#e91b5c] py-1"
                >
                  BLOG
                </Link>
              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-auto border-t border-black/[0.06] pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-[#565656]">
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-semibold">
                  <span>My Account / Sign In</span>
                </Link>
              </div>
              <p className="text-[10px] text-[#565656]/60 tracking-wider" suppressHydrationWarning>
                © {new Date().getFullYear()} Mohima Premium Beauty. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

