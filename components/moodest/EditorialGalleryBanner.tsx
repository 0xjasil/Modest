import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { categoryAPI, productAPI, mapBackendProductToProduct } from "@/lib/api";
import { getDynamicCategoryImage, type CategoryItem } from "@/components/moodest/DiscoverCategories";
import type { Product } from "@/lib/types";

interface EditorialGalleryBannerProps {
  initialCategories?: CategoryItem[];
  initialProducts?: Product[];
}

interface GalleryCardItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  ariaLabel: string;
}

export default function EditorialGalleryBanner({
  initialCategories,
  initialProducts,
}: EditorialGalleryBannerProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories || []);
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(
    (!initialCategories || initialCategories.length === 0) &&
    (!initialProducts || initialProducts.length === 0)
  );

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialCategories, initialProducts]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (categories.length > 0 && products.length > 0) return;
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          categories.length === 0 ? categoryAPI.getAll().catch(() => []) : Promise.resolve(null),
          products.length === 0 ? productAPI.getAll({ limit: 12 }).catch(() => null) : Promise.resolve(null),
        ]);

        if (!isMounted) return;

        if (catsRes && Array.isArray(catsRes) && catsRes.length > 0) {
          setCategories(
            catsRes.map((cat: any) => ({
              id: String(cat.id),
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              image: cat.image || cat.imageUrl || cat.img || cat.thumbnail || "",
              description: cat.description || "",
            }))
          );
        }

        if (prodsRes?.items && Array.isArray(prodsRes.items)) {
          setProducts(prodsRes.items.map(mapBackendProductToProduct));
        }
      } catch (err) {
        console.warn("[EditorialGalleryBanner] Error fetching gallery items:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [categories.length, products.length]);

  // Construct dynamic cards from live categories or products
  const cards: GalleryCardItem[] = React.useMemo(() => {
    if (categories.length >= 3) {
      // Prioritize categories with dynamic image resolution
      return categories.slice(0, 4).map((cat) => {
        const resolvedImg = getDynamicCategoryImage(cat, products) || "/banners/category-highlights-banner.jpg";
        return {
          id: cat.id,
          title: cat.name,
          subtitle: cat.description ? cat.description.slice(0, 45) : "Exclusive Edition",
          href: `/category/${cat.slug}`,
          image: resolvedImg,
          ariaLabel: `Explore ${cat.name} Collection`,
        };
      });
    }

    if (products.length >= 3) {
      return products.slice(0, 4).map((p) => ({
        id: String(p.id),
        title: p.name,
        subtitle: p.brand || "Modest Studio",
        href: `/product/${p.id}`,
        image: p.image || "/banners/top-promo-banner.jpg",
        ariaLabel: `View ${p.name}`,
      }));
    }

    return [];
  }, [categories, products]);

  // Loading skeleton state
  if (loading && cards.length === 0) {
    return (
      <section className="w-full px-3 sm:px-6 my-10 sm:my-20 relative block clear-both" aria-label="Loading Visual Gallery">
        <div className="w-full h-auto grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4.5 animate-pulse">
          <div className="col-span-1 md:col-span-4 h-[340px] sm:h-[440px] md:h-[620px] lg:h-[680px] bg-gray-200 dark:bg-white/5 rounded-[2px]" />
          <div className="col-span-1 md:col-span-4 flex flex-col gap-2.5 sm:gap-4.5 h-[340px] sm:h-[440px] md:h-[620px] lg:h-[680px]">
            <div className="flex-1 bg-gray-200 dark:bg-white/5 rounded-[2px]" />
            <div className="flex-1 bg-gray-200 dark:bg-white/5 rounded-[2px]" />
          </div>
          <div className="hidden md:block md:col-span-4 h-[420px] sm:h-[480px] md:h-[620px] lg:h-[680px] bg-gray-200 dark:bg-white/5 rounded-[2px]" />
        </div>
      </section>
    );
  }

  // If no dynamic cards available, return null
  if (cards.length === 0) {
    return null;
  }

  const card1 = cards[0];
  const card2 = cards[1];
  const card3 = cards[2];
  const card4 = cards[3] || cards[0];

  return (
    <section className="w-full px-3 sm:px-6 my-10 sm:my-20 relative block clear-both" aria-label="Signature Visual Gallery">
      {/* Mobile-first Mosaic Gallery: 2-column asymmetrical on mobile (<md), 3-column on desktop (md+) */}
      <div className="w-full h-auto grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4.5">
        
        {/* Column 1: Left Tall Vertical Card — Full height on mobile & desktop */}
        {card1 && (
          <div className="col-span-1 md:col-span-4 h-[340px] sm:h-[440px] md:h-[620px] lg:h-[680px]">
            <Link
              href={card1.href}
              className="group relative block w-full h-full overflow-hidden rounded-[2px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
              aria-label={card1.ariaLabel}
            >
              <img
                src={card1.image}
                alt={`${card1.title} | Modest Studio`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("/banners/top-promo-banner.jpg")) {
                    target.src = "/banners/top-promo-banner.jpg";
                  }
                }}
              />
              {/* Subtle Gradient & Floating Circular Arrow Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent flex items-end justify-between p-3.5 sm:p-5">
                <span className="font-serif text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-md truncate pr-2">
                  {card1.title}
                </span>
                <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-mb-surface text-mb-primary border border-mb-border shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                  <Icon icon="lucide:chevron-right" className="w-4 h-4 sm:w-5 sm:h-5 text-mb-primary" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Column 2: 2 Stacked Cards — Top & Bottom on mobile & desktop */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-2.5 sm:gap-4.5 h-[340px] sm:h-[440px] md:h-[620px] lg:h-[680px]">
          {/* Top Card */}
          {card2 && (
            <Link
              href={card2.href}
              className="group flex-1 relative block w-full h-full overflow-hidden rounded-[2px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
              aria-label={card2.ariaLabel}
            >
              <img
                src={card2.image}
                alt={`${card2.title} | Modest Studio`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("/banners/category-highlights-banner.jpg")) {
                    target.src = "/banners/category-highlights-banner.jpg";
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent flex items-end justify-between p-3 sm:p-4">
                <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-md truncate pr-2">
                  {card2.title}
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-mb-surface text-mb-primary border border-mb-border shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                  <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mb-primary" />
                </div>
              </div>
            </Link>
          )}

          {/* Bottom Card */}
          {card3 && (
            <Link
              href={card3.href}
              className="group flex-1 relative block w-full h-full overflow-hidden rounded-[2px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
              aria-label={card3.ariaLabel}
            >
              <img
                src={card3.image}
                alt={`${card3.title} | Modest Studio`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("/banners/timeless-beauty-banner.jpg")) {
                    target.src = "/banners/timeless-beauty-banner.jpg";
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent flex items-end justify-between p-3 sm:p-4">
                <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-md truncate pr-2">
                  {card3.title}
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-mb-surface text-mb-primary border border-mb-border shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                  <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mb-primary" />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Column 3: Right Tall Vertical Card — Only on desktop (md+), hidden on mobile (<md) */}
        {card4 && (
          <div className="hidden md:block md:col-span-4 h-[420px] sm:h-[480px] md:h-[620px] lg:h-[680px]">
            <Link
              href={card4.href}
              className="group relative block w-full h-full overflow-hidden rounded-[2px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
              aria-label={card4.ariaLabel}
            >
              <img
                src={card4.image}
                alt={`${card4.title} | Modest Studio`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("/banners/top-promo-banner.jpg")) {
                    target.src = "/banners/top-promo-banner.jpg";
                  }
                }}
              />
              {/* Gradient & Floating Circular Arrow Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent flex items-end justify-between p-5">
                <span className="font-serif text-base sm:text-lg font-semibold text-white drop-shadow-md truncate pr-2">
                  {card4.title}
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-neutral-900 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                  <Icon icon="lucide:chevron-right" className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
              </div>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
