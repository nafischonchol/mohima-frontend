"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Eye, Loader2, PackageX, Filter } from "lucide-react";
import Link from "next/link";
import { getCustomerOrdersApi, type CustomerOrder } from "@/lib/api/customerOrder";

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomerOrdersApi({
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if (res.success && Array.isArray(res.resources)) {
        setOrders(res.resources);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch customer orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    const normalized = status?.toLowerCase() || "";
    if (normalized === "completed" || normalized === "delivered") {
      return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    }
    if (normalized === "processing" || normalized === "placed" || normalized === "pending") {
      return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
    }
    if (normalized === "cancelled" || normalized === "failed") {
      return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20";
    }
    return "bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Order History</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View and track your B2B wholesale orders.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice or item..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors shadow-sm"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-rose-500 transition-colors shadow-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="text-sm font-medium">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 mb-4">
              <PackageX size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No orders found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {search || statusFilter !== "all"
                ? "No orders match your search criteria. Try clearing filters."
                : "You haven't placed any orders yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Items</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {orders.map((order) => {
                  const statusColor = getStatusColor(order.status);

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {order.invoice_no || `#ORD-${order.id}`}
                      </td>
                      <td className="px-6 py-4">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{order.items_count} {order.items_count === 1 ? 'item' : 'items'}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        ৳{order.grand_total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Eye size={14} />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Showing {orders.length} {orders.length === 1 ? 'entry' : 'entries'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
