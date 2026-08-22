"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Layers, X, Plus, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export type POSProduct = {
  id: string;
  name: string;
  banglaName?: string;
  sellPrice: number;
  stock: number;
  barcode: string;
  category: string;
  image?: string;
  brand?: string;
  sku?: string;
  variantId?: number;
  hasVariant?: boolean;
};

interface ProductGridProps {
  products: POSProduct[];
  onSelectProduct: (product: POSProduct) => void;
  cartQuantities: Record<string, number>;
}

export function ProductGrid({ products, onSelectProduct, cartQuantities }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extract unique categories
  useEffect(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) {
        cats.add(p.category);
      }
    });
    setCategories(["All", ...Array.from(cats)]);
  }, [products]);

  // Barcode quick-add detection
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length >= 8) {
      const match = products.find(
        (p) => p.barcode === trimmed || (p.sku && p.sku === trimmed)
      );
      if (match && match.stock > 0) {
        onSelectProduct(match);
        setSearchQuery(""); // Clear search bar upon success
      }
    }
  }, [searchQuery, products, onSelectProduct]);

  // Filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.banglaName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery) ||
      (product.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden border-slate-100 shadow-xl shadow-slate-100/30">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          All Products
          <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
            {filteredProducts.length}
          </span>
        </h3>
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-3 border-b border-slate-100 bg-[#fafafa]/50 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <Input
            ref={searchInputRef}
            placeholder="Search by name, barcode or SKU..."
            className="pl-10 pr-9 h-9 rounded-xl bg-white border-slate-200 focus:border-indigo-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border
                ${
                  selectedCategory === category
                    ? "bg-[#F3F2FF] text-indigo-700 border-indigo-200"
                    : "bg-white text-slate-600 border-slate-150 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              {category !== "All" && <Layers className="w-3.5 h-3.5 opacity-70" />}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white border border-slate-100 rounded-2xl p-6">
            <Sparkles className="w-10 h-10 text-indigo-200 mb-3 animate-pulse" />
            <p className="font-bold text-slate-700 text-sm">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-4">
            {filteredProducts.map((product) => {
              const inCartQty = cartQuantities[product.id] || 0;
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 5;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOutOfStock && onSelectProduct(product)}
                  className={`group relative bg-white rounded-xl border transition-all duration-300 p-3 flex flex-col justify-between cursor-pointer select-none overflow-hidden
                    ${
                      isOutOfStock
                        ? "opacity-60 border-slate-150 bg-slate-50/50 cursor-not-allowed"
                        : "border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-slate-100/50 hover:border-indigo-200 hover:-translate-y-0.5 active:scale-[0.98]"
                    }
                    ${inCartQty > 0 ? "ring-2 ring-indigo-500/80 border-indigo-200" : ""}`}
                >
                  {/* Cart Quantity Badge */}
                  {inCartQty > 0 && (
                    <span className="absolute top-3 right-3 bg-indigo-600 text-white font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/20 border-2 border-white animate-in zoom-in duration-200">
                      {inCartQty}
                    </span>
                  )}

                  {/* Top: Image & Info */}
                  <div className="space-y-2">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 text-lg font-bold">
                          {product.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      {/* Stock Badge */}
                      <div className="absolute bottom-2 left-2">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-50 border border-rose-100 text-rose-700">
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-50 border border-amber-100 text-amber-700">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 border border-emerald-100 text-emerald-700">
                            Qty: {product.stock}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2.2rem]">
                        {product.name}
                      </h4>
                      {product.banglaName && (
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 Bengali-font mt-0.5">
                          {product.banglaName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-55">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-450 font-semibold font-mono">
                        {product.sku || "N/A"}
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-indigo-650">
                        ৳{product.sellPrice.toFixed(2)}
                      </span>
                    </div>
                    {!isOutOfStock && (
                      <button
                        type="button"
                        className="h-8 w-8 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
