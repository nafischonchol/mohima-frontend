"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Droplet,
  Sun,
  Layers,
  Waves,
  Flower2,
  Box,
} from "lucide-react";
import Link from "next/link";
import { getPopularCategories } from "@/lib/api/categories";

interface Category {
  id: string | number;
  name: string;
  slug?: string;
  icon?: string | null;
}

const getCategoryIcon = (slug?: string) => {
  const iconProps = { className: "w-6 h-6 text-[#CC826A]" };
  const slugLower = (slug || "").toLowerCase();

  if (slugLower.includes("cleanser")) return <Droplet {...iconProps} />;
  if (slugLower.includes("toner") || slugLower.includes("tonner"))
    return <Waves {...iconProps} />;
  if (slugLower.includes("serum")) return <Sparkles {...iconProps} />;
  if (slugLower.includes("moisturizer") || slugLower.includes("cream"))
    return <Flower2 {...iconProps} />;
  if (slugLower.includes("sunscreen") || slugLower.includes("sun"))
    return <Sun {...iconProps} />;
  if (slugLower.includes("mask")) return <Layers {...iconProps} />;

  return <Box {...iconProps} />;
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getPopularCategories();
        if (data.success && data.resources) {
          setCategories(data.resources);
        }
      } catch (error) {
        console.error("Failed to fetch popular categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 select-none scroll-reveal">
      <div className="text-center mb-10 flex flex-col items-center">
        <span className="text-[10px] tracking-[0.3em] font-bold text-[#CC826A] uppercase mb-1">
          Shop by Category
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#121212] tracking-wide">
          Curated Skincare Steps
        </h2>
        <div className="w-12 h-px bg-[#CC826A] mt-4" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-[#CC826A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          categories.map((cat) => {
            const href = `/${cat.slug || cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Circular Container */}
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-350 bg-white hover:bg-[#FAF9F6] border border-[#E5E5E5] group-hover:border-[#CC826A] group-hover:scale-105 shadow-xs"
                >
                  <div>
                    {cat.icon ? (
                      <img
                        src={cat.icon}
                        alt={cat.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      getCategoryIcon(cat.slug)
                    )}
                  </div>
                </div>

                {/* Text details */}
                <span
                  className="text-xs font-semibold tracking-wider text-[#121212] mt-4 text-center transition-colors group-hover:text-[#CC826A]"
                >
                  {cat.name}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
