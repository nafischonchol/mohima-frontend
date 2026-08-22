"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { requestApi } from "@/lib/api/client";
import { toast } from "react-hot-toast";

export function RegisterClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    company_name: "",
    country: "BD",
    email: "",
    website_or_fb: "",
    phone: "",
    trade_license: "",
    company_address: "",
    contact_name: "",
    position: "",
    username: "",
    password: "",
    business_type: "",
    hear_about_us: "",
    interested_categories: [] as string[],
    business_introduction: "",
    nda_agreed: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleCheckboxChange = (category: string) => {
    setFormData((prev) => {
      const exists = prev.interested_categories.includes(category);
      const updated = exists
        ? prev.interested_categories.filter((c) => c !== category)
        : [...prev.interested_categories, category];
      return { ...prev, interested_categories: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nda_agreed) {
      toast.error("Please agree to the Non-Disclosure Agreement.");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await requestApi("/customer/register", {
        method: "POST",
        body: formData,
        isPublic: true,
      });

      if (response.success) {
        toast.success(
          response.message || "Registration submitted successfully! Our team will review your application.",
          {
            style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
            iconTheme: { primary: "#10b981", secondary: "#fff" },
            duration: 6000,
          }
        );
        router.push("/login");
      } else {
        if (response.errors) {
          setErrors(response.errors);
          const firstError = Object.values(response.errors)[0]?.[0];
          toast.error(firstError || response.message || "Failed to register. Please check input fields.");
        } else {
          toast.error(response.message || "Failed to submit registration application.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xl">
      <div className="text-center mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Join Mohimaa</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm">
          To complete the sign-up process, please submit your business details. It can take up to 24-48 working hours for our sales team to verify your account for B2B pricing access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Section 1: Company Information */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            Company Information <span className="text-rose-500 text-xs font-normal">(* mandatory)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.company_name && <span className="text-xs text-rose-500">{errors.company_name[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Country <span className="text-rose-500">*</span>
              </label>
              <select
                required
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors appearance-none"
              >
                <option value="BD">Bangladesh</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.country && <span className="text-xs text-rose-500">{errors.country[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Email (Please enter a valid email) <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.email && <span className="text-xs text-rose-500">{errors.email[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Website URL or Facebook Page
              </label>
              <input
                type="text"
                name="website_or_fb"
                value={formData.website_or_fb}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
                placeholder="https://"
              />
              {errors.website_or_fb && <span className="text-xs text-rose-500">{errors.website_or_fb[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Phone No. (including country code) <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
                placeholder="+880"
              />
              {errors.phone && <span className="text-xs text-rose-500">{errors.phone[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Trade License No. (Optional)
              </label>
              <input
                type="text"
                name="trade_license"
                value={formData.trade_license}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.trade_license && <span className="text-xs text-rose-500">{errors.trade_license[0]}</span>}
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Company Address <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.company_address && <span className="text-xs text-rose-500">{errors.company_address[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Contact Name <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.contact_name && <span className="text-xs text-rose-500">{errors.contact_name[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Position / Title (Optional)
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
                placeholder="e.g. Owner, Manager"
              />
              {errors.position && <span className="text-xs text-rose-500">{errors.position[0]}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Account Details */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-t border-slate-200 dark:border-slate-800 pt-8">
            Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Username (Minimum of 5 characters) <span className="text-rose-500">*</span>
              </label>
              <input
                required
                minLength={5}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.username && <span className="text-xs text-rose-500">{errors.username[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="password"
                minLength={6}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors"
              />
              {errors.password && <span className="text-xs text-rose-500">{errors.password[0]}</span>}
            </div>
          </div>
        </div>

        {/* Section 3: Business Information */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-t border-slate-200 dark:border-slate-800 pt-8">
            Business Information
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Type of Business <span className="text-rose-500">*</span>
              </label>
              <select
                required
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors appearance-none"
              >
                <option value="">--- Select business type ---</option>
                <option value="retail">Physical Retail Shop</option>
                <option value="online">Online E-commerce / F-commerce</option>
                <option value="wholesale">Wholesaler / Distributor</option>
                <option value="other">Other</option>
              </select>
              {errors.business_type && <span className="text-xs text-rose-500">{errors.business_type[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                How did you hear about us? <span className="text-rose-500">*</span>
              </label>
              <select
                required
                name="hear_about_us"
                value={formData.hear_about_us}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors appearance-none"
              >
                <option value="">--- Path selection ---</option>
                <option value="search">Google Search</option>
                <option value="social">Facebook / Instagram</option>
                <option value="referral">Friend / Colleague Referral</option>
                <option value="other">Other</option>
              </select>
              {errors.hear_about_us && <span className="text-xs text-rose-500">{errors.hear_about_us[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Interested Categories
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interested_categories.includes("K-Beauty Products")}
                    onChange={() => handleCheckboxChange("K-Beauty Products")}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-rose-500 focus:ring-rose-500 bg-white dark:bg-slate-950"
                  />
                  K-Beauty Products
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interested_categories.includes("Door to Door Service")}
                    onChange={() => handleCheckboxChange("Door to Door Service")}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-rose-500 focus:ring-rose-500 bg-white dark:bg-slate-950"
                  />
                  Door to Door Service
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interested_categories.includes("Import/Export Solutions")}
                    onChange={() => handleCheckboxChange("Import/Export Solutions")}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-rose-500 focus:ring-rose-500 bg-white dark:bg-slate-950"
                  />
                  Import/Export Solutions
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400">
                Introduce Your Business (Optional)
              </label>
              <textarea
                rows={4}
                name="business_introduction"
                value={formData.business_introduction}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-rose-500 transition-colors resize-none"
              ></textarea>
              {errors.business_introduction && (
                <span className="text-xs text-rose-500">{errors.business_introduction[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: NDA */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-950/50">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            NON-DISCLOSURE AGREEMENT <span className="text-rose-500 text-xs font-normal">(* mandatory)</span>
          </h3>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 h-32 overflow-y-auto mb-4 custom-scrollbar">
            This site, and any contents or web pages attached, contains confidential and proprietary information that is intended for the exclusive use of Mohimaa, employees and authorized partners for the limited purpose of submitting orders and/or viewing products for wholesale customers.
            <br />
            <br />
            Only authorized employees and partners are permitted to access this system and any unauthorized use is strictly prohibited. By accessing this system, you agree to keep all pricing, product catalogs, and business terms strictly confidential and agree not to disclose this information to any third party.
            <br />
            <br />
            Violation of this agreement will result in immediate termination of your account and potential legal action.
          </div>

          <div className="flex flex-col items-center justify-center pt-2 gap-2">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-orange-600 dark:hover:text-rose-400 transition-colors">
              <input
                type="checkbox"
                required
                name="nda_agreed"
                checked={formData.nda_agreed}
                onChange={(e) => setFormData((prev) => ({ ...prev, nda_agreed: e.target.checked }))}
                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-orange-500 dark:text-rose-500 focus:ring-orange-500 dark:focus:ring-rose-500 bg-white dark:bg-slate-950 cursor-pointer"
              />
              I agree to the Non-Disclosure Agreement
            </label>
            {errors.nda_agreed && <span className="text-xs text-rose-500">{errors.nda_agreed[0]}</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] text-lg mt-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting Application...
            </>
          ) : (
            "Continue to register"
          )}
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-500 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:text-orange-700 dark:text-rose-400 dark:hover:text-rose-300 font-bold">
            Log In here
          </Link>
        </p>
      </form>
    </div>
  );
}
