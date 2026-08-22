import { create } from 'zustand';
import { fetchCustomerCart, addToCartApi, updateCartQtyApi, removeCartItemApi, clearCartApi, CustomerCartItem } from '@/lib/api/cart';

export interface CartItem {
  id: string;
  product_id?: number;
  product_variant_id?: number | null;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  sku?: string;
  slug_url?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<{ success: boolean; message?: string }>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    if (!token) {
      set({ items: [] });
      return;
    }

    set({ isLoading: true });
    const res = await fetchCustomerCart();
    if (res.success && Array.isArray(res.resources)) {
      set({
        items: res.resources.map((item: CustomerCartItem) => ({
          id: item.id,
          product_id: item.product_id,
          product_variant_id: item.product_variant_id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          quantity: item.quantity,
          brand: item.brand,
          sku: item.sku,
          slug_url: item.slug_url,
        })),
      });
    }
    set({ isLoading: false });
  },

  addToCart: async (item) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    if (!token) {
      import('react-hot-toast').then((mod) => {
        mod.toast.error('Please log in to add items to cart', {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
        });
      });
      return { success: false, message: 'Unauthenticated' };
    }

    const productId = item.product_id || Number(item.id);
    const variantId = item.product_variant_id || null;
    const qty = item.quantity || 1;

    const res = await addToCartApi(productId, variantId, qty);
    if (res.success) {
      await get().fetchCart();
      import('react-hot-toast').then((mod) => {
        mod.toast.success(res.message || `Added ${qty} ${qty > 1 ? 'items' : 'item'} to cart`, {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
          iconTheme: { primary: '#f43f5e', secondary: '#fff' },
        });
      });
      return { success: true, message: res.message };
    } else {
      import('react-hot-toast').then((mod) => {
        mod.toast.error(res.message || 'Failed to add item to cart', {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
        });
      });
      return { success: false, message: res.message };
    }
  },

  removeFromCart: async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    if (!token) return;

    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));

    const res = await removeCartItemApi(id);
    if (!res.success) {
      await get().fetchCart();
      import('react-hot-toast').then((mod) => {
        mod.toast.error(res.message || 'Failed to remove item', {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
        });
      });
    }
  },

  updateQuantity: async (id, quantity) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    if (!token) return;

    const targetQty = Math.max(1, quantity);
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity: targetQty } : i)),
    }));

    const res = await updateCartQtyApi(id, targetQty);
    if (!res.success) {
      await get().fetchCart();
      import('react-hot-toast').then((mod) => {
        mod.toast.error(res.message || 'Failed to update quantity', {
          style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #1e293b' },
        });
      });
    }
  },

  clearCart: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
    set({ items: [] });
    if (token) {
      await clearCartApi();
    }
  },

  getCartTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
  getCartCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));
