"use client";

import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart, HeartCrack, ChevronRight } from "lucide-react";
import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { useCustomerAuth } from "@/lib/hooks/useCustomerAuth";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();
  const { isLoggedIn } = useCustomerAuth();
  const items = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      <AnnouncementBar />
      <CustomerHeader />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-slate-200">My Wishlist</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Wishlist</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">You have {items.length} {items.length === 1 ? 'item' : 'items'} saved.</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-100 dark:border-rose-500/20 self-start sm:self-auto"
            >
              <Trash2 size={16} />
              Clear Wishlist
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <HeartCrack size={40} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Wishlist is Empty</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
              Looks like you haven't saved any items yet. Browse our catalog and click the heart icon to save items for later!
            </p>
            <Link 
              href="/catalog" 
              className="bg-[#f14e60] hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500/50 transition-all rounded-2xl p-4 flex flex-col group shadow-sm hover:shadow-md">
                
                <Link href={`/product/${item.slug_url || item.id}`} className="w-full aspect-square relative bg-white rounded-xl p-3 border border-slate-100 dark:border-slate-800 mb-4 overflow-hidden block">
                   <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                   
                   <button 
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       toggleWishlist(item);
                     }}
                     className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shadow-sm z-10"
                   >
                     <Trash2 size={14} />
                   </button>
                </Link>

                <div className="flex flex-col flex-grow">
                  {item.brand && (
                    <span className="text-rose-500 text-[10px] font-black uppercase tracking-wider mb-1">{item.brand}</span>
                  )}
                  <Link href={`/product/${item.slug_url || item.id}`} className="font-bold text-slate-900 dark:text-slate-200 text-sm leading-snug line-clamp-2 mb-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {item.name}
                  </Link>
                  
                  <div className="mt-auto flex items-center justify-between pt-4">
                    {isLoggedIn ? (
                      <span className="font-black text-slate-900 dark:text-white">৳{item.price.toLocaleString()}</span>
                    ) : (
                      <Link href="/login" className="text-[11px] font-bold text-white bg-[#f14e60] hover:bg-rose-600 px-3 py-1.5 rounded-full transition-colors shadow-sm">
                        Log In
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push("/login");
                          return;
                        }
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          brand: item.brand,
                          sku: item.sku,
                          slug_url: item.slug_url
                        });
                      }}
                      className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 text-slate-600 dark:text-slate-400 hover:text-white transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:border-rose-500 shadow-sm"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <CustomerFooter />
    </div>
  );
}
