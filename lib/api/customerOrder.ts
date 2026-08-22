import { requestApi, ApiResponse } from "@/lib/api/client";

export interface CustomerOrderPayload {
  address_id?: number;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  company_name?: string;
  cart_ids: number[];
  payment_method?: string;
}

export interface CustomerOrderItem {
  id: number;
  name: string;
  sku: string;
  variant_title: string;
  unit_price: number;
  quantity: number;
  total: number;
}

export interface CustomerOrder {
  id: number;
  invoice_no: string;
  date: string;
  created_at: string;
  status: string;
  items_count: number;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  delivery_charge?: number | null;
  grand_total: number;
  items: CustomerOrderItem[];
}

export interface CustomerOrderStatusHistory {
  id: number;
  status: string;
  note: string | null;
  created_at: string;
}

export interface CustomerOrderDetail extends CustomerOrder {
  paid_amount: number;
  client_snapshot?: {
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    company_name?: string;
    label?: string;
  };
  status_histories?: CustomerOrderStatusHistory[];
}

export async function createCustomerOrderApi(
  payload: CustomerOrderPayload,
): Promise<ApiResponse<any>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customer_token")
      : null;

  if (!token) {
    return {
      success: false,
      message: "You must be logged in to place an order.",
      resources: null,
    };
  }

  return requestApi<any>("/customer/me/orders", {
    method: "POST",
    body: payload,
    isPublic: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getCustomerOrdersApi(params?: {
  search?: string;
  status?: string;
}): Promise<ApiResponse<CustomerOrder[]>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customer_token")
      : null;

  if (!token) {
    return {
      success: false,
      message: "You must be logged in to view orders.",
      resources: [],
    };
  }

  return requestApi<CustomerOrder[]>("/customer/me/orders", {
    params,
    isPublic: true,
    fallbackData: [],
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getCustomerOrderDetailApi(
  id: string | number
): Promise<ApiResponse<CustomerOrderDetail | null>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customer_token")
      : null;

  if (!token) {
    return {
      success: false,
      message: "You must be logged in to view order details.",
      resources: null,
    };
  }

  return requestApi<CustomerOrderDetail>(`/customer/me/orders/${id}`, {
    isPublic: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

