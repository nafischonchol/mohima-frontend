import React, { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ConcernGrid from "@/components/ConcernGrid";

import ProductCard from "@/components/ProductCard";
import InfiniteProductGrid from "@/components/InfiniteProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { FilterX } from "lucide-react";
import Link from "next/link";
import { getPopularProducts } from "@/lib/api/products";

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = typeof searchParams?.q === "string" ? searchParams.q : "";
  const selectedCategory =
    typeof searchParams?.category === "string" ? searchParams.category : null;
  const selectedConcern =
    typeof searchParams?.concern === "string" ? searchParams.concern : null;

  const { products: fetchedProducts, pagination } = await getPopularProducts();

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedConcern ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] font-sans">
      {/* Top Navbar */}
      <Suspense fallback={<div className="h-20 bg-white"></div>}>
        <Header />
      </Suspense>

      {/* Hero Banner Slideshow */}
      <HeroSection />

      <main className="flex-1 w-full">
        {/* Categories circle grid */}
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryGrid />
        </Suspense>

        {/* Skin Concern Grid */}
        <Suspense fallback={<div>Loading concerns...</div>}>
          <ConcernGrid />
        </Suspense>

        {/* Products catalog section */}
        <section
          id="products-catalog"
          className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 scroll-reveal"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#E5E5E5] pb-6 mb-10 gap-4">
            <div className="flex flex-col gap-2 text-left">
              <span className="text-[10px] tracking-[0.3em] font-bold text-[#CC826A] uppercase">
                THE BEAUTY SHELF
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-[#121212]">
                {selectedCategory || selectedConcern || searchQuery
                  ? `Filtered Curation`
                  : "Curations"}
              </h2>
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategory && (
                    <span className="bg-[#CC826A]/10 text-[#CC826A] text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#CC826A]/20">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedConcern && (
                    <span className="bg-[#CC826A]/10 text-[#CC826A] text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#CC826A]/20">
                      Concern: {selectedConcern}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-[#CC826A]/10 text-[#CC826A] text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-[#CC826A]/20">
                      Query: &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Reset filters button */}
            {activeFiltersCount > 0 && (
              <Link
                href="/"
                scroll={false}
                className="flex items-center gap-2 text-xs font-semibold text-[#CC826A] hover:text-[#121212] transition-colors border border-[#CC826A]/30 rounded-full px-4 py-2 hover:border-[#121212] cursor-pointer"
              >
                <FilterX size={14} />
                <span>Reset Filters</span>
              </Link>
            )}
          </div>

          {/* Product cards Grid */}
          <InfiniteProductGrid 
            initialProducts={fetchedProducts}
            initialPagination={pagination}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedConcern={selectedConcern}
          />
        </section>
      </main>

      {/* Cart side drawer overlay */}
      <CartDrawer />

      {/* Footer information section */}
      <Footer />
    </div>
  );
}
