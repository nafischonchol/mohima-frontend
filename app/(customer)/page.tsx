import { Suspense } from "react";
import { Metadata } from "next";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerHero } from "@/components/customer/home/CustomerHero";
import { BrandShowcase } from "@/components/customer/home/BrandShowcase";
import { WholesaleBenefits } from "@/components/customer/home/WholesaleBenefits";
import { ProductCatalogSection } from "@/components/customer/home/ProductCatalogSection";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { getPopularProducts } from "@/lib/api/products";
import { getPublicBanners } from "@/lib/api/banners";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Mohimaa | Direct Korean Cosmetics B2B Wholesale Importer",
  description:
    "Source 100% original Korean skincare and cosmetics at direct factory wholesale rates for cosmetics shops and online resellers in Bangladesh.",
  keywords: [
    "Korean cosmetics wholesale Bangladesh",
    "Korean skincare B2B importer",
    "Direct Seoul cosmetics import",
    "Cosmetics wholesale price Dhaka",
    "COSRX wholesale Bangladesh",
    "Beauty of Joseon wholesale Bangladesh",
    "Anua wholesale supplier Bangladesh",
  ],
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Mohimaa | Direct Korean Cosmetics B2B Wholesale Importer",
    description:
      "Source 100% original Korean skincare and cosmetics at direct factory wholesale rates for cosmetics shops and online resellers in Bangladesh.",
    url: siteUrl,
    siteName: "Mohimaa",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-home.jpg`,
        width: 1200,
        height: 630,
        alt: "Mohimaa B2B Korean Cosmetics Wholesale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohimaa | Direct Korean Cosmetics B2B Wholesale Importer",
    description:
      "Source 100% original Korean skincare and cosmetics at direct factory wholesale rates for cosmetics shops and online resellers in Bangladesh.",
    images: [`${siteUrl}/og-home.jpg`],
  },
};

export default async function CustomerB2BHomePage() {
  const [popularRes, heroBannersRes] = await Promise.all([
    getPopularProducts({ per_page: 20 }),
    getPublicBanners("hero"),
  ]);

  const initialProducts =
    popularRes.success &&
    Array.isArray(popularRes.resources) &&
    popularRes.resources.length > 0
      ? popularRes.resources
      : undefined;

  const heroBanners =
    heroBannersRes.success && Array.isArray(heroBannersRes.resources)
      ? heroBannersRes.resources
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Mohimaa",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/favicon.ico`,
        },
        description:
          "Direct Factory B2B Importer of Authentic Korean Cosmetics in Bangladesh.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Mohimaa",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/catalog?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WholesaleStore",
        "@id": `${siteUrl}/#store`,
        name: "Mohimaa B2B Hub",
        url: siteUrl,
        description:
          "Source 100% original Korean skincare and cosmetics at direct factory wholesale rates for cosmetics shops and online resellers in Bangladesh.",
        currenciesAccepted: "BDT",
        paymentAccepted: "Cash, Bank Transfer, Mobile Banking",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <CustomerHeader />
      <CustomerHero heroBanners={heroBanners} />
      <BrandShowcase />
      <WholesaleBenefits />
      <Suspense
        fallback={
          <div className="text-center py-20 text-slate-400">
            Loading catalog...
          </div>
        }
      >
        <ProductCatalogSection initialProducts={initialProducts} />
      </Suspense>
      <CustomerFooter />
    </div>
  );
}
