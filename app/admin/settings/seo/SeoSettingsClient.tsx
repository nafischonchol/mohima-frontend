"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  Check,
  AlertCircle,
  X,
  Loader2,
  FileText,
  Globe,
  Settings,
  AlertTriangle,
  Code,
  ToggleLeft,
  ToggleRight,
  Database,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink
} from "lucide-react";
import { getSeoSettings, updateSeoSettings, get404Logs, clear404Logs, SeoSetting, Seo404Log } from "@/lib/api/seo";

interface SeoSettingsClientProps {
  initialSettings: SeoSetting | null;
}

const GoogleIcon = () => (
  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const BingIcon = () => (
  <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32">
    <path fill="#008080" d="M10.1,2.1l7.8,3.2L12,24.1l-6.8-3.8V4.8L10.1,2.1z"/>
    <path fill="#00A0A0" d="M26.8,12.5l-6.8-3.3L12,24.1l14.8-8.4V12.5z"/>
  </svg>
);

const BaiduIcon = () => (
  <svg className="w-8 h-8 shrink-0 text-[#2932e1]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.77 15.65c-.5.41-.65 1.05-.33 1.58.33.53 1 .71 1.5.38.5-.33.63-.99.33-1.52-.33-.53-.99-.71-1.5-.44zm2.14-3.52c-.63.26-.94.94-.69 1.58.26.63.95.94 1.59.69.64-.26.95-.95.7-1.59-.26-.64-.96-.94-1.6-.68zm4.18-1.92c-.67.09-1.14.7-1.05 1.37.09.67.7 1.14 1.37 1.05.67-.09 1.14-.7 1.05-1.37-.09-.67-.7-1.14-1.37-1.05zm5.72.33c.66.14 1.3-.29 1.44-.95.14-.66-.29-1.3-.95-1.44-.66-.14-1.3.29-1.44.95-.14.66.29 1.3.95 1.44zm3.88 2.01c.6-.29.85-.99.56-1.59-.29-.6-.99-.85-1.59-.56-.6.29-.85.99-.56 1.59.29.6.99.85 1.59.56zm1.75 3.52c.49.33 1.16.15 1.49-.34.33-.49.15-1.16-.34-1.49-.49-.33-1.16-.15-1.49.34-.33.49-.15 1.16.34 1.49zM12 14c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3z"/>
  </svg>
);

const YandexIcon = () => (
  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#E52627" />
    <path d="M14.7 18h-2.2v-7.7L9.6 18H7.4l3.7-9.5-3.5-7.5h2.4L12 6.7V1h2.7v17z" fill="white" />
  </svg>
);

type ActiveTab = "webmaster" | "robots" | "sitemap" | "meta" | "tracking" | "logs";

export default function SeoSettingsClient({ initialSettings }: SeoSettingsClientProps) {
  const router = useRouter();

  // Notification Toast State
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("webmaster");

  // Form Field States
  const [googleId, setGoogleId] = useState(initialSettings?.google_search_console_id || "");
  const [bingId, setBingId] = useState(initialSettings?.bing_webmaster_id || "");
  const [baiduId, setBaiduId] = useState(initialSettings?.baidu_webmaster_id || "");
  const [yandexId, setYandexId] = useState(initialSettings?.yandex_webmaster_id || "");
  const [robotsTxt, setRobotsTxt] = useState(initialSettings?.robots_txt || "User-agent: *\nDisallow: /admin/");
  const [sitemapEnabled, setSitemapEnabled] = useState(initialSettings?.sitemap_enabled || false);
  const [robotsMeta, setRobotsMeta] = useState(initialSettings?.robots_meta_content || {
    noindex: false,
    nofollow: false,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  });
  const [metaPixelId, setMetaPixelId] = useState(initialSettings?.meta_pixel_id || "");
  const [metaCapiToken, setMetaCapiToken] = useState(initialSettings?.meta_capi_token || "");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initialSettings?.google_analytics_id || "");
  const [tiktokPixelId, setTiktokPixelId] = useState(initialSettings?.tiktok_pixel_id || "");

  // 404 Logs States
  const [logs, setLogs] = useState<Seo404Log[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  // Sitemap generation simulation
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);

  // Sync state if initial settings change
  useEffect(() => {
    if (initialSettings) {
      setGoogleId(initialSettings.google_search_console_id || "");
      setBingId(initialSettings.bing_webmaster_id || "");
      setBaiduId(initialSettings.baidu_webmaster_id || "");
      setYandexId(initialSettings.yandex_webmaster_id || "");
      setRobotsTxt(initialSettings.robots_txt || "User-agent: *\nDisallow: /admin/");
      setSitemapEnabled(initialSettings.sitemap_enabled);
      setRobotsMeta(initialSettings.robots_meta_content || {
        noindex: false,
        nofollow: false,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      });
      setMetaPixelId(initialSettings.meta_pixel_id || "");
      setMetaCapiToken(initialSettings.meta_capi_token || "");
      setGoogleAnalyticsId(initialSettings.google_analytics_id || "");
      setTiktokPixelId(initialSettings.tiktok_pixel_id || "");
    }
  }, [initialSettings]);

  // Load 404 logs
  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    const res = await get404Logs();
    if (res.success) {
      setLogs(res.resources);
    }
    setLoadingLogs(false);
  }, []);

  // Fetch logs whenever we switch to logs tab
  useEffect(() => {
    if (activeTab === "logs") {
      loadLogs();
    }
  }, [activeTab, loadLogs]);

  // Show Toast
  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  // Reset Changes
  const handleReset = () => {
    if (initialSettings) {
      setGoogleId(initialSettings.google_search_console_id || "");
      setBingId(initialSettings.bing_webmaster_id || "");
      setBaiduId(initialSettings.baidu_webmaster_id || "");
      setYandexId(initialSettings.yandex_webmaster_id || "");
      setRobotsTxt(initialSettings.robots_txt || "User-agent: *\nDisallow: /admin/");
      setSitemapEnabled(initialSettings.sitemap_enabled);
      setRobotsMeta(initialSettings.robots_meta_content || {
        noindex: false,
        nofollow: false,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      });
      setMetaPixelId(initialSettings.meta_pixel_id || "");
      setMetaCapiToken(initialSettings.meta_capi_token || "");
      setGoogleAnalyticsId(initialSettings.google_analytics_id || "");
      setTiktokPixelId(initialSettings.tiktok_pixel_id || "");
    } else {
      setGoogleId("");
      setBingId("");
      setBaiduId("");
      setYandexId("");
      setRobotsTxt("User-agent: *\nDisallow: /admin/");
      setSitemapEnabled(false);
      setRobotsMeta({
        noindex: false,
        nofollow: false,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
      });
      setMetaPixelId("");
      setMetaCapiToken("");
      setGoogleAnalyticsId("");
      setTiktokPixelId("");
    }
    showNotification("success", "Settings reset to saved values.");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      google_search_console_id: googleId.trim() || null,
      bing_webmaster_id: bingId.trim() || null,
      baidu_webmaster_id: baiduId.trim() || null,
      yandex_webmaster_id: yandexId.trim() || null,
      robots_txt: robotsTxt,
      sitemap_enabled: sitemapEnabled,
      robots_meta_content: robotsMeta,
      meta_pixel_id: metaPixelId.trim() || null,
      meta_capi_token: metaCapiToken.trim() || null,
      google_analytics_id: googleAnalyticsId.trim() || null,
      tiktok_pixel_id: tiktokPixelId.trim() || null,
    };

    const res = await updateSeoSettings(payload);
    setIsSaving(false);
    if (res.success) {
      showNotification("success", "SEO Settings updated successfully.");
      router.refresh();
    } else {
      showNotification("error", res.message);
    }
  };

  // Clear 404 Logs
  const handleClearLogs = async () => {
    setClearingLogs(true);
    const res = await clear404Logs();
    setClearingLogs(false);
    if (res.success) {
      setLogs([]);
      showNotification("success", "404 access logs cleared.");
    } else {
      showNotification("error", res.message);
    }
  };

  // Regenerate Sitemap simulation
  const handleRegenerateSitemap = () => {
    setRegeneratingSitemap(true);
    setTimeout(() => {
      setRegeneratingSitemap(false);
      showNotification("success", "Sitemap regenerated successfully.");
    }, 1500);
  };

  // Toggle helper for robots meta tags
  const toggleMeta = (key: keyof typeof robotsMeta) => {
    setRobotsMeta(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="pt-2 pl-2 pr-4 pb-4 md:pt-3 md:pl-3 md:pr-6 md:pb-6 lg:pt-4 lg:pl-4 lg:pr-8 lg:pb-8 w-full space-y-6 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300 
          ${notification.type === 'success' 
            ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50/90 border-rose-100 text-rose-800'}`}>
          {notification.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Check size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
              <AlertCircle size={18} />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
          </div>
          <button 
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-4 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader 
        title="SEO & Tracking" 
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "#" },
          { label: "SEO & Tracking" }
        ]}
      />

      {/* Modern Tabs Navigation */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-100">
        {(["webmaster", "robots", "sitemap", "meta", "tracking", "logs"] as const).map((tab) => {
          const labels: Record<ActiveTab, string> = {
            webmaster: "Webmaster Tools",
            robots: "Robots.txt",
            sitemap: "Sitemap",
            meta: "Robots Meta Content",
            tracking: "Analytics & Pixels",
            logs: "404 Logs",
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TAB 1: WEBMASTER TOOLS */}
        {activeTab === "webmaster" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            
            {/* Warning Alert Banner */}
            <div className="bg-amber-50/80 border border-amber-100 text-amber-800 rounded-2xl p-4 text-xs font-medium flex items-center gap-2.5">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              <span>After input All Information, Make sure you click Save Button at the bottom.</span>
            </div>

            <Card className="overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              <CardHeader className="py-5 bg-slate-50/20 border-b border-slate-100/50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Search size={16} className="text-indigo-600" />
                  Webmaster Tools
                </h3>
                <p className="text-xs text-slate-400">Optimize websites performance indexing status and search visibility. <a href="https://support.google.com/webmasters/answer/9012289" target="_blank" className="text-indigo-600 hover:underline inline-flex items-center gap-0.5">Learn more <ExternalLink size={10} /></a></p>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                
                {/* Google Search Console */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <GoogleIcon />
                      <h4 className="text-xs font-bold text-slate-800">Google search console</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-10">
                      Optimize website's performance, indexing status, and search visibility.{" "}
                      <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold inline-flex items-center gap-0.5">
                        Get verification ID <ExternalLink size={10} />
                      </a>
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Input
                      placeholder="Enter your HTML code or ID"
                      value={googleId}
                      onChange={(e) => setGoogleId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <div className="bg-blue-50/40 border border-blue-100/40 text-blue-900 rounded-xl p-3 text-[11px] font-mono flex items-center gap-2.5">
                      <Code size={13} className="text-blue-500 shrink-0" />
                      <span>&lt;meta name="google-site-verification" content="{googleId || "your-id"}" /&gt;</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Bing Webmaster Tools */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <BingIcon />
                      <h4 className="text-xs font-bold text-slate-800">Bing webmaster tools</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-10">
                      Optimize website's performance, indexing status, and search visibility.{" "}
                      <a href="https://www.bing.com/webmasters" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold inline-flex items-center gap-0.5">
                        Get verification ID <ExternalLink size={10} />
                      </a>
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Input
                      placeholder="Enter your HTML code or ID"
                      value={bingId}
                      onChange={(e) => setBingId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <div className="bg-blue-50/40 border border-blue-100/40 text-blue-900 rounded-xl p-3 text-[11px] font-mono flex items-center gap-2.5">
                      <Code size={13} className="text-blue-500 shrink-0" />
                      <span>&lt;meta name="msvalidate.01" content="{bingId || "your-id"}" /&gt;</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Baidu Webmaster Tool */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <BaiduIcon />
                      <h4 className="text-xs font-bold text-slate-800">Baidu webmaster tool</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-10">
                      Optimize website's performance, indexing status, and search visibility.{" "}
                      <a href="https://ziyuan.baidu.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold inline-flex items-center gap-0.5">
                        Get verification ID <ExternalLink size={10} />
                      </a>
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Input
                      placeholder="Enter your HTML code or ID"
                      value={baiduId}
                      onChange={(e) => setBaiduId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <div className="bg-blue-50/40 border border-blue-100/40 text-blue-900 rounded-xl p-3 text-[11px] font-mono flex items-center gap-2.5">
                      <Code size={13} className="text-blue-500 shrink-0" />
                      <span>&lt;meta name="baidu-site-verification" content="{baiduId || "your-id"}" /&gt;</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Yandex Webmaster Tool */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <YandexIcon />
                      <h4 className="text-xs font-bold text-slate-800">Yandex webmaster tool</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-10">
                      Optimize website's performance, indexing status, and search visibility.{" "}
                      <a href="https://webmaster.yandex.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold inline-flex items-center gap-0.5">
                        Get verification ID <ExternalLink size={10} />
                      </a>
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Input
                      placeholder="Enter your HTML code or ID"
                      value={yandexId}
                      onChange={(e) => setYandexId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <div className="bg-blue-50/40 border border-blue-100/40 text-blue-900 rounded-xl p-3 text-[11px] font-mono flex items-center gap-2.5">
                      <Code size={13} className="text-blue-500 shrink-0" />
                      <span>&lt;meta name="yandex-verification" content="{yandexId || "your-id"}" /&gt;</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: ROBOTS.TXT */}
        {activeTab === "robots" && (
          <Card className="overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] animate-in fade-in-50 duration-200">
            <CardHeader className="py-5 bg-slate-50/20 border-b border-slate-100/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                Robots.txt Editor
              </h3>
              <p className="text-xs text-slate-400">Manage rules for search engine crawlers accessing your site.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="robotsTxt" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configuration Rules</Label>
                <Textarea
                  id="robotsTxt"
                  rows={8}
                  placeholder="User-agent: *&#10;Disallow: /admin/"
                  value={robotsTxt}
                  onChange={(e) => setRobotsTxt(e.target.value)}
                  className="rounded-xl font-mono text-xs border-slate-200 focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Use standard robots.txt format. Incorrect configurations can prevent search engines from index-crawling your online shop layout.
              </p>
            </CardContent>
          </Card>
        )}

        {/* TAB 3: SITEMAP */}
        {activeTab === "sitemap" && (
          <Card className="overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] animate-in fade-in-50 duration-200">
            <CardHeader className="py-5 bg-slate-50/20 border-b border-slate-100/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Globe size={16} className="text-indigo-600" />
                XML Sitemap Settings
              </h3>
              <p className="text-xs text-slate-400">Generate sitemap.xml automatically containing active store categories, brands and products.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Sitemap Auto-generation</span>
                  <p className="text-[11px] text-slate-400">Automatically rebuild sitemap when items are added or modified.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSitemapEnabled(!sitemapEnabled)}
                  className="focus:outline-none cursor-pointer shrink-0"
                >
                  {sitemapEnabled ? (
                    <ToggleRight className="text-indigo-600 h-8 w-8" />
                  ) : (
                    <ToggleLeft className="text-slate-300 h-8 w-8" />
                  )}
                </button>
              </div>

              {sitemapEnabled && (
                <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sitemap URL</span>
                      <p className="text-xs font-semibold text-slate-700">http://localhost:3000/sitemap.xml</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Generated</span>
                      <p className="text-xs font-semibold text-slate-700">Just Now (Automatically updated)</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      disabled={regeneratingSitemap}
                      onClick={handleRegenerateSitemap}
                      className="h-8 text-xs bg-indigo-600 text-white rounded-lg px-4 active:scale-98 transition-all hover:bg-indigo-700 cursor-pointer flex items-center gap-1.5"
                    >
                      {regeneratingSitemap ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={12} />
                          Regenerate Sitemap
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        )}

        {/* TAB 4: ROBOTS META CONTENT */}
        {activeTab === "meta" && (
          <Card className="overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] animate-in fade-in-50 duration-200">
            <CardHeader className="py-5 bg-slate-50/20 border-b border-slate-100/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Settings size={16} className="text-indigo-600" />
                Robots Meta Content
              </h3>
              <p className="text-xs text-slate-400">Configure global metadata tags instructions for crawling search bots.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              
              {/* index/noindex */}
              <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">noindex</span>
                  <p className="text-[11px] text-slate-400">Instruct search engines not to show this site in search results.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMeta("noindex")}
                  className="focus:outline-none cursor-pointer shrink-0"
                >
                  {robotsMeta.noindex ? (
                    <ToggleRight className="text-indigo-600 h-8 w-8" />
                  ) : (
                    <ToggleLeft className="text-slate-300 h-8 w-8" />
                  )}
                </button>
              </div>

              {/* follow/nofollow */}
              <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">nofollow</span>
                  <p className="text-[11px] text-slate-400">Instruct search engines not to crawl links on pages of this website.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMeta("nofollow")}
                  className="focus:outline-none cursor-pointer shrink-0"
                >
                  {robotsMeta.nofollow ? (
                    <ToggleRight className="text-indigo-600 h-8 w-8" />
                  ) : (
                    <ToggleLeft className="text-slate-300 h-8 w-8" />
                  )}
                </button>
              </div>

              {/* noarchive */}
              <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">noarchive</span>
                  <p className="text-[11px] text-slate-400">Prevent search engines from serving cached page copies to searchers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMeta("noarchive")}
                  className="focus:outline-none cursor-pointer shrink-0"
                >
                  {robotsMeta.noarchive ? (
                    <ToggleRight className="text-indigo-600 h-8 w-8" />
                  ) : (
                    <ToggleLeft className="text-slate-300 h-8 w-8" />
                  )}
                </button>
              </div>

              {/* nosnippet */}
              <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">nosnippet</span>
                  <p className="text-[11px] text-slate-400">Prevent a search description snippet or video preview from showing in search results.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMeta("nosnippet")}
                  className="focus:outline-none cursor-pointer shrink-0"
                >
                  {robotsMeta.nosnippet ? (
                    <ToggleRight className="text-indigo-600 h-8 w-8" />
                  ) : (
                    <ToggleLeft className="text-slate-300 h-8 w-8" />
                  )}
                </button>
              </div>

              {/* noimageindex */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">noimageindex</span>
                  <p className="text-[11px] text-slate-400">Prevent search engines from indexing images found on pages of this website.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMeta("noimageindex")}
                  className="focus:outline-none cursor-pointer shrink-0"
                >
                  {robotsMeta.noimageindex ? (
                    <ToggleRight className="text-indigo-600 h-8 w-8" />
                  ) : (
                    <ToggleLeft className="text-slate-300 h-8 w-8" />
                  )}
                </button>
              </div>

            </CardContent>
          </Card>
        )}

        {/* TAB 5: ANALYTICS & PIXELS */}
        {activeTab === "tracking" && (
          <Card className="overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] animate-in fade-in-50 duration-200">
            <CardHeader className="py-5 bg-slate-50/20 border-b border-slate-100/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Globe size={16} className="text-indigo-600" />
                Analytics & Pixel Integrations
              </h3>
              <p className="text-xs text-slate-400">Configure Facebook Pixel, Conversion API (CAPI), Google Analytics, and TikTok tracking to measure performance.</p>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Meta / Facebook Integration */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Meta (Facebook) Setup</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaPixelId" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Meta Pixel ID</Label>
                    <Input
                      id="metaPixelId"
                      placeholder="e.g. 123456789012345"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <p className="text-[10px] text-slate-400">Used for client-side browser events tracking. <a href="https://business.facebook.com/events_manager" target="_blank" className="text-indigo-600 hover:underline">Events Manager <ExternalLink className="inline" size={8} /></a></p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaCapiToken" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Conversion API (CAPI) Access Token</Label>
                    <Input
                      id="metaCapiToken"
                      type="password"
                      placeholder="Enter Meta System User Token"
                      value={metaCapiToken}
                      onChange={(e) => setMetaCapiToken(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <p className="text-[10px] text-slate-400">Used to send secure server-to-server conversion events, bypassing browser ad-blockers.</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Google Analytics & TikTok Integration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Google Analytics */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Google Analytics</h4>
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">GA4 Measurement ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      placeholder="e.g. G-XXXXXXXXXX"
                      value={googleAnalyticsId}
                      onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <p className="text-[10px] text-slate-400">Configure Google Analytics 4 tracking. <a href="https://analytics.google.com/" target="_blank" className="text-indigo-600 hover:underline">Google Analytics <ExternalLink className="inline" size={8} /></a></p>
                  </div>
                </div>

                {/* TikTok Pixel */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">TikTok Ads</h4>
                  <div className="space-y-2">
                    <Label htmlFor="tiktokPixelId" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TikTok Pixel ID</Label>
                    <Input
                      id="tiktokPixelId"
                      placeholder="e.g. CXXXXXXXXXXXXXXXXXXX"
                      value={tiktokPixelId}
                      onChange={(e) => setTiktokPixelId(e.target.value)}
                      className="rounded-xl h-9.5 border-slate-200 text-xs focus-visible:ring-indigo-100 focus-visible:border-indigo-400"
                    />
                    <p className="text-[10px] text-slate-400">Configure TikTok advertising analytics tracking. <a href="https://ads.tiktok.com/" target="_blank" className="text-indigo-600 hover:underline">TikTok Ads <ExternalLink className="inline" size={8} /></a></p>
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>
        )}

        {/* TAB 5: 404 LOGS */}
        {activeTab === "logs" && (
          <Card className="overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.01)] animate-in fade-in-50 duration-200">
            <CardHeader className="py-5 bg-slate-50/20 border-b border-slate-100/50 flex flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Database size={16} className="text-indigo-600" />
                  404 Access Logs
                </h3>
                <p className="text-xs text-slate-400">Identify broken page layout links requested by users or bots.</p>
              </div>
              
              {logs.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={clearingLogs || loadingLogs}
                  onClick={handleClearLogs}
                  className="h-8.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs px-3 active:scale-98 transition-all cursor-pointer flex items-center gap-1"
                >
                  {clearingLogs ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Clear Logs
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              
              {loadingLogs ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                  <Loader2 className="animate-spin text-indigo-500" size={24} />
                  <span className="text-xs">Loading logs data...</span>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <Database size={32} className="text-slate-300" />
                  <span className="text-xs font-medium">No 404 log entries found</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                        <th className="py-3 px-6">Requested Path</th>
                        <th className="py-3 px-6">Referrer URL</th>
                        <th className="py-3 px-6 text-center">Hits</th>
                        <th className="py-3 px-6 text-right">Last Accessed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-mono text-slate-800 font-semibold">{log.path}</td>
                          <td className="py-3.5 px-6 text-slate-500 truncate max-w-[200px]">{log.referrer || "Direct / Unknown"}</td>
                          <td className="py-3.5 px-6 text-center font-bold text-slate-900">{log.hits}</td>
                          <td className="py-3.5 px-6 text-right text-slate-400">
                            {log.last_accessed_at ? new Date(log.last_accessed_at).toLocaleString() : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </CardContent>
          </Card>
        )}

        {/* Global Save/Reset Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={isSaving}
            className="h-10 rounded-xl border border-slate-200 active:scale-[0.98] transition-all cursor-pointer text-slate-600 bg-white hover:bg-slate-50 text-xs"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="h-10 rounded-xl px-6 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-xs font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={15} />
                Save information
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
