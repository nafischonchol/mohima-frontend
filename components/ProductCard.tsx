"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  slug_url?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  concern: string;
  isBestSeller?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const onAddToCart = addToCart;
  const onToggleWishlist = toggleWishlist;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-black/[0.03] transition-all duration-350 hover:shadow-md hover:scale-[1.01] select-none h-full">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF9F6] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <span className="bg-[#121212] text-[#FAF9F6] text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#CC826A] text-[#FAF9F6] text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-xs">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full border border-black/[0.04] bg-white/80 hover:bg-white backdrop-blur-xs shadow-xs transition-colors duration-300 cursor-pointer ${
            isWishlisted ? "text-red-500" : "text-[#121212] hover:text-red-500"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Main Image */}
        <Link href={`/products/${product.slug_url || product.id}`} className="cursor-pointer">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-w-7xl) 25vw, 100vw"
          />
        </Link>

        {/* Quick Add Button (Slides Up on Hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 ease-out hidden sm:block">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-[#121212]/90 hover:bg-[#CC826A] backdrop-blur-xs text-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-md transition-colors duration-300 cursor-pointer"
          >
            <ShoppingBag size={12} />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div className="flex flex-col gap-1">
          {/* Category */}
          <span className="text-[9px] text-[#565656]/50 font-bold uppercase tracking-widest">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="text-xs font-semibold text-[#121212] uppercase tracking-wide group-hover:text-[#CC826A] transition-colors duration-300 line-clamp-2 min-h-8">
            <Link href={`/products/${product.slug_url || product.id}`} className="block">
              {product.name}
            </Link>
          </h3>

          {/* Reviews Star Rating */}
          <div className="flex items-center gap-1 mt-1 text-[#CC826A]">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(product.rating) ? "fill-currentColor" : "opacity-35"}
                />
              ))}
            </div>
            <span className="text-[9px] text-[#565656]/60 font-semibold pl-1">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Price and Add button (Mobile/Tablet fallback) */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-row items-center gap-2">
            {product.originalPrice && (
              <span className="text-[10px] text-[#565656]/55 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs font-bold text-[#121212] tracking-wider">
              ৳{product.price.toLocaleString()}
            </span>
          </div>

          {/* Mobile Direct Add button */}
          <button
            onClick={() => onAddToCart(product)}
            className="sm:hidden p-2 rounded-full bg-[#121212] text-white hover:bg-[#CC826A] transition-colors cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
