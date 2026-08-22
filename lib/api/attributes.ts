"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface AttributeValueOption {
  id?: number;
  value: string;
  image?: string | null;
  image_relative?: string | null;
  remove_image?: boolean;
}

export interface Attribute {
  id: number;
  name: string;
  type: "text" | "rich_text" | "select" | "multi_select";
  values?: AttributeValueOption[] | string[] | null;
  is_active: boolean;
  is_default_specification?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrUpdateAttributePayload {
  name: string;
  type: string;
  values?: Array<{
    id?: number;
    value: string;
    image?: string | null;
    image_relative?: string | null;
    remove_image?: boolean;
  }> | null;
  is_active: boolean;
  is_default_specification?: boolean;
}

export async function getAttributes(): Promise<ApiResponse<Attribute[]>> {
  return requestApi<Attribute[]>("/admin/attributes", { fallbackData: [] });
}

export async function getAttribute(id: number | string): Promise<ApiResponse<Attribute | null>> {
  return requestApi<Attribute | null>(`/admin/attributes/${id}`);
}

export async function createAttribute(formData: FormData): Promise<ApiResponse<Attribute | null>> {
  return requestApi<Attribute | null>("/admin/attributes", {
    method: "POST",
    body: formData,
  });
}

export async function updateAttribute(
  id: number | string,
  formData: FormData
): Promise<ApiResponse<Attribute | null>> {
  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  return requestApi<Attribute | null>(`/admin/attributes/${id}`, {
    method: "POST",
    body: formData,
  });
}
