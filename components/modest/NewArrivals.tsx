import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/modest/QuickViewModal";
import { products as fallbackProducts } from "@/components/ProductGrid";
import { productAPI, mapBackendProductToProduct } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function NewArrivals() {
  const [items, setItems] = useState<Product[]>(fallbackProducts);
  const [selectedTab, setSelectedTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const res = await productAPI.getAll({ limit: 12 });
        if (isSubscribed && res?.items && res.items.length > 0) {
          setItems(res.items.map(mapBackendProductToProduct));
        }
      } catch {
        // use fallbackProducts
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const TABS = [
    { key: "all", label: "All New Arrivals" },
    { key: "fashion", label: "Signature Abayas" },
    { key: "skincare", label: "Co-ord Sets" },
    { key: "luxe", label: "Kimonos & Luxe" },
  ];

  const filtered = items.filter(p => {
    if (selectedTab === "all") return true;
    return p.category === selectedTab || (selectedTab === "fashion" && p.category === "makeup");
  }).slice(0, 8);

  return (
    <section className="bg-mb-bg py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-labelledby="new-arrivals-heading">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-mb-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
                Atelier Drop • Season 2026
              </span>
            </div>
            <h2 id="new-arrivals-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight">
              New Arrivals
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTab(tab.key)}
                className={`px-4 py-2 text-xs font-sans tracking-editorial uppercase transition-all whitespace-nowrap ${
                  selectedTab === tab.key
                    ? "bg-mb-primary text-mb-bg font-semibold shadow-xs"
                    : "bg-mb-surface text-mb-body hover:bg-mb-surface-strong hover:text-mb-primary border border-mb-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={p => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/category/all?sort=newest"
            className="luxury-btn-secondary inline-block px-10 py-3.5 text-xs tracking-editorial"
          >
            Explore Complete New Collection ({items.length} Styles) →
          </Link>
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
