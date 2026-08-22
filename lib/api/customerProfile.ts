import { requestApi, ApiResponse } from "@/lib/api/client";

export interface CustomerProfileData {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  status: string;
  is_active: boolean;
}

export interface UpdateCustomerProfilePayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  company_name?: string;
  phone: string;
  email: string;
}

export interface UpdateCustomerPasswordPayload {
  current_password: string;
  new_password: string;
}

function getAuthHeader(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customer_token")
      : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function getCustomerProfileApi(): Promise<ApiResponse<CustomerProfileData>> {
  return requestApi<CustomerProfileData>("/customer/me/profile", {
    method: "GET",
    isPublic: true,
    headers: getAuthHeader(),
  });
}

export async function updateCustomerProfileApi(
  payload: UpdateCustomerProfilePayload
): Promise<ApiResponse<CustomerProfileData>> {
  return requestApi<CustomerProfileData>("/customer/me/profile", {
    method: "PUT",
    body: payload,
    isPublic: true,
    headers: getAuthHeader(),
  });
}

export async function updateCustomerPasswordApi(
  payload: UpdateCustomerPasswordPayload
): Promise<ApiResponse<any>> {
  return requestApi<any>("/customer/me/profile/password", {
    method: "PUT",
    body: payload,
    isPublic: true,
    headers: getAuthHeader(),
  });
}
