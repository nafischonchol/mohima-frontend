"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getHeroBanners } from "@/lib/api/banners";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  tagline: string;
  ctaText: string;
}

export default function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dynamicSlides, setDynamicSlides] = useState<Slide[]>([]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % dynamicSlides.length);
  };

  const handlePrev = () => {
    setCurrentIdx(
      (prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length,
    );
  };

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const data = await getHeroBanners();

        if (data.success && data.resources && data.resources.length > 0) {
          const mapped: Slide[] = data.resources.map((item: any) => ({
            image: item.banner_image,
            tagline: item.type_label
              ? item.type_label.toUpperCase()
              : "EID OFFER",
            title: item.name || "Special Promotion",
            subtitle:
              item.short_description ||
              "Experience the glow with Mohima's premium collection of authentic beauty and luxury skincare.",
            ctaText: "Shop Now",
            redirectUrl: item.redirect_url,
          }));
          setDynamicSlides(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch hero banners from API:", err);
      }
    };

    fetchHeroBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [dynamicSlides.length]);

  if (dynamicSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] bg-zinc-100 overflow-hidden select-none">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {dynamicSlides.map((slide, index) => {
          const isActive = index === currentIdx;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 translate-x-0 scale-100 z-10"
                  : "opacity-0 translate-x-4 scale-[1.02] z-0"
              }`}
            >
              {/* Image with overlay */}
              <div className="absolute inset-0 bg-[#121212]/20 z-10" />
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover object-center transition-transform duration-[6000ms] scale-105 ease-out"
                sizes="100vw"
              />

              {/* Text Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-start z-20 px-6 sm:px-12 md:px-24">
                <div className="max-w-xl text-left text-white drop-shadow-sm flex flex-col items-start gap-4 sm:gap-6">
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] text-[#E0A996] uppercase animate-fade-in-up">
                    {slide.tagline}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-wide animate-fade-in-up delay-100">
                    {slide.title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-[#FAF9F6]/85 font-light leading-relaxed tracking-wider animate-fade-in-up delay-200">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => {
                      if ((slide as any).redirectUrl) {
                        window.location.href = (slide as any).redirectUrl;
                      } else {
                        window.scrollTo({ top: 1200, behavior: "smooth" });
                      }
                    }}
                    className="mt-2 bg-[#FAF9F6] text-[#121212] text-xs font-semibold tracking-widest uppercase px-6 sm:px-8 py-3.5 rounded-full hover:bg-[#CC826A] hover:text-white transition-colors duration-300 shadow-lg cursor-pointer"
                  >
                    {slide.ctaText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Chevrons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/35 backdrop-blur-xs text-white p-2 rounded-full transition-all duration-350 z-30 opacity-60 hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/35 backdrop-blur-xs text-white p-2 rounded-full transition-all duration-350 z-30 opacity-60 hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {dynamicSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIdx(index)}
            className={`h-1.5 rounded-full transition-all duration-350 ${
              index === currentIdx ? "bg-white w-6" : "bg-white/50 w-1.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
