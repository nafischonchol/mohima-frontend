import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { FooterSupportBox } from "@/components/customer/home/FooterSupportBox";
import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Privacy Policy | Mohimaa B2B Wholesale",
  description:
    "Read our B2B privacy policy to learn how Mohimaa protects and uses your business data in Bangladesh.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Mohimaa B2B Wholesale",
    description:
      "Read our B2B privacy policy to learn how Mohimaa protects and uses your business data in Bangladesh.",
    url: `${siteUrl}/privacy`,
    siteName: "Mohimaa",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We respect your privacy and are committed to protecting your personal and business information. This policy explains how we collect, use, store, and protect information submitted through our website and B2B services.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm prose prose-slate dark:prose-invert prose-rose max-w-none">
          <p className="text-sm text-slate-500">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you register for a B2B wholesale account with Mohimaa,
            we collect specific business information necessary to process your
            orders and verify your business status. This may include:
          </p>
          <ul>
            <li>Business Name and Registration Details</li>
            <li>Contact Person's Name, Phone Number, and Email Address</li>
            <li>Delivery and Billing Addresses</li>
            <li>Purchase History and Wholesale Preferences</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the collected information strictly for B2B operational
            purposes, including:
          </p>
          <ul>
            <li>
              Processing and fulfilling your wholesale orders efficiently.
            </li>
            <li>
              Communicating important updates regarding stock availability,
              shipping, and order status.
            </li>
            <li>
              Sending targeted promotional offers and bulk discounts (you may
              opt-out at any time).
            </li>
            <li>Improving our B2B platform and supply chain logistics.</li>
          </ul>

          <h2>3. Data Protection</h2>
          <p>
            Mohimaa is committed to protecting your business data. We
            implement industry-standard security measures to prevent
            unauthorized access, disclosure, or alteration of your information.
            Your payment details are processed through secure, encrypted
            gateways.
          </p>

          <h2>4. Third-Party Sharing</h2>
          <p>
            We do not sell, trade, or rent your business information to third
            parties. However, we may share necessary details with trusted
            logistics partners (couriers) solely for the purpose of delivering
            your orders.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, or request the deletion of
            your account information at any time. To exercise these rights,
            please contact your dedicated account manager or email our support
            team.
          </p>
        </div>

        <FooterSupportBox />
      </main>

      <CustomerFooter />
    </div>
  );
}
