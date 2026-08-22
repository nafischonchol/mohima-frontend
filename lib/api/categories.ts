"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  parent?: { id: number; name: string } | null;
  icon?: string | null;
  icon_relative?: string | null;
  is_active: boolean;
  meta_title?: string | null;
  meta_keyword?: string[] | null;
  meta_description?: string | null;
  meta_image?: string | null;
  meta_image_relative?: string | null;
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return requestApi<Category[]>("/admin/categories", { fallbackData: [] });
}

export async function getCategory(id: number | string): Promise<ApiResponse<Category | null>> {
  return requestApi<Category | null>(`/admin/categories/${id}`);
}

export async function createCategory(formData: FormData): Promise<ApiResponse<Category | null>> {
  return requestApi<Category | null>("/admin/categories", {
    method: "POST",
    body: formData,
  });
}

export async function updateCategory(
  id: number | string,
  formData: FormData
): Promise<ApiResponse<Category | null>> {
  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  return requestApi<Category | null>(`/admin/categories/${id}`, {
    method: "POST",
    body: formData,
  });
}

export interface PublicCategory {
  id: number;
  name: string;
  slug?: string;
  parent_id?: number | null;
  children?: PublicCategory[];
}

export async function getPublicCategories(): Promise<ApiResponse<PublicCategory[]>> {
  return requestApi<PublicCategory[]>("/customer/popular-categories", {
    isPublic: true,
    fallbackData: [],
  });
}

export const getPopularCategories = async (): Promise<ApiResponse<PublicCategory[]>> => {
  return requestApi<PublicCategory[]>("/customer/popular-categories", {
    isPublic: true,
    fallbackData: [],
  });
};



