"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { useCustomerAuth } from "@/lib/hooks/useCustomerAuth";
import { createCustomerOrderApi } from "@/lib/api/customerOrder";
import {
  getCustomerAddressesApi,
  createCustomerAddressApi,
  updateCustomerAddressApi,
  CustomerAddress,
} from "@/lib/api/customerAddress";
import { getPublicDistricts, District } from "@/lib/api/locations";
import { Select } from "@/components/ui/Select";
import {
  CreditCard,
  Lock,
  MapPin,
  ShieldCheck,
  LogIn,
  Loader2,
  Plus,
  X,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CheckoutClient() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { isLoggedIn, customerUser, loading: authLoading } = useCustomerAuth();
  const { items, getCartTotal, clearCart } = useCartStore();

  // Delivery Address State
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Districts State
  const [districts, setDistricts] = useState<District[]>([]);

  // Inline Form State (used when no saved address exists)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [companyName, setCompanyName] = useState("");

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // New/Edit Address Form State (inside Modal)
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
  const [newAddrAddress, setNewAddrAddress] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("Dhaka");
  const [newAddrCompany, setNewAddrCompany] = useState("");
  const [newAddrLabel, setNewAddrLabel] = useState("HOME");
  const [newAddrIsDefault, setNewAddrIsDefault] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Public Districts
  useEffect(() => {
    async function loadDistricts() {
      try {
        const res = await getPublicDistricts();
        if (res.success && res.resources && res.resources.length > 0) {
          setDistricts(res.resources);
          const dhaka = res.resources.find((d) => d.name.toLowerCase() === "dhaka");
          const defaultCity = dhaka ? dhaka.name : res.resources[0].name;
          setCity((prev) => (prev ? prev : defaultCity));
          setNewAddrCity((prev) => (prev ? prev : defaultCity));
        }
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    }
    loadDistricts();
  }, []);

  // Reset Modal Form to Default
  const resetAddressForm = () => {
    setEditingAddressId(null);
    setNewAddrName(customerUser?.name || "");
    const userPhone = customerUser?.phone || customerUser?.mobile || customerUser?.contact || customerUser?.phone_number || "";
    setNewAddrPhone(userPhone);
    setNewAddrAddress(customerUser?.address || "");
    const dhaka = districts.find((d) => d.name.toLowerCase() === "dhaka");
    setNewAddrCity(dhaka ? dhaka.name : districts[0]?.name || "Dhaka");
    setNewAddrCompany("");
    setNewAddrLabel("HOME");
    setNewAddrIsDefault(false);
  };

  // Open Form pre-filled for Editing an existing address
  const handleEditAddressClick = (addr: CustomerAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setNewAddrName(addr.name || "");
    setNewAddrPhone(addr.phone || "");
    setNewAddrAddress(addr.address || "");
    setNewAddrCity(addr.city || "Dhaka");
    setNewAddrCompany(addr.company_name || "");
    setNewAddrLabel(addr.label || "HOME");
    setNewAddrIsDefault(Boolean(addr.is_default));
    setShowAddForm(true);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !authLoading && !isLoggedIn) {
      router.replace("/login?redirect=/checkout");
    }
  }, [mounted, authLoading, isLoggedIn, router]);

  // Fetch Addresses
  useEffect(() => {
    if (isLoggedIn) {
      loadAddresses();
    }
  }, [isLoggedIn]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await getCustomerAddressesApi();
      if (res.success && res.resources) {
        setAddresses(res.resources);
        const defaultAddr = res.resources.find((a) => a.is_default) || res.resources[0] || null;
        setSelectedAddress(defaultAddr);
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Pre-fill profile info if empty
  useEffect(() => {
    if (customerUser) {
      const userPhone = customerUser.phone || customerUser.mobile || customerUser.contact || customerUser.phone_number;
      if (customerUser.name && !fullName) {
        setFullName(customerUser.name);
        setNewAddrName(customerUser.name);
      }
      if (userPhone && !phone) {
        setPhone(userPhone);
        setNewAddrPhone(userPhone);
      }
      if (customerUser.address && !streetAddress) {
        setStreetAddress(customerUser.address);
        setNewAddrAddress(customerUser.address);
      }
    }
  }, [customerUser, fullName, phone, streetAddress]);

  if (!mounted || authLoading || !isLoggedIn) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 font-medium gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
        Checking authentication...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center min-h-[400px] shadow-sm dark:shadow-none">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">You need items in your cart to proceed to checkout.</p>
        <Link href="/" className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleCreateAddressInModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingAddress) return;

    setIsSavingAddress(true);
    try {
      const payload = {
        name: newAddrName,
        phone: newAddrPhone,
        address: newAddrAddress,
        city: newAddrCity,
        company_name: newAddrCompany,
        label: newAddrLabel,
        is_default: newAddrIsDefault,
      };

      let res;
      if (editingAddressId) {
        res = await updateCustomerAddressApi(editingAddressId, payload);
      } else {
        res = await createCustomerAddressApi(payload);
      }

      if (res.success && res.resources) {
        const mod = await import("react-hot-toast");
        mod.toast.success(
          editingAddressId ? "Delivery address updated successfully!" : "Delivery address added successfully!"
        );
        
        await loadAddresses();
        setSelectedAddress(res.resources);
        setEditingAddressId(null);
        setShowAddForm(false);
        setIsAddressModalOpen(false);
      } else {
        const mod = await import("react-hot-toast");
        mod.toast.error(res.message || "Failed to save address.");
      }
    } catch (err: any) {
      const mod = await import("react-hot-toast");
      mod.toast.error(err?.message || "Error saving address.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const cartIds = items.map((item) => Number(item.id));

      let payload: any = {
        cart_ids: cartIds,
        payment_method: paymentMethod,
      };

      if (selectedAddress) {
        payload.address_id = selectedAddress.id;
      } else {
        if (!fullName || !phone || !streetAddress || !city) {
          const mod = await import("react-hot-toast");
          mod.toast.error("Please fill in all required shipping address fields.");
          setIsSubmitting(false);
          return;
        }

        const fullAddress = city ? `${streetAddress}, ${city}` : streetAddress;
        payload.name = fullName;
        payload.phone = phone;
        payload.address = fullAddress;
        payload.city = city;
        payload.company_name = companyName;

        // Auto-save address for customer in background
        createCustomerAddressApi({
          name: fullName,
          phone: phone,
          address: streetAddress,
          city: city,
          company_name: companyName,
          label: "HOME",
          is_default: true,
        }).catch((err) => console.error("Failed auto saving address", err));
      }

      const res = await createCustomerOrderApi(payload);

      if (res.success) {
        const mod = await import("react-hot-toast");
        mod.toast.success(res.message || "Order placed successfully!", {
          style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        });

        await clearCart();
        router.push("/thank-you");
      } else {
        const mod = await import("react-hot-toast");
        mod.toast.error(res.message || "Failed to place order. Please try again.", {
          style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
        });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      const mod = await import("react-hot-toast");
      mod.toast.error(err?.message || "An unexpected error occurred.", {
        style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Checkout Form */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
          
          {/* Delivery Address Section */}
          {loadingAddresses ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="py-4 flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 size={16} className="animate-spin text-rose-500" /> Loading shipping information...
              </div>
            </div>
          ) : selectedAddress ? (
            /* Active Address Summary Row matching user's uploaded image */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-rose-600"></div>

              <div className="p-5 sm:p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-rose-500 font-bold text-base">
                  <MapPin size={18} className="text-rose-500" />
                  <span>Delivery Address</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm sm:text-base">
                    <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {selectedAddress.name} {selectedAddress.phone}
                    </span>

                    <span className="text-slate-600 dark:text-slate-300">
                      {selectedAddress.address}, {selectedAddress.city}
                      {selectedAddress.company_name ? ` (${selectedAddress.company_name})` : ""}
                    </span>

                    <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded px-1.5 py-0.5 bg-rose-50 dark:bg-rose-500/10">
                      {selectedAddress.label || "HOME"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(addresses.length === 0);
                      setIsAddressModalOpen(true);
                    }}
                    className="text-sm font-bold text-rose-500 dark:text-rose-400 hover:text-rose-600 hover:underline uppercase shrink-0 transition-colors self-start sm:self-center"
                  >
                    CHANGE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* On-Page Inline Shipping Information Form (when no saved address exists) */
            <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-none">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="text-rose-500" /> Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name <span className="text-rose-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                    placeholder="Your Business Ltd."
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Street Address <span className="text-rose-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                    placeholder="House 123, Road 4, Block C"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">City / District <span className="text-rose-500">*</span></label>
                  <Select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors h-auto min-h-[46px]"
                  >
                    <option value="" disabled>Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} {d.bn_name ? `(${d.bn_name})` : ""}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Phone Number <span className="text-rose-500">*</span></label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CreditCard className="text-rose-500" /> Payment Method
            </h2>
            
            <div className="flex flex-col gap-4">
              <label
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-500/5"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-4 h-4 text-rose-500 focus:ring-rose-500 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Pay with cash upon delivery.</span>
                </div>
              </label>

              <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/30 rounded-xl opacity-50 cursor-not-allowed">
                <input
                  disabled
                  type="radio"
                  name="payment"
                  checked={false}
                  onChange={() => {}}
                  className="w-4 h-4 text-slate-400 bg-slate-200 border-slate-300 dark:border-slate-700 cursor-not-allowed"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400">Online Payment (SSLCommerz)</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">Disabled</span>
                  </div>
                  <span className="text-sm text-slate-400 dark:text-slate-500">Online payment is currently disabled. Please select Cash on Delivery.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 sticky top-24 shadow-sm dark:shadow-2xl dark:backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">Order Details</h3>
          
          <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center relative border border-slate-200 dark:border-transparent">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    <div className="absolute -top-2 -right-2 bg-slate-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-900">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate" title={item.name}>{item.name}</span>
                    <span className="text-xs text-slate-500">{item.brand}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">৳{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 text-slate-600 dark:text-slate-300 font-medium mb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <span>Subtotal ({items.length} items)</span>
              <span className="text-slate-900 dark:text-white">৳{getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">Calculated later</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4 border-t border-slate-200 dark:border-slate-800 mb-8">
            <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-500">৳{getCartTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Processing Order...
              </>
            ) : (
              <>
                <Lock size={18} /> Place Order
              </>
            )}
          </button>
          
          <div className="mt-6 flex flex-col gap-3 text-xs text-slate-500 dark:text-slate-500 font-medium text-center bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/50">
            <p className="flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Safe & Secure
            </p>
            <p>Your personal data will be used to process your order and support your experience throughout this website.</p>
          </div>
        </div>
      </div>

      {/* Address Selection / Addition Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {showAddForm
                      ? editingAddressId
                        ? "Edit Delivery Address"
                        : "Add New Delivery Address"
                      : "Select Delivery Address"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {showAddForm
                      ? editingAddressId
                        ? "Update your address details below"
                        : "Fill in your shipping details below"
                      : "Choose your primary address for order delivery"}
                  </p>
                </div>
              </div>
            </div>

            {!showAddForm ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                          isSelected
                            ? "border-rose-500 bg-rose-50/40 dark:bg-rose-500/10 shadow-sm"
                            : "border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="radio"
                            name="selected_address"
                            checked={isSelected}
                            onChange={() => setSelectedAddress(addr)}
                            className="mt-1 w-4 h-4 text-rose-500 focus:ring-rose-500 border-slate-300"
                          />
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-base">
                                {addr.name}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                ({addr.phone})
                              </span>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/50">
                                  Default
                                </span>
                              )}
                              <span className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                                {addr.label}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-0.5">
                              {addr.address}, <span className="font-medium">{addr.city}</span>
                              {addr.company_name ? ` • ${addr.company_name}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          <button
                            type="button"
                            onClick={(e) => handleEditAddressClick(addr, e)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                            title="Edit Address"
                          >
                            <Pencil size={16} />
                          </button>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      resetAddressForm();
                      setShowAddForm(true);
                    }}
                    className="w-full sm:w-auto text-sm font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <Plus size={18} /> Add New Address
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-md shadow-rose-500/20 active:scale-95"
                  >
                    Confirm Selection
                  </button>
                </div>
              </div>
            ) : (
              /* Add / Edit Address Form */
              <form onSubmit={handleCreateAddressInModal} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      placeholder="e.g. Chonchol Miah"
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={newAddrAddress}
                      onChange={(e) => setNewAddrAddress(e.target.value)}
                      placeholder="e.g. House 12, Road 4, Block B"
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>

                  {/* City / District Select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      City / District <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all h-auto min-h-[46px]"
                    >
                      <option value="" disabled>Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} {d.bn_name ? `(${d.bn_name})` : ""}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newAddrCompany}
                      onChange={(e) => setNewAddrCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Additional Settings Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  {/* Address Label */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      Label:
                    </span>
                    <div className="flex gap-2">
                      {["HOME", "WORK", "OFFICE"].map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setNewAddrLabel(lbl)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            newAddrLabel === lbl
                              ? "bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/30"
                              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Set as Default Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="is_default_check"
                      checked={newAddrIsDefault}
                      onChange={(e) => setNewAddrIsDefault(e.target.checked)}
                      className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Set as default address
                    </span>
                  </label>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddressId(null);
                        setShowAddForm(false);
                      }}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Back to List
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-md shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSavingAddress ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : editingAddressId ? (
                      "Update Delivery Address"
                    ) : (
                      "Save Delivery Address"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
