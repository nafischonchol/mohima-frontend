import { notFound } from "next/navigation";
import CatalogFilterClient from "@/components/CatalogFilterClient";
import { getFilterableData } from "@/lib/api/products";

interface DoubleSlugPageProps {
  params: Promise<{
    slug1: string;
    slug2: string;
  }>;
}

export default async function DoubleSlugPage({ params }: DoubleSlugPageProps) {
  const { slug1, slug2 } = await params;

  if (!slug1 || !slug2) {
    notFound();
  }

  // Fetch filterable data to resolve slug1 (category) and slug2 (brand)
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
  const isBrand = brands.some((b) => b.slug === slug2);

  if (isCat && isBrand) {
    return <CatalogFilterClient initialCategorySlug={slug1} initialBrandSlug={slug2} />;
  }

  // If slug1 is not a category or slug2 is not a brand, trigger Next.js 404
  notFound();
}
