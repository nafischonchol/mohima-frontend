import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { FooterSupportBox } from "@/components/customer/home/FooterSupportBox";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Payment Information | Mohimaa B2B Wholesale",
  description:
    "We offer secure and convenient payment options for B2B orders.",
  alternates: {
    canonical: `${siteUrl}/payment`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Payment Information
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We offer secure and convenient payment options for B2B orders. Payment terms may vary depending on the order size, customer, destination, and business agreement. Payment details will be confirmed before order processing.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm prose prose-slate dark:prose-invert prose-rose max-w-none">
          <p className="text-sm text-slate-500">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Accepted Payment Methods</h2>
          <p>
            We strive to provide flexible and secure payment solutions for our B2B partners. Currently, we accept the following payment methods:
          </p>
          <ul>
            <li><strong>Bank Transfer:</strong> Direct deposit to our corporate bank account for large wholesale orders.</li>
            <li><strong>Mobile Banking:</strong> bKash, Nagad, and Rocket for faster processing of smaller to medium-sized orders.</li>
            <li><strong>Credit/Debit Cards:</strong> Secure online payment gateway (SSLCommerz) for Visa, MasterCard, and Amex.</li>
            <li><strong>Cash on Delivery (COD):</strong> Available for verified accounts within specific delivery zones and order limits.</li>
          </ul>

          <h2>2. Payment Terms</h2>
          <p>
            Payment terms are established based on your account verification and order volume. For first-time B2B buyers, full payment or a substantial advance may be required before order dispatch.
          </p>

          <h2>3. Currency and Taxes</h2>
          <p>
            All transactions are processed in Bangladeshi Taka (BDT) unless otherwise agreed upon for international distributors. Applicable taxes and VAT will be calculated and clearly displayed on your final wholesale invoice.
          </p>
        </div>

        <FooterSupportBox />
      </main>

      <CustomerFooter />
    </div>
  );
}
