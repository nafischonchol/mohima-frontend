import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { FooterSupportBox } from "@/components/customer/home/FooterSupportBox";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "B2B Wholesale Terms & Conditions | Mohimaa",
  description:
    "Read the B2B wholesale terms and conditions for purchasing direct Korean cosmetics from Mohimaa in Bangladesh.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "B2B Wholesale Terms & Conditions | Mohimaa",
    description:
      "Read the B2B wholesale terms and conditions for purchasing direct Korean cosmetics from Mohimaa in Bangladesh.",
    url: `${siteUrl}/terms`,
    siteName: "Mohimaa",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Our Terms & Conditions explain the rules and policies related to product orders, pricing, MOQ, payments, cancellations, shipping, delivery, returns, and other B2B transactions with MOHIMAA.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm prose prose-slate dark:prose-invert prose-rose max-w-none">
          <p className="text-sm text-slate-500">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to Mohimaa. By accessing our B2B wholesale platform
            or purchasing products from us, you agree to be bound by these Terms
            & Conditions. These terms govern the relationship between Mohimaa
            Warehouse (the "Supplier") and you (the "Merchant/Reseller").
          </p>

          <h2>2. B2B Eligibility</h2>
          <p>
            Our services are strictly for business-to-business (B2B)
            transactions. By registering an account, you represent and warrant
            that you are purchasing goods for resale purposes (e.g., you own a
            cosmetics shop, pharmacy, or online business) and not for personal
            consumption.
          </p>

          <h2>3. Minimum Order Quantity (MOQ)</h2>
          <p>
            To qualify for our wholesale pricing, all orders must meet the
            minimum order value or quantity thresholds defined on our platform.
            Mohimaa reserves the right to cancel any orders that do not
            meet these B2B requirements.
          </p>

          <h2>4. Pricing and Payment</h2>
          <ul>
            <li>
              All wholesale prices are subject to change without prior notice
              due to fluctuations in currency exchange rates or supplier pricing
              in South Korea.
            </li>
            <li>
              Prices displayed are exclusive of applicable taxes and shipping
              fees, which will be calculated at checkout.
            </li>
            <li>
              Full payment must be cleared before goods are dispatched from our
              Dhaka warehouse.
            </li>
          </ul>

          <h2>5. Authenticity Guarantee</h2>
          <p>
            Mohimaa guarantees that all Korean cosmetics sold on this
            platform are 100% authentic, imported directly from South Korea via
            authorized channels. We can provide necessary customs documentation
            upon request for large volume buyers.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Mohimaa shall not be liable for any indirect, incidental,
            or consequential damages arising from the resale of our products.
            Merchants are responsible for ensuring compliance with local laws
            and regulations regarding the sale of cosmetics in their respective
            jurisdictions.
          </p>
        </div>

        <FooterSupportBox />
      </main>

      <CustomerFooter />
    </div>
  );
}
