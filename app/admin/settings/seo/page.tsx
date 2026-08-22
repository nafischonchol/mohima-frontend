import { getSeoSettings } from "@/lib/api/seo";
import SeoSettingsClient from "@/app/admin/settings/seo/SeoSettingsClient";

export const metadata = {
  title: "SEO & Tracking - POS Admin",
  description: "Configure Webmaster tools, Robots.txt rules, Sitemap preferences, tracking codes, and monitor 404 access logs.",
};

export default async function SeoSettingsPage() {
  const response = await getSeoSettings();
  const initialSettings = response.success ? response.resources : null;

  return <SeoSettingsClient initialSettings={initialSettings} />;
}
