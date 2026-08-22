"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface Admin {
  id: string;
  name: string;
  company_name: string | null;
  phone: string;
  email: string;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdmins(): Promise<ApiResponse<Admin[]>> {
  return requestApi<Admin[]>("/admin/admins", { fallbackData: [] });
}

export async function getAdmin(id: string): Promise<ApiResponse<Admin | null>> {
  return requestApi<Admin | null>(`/admin/admins/${id}`);
}

export async function createAdmin(payload: {
  name: string;
  company_name: string | null;
  phone: string;
  email: string;
  password?: string;
  logo?: string | null;
  is_active: boolean;
}): Promise<ApiResponse<Admin | null>> {
  return requestApi<Admin | null>("/admin/admins", {
    method: "POST",
    body: payload,
  });
}

export async function updateAdmin(
  id: string,
  payload: {
    name: string;
    company_name: string | null;
    phone: string;
    email: string;
    logo?: string | null;
    is_active: boolean;
  }
): Promise<ApiResponse<Admin | null>> {
  return requestApi<Admin | null>(`/admin/admins/${id}`, {
    method: "PUT",
    body: payload,
  });
}

