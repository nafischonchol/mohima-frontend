import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import {
  CheckCircle2,
  UserPlus,
  ShoppingCart,
  Truck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "How to Order Korean Cosmetics Wholesale | Mohimaa",
  description:
    "Step-by-step guide to registering, browsing ready stock, and ordering authentic Korean skincare at factory wholesale rates in Bangladesh.",
  keywords: [
    "How to order Korean cosmetics wholesale",
    "Mohimaa B2B buyer guide",
    "Korean skincare import process Bangladesh",
  ],
  alternates: {
    canonical: `${siteUrl}/how-to-use`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "How to Order Korean Cosmetics Wholesale | Mohimaa",
    description:
      "Step-by-step guide to registering, browsing ready stock, and ordering authentic Korean skincare at factory wholesale rates in Bangladesh.",
    url: `${siteUrl}/how-to-use`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Order Korean Cosmetics Wholesale | Mohimaa",
    description:
      "Step-by-step guide to registering, browsing ready stock, and ordering authentic Korean skincare at factory wholesale rates in Bangladesh.",
  },
};

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            How to Use Mohimaa
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Your ultimate guide to sourcing 100% original Korean cosmetics at
            direct factory wholesale rates. Follow these simple steps to grow
            your business.
          </p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-rose-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <UserPlus size={20} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:border-rose-500/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-rose-500 font-black text-xl">01</span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Register for a B2B Account
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                To access our exclusive wholesale catalog and pricing, you must
                first register. We verify all accounts to ensure our B2B pricing
                remains exclusive to retailers and stockists.
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Submit your business details
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Wait for admin approval (usually within 24 hours)
                </li>
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                Register Now →
              </Link>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-orange-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ShoppingCart size={20} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:border-orange-500/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-orange-500 font-black text-xl">02</span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Browse & Build Your Order
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Once approved, log in to view our live B2B Wholesale Catalog.
                Explore over 50+ top Korean brands with up to 55% off retail
                prices.
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Filter by Brand, Category, or Function
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Real-time Dhaka Hub stock visibility
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Add desired quantities to your cart
                </li>
              </ul>
              <Link
                href="/catalog"
                className="inline-flex items-center text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
              >
                View Catalog →
              </Link>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-yellow-500 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <CreditCard size={20} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:border-yellow-500/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-yellow-500 font-black text-xl">03</span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Secure Checkout
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Review your cart to ensure Minimum Order Quantities (MOQ) or
                Minimum Order Values (MOV) are met, then proceed to our secure
                checkout.
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Fill in your shipping & billing information
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Choose Cash on Delivery (COD) or Online Payment
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Confirm your order to receive an Order Reference ID
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-emerald-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Truck size={20} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-xl transition-all hover:border-emerald-500/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-emerald-500 font-black text-xl">04</span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  Track & Receive
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                Your order is immediately processed by our Dhaka Hub. You can
                track its status in real-time until it arrives at your doorstep.
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  24-48 hour dispatch time for ready stock
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Track via the "Track Order" page
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 shrink-0 mt-0.5"
                  />{" "}
                  Nationwide delivery via STEADFAST Courier
                </li>
              </ul>
              <Link
                href="/orders"
                className="inline-flex items-center text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Track an Order →
              </Link>
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
