"use client";

import { useEffect, useState } from "react";
import { Package, MapPin, Banknote, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { getCustomerProfileApi, type CustomerProfileData } from "@/lib/api/customerProfile";
import { getCustomerAddressesApi, type CustomerAddress } from "@/lib/api/customerAddress";
import { getCustomerOrdersApi, type CustomerOrder } from "@/lib/api/customerOrder";

export default function AccountDashboardPage() {
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [profileRes, ordersRes, addressesRes] = await Promise.all([
          getCustomerProfileApi(),
          getCustomerOrdersApi(),
          getCustomerAddressesApi(),
        ]);

        if (profileRes.success && profileRes.resources) {
          setProfile(profileRes.resources);
        }

        if (ordersRes.success && Array.isArray(ordersRes.resources)) {
          setOrders(ordersRes.resources);
        }

        if (addressesRes.success && Array.isArray(addressesRes.resources)) {
          setAddresses(addressesRes.resources);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => {
    const s = (o.status || "").toLowerCase();
    return s === "placed" || s === "processing" || s === "pending";
  }).length;

  const addressCount = addresses.length;

  const totalSpent = orders
    .filter((o) => {
      const s = (o.status || "").toLowerCase();
      return s !== "cancelled" && s !== "failed";
    })
    .reduce((acc, o) => acc + (Number(o.grand_total) || 0), 0);

  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "delivered") {
      return "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20";
    }
    if (s === "processing" || s === "placed" || s === "pending") {
      return "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20";
    }
    if (s === "cancelled" || s === "failed") {
      return "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20";
    }
    return "bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20";
  };

  const displayName = profile?.company_name || profile?.name || "Customer";

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <p className="text-sm font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-10 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 dark:bg-rose-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        <h1 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white mb-2">
          Welcome back, <span className="text-orange-600 dark:text-rose-400">{displayName}!</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
          From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Orders", value: totalOrders.toString(), icon: Package, color: "text-blue-400", bg: "bg-blue-500/10" },
          { title: "Pending Orders", value: pendingOrders.toString(), icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { title: "Addresses", value: addressCount.toString(), icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, icon: Banknote, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-bold text-orange-600 dark:text-rose-400 hover:text-orange-700 dark:hover:text-rose-300 transition-colors">
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No recent orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {order.invoice_no || `#ORD-${order.id}`}
                    </td>
                    <td className="px-6 py-4 font-medium">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">৳{Number(order.grand_total).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-block text-orange-600 dark:text-rose-400 hover:text-orange-700 dark:hover:text-rose-300 font-bold text-xs bg-orange-100 dark:bg-rose-500/10 hover:bg-orange-200 dark:hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
