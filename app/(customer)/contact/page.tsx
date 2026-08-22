import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { PhoneCall, Mail, MapPin, Send } from "lucide-react";

import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohimaa.com";

export const metadata: Metadata = {
  title: "Contact Us | Mohimaa B2B Wholesale Support Dhaka",
  description:
    "Get in touch with our B2B wholesale team in Dhaka & Seoul for inquiries on bulk Korean cosmetics imports, pricing, and account verification.",
  keywords: [
    "Contact Mohimaa",
    "Korean cosmetics wholesale hotline Dhaka",
    "Korean skincare B2B support Bangladesh",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact Us | Mohimaa B2B Wholesale Support Dhaka",
    description:
      "Get in touch with our B2B wholesale team in Dhaka & Seoul for inquiries on bulk Korean cosmetics imports, pricing, and account verification.",
    url: `${siteUrl}/contact`,
    siteName: "Mohimaa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Mohimaa B2B Wholesale Support Dhaka",
    description:
      "Get in touch with our B2B wholesale team in Dhaka & Seoul for inquiries on bulk Korean cosmetics imports, pricing, and account verification.",
  },
};

const contactSchemaJson = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Mohimaa B2B Support",
  url: `${siteUrl}/contact`,
  mainEntity: {
    "@type": "WholesaleStore",
    name: "Mohimaa",
    url: siteUrl,
    telephone: "+8801700000000",
    email: "wholesale@mohimaa.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchemaJson) }}
      />
      <AnnouncementBar />
      <CustomerHeader />

      <main className="flex-grow pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
            CONNECT WITH US
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Stay Connected with MOHIMAA
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            Follow us on social media to stay updated with the latest Korean Beauty products, wholesale offers, new arrivals, restocks, and B2B business opportunities.
          </p>
          <p className="text-rose-500 font-bold uppercase tracking-widest text-sm">
            Follow • Discover • Grow with Us
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Information */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Get in Touch
              </h2>

              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                      Wholesale Helpline
                    </p>
                    <a
                      href="tel:+8801700000000"
                      className="text-lg text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      +8801700000000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                      Email Support
                    </p>
                    <a
                      href="mailto:wholesale@mohimaa.com"
                      className="text-lg text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      wholesale@mohimaa.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                      Warehouse Address
                    </p>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      Dhaka, Bangladesh &<br />
                      Seoul, S. Korea
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              Send us a Message
            </h2>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  placeholder="john@yourstore.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                >
                  <option>Wholesale Inquiry</option>
                  <option>Order Status</option>
                  <option>Bulk Pricing</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button
                type="button"
                className="mt-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}
