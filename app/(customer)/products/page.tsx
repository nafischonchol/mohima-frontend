"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Filter,
  X,
  Check,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Grid,
  List as ListIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { getFilterableData, filterProducts, FilterableData } from "@/lib/api/products";

function CatalogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params extraction
  const categoryIdParam = searchParams.get("category_id") || "";
  const brandIdParam = searchParams.get("brand_id") || "";
  const concernIdParam = searchParams.get("concern_id") || "";
  const searchTextParam = searchParams.get("q") || searchParams.get("search_text") || "";
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const isStockParam = searchParams.get("is_stock") || "";
  const sortByParam = searchParams.get("sort_by") || "latest";

  // State for filter options returned from API (/api/customer/filterable-data)
  const [filterData, setFilterData] = useState<FilterableData | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Active Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryIdParam);
  const [selectedBrand, setSelectedBrand] = useState<string>(brandIdParam);
  const [selectedConcern, setSelectedConcern] = useState<string>(concernIdParam);
  const [minPrice, setMinPrice] = useState<string>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<string>(maxPriceParam);
  const [inStockOnly, setInStockOnly] = useState<boolean>(isStockParam === "true" || isStockParam === "1");
  const [sortBy, setSortBy] = useState<string>(sortByParam);
  const [searchText, setSearchText] = useState<string>(searchTextParam);

  // Products state & pagination
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile sidebar filter drawer toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    concerns: true,
    price: true,
  });

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(categoryIdParam);
    setSelectedBrand(brandIdParam);
    setSelectedConcern(concernIdParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setInStockOnly(isStockParam === "true" || isStockParam === "1");
    setSortBy(sortByParam);
    setSearchText(searchTextParam);
  }, [categoryIdParam, brandIdParam, concernIdParam, minPriceParam, maxPriceParam, isStockParam, sortByParam, searchTextParam]);

  // Fetch filter options ONCE from /api/customer/filterable-data
  useEffect(() => {
    async function loadFilterableData() {
      setLoadingFilters(true);
      const res = await getFilterableData();
      if (res && res.success && res.resources) {
        setFilterData(res.resources);
      }
      setLoadingFilters(false);
    }
    loadFilterableData();
  }, []);

  // Fetch products based on active filters
  useEffect(() => {
    async function loadFilteredProducts() {
      setLoadingProducts(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

      const res = await filterProducts({
        search_text: searchText || undefined,
        category_id: selectedCategory || undefined,
        brand_id: selectedBrand || undefined,
        concern_id: selectedConcern || undefined,
        min_price: minPrice ? Number(minPrice) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        is_stock: inStockOnly ? 1 : undefined,
        sort_by: sortBy || undefined,
        page: currentPage,
        per_page: 16,
      });

      if (res && res.success && res.resources) {
        const mappedProducts = res.resources.map((item: any) => {
          const price =
            item.discount_price ||
            item.min_discount_price ||
            item.price ||
            item.min_price ||
            0;
          const originalPrice = item.price || item.min_price || 0;
          return {
            id: String(item.id),
            slug_url: item.slug_url,
            name: item.name,
            category: item.category?.name || "Uncategorized",
            price: Number(price),
            originalPrice: originalPrice > price ? Number(originalPrice) : undefined,
            image: item.thumbnail
              ? item.thumbnail.startsWith("http")
                ? item.thumbnail
                : `${apiBase}${item.thumbnail}`
              : "/images/product_snail.png",
            rating: item.rating || 4.8,
            reviewsCount: item.reviews_count || 12,
            concern: "Skincare",
            isBestSeller: item.is_bestseller || false,
            isNew: false,
          };
        });
        setProducts(mappedProducts);
        setPagination(res.pagination || null);
      } else {
        setProducts([]);
        setPagination(null);
      }
      setLoadingProducts(false);
    }

    loadFilteredProducts();
  }, [selectedCategory, selectedBrand, selectedConcern, minPrice, maxPrice, inStockOnly, sortBy, searchText, currentPage]);

  // Apply filters to URL
  const updateQueryParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (id: string) => {
    const val = selectedCategory === id ? "" : id;
    setSelectedCategory(val);
    setCurrentPage(1);
    updateQueryParams({ category_id: val });
  };

  const handleBrandSelect = (id: string) => {
    const val = selectedBrand === id ? "" : id;
    setSelectedBrand(val);
    setCurrentPage(1);
    updateQueryParams({ brand_id: val });
  };

  const handleConcernSelect = (id: string) => {
    const val = selectedConcern === id ? "" : id;
    setSelectedConcern(val);
    setCurrentPage(1);
    updateQueryParams({ concern_id: val });
  };

  const handlePriceApply = () => {
    setCurrentPage(1);
    updateQueryParams({ min_price: minPrice, max_price: maxPrice });
  };

  const handleStockToggle = () => {
    const nextVal = !inStockOnly;
    setInStockOnly(nextVal);
    setCurrentPage(1);
    updateQueryParams({ is_stock: nextVal ? "true" : "" });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    setCurrentPage(1);
    updateQueryParams({ sort_by: val });
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedConcern("");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("latest");
    setSearchText("");
    setCurrentPage(1);
    router.push("/products");
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedConcern ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchText ? 1 : 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] font-sans">
      <Suspense fallback={<div className="h-20 bg-white"></div>}>
        <Header />
      </Suspense>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#565656] mb-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#CC826A] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-[#565656]/50 shrink-0" />
          <span className="text-[#121212] font-semibold">Catalog & Products</span>
        </nav>

        {/* Page Title & Mobile Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E5E5E5] pb-4 mb-6 gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#121212]">
              All Products
            </h1>
            <p className="text-xs text-[#565656] mt-1">
              {pagination?.total !== undefined ? `${pagination.total} products available` : "Discover our curated collection"}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-full text-xs font-semibold shadow-xs hover:border-[#CC826A]"
            >
              <SlidersHorizontal size={14} className="text-[#CC826A]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#565656] font-medium hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-3 py-2 bg-white border border-black/10 rounded-lg text-xs font-medium text-[#121212] focus:outline-none focus:border-[#CC826A] cursor-pointer shadow-xs"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="best_selling">Best Selling</option>
                <option value="price_low_to_high">Price: Low to High</option>
                <option value="price_high_to_low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filter Column */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-black/[0.04] shadow-xs sticky top-24">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#121212] tracking-wide uppercase">
                <Filter size={16} className="text-[#CC826A]" />
                <span>Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#CC826A] hover:underline"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {loadingFilters ? (
              <div className="space-y-4 py-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-100 rounded w-full"></div>
              </div>
            ) : (
              <>
                {/* 1. Categories Accordion */}
                <div className="border-b border-black/[0.06] pb-4">
                  <button
                    onClick={() => toggleSection("categories")}
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#121212] py-1"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openSections.categories ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openSections.categories && (
                    <div className="mt-3 space-y-1">
                      {filterData?.categories?.map((cat) => {
                        const isSelected = String(cat.id) === String(selectedCategory);
                        return (
                          <div key={cat.id} className="space-y-1">
                            <button
                              onClick={() => handleCategorySelect(String(cat.id))}
                              className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors text-left font-medium ${
                                isSelected
                                  ? "bg-[#CC826A]/10 text-[#CC826A] font-bold"
                                  : "text-[#565656] hover:bg-black/5 hover:text-[#121212]"
                              }`}
                            >
                              <span>{cat.name}</span>
                              {isSelected && <Check size={12} className="text-[#CC826A]" />}
                            </button>
                            {/* Children categories */}
                            {cat.children && cat.children.length > 0 && (
                              <div className="pl-3 space-y-1 border-l-2 border-[#CC826A]/20 ml-2">
                                {cat.children.map((child) => {
                                  const isChildSelected = String(child.id) === String(selectedCategory);
                                  return (
                                    <button
                                      key={child.id}
                                      onClick={() => handleCategorySelect(String(child.id))}
                                      className={`block w-full text-left text-[11px] py-1 px-2 rounded transition-colors ${
                                        isChildSelected
                                          ? "text-[#CC826A] font-bold"
                                          : "text-[#565656] hover:text-[#121212]"
                                      }`}
                                    >
                                      {child.name}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Brands Filter */}
                <div className="border-b border-black/[0.06] pb-4">
                  <button
                    onClick={() => toggleSection("brands")}
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#121212] py-1"
                  >
                    <span>Brands</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openSections.brands ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openSections.brands && (
                    <div className="mt-3 space-y-1">
                      {filterData?.brands?.map((brand) => {
                        const isSelected = String(brand.id) === String(selectedBrand);
                        return (
                          <button
                            key={brand.id}
                            onClick={() => handleBrandSelect(String(brand.id))}
                            className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors text-left font-medium ${
                              isSelected
                                ? "bg-[#CC826A]/10 text-[#CC826A] font-bold"
                                : "text-[#565656] hover:bg-black/5 hover:text-[#121212]"
                            }`}
                          >
                            <span>{brand.name}</span>
                            {isSelected && <Check size={12} className="text-[#CC826A]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Dynamic Attributes Filters (select / multiple select) */}
                {filterData?.attributes && filterData.attributes.length > 0 ? (
                  filterData.attributes.map((attr) => {
                    const sectionKey = `attr_${attr.id}`;
                    const isOpen = (openSections as any)[sectionKey] ?? true;
                    return (
                      <div key={attr.id} className="border-b border-black/[0.06] pb-4">
                        <button
                          onClick={() =>
                            setOpenSections((prev) => ({
                              ...prev,
                              [sectionKey]: !isOpen,
                            }))
                          }
                          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#121212] py-1"
                        >
                          <span>{attr.name}</span>
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isOpen && attr.attribute_values && attr.attribute_values.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {attr.attribute_values.map((val) => {
                              const isSelected = String(val.id) === String(selectedConcern);
                              return (
                                <button
                                  key={val.id}
                                  onClick={() => handleConcernSelect(String(val.id))}
                                  className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors text-left font-medium ${
                                    isSelected
                                      ? "bg-[#CC826A]/10 text-[#CC826A] font-bold"
                                      : "text-[#565656] hover:bg-black/5 hover:text-[#121212]"
                                  }`}
                                >
                                  <span>{val.value}</span>
                                  {isSelected && <Check size={12} className="text-[#CC826A]" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  filterData?.skin_concerns && filterData.skin_concerns.length > 0 && (
                    <div className="border-b border-black/[0.06] pb-4">
                      <button
                        onClick={() => toggleSection("concerns")}
                        className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#121212] py-1"
                      >
                        <span>Skin Concern</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${openSections.concerns ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openSections.concerns && (
                        <div className="mt-3 space-y-1">
                          {filterData.skin_concerns.map((concern) => {
                            const isSelected = String(concern.id) === String(selectedConcern);
                            return (
                              <button
                                key={concern.id}
                                onClick={() => handleConcernSelect(String(concern.id))}
                                className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors text-left font-medium ${
                                  isSelected
                                    ? "bg-[#CC826A]/10 text-[#CC826A] font-bold"
                                    : "text-[#565656] hover:bg-black/5 hover:text-[#121212]"
                                }`}
                              >
                                <span>{concern.value}</span>
                                {isSelected && <Check size={12} className="text-[#CC826A]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* 4. Price Range */}
                <div className="border-b border-black/[0.06] pb-4">
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#121212] py-1"
                  >
                    <span>Price Range (৳)</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openSections.price ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openSections.price && (
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-black/10 rounded-md text-xs focus:outline-none focus:border-[#CC826A]"
                        />
                        <span className="text-xs text-[#565656]">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-black/10 rounded-md text-xs focus:outline-none focus:border-[#CC826A]"
                        />
                      </div>
                      <button
                        onClick={handlePriceApply}
                        className="w-full py-1.5 bg-[#121212] text-white rounded-md text-xs font-semibold hover:bg-[#CC826A] transition-colors"
                      >
                        Apply Price
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Stock Status Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#121212]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={handleStockToggle}
                      className="rounded border-gray-300 text-[#CC826A] focus:ring-[#CC826A] cursor-pointer"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <div className="col-span-1 lg:col-span-9 space-y-6">
            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-black/[0.04]">
                <span className="text-xs font-semibold text-[#565656]">Active Filters:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#CC826A]/10 text-[#CC826A] rounded-full text-xs font-medium">
                    Cat ID: {selectedCategory}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-black"
                      onClick={() => handleCategorySelect(selectedCategory)}
                    />
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#CC826A]/10 text-[#CC826A] rounded-full text-xs font-medium">
                    Brand ID: {selectedBrand}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-black"
                      onClick={() => handleBrandSelect(selectedBrand)}
                    />
                  </span>
                )}
                {selectedConcern && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#CC826A]/10 text-[#CC826A] rounded-full text-xs font-medium">
                    Concern ID: {selectedConcern}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-black"
                      onClick={() => handleConcernSelect(selectedConcern)}
                    />
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#CC826A]/10 text-[#CC826A] rounded-full text-xs font-medium">
                    ৳{minPrice || 0} - ৳{maxPrice || "Max"}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-black"
                      onClick={() => {
                        setMinPrice("");
                        setMaxPrice("");
                        updateQueryParams({ min_price: "", max_price: "" });
                      }}
                    />
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#CC826A]/10 text-[#CC826A] rounded-full text-xs font-medium">
                    In Stock
                    <X
                      size={12}
                      className="cursor-pointer hover:text-black"
                      onClick={handleStockToggle}
                    />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-500 font-semibold hover:underline ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid / Loading State */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl h-72 animate-pulse border border-black/5"
                  ></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-black/[0.04] space-y-4">
                <div className="w-16 h-16 bg-[#CC826A]/10 text-[#CC826A] rounded-full flex items-center justify-center mx-auto">
                  <Filter size={32} />
                </div>
                <h3 className="text-lg font-serif font-semibold text-[#121212]">
                  No products match your filters
                </h3>
                <p className="text-xs text-[#565656] max-w-sm mx-auto">
                  Try adjusting or resetting your category, brand, or price range filters to discover more items.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#121212] text-white text-xs font-semibold rounded-full hover:bg-[#CC826A] transition-colors shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1.5 border border-black/10 rounded-md text-xs font-semibold disabled:opacity-40 hover:bg-white cursor-pointer"
                >
                  Prev
                </button>
                <span className="text-xs font-medium text-[#565656]">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  disabled={currentPage >= pagination.last_page}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1.5 border border-black/10 rounded-md text-xs font-semibold disabled:opacity-40 hover:bg-white cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#121212] uppercase">
                  <Filter size={16} className="text-[#CC826A]" />
                  <span>Filter Products</span>
                </div>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} className="text-[#121212]" />
                </button>
              </div>

              {/* Filter List for Mobile */}
              <div className="space-y-5">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-2">
                    Categories
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filterData?.categories?.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(String(cat.id))}
                        className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                          String(cat.id) === String(selectedCategory)
                            ? "bg-[#CC826A]/10 text-[#CC826A] font-bold"
                            : "text-[#565656]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-2">
                    Brands
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filterData?.brands?.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandSelect(String(brand.id))}
                        className={`block w-full text-left text-xs py-1.5 px-2 rounded ${
                          String(brand.id) === String(selectedBrand)
                            ? "bg-[#CC826A]/10 text-[#CC826A] font-bold"
                            : "text-[#565656]"
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-2">
                    Price Range
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 space-y-2">
              <button
                onClick={() => {
                  handlePriceApply();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-[#121212] text-white rounded-full text-xs font-semibold"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-gray-100 text-[#121212] rounded-full text-xs font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-xs">Loading products catalog...</div>}>
      <CatalogPageContent />
    </Suspense>
  );
}
