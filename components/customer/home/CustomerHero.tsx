import { Sparkles, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/lib/api/banners";

interface CustomerHeroProps {
  heroBanners?: Banner[];
}

export function CustomerHero({ heroBanners = [] }: CustomerHeroProps) {
  const activeBanners = heroBanners.filter((b) => b.banner_image);

  let bannerList: { src: string; alt: string; url?: string | null }[] = [];

  if (activeBanners.length > 0) {
    const mapped = activeBanners.map((b) => ({
      src: b.banner_image!,
      alt: b.name || "Hero Banner",
      url: b.redirect_url,
    }));
    // Repeat items if count is small so marquee animation loops smoothly
    bannerList = mapped;
    while (bannerList.length < 4) {
      bannerList = [...bannerList, ...mapped];
    }
  }

  return (
    <section className="relative w-full pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-white dark:from-slate-900 dark:via-[#020617] dark:to-slate-950"></div>

      {/* Decorative blurry glowing orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-full text-[9px] sm:text-xs lg:text-base font-bold bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 shadow-sm backdrop-blur-md whitespace-nowrap">
          <Sparkles className="w-[13px] h-[13px] lg:w-5 lg:h-5 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>
            🇰🇷 100% Authentic Korean Cosmetics • Direct Factory Supply
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Your Trusted B2B Source for
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#f14e60] to-[#ff8c00]">
            Premium K-Beauty
          </span>
        </h1>

        <div className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed space-y-4">
          <p>
            Grow your beauty business with 100% authentic Korean skincare and beauty products, sourced directly from trusted Korean companies and verified suppliers in South Korea.
          </p>
          <p>
            We provide competitive wholesale pricing, reliable B2B supply, and flexible sourcing solutions for retailers, distributors, e-commerce businesses, and beauty professionals.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/catalog"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm transition-all duration-300 shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building2 size={18} className="text-rose-400" />
            Become a B2B Partner
          </Link>
        </div>

        {/* Promotional Banners Marquee */}
        {bannerList.length > 0 && (
          <div className="w-full max-w-6xl mx-auto pt-6 mt-6 md:pt-8 md:mt-8 border-t border-slate-200 dark:border-slate-800/80">
            <div className="relative flex overflow-hidden w-full">
              <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex shrink-0">
                    {bannerList.map((item, idx) => {
                      const content = (
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={500}
                          height={256}
                          unoptimized
                          className="w-full h-44 sm:h-56 md:h-64 rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-800/60 transition-transform duration-300 hover:scale-[1.02]"
                        />
                      );

                      return (
                        <div
                          key={`banner-${i}-${idx}`}
                          className="w-[280px] sm:w-[400px] md:w-[500px] shrink-0 px-2 sm:px-3"
                        >
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              {content}
                            </a>
                          ) : (
                            content
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Gradient Overlays */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-[#020617] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-[#020617] to-transparent z-10" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
