"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrandMegaMenu } from "@/components/customer/home/BrandMegaMenu";
import { CategoryMegaMenu } from "@/components/customer/home/CategoryMegaMenu";
import { MobileSidebar } from "@/components/customer/home/MobileSidebar";
import { HeaderAuth } from "@/components/customer/home/HeaderAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPublicStoreSetup, StoreSetup } from "@/lib/api/storeSetup";
import { filterProducts, Product } from "@/lib/api/products";
import { useCustomerAuth } from "@/lib/hooks/useCustomerAuth";

export function CustomerHeader() {
  const router = useRouter();
  const { isLoggedIn } = useCustomerAuth();
  const [storeSetup, setStoreSetup] = useState<StoreSetup | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublicStoreSetup().then((res) => {
      if (res.success && res.resources) {
        setStoreSetup(res.resources);
      }
    });
  }, []);

  // Debounced live search
  useEffect(() => {
    const query = searchInput.trim();
    if (!query) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await filterProducts({ search_text: query, per_page: 15 });
        if (res.success && res.resources) {
          const rawItems = Array.isArray(res.resources)
            ? res.resources
            : (res.resources as any).items || [];
          setSearchResults(rawItems.slice(0, 15));
          setIsOpen(true);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Live search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductClick = (slugUrl?: string, id?: number) => {
    setIsOpen(false);
    const targetSlug = slugUrl || (id ? String(id) : "");
    if (targetSlug) {
      router.push(`/product/${targetSlug}`);
    }
  };

  const handleSearchSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/catalog?search_text=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/catalog`);
    }
  };

  const logoUrl = storeSetup?.logo || "/mohimaa 1.png";
  const storeName = storeSetup?.store_name || "Mohimaa";

  const renderDropdown = () => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 max-h-[480px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 transition-all">
        {isLoading ? (
          <div className="flex items-center justify-center p-6 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm font-medium">Searching products...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="py-1">
              {searchResults.map((product) => {
                const currentPrice =
                  (product as any).min_discount_price && (product as any).min_discount_price > 0
                    ? (product as any).min_discount_price
                    : product.min_price;

                const regularPrice =
                  (product as any).min_discount_price && (product as any).min_discount_price > 0
                    ? product.min_price
                    : null;

                return (
                  <div
                    key={product.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleProductClick(product.slug_url || product.slug, product.id);
                    }}
                    className="flex items-center gap-3.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        {isLoggedIn ? (
                          <>
                            <span className="text-sm font-extrabold text-rose-600 dark:text-rose-500">
                              ৳{currentPrice}
                            </span>
                            {regularPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ৳{regularPrice}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20">
                            Log In to View Price
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-center cursor-pointer text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors border-t border-slate-100 dark:border-slate-800"
            >
              See all results for "{searchInput}"
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
            No products found matching "{searchInput}"
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="relative z-30 flex flex-col w-full bg-slate-950 transition-colors duration-300">
      {/* Top Header Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Row */}
          <div className="flex items-center justify-between h-20 lg:h-28 gap-4 lg:gap-8">
            
            {/* Mobile Menu & Logo Group */}
            <div className="flex items-center gap-3 lg:gap-0">
              {/* Hamburger & Sidebar Drawer (Mobile Only) */}
              <MobileSidebar />

              {/* Logo Section */}
              <Link href="/" className="flex items-center flex-shrink-0">
                 <Image 
                   src={logoUrl} 
                   alt={storeName} 
                   width={240} 
                   height={70} 
                   className="object-contain max-h-16 sm:max-h-20 w-auto max-w-[140px] sm:max-w-[180px] lg:max-w-[240px]"
                   priority
                   unoptimized
                 />
              </Link>
            </div>

            {/* Search Bar (Desktop Only) */}
            <div className="hidden lg:block flex-1 max-w-2xl px-8 relative" ref={searchContainerRef}>
              <form 
                onSubmit={handleSearchSubmit}
                className="relative group"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0 && searchInput.trim()) {
                      setIsOpen(true);
                    }
                  }}
                  className="w-full bg-transparent border-b border-slate-600 text-slate-200 px-2 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder:text-slate-500 text-lg"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-orange-500 transition-colors">
                  <Search size={24} />
                </button>
              </form>

              {renderDropdown()}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-[11px] sm:text-xs lg:text-sm font-bold lg:font-medium text-slate-300 whitespace-nowrap">
              <HeaderAuth />
              
              <ThemeToggle />
              
              <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-orange-400 transition-colors px-3 py-1.5 border border-slate-700 rounded-md bg-slate-900">
                <span>ENGLISH</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Search Bar (Mobile Only - shown below main row) */}
          <div className="lg:hidden pb-4 relative" ref={searchContainerRef}>
            <form 
              onSubmit={handleSearchSubmit}
              className="relative group bg-slate-900 rounded-full border border-slate-700 px-4 py-2 flex items-center shadow-inner"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0 && searchInput.trim()) {
                    setIsOpen(true);
                  }
                }}
                className="w-full bg-transparent text-slate-200 text-sm focus:outline-none placeholder:text-slate-500"
              />
              <button type="submit" className="text-slate-400 hover:text-orange-500 transition-colors">
                <Search size={18} />
              </button>
            </form>

            {renderDropdown()}
          </div>

        </div>
      </div>

      {/* Navigation Bar - Aligned with Brand Logo Gradient (Hidden on Mobile) */}
      <div className="hidden lg:block bg-gradient-to-r from-rose-600 via-orange-500 to-yellow-500 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between h-14 text-[15px] font-extrabold text-white whitespace-nowrap">
            <BrandMegaMenu />
            <CategoryMegaMenu />
            <li>
              <Link href="/catalog" className="hover:text-slate-900 transition-colors px-2 py-2">
                Products
              </Link>
            </li>
            <li>
              <Link href="/best-sellings" className="hover:text-slate-900 transition-colors px-2 py-2">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link href="/new-arrivals" className="hover:text-slate-900 transition-colors px-2 py-2">
                New Arrival
              </Link>
            </li>
            <li>
              <Link href="/how-to-use" className="hover:text-slate-900 transition-colors px-2 py-2">
                How to Use
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-slate-900 transition-colors px-2 py-2">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/why-us" className="hover:text-slate-900 transition-colors px-2 py-2">
                Why Mohimaa?
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

