import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { FaqClient } from "@/app/(customer)/faq/FaqClient";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Mohimaa B2B",
  description:
    "Got questions about wholesale MOQs, 100% authentic Korean cosmetics imports, Dhaka warehouse shipping, or payment methods? Find answers here.",
  keywords: [
    "Korean cosmetics wholesale FAQ",
    "Mohimaa MOQ",
    "Korean skincare bulk importer Bangladesh",
    "Dhaka Hub wholesale delivery",
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Mohimaa B2B",
    description:
      "Find answers to common questions about our B2B Korean skincare wholesale platform, MOQs, authenticity guarantees, and shipping in Bangladesh.",
    url: `${siteUrl}/faq`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Mohimaa B2B",
    description:
      "Find answers to common questions about our B2B Korean skincare wholesale platform, MOQs, authenticity guarantees, and shipping in Bangladesh.",
  },
};

const faqSchemaJson = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Minimum Order Quantity (MOQ)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our minimum order quantity varies by product but generally starts at 5-10 pieces per SKU for most Korean cosmetic items. The specific MOQ for each product is displayed on its details page in the catalog.",
      },
    },
    {
      "@type": "Question",
      name: "Are the products 100% authentic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All our products are 100% authentic. We import directly from Seoul, South Korea, from authorized distributors and brands. We provide all necessary import documentation upon request.",
      },
    },
    {
      "@type": "Question",
      name: "How often is stock updated in the Dhaka Hub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Dhaka Hub stock is updated in real-time on the website. If an item says 'In Stock', it means it is physically available in our Dhaka warehouse and ready for immediate dispatch.",
      },
    },
    {
      "@type": "Question",
      name: "How long does delivery take within Bangladesh?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For ready stock in our Dhaka Hub, we process orders within 24 hours. Delivery inside Dhaka typically takes 1-2 days, while outside Dhaka takes 2-4 days via STEADFAST Courier.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept Cash on Delivery (COD) for orders up to a certain limit. We also accept secure online payments via SSLCommerz (Credit/Debit Cards, bKash, Nagad, etc.) and direct bank transfers.",
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaJson) }}
      />
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            FAQ — Frequently Asked Questions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our products, wholesale orders, MOQ, pricing, payment, shipping, product sourcing, and B2B partnership process.
          </p>
        </div>

        <FaqClient />
      </main>

      <CustomerFooter />
    </div>
  );
}
