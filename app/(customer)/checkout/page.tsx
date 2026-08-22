"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const SHIPPING_THRESHOLD = 1500;
const FLAT_SHIPPING_CHARGE = 60;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  // Page Title
  useEffect(() => {
    document.title = "Secure Checkout | Mohima Premium Beauty";
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      router.push("/viewCart");
    }
  }, [cart, router, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call and processing
    setTimeout(() => {
      alert(
        `Order Confirmed! Thank you, ${formData.firstName}. We will deliver to ${formData.address}.`,
      );
      // In a real app, we would clear the cart and redirect to a success page
      setIsProcessing(false);
      router.push("/");
    }, 2000);
  };

  // Calculations (Consistent with Cart)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const remainingForFreeShipping = SHIPPING_THRESHOLD - subtotal;
  const isFreeShipping = remainingForFreeShipping <= 0;
  const shippingCharge = isFreeShipping ? 0 : FLAT_SHIPPING_CHARGE;
  const total = subtotal + shippingCharge; // Assuming no promo applied for this generic checkout

  if (cart.length === 0 && !isProcessing) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] font-sans selection:bg-[#CC826A] selection:text-white">
      <Suspense
        fallback={
          <div className="h-20 bg-white border-b border-[#E5E5E5]"></div>
        }
      >
        <Header />
      </Suspense>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/viewCart"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-[#565656] hover:text-[#CC826A] transition-colors mb-8 group"
        >
          <ChevronLeft
            size={14}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          Back to Shopping Bag
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 space-y-10">
            <div className="border-b border-[#E5E5E5] pb-6">
              <h1 className="font-serif text-3xl font-normal tracking-wide text-[#121212] uppercase">
                Secure Checkout
              </h1>
            </div>

            <form
              id="checkout-form"
              onSubmit={handleCheckoutSubmit}
              className="space-y-10"
            >
              {/* Contact Information */}
              <section className="space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#121212]">
                  1. Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      Email Address *
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      Phone Number *
                    </label>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#121212] flex items-center gap-2">
                  <MapPin size={16} className="text-[#CC826A]" /> 2. Shipping
                  Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                      placeholder="First Name"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      First Name *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                      placeholder="Last Name"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      Last Name *
                    </label>
                  </div>
                  <div className="relative md:col-span-2">
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                      placeholder="Street Address"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      Street Address, Apartment, Suite, etc. *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                      placeholder="City"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      City *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-black/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#CC826A] focus:ring-1 focus:ring-[#CC826A] transition-all peer placeholder-transparent"
                      placeholder="Postal Code"
                    />
                    <label className="absolute left-4 top-3.5 text-sm text-black/40 transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:bg-white peer-focus:px-1 peer-focus:text-[#CC826A] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:bg-white peer-valid:px-1">
                      Postal Code *
                    </label>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-5">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#121212]">
                  3. Payment Method
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <label
                    className={`relative flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "cod"
                        ? "border-[#CC826A] bg-white shadow-md shadow-[#CC826A]/5"
                        : "border-black/5 bg-white hover:border-black/20 hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="w-4 h-4 text-[#CC826A] bg-gray-100 border-gray-300 focus:ring-[#CC826A] focus:ring-2 accent-[#CC826A]"
                      />
                    </div>
                    <div className="ml-3">
                      <span className="block text-sm font-bold text-[#121212] mb-1 flex items-center gap-2">
                        <Wallet
                          size={16}
                          className={
                            paymentMethod === "cod"
                              ? "text-[#CC826A]"
                              : "text-[#565656]"
                          }
                        />
                        Cash on Delivery
                      </span>
                      <span className="block text-xs text-[#565656] leading-relaxed">
                        Pay in cash when your order arrives at your doorstep.
                      </span>
                    </div>
                  </label>

                  {/* Online Option */}
                  <label
                    className={`relative flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "online"
                        ? "border-[#CC826A] bg-white shadow-md shadow-[#CC826A]/5"
                        : "border-black/5 bg-white hover:border-black/20 hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="w-4 h-4 text-[#CC826A] bg-gray-100 border-gray-300 focus:ring-[#CC826A] focus:ring-2 accent-[#CC826A]"
                      />
                    </div>
                    <div className="ml-3">
                      <span className="block text-sm font-bold text-[#121212] mb-1 flex items-center gap-2">
                        <CreditCard
                          size={16}
                          className={
                            paymentMethod === "online"
                              ? "text-[#CC826A]"
                              : "text-[#565656]"
                          }
                        />
                        Online Payment
                      </span>
                      <span className="block text-xs text-[#565656] leading-relaxed">
                        Pay securely via bKash, SSLCommerz, Credit, or Debit
                        card.
                      </span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Submit CTA (Mobile Only - Desktop has sticky button) */}
              <div className="lg:hidden pt-4 border-t border-[#E5E5E5]">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-[#121212] text-[#FAF9F6] text-xs font-bold uppercase tracking-widest py-4.5 rounded-full hover:bg-[#CC826A] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isProcessing ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  <span>
                    {isProcessing ? "Processing Securely..." : "Place Order"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-white rounded-3xl border border-black/[0.04] p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-normal tracking-wider uppercase text-[#121212] border-b border-black/[0.04] pb-4 mb-6">
                Order Summary
              </h3>

              {/* Item List */}
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#FAF9F6] rounded-lg border border-[#E5E5E5] overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-2 -right-2 bg-[#121212] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold tracking-wide text-[#121212] uppercase truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#565656] mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-xs font-bold text-[#121212] tracking-wider whitespace-nowrap">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3.5 text-xs text-[#565656] font-medium border-y border-black/[0.04] py-5 mb-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#121212] font-semibold">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#121212] font-semibold">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                        Free
                      </span>
                    ) : (
                      `৳${shippingCharge.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[#121212] font-bold text-sm mb-8">
                <span className="uppercase tracking-widest font-normal text-xs text-[#565656] self-end">
                  Total to Pay
                </span>
                <span className="text-2xl font-black tracking-wider text-[#CC826A]">
                  ৳{total.toLocaleString()}
                </span>
              </div>

              {/* Submit CTA (Desktop) */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="hidden lg:flex w-full bg-[#121212] text-[#FAF9F6] text-xs font-bold uppercase tracking-widest py-4.5 rounded-full hover:bg-[#CC826A] hover:shadow-lg hover:shadow-[#CC826A]/20 transition-all duration-300 items-center justify-center gap-2 cursor-pointer disabled:opacity-70 group"
              >
                {isProcessing ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Place Order Securely</span>
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-black/[0.04] text-[#565656] text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#CC826A]" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    SSL Secure
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <CheckCircle size={16} className="text-[#CC826A]" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    Authentic
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <Truck size={16} className="text-[#CC826A]" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    Fast Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
