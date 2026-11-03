import React from "react";
import Link from "next/link";
// @ts-ignore
import { category as abayaCategories } from "@/data/TopBrands";

export default function DiscoverCategories() {
  const categories = (abayaCategories || []) as Array<{
    img: string;
    offer: string;
    slug?: string;
  }>;

  return (
    <section className="w-full px-3 sm:px-6 my-6" aria-label="Explore Abaya Categories">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-mb-muted mt-0.5">
            Inspired by Ovais Abaya Collection — Front Open, Double Shrug, Kaftans &amp; Bridal Edits
          </p>
        </div>
        <Link
          href="/category/all"
          className="text-xs sm:text-sm font-semibold text-mb-primary hover:text-mb-primary-hover flex items-center gap-1 transition-colors"
        >
          View All <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {categories.slice(0, 12).map((cat, i) => {
          const href = `/category/${cat.slug || cat.offer.toLowerCase().replace(/\s+/g, "-")}`;
          return (
            <Link
              key={i}
              href={href}
              className="group flex flex-col items-center justify-center p-3 bg-mb-surface rounded-[12px] border border-mb-border shadow-card hover:shadow-dropdown hover:border-mb-accent transition-all text-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full bg-mb-bg border border-mb-border-lite flex items-center justify-center mb-2.5 shadow-xs">
                <img
                  src={cat.img}
                  alt={cat.offer}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-serif text-xs sm:text-sm font-semibold text-mb-text group-hover:text-mb-primary transition-colors line-clamp-2">
                {cat.offer}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
