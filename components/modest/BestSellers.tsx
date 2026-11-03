import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/modest/QuickViewModal";
import { products as fallbackProducts } from "@/components/ProductGrid";
import { productAPI, mapBackendProductToProduct } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function BestSellers() {
  const [items, setItems] = useState<Product[]>(fallbackProducts);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const res = await productAPI.getAll({ limit: 20 });
        if (isSubscribed && res?.items && res.items.length > 0) {
          setItems(res.items.map(mapBackendProductToProduct));
        }
      } catch {
        // fallback to fallbackProducts
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Sort by rating / review count
  const bestSellers = [...items]
    .sort((a, b) => (b.rating * (b.reviewCount || 1)) - (a.rating * (a.reviewCount || 1)))
    .slice(0, 4);

  return (
    <section className="bg-mb-bg py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-labelledby="bestsellers-heading">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-mb-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
                Client Favourites
              </span>
            </div>
            <h2 id="bestsellers-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/category/all?sort=popularity"
            className="font-sans text-xs uppercase tracking-editorial font-medium text-mb-accent-deep hover:text-mb-primary transition-colors mt-3 md:mt-0 flex items-center gap-1.5"
          >
            <span>View All Most Loved</span>
            <span>→</span>
          </Link>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />

      </div>
    </section>
  );
}
