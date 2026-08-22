"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface Product {
  id: number;
  name: string;
  bangla_name?: string | null;
  slug: string;
  slug_url?: string;
  short_description?: string | null;
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

import { productsDatabase } from "@/data/products";

export async function getPopularProducts(
  pageParam: number | { per_page?: number; page?: number } = 1,
): Promise<{ products: any[]; pagination?: any; success?: boolean }> {
  const pageNum =
    typeof pageParam === "number" ? pageParam : pageParam?.page || 1;
  const perPage =
    typeof pageParam === "object" ? pageParam?.per_page || 20 : 20;

  try {
    const res = await requestApi<any>("/customer/popular-products", {
      isPublic: true,
      params: { page: pageNum, per_page: perPage },
      next: {
        revalidate: 120,
        tags: [
          "popular-products",
          `popular-products:page:${pageNum}:per_page:${perPage}`,
        ],
      },
      fallbackData: null,
    });

    if (res && res.success && res.resources) {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const products = res.resources.map((item: any) => {
        const price =
          item.discount_price ||
          item.min_discount_price ||
          item.price ||
          item.min_price ||
          0;
        const originalPrice = item.price || item.min_price || 0;
        return {
          id: String(item.id),
          slug_url: item.slug_url,
          name: item.name,
          category: item.category?.name || "Uncategorized",
          price: Number(price),
          originalPrice:
            originalPrice > price ? Number(originalPrice) : undefined,
          image: item.thumbnail
            ? item.thumbnail.startsWith("http")
              ? item.thumbnail
              : `${apiBase}${item.thumbnail}`
            : "/images/product_snail.png",
          rating: item.rating || 4.8,
          reviewsCount: item.reviews_count || 120,
          concern: "General",
          isBestSeller: true,
          isNew: false,
        };
      });
      return { products, pagination: res.pagination, success: true };
    }
  } catch (error) {
    console.error("Failed to fetch popular products", error);
  }
  return { products: productsDatabase, success: false };
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
  concern_id?: number | string;
  attribute_value_id?: number | string;
  min_price?: number;
  max_price?: number;
  is_stock?: boolean | number;
  sort_by?: string;
  per_page?: number;
  page?: number;
}

export async function filterProducts(
  params?: ProductFilterParams,
): Promise<ApiResponse<Product[]>> {
  return requestApi<Product[]>("/customer/products/filter", {
    isPublic: true,
    params,
    fallbackData: [],
  });
}

export interface AttributeItem {
  id: number;
  name: string;
  slug: string;
  type: string;
  attribute_values?: Array<{
    id: number;
    attribute_id: number;
    value: string;
    image?: string | null;
  }>;
}

export interface FilterableData {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    parent_id?: number | null;
    icon?: string | null;
    children?: Array<{ id: number; name: string; slug: string }>;
  }>;
  brands: Array<{
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
  }>;
  attributes?: AttributeItem[];
  skin_concerns?: Array<{
    id: number;
    value: string;
    image?: string | null;
  }>;
  price_range: {
    min: number;
    max: number;
  };
}

export async function getFilterableData(): Promise<ApiResponse<FilterableData | null>> {
  return requestApi<FilterableData | null>("/customer/filterable-data", {
    isPublic: true,
    fallbackData: null,
  });
}
