import { Suspense } from "react";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { ProductCatalogSection } from "@/components/customer/home/ProductCatalogSection";
import { getBestSellingProducts } from "@/lib/api/products";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Best Selling Korean Cosmetics Wholesale | Mohimaa",
  description:
    "Stock the highest-demanded Korean skincare products and viral cosmetics in Bangladesh. Top trending items from COSRX, Anua, Beauty of Joseon.",
  keywords: [
    "Best selling Korean cosmetics Bangladesh",
    "Top Korean skincare wholesale",
    "Viral Korean cosmetics wholesale Dhaka",
  ],
  alternates: {
    canonical: `${siteUrl}/best-sellings`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Best Selling Korean Cosmetics Wholesale | Mohimaa",
    description:
      "Stock the highest-demanded Korean skincare products and viral cosmetics in Bangladesh.",
    url: `${siteUrl}/best-sellings`,
    siteName: "Mohimaa",
    type: "website",
  },
};

export default async function BestSellingsPage() {
  const bestRes = await getBestSellingProducts({ per_page: 20 });

  const initialProducts =
    bestRes.success &&
    Array.isArray(bestRes.resources) &&
    bestRes.resources.length > 0
      ? bestRes.resources
      : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
      <AnnouncementBar />
      <CustomerHeader />
      <main className="flex-grow pb-24">
        <Suspense
          fallback={
            <div className="text-center py-20 text-slate-400">
              Loading best selling products...
            </div>
          }
        >
          <ProductCatalogSection
            initialProducts={initialProducts}
            defaultSortBy="best_selling"
          />
        </Suspense>
      </main>
      <CustomerFooter />
    </div>
  );
}
