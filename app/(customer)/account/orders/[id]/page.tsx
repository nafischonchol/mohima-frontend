"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, Package, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/app/(customer)/account/orders/[id]/PrintButton";
import { getCustomerOrderDetailApi, type CustomerOrderDetail } from "@/lib/api/customerOrder";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderIdParam = resolvedParams.id;

  const [order, setOrder] = useState<CustomerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrderDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCustomerOrderDetailApi(orderIdParam);
        if (res.success && res.resources) {
          setOrder(res.resources);
        } else {
          setError(res.message || "Failed to load order details.");
        }
      } catch (err) {
        console.error("Error loading order details:", err);
        setError("An unexpected error occurred while loading order details.");
      } finally {
        setLoading(false);
      }
    }

    if (orderIdParam) {
      loadOrderDetail();
    }
  }, [orderIdParam]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <p className="text-sm font-medium">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Unable to load order</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || "Order not found."}</p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>
    );
  }

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
      <div className="flex items-center gap-4">
        <Link
          href="/account/orders"
          className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            Order {order.invoice_no || `#ORD-${order.id}`}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Placed on {order.date}</p>
        </div>

        <PrintButton order={order} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package size={18} className="text-rose-400" />
                Items Ordered
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">PKG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 dark:text-white font-bold text-sm truncate">{item.name}</h3>
                      {item.variant_title && (
                        <p className="text-xs text-rose-500 font-medium">{item.variant_title}</p>
                      )}
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                        ৳{item.unit_price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-900 dark:text-white font-bold">৳{item.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/50 p-6 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white">৳{order.total_amount.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-৳{order.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                {order.tax_amount > 0 && (
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Tax</span>
                    <span className="text-slate-900 dark:text-white">৳{order.tax_amount.toLocaleString()}</span>
                  </div>
                )}
                {order.delivery_charge !== undefined && order.delivery_charge !== null && (
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Delivery Charge</span>
                    <span className="text-slate-900 dark:text-white">৳{(order.delivery_charge ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between font-black text-slate-900 dark:text-white text-lg">
                  <span>Total</span>
                  <span className="text-rose-600 dark:text-rose-400">৳{order.grand_total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status History / Tracking */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Order Status History</h2>

            {order.status_histories && order.status_histories.length > 0 ? (
              <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
                {order.status_histories.map((h, i) => (
                  <div key={h.id || i} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-white dark:ring-slate-900 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm capitalize">{h.status}</h3>
                    {h.note && <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">{h.note}</p>}
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{h.created_at}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Order placed on {order.date}</p>
            )}
          </div>

          {/* Shipping Address */}
          {order.client_snapshot && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Shipping Information</h2>
              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {order.client_snapshot.company_name && (
                  <p className="font-bold text-slate-900 dark:text-white">{order.client_snapshot.company_name}</p>
                )}
                {order.client_snapshot.name && <p>{order.client_snapshot.name}</p>}
                {order.client_snapshot.address && <p>{order.client_snapshot.address}</p>}
                {order.client_snapshot.city && <p>{order.client_snapshot.city}</p>}
                {order.client_snapshot.phone && (
                  <p className="pt-2 text-slate-500 dark:text-slate-400 font-medium">{order.client_snapshot.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
