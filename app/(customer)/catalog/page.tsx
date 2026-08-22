import { Suspense } from "react";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { ProductCatalogSection } from "@/components/customer/home/ProductCatalogSection";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Korean Cosmetics B2B Wholesale Catalog | Mohimaa",
  description:
    "Explore our complete B2B wholesale catalog of authentic Korean skincare and makeup in Bangladesh. Direct factory rates for COSRX, Anua, Beauty of Joseon, fwee & more.",
  keywords: [
    "Korean cosmetics catalog Bangladesh",
    "B2B skincare wholesale list",
    "COSRX wholesale price list",
    "Beauty of Joseon bulk Dhaka",
    "Korean makeup wholesale supplier",
  ],
  alternates: {
    canonical: `${siteUrl}/catalog`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Korean Cosmetics B2B Wholesale Catalog | Mohimaa",
    description:
      "Source 100% original Korean cosmetics at direct factory wholesale prices in Bangladesh. Ready stock in Dhaka hub.",
    url: `${siteUrl}/catalog`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Cosmetics B2B Wholesale Catalog | Mohimaa",
    description:
      "Source 100% original Korean cosmetics at direct factory wholesale prices in Bangladesh. Ready stock in Dhaka hub.",
  },
};

const catalogSchemaJson = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Korean Cosmetics B2B Wholesale Catalog",
  url: `${siteUrl}/catalog`,
  description:
    "Full wholesale product catalog of authentic Korean cosmetics and skincare available for retail shops and online resellers in Bangladesh.",
  provider: {
    "@type": "Organization",
    name: "Mohimaa",
    url: siteUrl,
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Korean Skincare & Toners",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Serums & Ampoules Wholesale",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Sunscreens & Cleansers",
      },
    ],
  },
};

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchemaJson) }}
      />
      <AnnouncementBar />
      <CustomerHeader />
      <main className="flex-grow pb-24">
        <Suspense
          fallback={
            <div className="text-center py-20 text-slate-400">
              Loading catalog...
            </div>
          }
        >
          <ProductCatalogSection />
        </Suspense>
      </main>
      <CustomerFooter />
    </div>
  );
}
