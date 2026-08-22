import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { FooterSupportBox } from "@/components/customer/home/FooterSupportBox";
import { Truck, ShieldCheck, MapPin } from "lucide-react";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "B2B Wholesale Shipping & Delivery Policy | Mohimaa",
  description:
    "Fast nationwide delivery across all 64 districts in Bangladesh from our Dhaka ready stock hub via STEADFAST courier. Free store pickup available.",
  keywords: [
    "Korean cosmetics wholesale shipping Bangladesh",
    "Dhaka hub bulk dispatch",
    "STEADFAST courier B2B cosmetics delivery",
  ],
  alternates: {
    canonical: `${siteUrl}/shipping`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "B2B Wholesale Shipping & Delivery Policy | Mohimaa",
    description:
      "Fast nationwide delivery across all 64 districts in Bangladesh from our Dhaka ready stock hub.",
    url: `${siteUrl}/shipping`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Wholesale Shipping & Delivery Policy | Mohimaa",
    description:
      "Fast nationwide delivery across all 64 districts in Bangladesh from our Dhaka ready stock hub.",
  },
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Shipping Information
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We provide shipping support for B2B orders from Korea to international destinations. Shipping options, delivery time, shipping costs, and other details may vary depending on the destination, order volume, product type, and shipping method.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm prose prose-slate dark:prose-invert prose-rose max-w-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 not-prose">
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                <Truck size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Fast Dispatch
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Orders dispatched within 24-48 hours from our Dhaka hub.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Nationwide Delivery
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We deliver to all 64 districts in Bangladesh via trusted
                couriers.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Secure Packaging
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bulk items are packed securely to prevent transit damage.
              </p>
            </div>
          </div>

          <h2>1. Dispatch Timeline</h2>
          <p>
            Since we maintain a ready stock of most Korean cosmetics at our
            Dhaka warehouse, orders are typically processed and dispatched
            within <strong>24 to 48 hours</strong> of payment confirmation.
            During peak sale periods or for exceptionally large bulk orders,
            processing may take up to 72 hours.
          </p>

          <h2>2. Delivery Methods & Times</h2>
          <p>
            We partner with leading courier services in Bangladesh to ensure
            your wholesale inventory reaches your shop safely and on time.
          </p>
          <ul>
            <li>
              <strong>Inside Dhaka:</strong> 1-2 business days via standard
              courier or dedicated delivery van for large volumes.
            </li>
            <li>
              <strong>Outside Dhaka (Major Cities):</strong> 2-3 business days.
            </li>
            <li>
              <strong>Remote Areas:</strong> 3-5 business days.
            </li>
          </ul>

          <h2>3. Shipping Charges</h2>
          <p>
            Shipping charges are calculated based on the total weight/volume of
            your wholesale order and the delivery destination. The exact
            shipping fee will be communicated to you by your dedicated account
            manager before finalizing the invoice.
          </p>
          <p>
            <em>
              * Special shipping discounts may apply for exceptionally large
              volume orders.
            </em>
          </p>

          <h2>4. Store Pickup</h2>
          <p>
            For merchants based in Dhaka, we offer a free store pickup option.
            You can arrange to collect your inventory directly from our
            warehouse after receiving confirmation that your order is packed and
            ready.
          </p>

          <h2>5. Damaged in Transit</h2>
          <p>
            We take utmost care in packaging bulk items. However, if you receive
            a shipment with visible external damage, please take photos
            immediately before opening and contact our wholesale helpline within
            24 hours of receipt.
          </p>
        </div>

        <FooterSupportBox />
      </main>

      <CustomerFooter />
    </div>
  );
}
