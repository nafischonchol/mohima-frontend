import { Suspense } from "react";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { ProductCatalogSection } from "@/components/customer/home/ProductCatalogSection";
import { getNewArrivalProducts } from "@/lib/api/products";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "New Arrival Korean Cosmetics Wholesale | Mohimaa",
  description:
    "Discover the latest shipments of fresh Korean skincare and cosmetics arrived at our Dhaka hub straight from Seoul factories.",
  keywords: [
    "New Korean skincare arrivals Bangladesh",
    "Latest Korean cosmetics import Dhaka",
    "Fresh K-beauty wholesale shipment",
  ],
  alternates: {
    canonical: `${siteUrl}/new-arrivals`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "New Arrival Korean Cosmetics Wholesale | Mohimaa",
    description:
      "Discover the latest shipments of fresh Korean skincare and cosmetics arrived at our Dhaka hub straight from Seoul factories.",
    url: `${siteUrl}/new-arrivals`,
    siteName: "Mohimaa",
    type: "website",
  },
};

export default async function NewArrivalsPage() {
  const newRes = await getNewArrivalProducts({ per_page: 20 });

  const initialProducts =
    newRes.success &&
    Array.isArray(newRes.resources) &&
    newRes.resources.length > 0
      ? newRes.resources
      : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
      <AnnouncementBar />
      <CustomerHeader />
      <main className="flex-grow pb-24">
        <Suspense
          fallback={
            <div className="text-center py-20 text-slate-400">
              Loading new arrival products...
            </div>
          }
        >
          <ProductCatalogSection
            initialProducts={initialProducts}
            defaultSortBy="latest"
          />
        </Suspense>
      </main>
      <CustomerFooter />
    </div>
  );
}
