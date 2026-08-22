"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface Attribute {
  id: number;
  name: string;
  type: "text" | "rich_text" | "select" | "multi_select";
  values?: string[] | null;
  is_active: boolean;
  is_default_specification?: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAttributes(): Promise<ApiResponse<Attribute[]>> {
  return requestApi<Attribute[]>("/admin/attributes", { fallbackData: [] });
}

export async function getAttribute(id: number | string): Promise<ApiResponse<Attribute | null>> {
  return requestApi<Attribute | null>(`/admin/attributes/${id}`);
}

export async function createAttribute(data: {
  name: string;
  type: string;
  values?: string[] | null;
  is_active: boolean;
  is_default_specification?: boolean;
}): Promise<ApiResponse<Attribute | null>> {
  return requestApi<Attribute | null>("/admin/attributes", {
    method: "POST",
    body: data,
  });
}

export async function updateAttribute(
  id: number | string,
  data: {
    name: string;
    type: string;
    values?: string[] | null;
    is_active: boolean;
    is_default_specification?: boolean;
  }
): Promise<ApiResponse<Attribute | null>> {
  return requestApi<Attribute | null>(`/admin/attributes/${id}`, {
    method: "PUT",
    body: data,
  });
}

