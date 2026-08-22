"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  Search, 
  Edit, 
  AlertCircle, 
  Check, 
  X,
  Package,
  Layers,
  Inbox,
  Eye
} from "lucide-react";
import { Product } from "@/lib/api/products";
import Link from "next/link";

type Props = {
  initialProducts: Product[];
};

export default function ProductsListClient({ initialProducts }: Props) {
  // Data State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Keep state in sync with server components updates
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Price formatting helper
  const formatPrice = (price: string | number | null | undefined) => {
    if (price === null || price === undefined) return "৳0.00";
    return `৳${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Price range renderer
  const getPriceRange = (product: Product) => {
    if (!product.has_variants) {
      return formatPrice(product.price);
    }
    const min = Number(product.min_price);
    const max = Number(product.max_price);
    if (min === max) {
      return formatPrice(min);
    }
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  // Stock badge helper
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-100 text-rose-700">
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500 animate-pulse" />
          Out of Stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-100 text-amber-700">
          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500" />
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500" />
        In Stock ({stock})
      </span>
    );
  };

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 border-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-rose-50 border-rose-100 text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-rose-500" />
            Inactive
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 border-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-amber-500" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-slate-50 border-slate-150 text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-slate-400" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.bangla_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <div className="pt-2 pl-2 pr-4 pb-4 md:pt-3 md:pl-3 md:pr-6 md:pb-6 lg:pt-4 lg:pl-4 lg:pr-8 lg:pb-8 w-full space-y-6 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300 
          ${notification.type === 'success' 
            ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50/90 border-rose-100 text-rose-800'}`}>
          {notification.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Check size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
              <AlertCircle size={18} />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Package size={24} className="text-indigo-500" />
            Product Listing
          </h1>
          <p className="text-sm text-slate-500">Manage, search, and view stock status of your products.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 bg-slate-50/30">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package size={20} className="text-indigo-500" />
            Products
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-8 w-full rounded-xl bg-white border-slate-200"
              />
            </div>
            <Link href="/admin/products/add">
              <Button className="h-8 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 bg-indigo-600 text-white hover:bg-indigo-700">
                <Plus size={18} className="mr-1.5" />
                Add Product
              </Button>
            </Link>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider w-16">ID</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Product Details</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Price / Range</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Inbox size={24} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-700">No products found</p>
                          <p className="text-sm text-slate-400 mt-1">Try refining your search or add a new product to get started.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="px-6 py-4.5 text-slate-505 font-medium">#{row.id}</td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          {row.thumbnail ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0 flex items-center justify-center">
                              <img src={row.thumbnail} alt={row.name} className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-500 font-bold text-sm uppercase">
                              {row.name.substring(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="flex flex-col">
                              <Link href={`/admin/products/${row.id}`}>
                                <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-650 hover:text-indigo-600 transition-colors hover:underline cursor-pointer">
                                  {row.name}
                                </p>
                              </Link>
                              {row.bangla_name && (
                                <p className="text-xs text-slate-505 font-medium mt-0.5 Bengali-font">
                                  {row.bangla_name}
                                </p>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-450 mt-1 font-mono">/{row.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        {row.category ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-650">
                              <Layers size={13} className="text-slate-400" />
                              {row.category.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Uncategorized</span>
                        )}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="text-sm font-bold text-indigo-600">
                          {getPriceRange(row)}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        {getStockBadge(row.total_stock)}
                      </td>
                      <td className="px-6 py-4.5">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="px-6 py-4.5 text-right flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${row.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="secondary" 
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center p-0"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/edit/${row.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="secondary" 
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-none transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center p-0"
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
