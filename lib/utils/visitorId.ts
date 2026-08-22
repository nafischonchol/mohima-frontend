import { requestApi } from "@/lib/api/client";

const VISITOR_ID_KEY = "visitor_id";
const TWELVE_HOURS_IN_SECONDS = 12 * 60 * 60; // 43200 seconds

export function setVisitorId(visitorId: string): void {
  if (typeof window === "undefined" || !visitorId) {
    return;
  }

  // Pure cookie with 12 hours max-age (43200 seconds)
  document.cookie = `${VISITOR_ID_KEY}=${visitorId}; path=/; max-age=${TWELVE_HOURS_IN_SECONDS}; SameSite=Lax`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const match = document.cookie.match(
    new RegExp("(^| )" + VISITOR_ID_KEY + "=([^;]+)"),
  );
  if (match && match[2]) {
    return match[2];
  }

  return "";
}

export function clearVisitorId(): void {
  if (typeof window === "undefined") {
    return;
  }
  document.cookie = `${VISITOR_ID_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export async function ensureVisitorSession(): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  let visitorId = getVisitorId();
  if (visitorId) {
    // Renew / slide 12 hours expiration on active session check
    setVisitorId(visitorId);
    return visitorId;
  }

  try {
    const response = await requestApi<{ guest_token?: string }>(
      "/customer/visitor/session",
      {
        method: "GET",
        isPublic: true,
      },
    );

    const token =
      response.resources?.guest_token || (response as any)?.guest_token;
    if (token) {
      setVisitorId(token);
      return token;
    }
  } catch (error) {
    console.error("Failed to initialize visitor session:", error);
  }

  return "";
}
