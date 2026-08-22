import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { RefreshCcw, AlertTriangle, CheckCircle } from "lucide-react";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Mohimaa B2B Wholesale",
  description:
    "Learn about our B2B wholesale return policy, 48-hour defect reporting, authenticity guarantees, and hassle-free replacements.",
  keywords: [
    "Mohimaa return policy",
    "Korean cosmetics wholesale refund Bangladesh",
    "B2B skincare replacement policy",
  ],
  alternates: {
    canonical: `${siteUrl}/returns`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Return & Refund Policy | Mohimaa B2B Wholesale",
    description:
      "Learn about our B2B wholesale return policy, 48-hour defect reporting, and authenticity guarantees.",
    url: `${siteUrl}/returns`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Return & Refund Policy | Mohimaa B2B Wholesale",
    description:
      "Learn about our B2B wholesale return policy, 48-hour defect reporting, and authenticity guarantees.",
  },
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Return & Refund Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Our B2B return policies are designed to protect your business while
            maintaining our quality guarantees.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm prose prose-slate dark:prose-invert prose-rose max-w-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 not-prose">
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Report within 48h
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Claims for defects or wrong items must be made within 48 hours
                of delivery.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Authenticity Guaranteed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                100% money-back guarantee if any product is proven unauthentic.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                <RefreshCcw size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                B2B Replacement
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Valid claims will be settled via replacements in your next
                wholesale order.
              </p>
            </div>
          </div>

          <h2>1. B2B Return Policy Overview</h2>
          <p>
            As a B2B wholesale distributor, Mohimaa operates
            differently from retail stores. We supply authentic Korean cosmetics
            in bulk at highly discounted rates. Therefore, we do not accept
            returns for unsold inventory, change of mind, or minor packaging
            creases that do not affect the product inside.
          </p>

          <h2>2. Valid Grounds for Return/Replacement</h2>
          <p>
            We will gladly accept returns or provide replacements under the
            following circumstances:
          </p>
          <ul>
            <li>
              <strong>Wrong Product Supplied:</strong> The item delivered does
              not match your invoice.
            </li>
            <li>
              <strong>Expired or Near-Expiry Products:</strong> Unless
              specifically sold as "clearance/near-expiry" at a marked-down
              rate.
            </li>
            <li>
              <strong>Severe Transit Damage:</strong> Product leakage or broken
              containers rendering the product unsalable.
            </li>
          </ul>

          <h2>3. How to File a Claim</h2>
          <p>
            If you encounter an issue that meets the criteria above, you must
            notify us within <strong>48 hours</strong> of receiving your
            shipment.
          </p>
          <ol>
            <li>
              Contact your dedicated account manager or email our support team.
            </li>
            <li>Provide your Invoice/Order Number.</li>
            <li>
              Attach clear photos or videos of the damaged/incorrect products
              and the shipping box.
            </li>
          </ol>

          <h2>4. Settlement of Claims</h2>
          <p>
            Once a claim is verified and approved by our team, we will process
            the resolution via one of the following methods (at our discretion):
          </p>
          <ul>
            <li>
              Sending a replacement item along with your next wholesale order.
            </li>
            <li>
              Issuing a credit note that can be applied to your future
              purchases.
            </li>
            <li>
              In rare cases, providing a direct refund for the affected items.
            </li>
          </ul>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
