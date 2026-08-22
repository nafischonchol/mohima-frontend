import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Truck,
  Headphones,
  BadgePercent,
  PackageCheck,
  Globe,
  Handshake,
  Search,
} from "lucide-react";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title:
    "Why Choose Us? | Authentic Korean Skincare Direct B2B Importer Bangladesh",
  description:
    "Discover why thousands of cosmetics shop owners and online resellers choose Mohimaa for authentic Korean cosmetics direct wholesale import in Bangladesh.",
  keywords: [
    "Why Mohimaa",
    "Korean skincare importer Dhaka",
    "B2B cosmetics distributor Bangladesh",
    "Authentic Korean skincare supplier",
  ],
  alternates: {
    canonical: `${siteUrl}/why-us`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title:
      "Why Choose Us? | Authentic Korean Skincare Direct B2B Importer Bangladesh",
    description:
      "Direct Seoul factory imports, ready stock in Dhaka hub, zero MOQ barriers, and guaranteed 100% authentic Korean cosmetics.",
    url: `${siteUrl}/why-us`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Why Choose Us? | Authentic Korean Skincare Direct B2B Importer Bangladesh",
    description:
      "Direct Seoul factory imports, ready stock in Dhaka hub, zero MOQ barriers, and guaranteed 100% authentic Korean cosmetics.",
  },
};

const reasons = [
  {
    icon: <Search size={32} />,
    title: "Korean Beauty Product Sourcing",
    description:
      "Direct sourcing of authentic Korean beauty products from verified manufacturers and brand owners in South Korea.",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: <PackageCheck size={32} />,
    title: "B2B Wholesale Supply",
    description:
      "Reliable and continuous wholesale supply for retailers, e-commerce businesses, and beauty professionals worldwide.",
    color: "from-rose-500 to-rose-700",
  },
  {
    icon: <Globe size={32} />,
    title: "Import & Export Support",
    description:
      "Comprehensive support for international trade, managing documentation, and ensuring seamless import/export processes.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: <Handshake size={32} />,
    title: "Distributor & Partnership",
    description:
      "Building strong, long-term partnerships with global distributors to expand the reach of top K-Beauty brands.",
    color: "from-orange-500 to-orange-700",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Korean Brand Sourcing",
    description:
      "Curating and sourcing the most in-demand and emerging Korean cosmetic brands for your specific market needs.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: <Truck size={32} />,
    title: "Global Logistics Solutions",
    description:
      "End-to-end logistics and supply chain solutions to ensure timely, safe, and efficient delivery of your wholesale orders.",
    color: "from-yellow-500 to-yellow-700",
  },
];

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-rose-500/10 border border-orange-200 dark:border-rose-500/20 text-orange-600 dark:text-rose-400 font-bold text-sm mb-6 uppercase tracking-wider">
            Our Business
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight uppercase">
            MOHIMAA
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl leading-relaxed">
            MOHIMAA specializes in Korean Beauty B2B Wholesale, Sourcing, Import & Export. We provide authentic Korean skincare and beauty products to importers, distributors, retailers, e-commerce businesses, and other B2B partners worldwide.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 group shadow-lg hover:shadow-2xl"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
              >
                {reason.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-rose-400 transition-colors">
                {reason.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Goal Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
            Our goal is simple:
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl leading-relaxed mb-6">
            To connect trusted Korean beauty products with businesses worldwide through reliable sourcing and professional B2B supply solutions.
          </p>
          <p className="text-rose-500 font-bold uppercase tracking-widest text-sm sm:text-base">
            MOHIMAA — Your Trusted Partner in Korean Beauty.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 rounded-3xl p-1 relative overflow-hidden shadow-[0_0_40px_rgba(244,63,94,0.3)]">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          <div className="bg-white dark:bg-slate-950 rounded-[22px] p-8 sm:p-12 text-center relative z-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Ready to boost your margins?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of successful cosmetics shop owners and online
              resellers in Bangladesh who trust Mohimaa for their
              inventory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/register"
                className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 text-lg"
              >
                Register as B2B Buyer
              </a>
              <a
                href="/catalog"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 px-10 rounded-full transition-colors border border-slate-300 dark:border-slate-700 text-lg"
              >
                View Catalog
              </a>
            </div>
          </div>
        </div>

        {/* Help Banner */}
        <div className="mt-20 bg-gradient-to-r from-rose-100 via-white to-orange-100 dark:from-rose-900/40 dark:via-slate-900 dark:to-orange-900/40 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 relative z-10">
            Still need help?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8 relative z-10">
            Our dedicated B2B support team is available from 9 AM to 6 PM to
            assist you with onboarding, order placement, and product inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link href="/faq" className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-full transition-colors border border-slate-300 dark:border-slate-700 shadow-sm text-center">
              Read our FAQ
            </Link>
            <Link href="/contact" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-center">
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
