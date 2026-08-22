import { AnnouncementBar } from "@/components/customer/home/AnnouncementBar";
import { CustomerHeader } from "@/components/customer/home/CustomerHeader";
import { CustomerFooter } from "@/components/customer/home/CustomerFooter";
import { ProductDetails } from "@/components/customer/product/ProductDetails";
import { getCustomerProductDetails } from "@/lib/api/products";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getSiteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "127.0.0.1:3090";
    const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");
    return `${protocol}://${host}`;
  } catch {
    return "http://127.0.0.1:3090";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug_url: string }>;
}): Promise<Metadata> {
  const { slug_url } = await params;
  const res = await getCustomerProductDetails(slug_url);
  const product = res.success ? res.resources : null;
  const siteUrl = await getSiteUrl();

  if (!product) {
    return {
      metadataBase: new URL(siteUrl),
      title: "Product Not Found | Mohimaa",
      description: "The requested product could not be found.",
    };
  }

  const brandName = typeof product.brand === "object" ? product.brand?.name : (product.brand || "");
  const categoryName = typeof product.category === "object" ? product.category?.name : (product.category || "");

  const customMetaDesc = product.meta_description ? product.meta_description.trim() : null;
  const rawDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim()
    : "";
  
  const descSource = customMetaDesc || rawDescription;
  
  // SEO best practice: Meta description max 150-155 characters
  const metaDescription = descSource
    ? (descSource.length > 150 ? `${descSource.slice(0, 147)}...` : descSource)
    : `${product.name} - Buy online at Mohimaa. Best wholesale price and authentic quality guaranteed.`;

  const title = product.meta_title
    ? product.meta_title
    : `${product.name} ${brandName ? `- ${brandName}` : ""} | Mohimaa`;
  const mainImage = product.thumbnail || (product.images && product.images[0]) || "";
  const relativePath = `/product/${product.slug_url || slug_url}`;
  const absoluteCanonicalUrl = `${siteUrl}${relativePath}`;

  const parseKeywords = (): string[] => {
    if (typeof product.meta_keywords === "string" && product.meta_keywords.trim()) {
      return product.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean);
    }
    if (Array.isArray(product.meta_keywords)) {
      return (product.meta_keywords as any[]).map((k) => String(k).trim()).filter(Boolean);
    }
    return [product.name, brandName, categoryName, "Mohimaa"].filter((k): k is string => Boolean(k));
  };

  return {
    metadataBase: new URL(siteUrl),
    title,
    description: metaDescription,
    keywords: parseKeywords(),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: absoluteCanonicalUrl,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: absoluteCanonicalUrl,
      siteName: "Mohimaa",
      images: mainImage ? [{ url: mainImage, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: mainImage ? [mainImage] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug_url: string }>;
}) {
  const { slug_url } = await params;
  const res = await getCustomerProductDetails(slug_url);
  const product = res.success ? res.resources : null;

  if (!product) {
    notFound();
  }

  const siteUrl = await getSiteUrl();

  let productSchemaJson = null;
  let breadcrumbSchemaJson = null;

  if (product) {
    const brandName = typeof product.brand === "object" ? product.brand?.name : (product.brand || "");
    const categoryName = typeof product.category === "object" ? product.category?.name : (product.category || "");
    const rawDescription = product.description
      ? product.description.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim()
      : "";

    const selectedVariant = product.variants?.[0];
    const stockCount = selectedVariant
      ? selectedVariant.stock
      : (product.total_stock !== undefined ? product.total_stock : 0);

    const images: string[] = [];
    if (product.thumbnail) images.push(product.thumbnail);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !images.includes(img)) images.push(img);
      });
    }

    const absoluteProductUrl = `${siteUrl}/product/${product.slug_url || slug_url}`;

    productSchemaJson = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: images.length > 0 ? images : undefined,
      description: rawDescription || product.name,
      sku: selectedVariant?.sku || product.barcode || product.sku || `PROD-${product.id}`,
      brand: {
        "@type": "Brand",
        name: brandName || "Mohimaa",
      },
      offers: {
        "@type": "Offer",
        availability: stockCount > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: absoluteProductUrl,
      },
      aggregateRating: product.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews_count || 1,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    };

    const breadcrumbItems = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
    ];

    if (categoryName) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${siteUrl}/products`,
      });
    }

    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: product.name,
      item: absoluteProductUrl,
    });

    breadcrumbSchemaJson = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    };
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans transition-colors duration-300">
      {/* Structural Schema Markups for SEO */}
      {productSchemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemaJson) }}
        />
      )}
      {breadcrumbSchemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaJson) }}
        />
      )}

      <AnnouncementBar />
      <CustomerHeader />
      <main className="flex-grow pb-24">
        <ProductDetails slugUrl={slug_url} initialData={product} />
      </main>
      <CustomerFooter />
    </div>
  );
}

