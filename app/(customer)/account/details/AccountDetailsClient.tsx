"use client";

import { useEffect, useState } from "react";
import { User, Lock, Mail, Phone, Building, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  getCustomerProfileApi,
  updateCustomerProfileApi,
  updateCustomerPasswordApi,
} from "@/lib/api/customerProfile";

export function AccountDetailsClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Profile Form State
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Visibility State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      const res = await getCustomerProfileApi();
      if (res.success && res.resources) {
        setName(res.resources.name || "");
        setCompanyName(res.resources.company_name || "");
        setPhone(res.resources.phone || "");
        setEmail(res.resources.email || "");
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    const res = await updateCustomerProfileApi({
      name,
      company_name: companyName,
      phone,
      email,
    });

    setIsSavingProfile(false);

    if (res.success) {
      if (res.resources) {
        setName(res.resources.name || "");
        setCompanyName(res.resources.company_name || "");
        setPhone(res.resources.phone || "");
        setEmail(res.resources.email || "");
      }
      toast.success(res.message || "Profile updated successfully", {
        style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
        iconTheme: { primary: "#10b981", secondary: "#fff" },
      });
    } else {
      toast.error(res.message || "Failed to update profile", {
        style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match", {
        style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
      });
      return;
    }

    setIsSavingPassword(true);

    const res = await updateCustomerPasswordApi({
      current_password: currentPassword,
      new_password: newPassword,
    });

    setIsSavingPassword(false);

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(res.message || "Password changed successfully", {
        style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
        iconTheme: { primary: "#10b981", secondary: "#fff" },
      });
    } else {
      toast.error(res.message || "Failed to change password", {
        style: { background: "#0f172a", color: "#f8fafc", border: "1px solid #1e293b" },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Account Details</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Update your profile information and password.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm dark:shadow-xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center gap-2">
          <User size={18} className="text-rose-500 dark:text-rose-400" />
          Profile Information
        </h2>
        
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Company Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
                <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSavingProfile}
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-40 shadow-sm"
          >
            {isSavingProfile ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm dark:shadow-xl mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center gap-2">
          <Lock size={18} className="text-rose-500 dark:text-rose-400" />
          Change Password
        </h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Password</label>
            <div className="relative">
              <input
                required
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">New Password</label>
            <div className="relative">
              <input
                required
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Confirm New Password</label>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSavingPassword}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-rose-600/20 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-48"
          >
            {isSavingPassword ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
