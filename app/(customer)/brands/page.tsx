"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { getPublicBrands, PublicBrand } from "@/lib/api/brands";

// Vibrant gradient backgrounds for text fallbacks
const fallbackGradients = [
  "bg-gradient-to-br from-rose-500 to-pink-600 text-white",
  "bg-gradient-to-br from-indigo-500 to-purple-600 text-white",
  "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
  "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
  "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
  "bg-gradient-to-br from-slate-800 to-slate-900 text-white",
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<PublicBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await getPublicBrands();
        if (res.success && Array.isArray(res.resources)) {
          setBrands(res.resources);
        }
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header Banner */}
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-500/20 rounded-xl p-4 mb-10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Sparkles className="text-rose-600 dark:text-rose-400" size={24} />
              <h1 className="text-rose-900 dark:text-rose-300 font-bold text-lg">All Brands</h1>
            </div>
            {!isLoading && (
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-3 py-1 rounded-full">
                {brands.length} Brands
              </span>
            )}
          </div>

          {/* Brands Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse"
                />
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div className="py-20 text-center text-slate-500 dark:text-slate-400">
              No brands available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {brands.map((brand, i) => {
                const gradientClass = fallbackGradients[i % fallbackGradients.length];

                return (
                  <Link
                    href={`/catalog?brand_id=${brand.id}`}
                    key={brand.id}
                    className={`aspect-square rounded-2xl ${
                      brand.icon
                        ? "bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                        : gradientClass
                    } flex flex-col items-center justify-center p-4 text-center hover:scale-[1.03] hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm`}
                  >
                    {brand.icon ? (
                      <img
                        src={brand.icon}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.classList.remove("hidden");
                          }
                        }}
                      />
                    ) : null}

                    <span
                      className={`${
                        brand.icon ? "hidden" : "block"
                      } font-sans font-extrabold text-sm tracking-wide uppercase z-10 relative group-hover:scale-105 transition-transform`}
                    >
                      {brand.name}
                    </span>

                    {/* Hover overlay shine */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
