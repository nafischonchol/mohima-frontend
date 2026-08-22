"use server";

import { requestApi } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/client";

export interface SeoSetting {
  id: number;
  google_search_console_id: string | null;
  bing_webmaster_id: string | null;
  baidu_webmaster_id: string | null;
  yandex_webmaster_id: string | null;
  meta_pixel_id: string | null;
  meta_capi_token: string | null;
  google_analytics_id: string | null;
  tiktok_pixel_id: string | null;
  robots_txt: string | null;
  sitemap_enabled: boolean;
  robots_meta_content: {
    noindex: boolean;
    nofollow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noimageindex: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Seo404Log {
  id: number;
  path: string;
  referrer: string | null;
  hits: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export async function getSeoSettings(): Promise<ApiResponse<SeoSetting | null>> {
  return requestApi<SeoSetting | null>("/admin/seo-settings");
}

export async function updateSeoSettings(payload: {
  google_search_console_id: string | null;
  bing_webmaster_id: string | null;
  baidu_webmaster_id: string | null;
  yandex_webmaster_id: string | null;
  meta_pixel_id: string | null;
  meta_capi_token: string | null;
  google_analytics_id: string | null;
  tiktok_pixel_id: string | null;
  robots_txt: string | null;
  sitemap_enabled: boolean;
  robots_meta_content: {
    noindex: boolean;
    nofollow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noimageindex: boolean;
  };
}): Promise<ApiResponse<SeoSetting | null>> {
  return requestApi<SeoSetting | null>("/admin/seo-settings", {
    method: "POST",
    body: payload,
  });
}

export async function get404Logs(): Promise<ApiResponse<Seo404Log[]>> {
  return requestApi<Seo404Log[]>("/admin/seo-settings/404-logs", {
    fallbackData: [],
  });
}

export async function clear404Logs(): Promise<ApiResponse<any>> {
  return requestApi<any>("/admin/seo-settings/404-logs", {
    method: "DELETE",
  });
}

