const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCustomerAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("customer_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export interface CustomerCartItem {
  id: string;
  product_id: number;
  product_variant_id: number | null;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  sku?: string;
  slug_url?: string;
}

export async function fetchCustomerCart(): Promise<{ success: boolean; resources: CustomerCartItem[]; message?: string }> {
  if (!API_BASE_URL) return { success: false, resources: [] };
  try {
    const res = await fetch(`${API_BASE_URL}/customer/me/cart`, {
      headers: getCustomerAuthHeaders(),
      cache: "no-store",
    });
    const data = await res.json();
    return {
      success: data.success ?? res.ok,
      resources: data.resources || [],
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, resources: [], message: err?.message };
  }
}

export async function addToCartApi(
  productId: number | string,
  variantId?: number | string | null,
  quantity: number = 1
): Promise<{ success: boolean; resources?: CustomerCartItem; message?: string }> {
  if (!API_BASE_URL) return { success: false };
  try {
    const res = await fetch(`${API_BASE_URL}/customer/me/cart`, {
      method: "POST",
      headers: getCustomerAuthHeaders(),
      body: JSON.stringify({
        product_id: Number(productId),
        product_variant_id: variantId ? Number(variantId) : null,
        quantity,
      }),
    });
    const data = await res.json();
    return {
      success: data.success ?? res.ok,
      resources: data.resources,
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

export async function updateCartQtyApi(
  cartId: number | string,
  quantity: number
): Promise<{ success: boolean; resources?: CustomerCartItem; message?: string }> {
  if (!API_BASE_URL) return { success: false };
  try {
    const res = await fetch(`${API_BASE_URL}/customer/me/cart/${cartId}`, {
      method: "PUT",
      headers: getCustomerAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    return {
      success: data.success ?? res.ok,
      resources: data.resources,
      message: data.message,
    };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

export async function removeCartItemApi(cartId: number | string): Promise<{ success: boolean; message?: string }> {
  if (!API_BASE_URL) return { success: false };
  try {
    const res = await fetch(`${API_BASE_URL}/customer/me/cart/${cartId}`, {
      method: "DELETE",
      headers: getCustomerAuthHeaders(),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

export async function clearCartApi(): Promise<{ success: boolean; message?: string }> {
  if (!API_BASE_URL) return { success: false };
  try {
    const res = await fetch(`${API_BASE_URL}/customer/me/cart/clear`, {
      method: "DELETE",
      headers: getCustomerAuthHeaders(),
    });
    const data = await res.json();
    return { success: data.success ?? res.ok, message: data.message };
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}
