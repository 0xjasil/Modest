import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCategories } from "@/lib/hooks";

export default function DiscoverCategories() {
  const { categories, isLoading } = useCategories();

  // Placeholder category icons
  const getCategoryIcon = (slug: string) => {
    const icons: Record<string, string> = {
      makeup: "💄",
      skincare: "✨",
      hair: "💇",
      fragrances: "🌸",
      "bath-body": "🛁",
      wellness: "🧘",
      default: "🛍️",
    };
    return icons[slug.toLowerCase()] || icons.default;
  };

  return (
    <section className="w-full px-3 sm:px-6 my-6" aria-label="Discover Categories">
      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-3 bg-mb-surface rounded-[12px] border border-mb-border"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-mb-bg rounded-full animate-pulse mb-2.5" />
              <div className="h-3 bg-mb-border rounded w-12 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center justify-center p-3 bg-mb-surface rounded-[12px] border border-mb-border shadow-card hover:shadow-dropdown hover:border-mb-accent transition-all text-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full bg-mb-bg border border-mb-border-lite flex items-center justify-center mb-2.5 shadow-xs text-3xl group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.slug)}
              </div>
              <span className="font-serif text-xs sm:text-sm font-semibold text-mb-text group-hover:text-mb-primary transition-colors line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
