import { notFound } from "next/navigation";
import CatalogFilterClient from "@/components/CatalogFilterClient";
import { getFilterableData } from "@/lib/api/products";

interface SingleSlugPageProps {
  params: Promise<{
    slug1: string;
  }>;
}

export default async function SingleSlugPage({ params }: SingleSlugPageProps) {
  const { slug1 } = await params;

  if (!slug1) {
    notFound();
  }

  // Fetch filterable data to resolve whether slug1 is a category or brand
  const res = await getFilterableData();
  const categories = res?.resources?.categories || [];
  const brands = res?.resources?.brands || [];

  // Helper to check recursively if slug matches any category or sub-category
  const isCategorySlug = (catList: typeof categories, targetSlug: string): boolean => {
    for (const cat of catList) {
      if (cat.slug === targetSlug) return true;
      if (cat.children && cat.children.length > 0) {
        if (isCategorySlug(cat.children as any, targetSlug)) return true;
      }
    }
    return false;
  };

  const isCat = isCategorySlug(categories, slug1);
  const isBrand = brands.some((b) => b.slug === slug1);

  if (isCat) {
    return <CatalogFilterClient initialCategorySlug={slug1} />;
  }

  if (isBrand) {
    return <CatalogFilterClient initialBrandSlug={slug1} />;
  }

  // If slug1 is neither a category nor a brand, trigger Next.js 404
  notFound();
}
