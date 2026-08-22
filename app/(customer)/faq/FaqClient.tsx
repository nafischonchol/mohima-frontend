"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FooterSupportBox } from "@/components/customer/home/FooterSupportBox";

const faqs = [
  {
    category: "Ordering & Stock",
    questions: [
      {
        q: "What is the Minimum Order Quantity (MOQ)?",
        a: "Our minimum order quantity varies by product but generally starts at 5-10 pieces per SKU for most Korean cosmetic items. The specific MOQ for each product is displayed on its details page in the catalog."
      },
      {
        q: "Are the products 100% authentic?",
        a: "Yes! All our products are 100% authentic. We import directly from Seoul, South Korea, from authorized distributors and brands. We provide all necessary import documentation upon request."
      },
      {
        q: "How often is stock updated in the Dhaka Hub?",
        a: "Our Dhaka Hub stock is updated in real-time on the website. If an item says 'In Stock', it means it is physically available in our Dhaka warehouse and ready for immediate dispatch."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take within Bangladesh?",
        a: "For ready stock in our Dhaka Hub, we process orders within 24 hours. Delivery inside Dhaka typically takes 1-2 days, while outside Dhaka takes 2-4 days via STEADFAST Courier."
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, Mohimaa B2B only operates within Bangladesh to serve local retailers and stockists."
      },
      {
        q: "What are the shipping charges?",
        a: "Shipping is free for wholesale orders above ৳50,000. For orders below that, standard STEADFAST Courier rates apply based on weight and destination."
      }
    ]
  },
  {
    category: "Payment & Returns",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD) for orders up to a certain limit. We also accept secure online payments via SSLCommerz (Credit/Debit Cards, bKash, Nagad, etc.) and direct bank transfers."
      },
      {
        q: "What is your return policy for wholesale orders?",
        a: "Since this is a B2B platform, we only accept returns for damaged goods or incorrect items delivered. Claims must be made within 48 hours of receiving the parcel with an unboxing video."
      }
    ]
  }
];

export function FaqClient() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0"); // Open first FAQ by default

  const toggleFaq = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-12">
      {faqs.map((group, groupIndex) => (
        <div key={group.category}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-rose-500"></span>
            {group.category}
          </h2>
          
          <div className="flex flex-col gap-4">
            {group.questions.map((faq, faqIndex) => {
              const index = `${groupIndex}-${faqIndex}`;
              const isOpen = openIndex === index;
              
              return (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-slate-900/50 border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-500/50 dark:border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-orange-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600 dark:text-rose-400' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800/50">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <FooterSupportBox />
    </div>
  );
}
