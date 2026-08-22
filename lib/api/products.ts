"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface Product {
  id: number;
  name: string;
  bangla_name?: string | null;
  slug: string;
  slug_url?: string;
  description?: string | null;
  category?: {
    id: number;
    name: string;
  } | null;
  brand?: {
    id: number;
    name: string;
  } | null;
  unit?: {
    id: number;
    name: string;
  } | null;
  thumbnail?: string | null;
  thumbnail_relative?: string | null;
  status: string;
  has_variants: boolean;
  price?: string | number | null;
  min_price: string | number;
  max_price: string | number;
  total_stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  barcode?: string | null;
  price: number;
  purchase_price?: number | null;
  discount_price?: number | null;
  stock: number;
  attributes?: Record<string, string>;
}

export interface ProductDetail extends Product {
  barcode?: string | null;
  sku?: string | null;
  purchase_price?: number | string | null;
  min_purchase_price?: number | string | null;
  max_purchase_price?: number | string | null;
  discount_price?: number | string | null;
  images?: string[];
  ingredients?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  rating?: number;
  reviews_count?: number;
  specifications?: Array<{
    id: number;
    attribute_id: number;
    attribute_name?: string | null;
    value: string;
  }>;
  variants: ProductVariant[];
}

export async function getProducts(): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>("/admin/products", { fallbackData: [] });
}

export async function createProduct(
  formData: FormData,
): Promise<ApiResponse<any>> {
  return requestApi<any>("/admin/products", {
    method: "POST",
    body: formData,
  });
}

export async function getProductEditPayload(
  id: string,
): Promise<ApiResponse<any>> {
  return requestApi<any>(`/admin/products/${id}/edit-payload`);
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ApiResponse<any>> {
  return requestApi<any>(`/admin/products/${id}`, {
    method: "POST",
    body: formData,
  });
}

export async function getProductDetails(
  id: string,
): Promise<ApiResponse<ProductDetail | null>> {
  return requestApi<ProductDetail | null>(`/admin/products/${id}`);
}

export async function getCustomerProductDetails(
  slugUrl: string,
): Promise<ApiResponse<ProductDetail | null>> {
  return requestApi<ProductDetail | null>(`/customer/product/${slugUrl}`, {
    isPublic: true,
  });
}

export async function checkProductByBarcode(
  barcode: string,
): Promise<ApiResponse<any>> {
  return requestApi<any>("/admin/products/check/barcode", {
    params: { barcode },
  });
}

export async function getPopularProducts(params?: {
  per_page?: number;
  page?: number;
}): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>("/customer/popular-products", {
    isPublic: true,
    params,
    next: {
      revalidate: 120,
      tags: [
        "popular-products",
        `popular-products:page:${params?.page || 1}:per_page:${params?.per_page || 20}`,
      ],
    },
    fallbackData: [],
  });
}

export async function getBestSellingProducts(params?: {
  per_page?: number;
  page?: number;
}): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>("/customer/best-selling-products", {
    isPublic: true,
    params,
    next: {
      revalidate: 120,
      tags: [
        "best-selling-products",
        `best-selling-products:page:${params?.page || 1}:per_page:${params?.per_page || 20}`,
      ],
    },
    fallbackData: [],
  });
}

export async function getNewArrivalProducts(params?: {
  per_page?: number;
  page?: number;
}): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>("/customer/new-arrival-products", {
    isPublic: true,
    params,
    next: {
      revalidate: 120,
      tags: [
        "new-arrival-products",
        `new-arrival-products:page:${params?.page || 1}:per_page:${params?.per_page || 20}`,
      ],
    },
    fallbackData: [],
  });
}

export async function getBrandProducts(
  brandId: number | string,
  params?: { per_page?: number; page?: number },
): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>(`/customer/brand/${brandId}/products`, {
    isPublic: true,
    params,
    next: {
      revalidate: 120,
      tags: ["brand-products", `brand:${brandId}:products`],
    },
    fallbackData: [],
  });
}

export async function getCategoryProducts(
  categoryId: number | string,
  params?: { per_page?: number; page?: number },
): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>(`/customer/category/${categoryId}/products`, {
    isPublic: true,
    params,
    next: {
      revalidate: 120,
      tags: ["category-products", `category:${categoryId}:products`],
    },
    fallbackData: [],
  });
}

export interface ProductFilterParams {
  [key: string]: string | number | boolean | undefined;
  search_text?: string;
  category_id?: number | string;
  sub_category_id?: number | string;
  brand_id?: number | string;
  is_stock?: boolean | number;
  sort_by?: string;
  per_page?: number;
  page?: number;
}

export async function filterProducts(
  params?: ProductFilterParams
): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>("/customer/products/filter", {
    isPublic: true,
    params,
    fallbackData: [],
  });
}
