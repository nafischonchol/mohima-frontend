import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchWishlistApi, toggleWishlistApi, mergeWishlistApi } from '@/lib/api/wishlist';
import { getVisitorId } from '@/lib/utils/visitorId';

export interface WishlistItem {
  id: string;
  productId?: number;
  name: string;
  price: number;
  image: string;
  brand?: string;
  sku?: string;
  slug_url?: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  isInWishlist: (id: string | number) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
  fetchWishlist: () => Promise<void>;
  mergeWishlistOnLogin: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const res = await fetchWishlistApi();
          if (res.success && Array.isArray(res.resources)) {
            const mappedItems: WishlistItem[] = res.resources.map((apiItem) => ({
              id: String(apiItem.product_id),
              productId: apiItem.product_id,
              name: apiItem.product?.name || '',
              price: apiItem.product?.selling_price || 0,
              image: apiItem.product?.primary_image_url || '',
              slug_url: apiItem.product?.slug || '',
            }));
            set({ items: mappedItems });
          }
        } catch {
          // Fallback to local storage state
        } finally {
          set({ isLoading: false });
        }
      },

      toggleWishlist: async (item) => {
        const rawId = item.productId || item.id;
        const numericId = typeof rawId === 'number' ? rawId : parseInt(String(rawId).split('-')[0], 10);
        const exists = get().isInWishlist(item.id) || (numericId ? get().isInWishlist(numericId) : false);

        // Optimistic UI update
        set((state) => {
          if (exists) {
            return { items: state.items.filter((i) => String(i.id) !== String(item.id) && String(i.id) !== String(numericId)) };
          }
          return { items: [...state.items, item] };
        });

        // Backend Sync & Notification
        if (!isNaN(numericId) && numericId > 0) {
          try {
            const res = await toggleWishlistApi(numericId);
            const isAttached = res.resources?.attached ?? (res as any)?.attached;
            const message = res.message;

            if (res.success) {
              if (Boolean(isAttached)) {
                // Ensure item is in store
                set((state) => {
                  const alreadyIn = state.items.some((i) => String(i.id) === String(item.id) || String(i.id) === String(numericId));
                  if (!alreadyIn) {
                    return { items: [...state.items, item] };
                  }
                  return state;
                });
              } else {
                // Ensure item is removed from store
                set((state) => ({
                  items: state.items.filter((i) => String(i.id) !== String(item.id) && String(i.id) !== String(numericId)),
                }));
              }

              // Show Toast notification according to backend single source of truth
              if (typeof window !== 'undefined') {
                import('react-hot-toast').then((mod) => {
                  if (Boolean(isAttached)) {
                    mod.toast.success(message || 'Product added to wishlist.', {
                      style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
                      iconTheme: { primary: '#f43f5e', secondary: '#fff' },
                    });
                  } else {
                    mod.toast(message || 'Product removed from wishlist.', {
                      icon: '💔',
                      style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
                    });
                  }
                });
              }
            }
          } catch {
            // Revert state on network error
            set((state) => {
              if (exists) {
                return { items: [...state.items, item] };
              }
              return { items: state.items.filter((i) => String(i.id) !== String(item.id)) };
            });
          }
        }
      },

      mergeWishlistOnLogin: async () => {
        const guestToken = getVisitorId();
        if (!guestToken) {
          return;
        }

        try {
          const res = await mergeWishlistApi(guestToken);
          if (res.success && Array.isArray(res.resources)) {
            const mappedItems: WishlistItem[] = res.resources.map((apiItem) => ({
              id: String(apiItem.product_id),
              productId: apiItem.product_id,
              name: apiItem.product?.name || '',
              price: apiItem.product?.selling_price || 0,
              image: apiItem.product?.primary_image_url || '',
              slug_url: apiItem.product?.slug || '',
            }));
            set({ items: mappedItems });
          }
        } catch {
          // Handle error gracefully
        }
      },

      isInWishlist: (id) => get().items.some((i) => String(i.id) === String(id) || (i.productId && String(i.productId) === String(id))),
      clearWishlist: () => set({ items: [] }),
      getWishlistCount: () => get().items.length,
    }),
    {
      name: 'mohimaa-wishlist-storage',
    }
  )
);
