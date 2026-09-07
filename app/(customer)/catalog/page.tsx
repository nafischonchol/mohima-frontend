import type { Metadata } from "next";
import CatalogFilterClient from "@/components/CatalogFilterClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";
const defaultOgImage = `${siteUrl}/images/hero_banner_1.png`;

export const metadata: Metadata = {
  title: "Catalog | Mohima Premium Beauty",
  description: "Browse all curated skincare and cosmetics products at Mohima.",
  alternates: {
    canonical: `${siteUrl}/catalog`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Catalog | Mohima Premium Beauty",
    description: "Browse all curated skincare and cosmetics products at Mohima.",
    url: `${siteUrl}/catalog`,
    siteName: "Mohima Premium Beauty",
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Mohima Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalog | Mohima Premium Beauty",
    description: "Browse all curated skincare and cosmetics products at Mohima.",
    images: [defaultOgImage],
  },
};

export default function CatalogPage() {
  return <CatalogFilterClient />;
}
