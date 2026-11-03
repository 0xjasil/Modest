import React from "react";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  image: string;
  badge?: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "abayas",
    name: "Signature Abayas",
    subtitle: "Draped luxury crêpe & batwing cuts",
    href: "/category/fashion",
    image: "/categories/luxe.jpg",
    badge: "Most Loved",
  },
  {
    id: "coords",
    name: "Co-ord Ensembles",
    subtitle: "Relaxed tailored modest sets",
    href: "/category/skincare",
    image: "/hero/card-1.jpg",
  },
  {
    id: "kimonos",
    name: "Flowing Kimonos",
    subtitle: "Breathable layering & outer duster robes",
    href: "/category/luxe",
    image: "/categories/wellness.jpg",
    badge: "New Silhouette",
  },
  {
    id: "scarves",
    name: "Hijabs & Scarves",
    subtitle: "Modal, silk touch & premium jersey",
    href: "/category/makeup",
    image: "/categories/makeup.jpg",
  },
  {
    id: "festive",
    name: "Festive & Occasion",
    subtitle: "Delicate embroidery & golden hues",
    href: "/category/fragrance",
    image: "/categories/fragrance.jpg",
  },
  {
    id: "all",
    name: "Atelier Essentials",
    subtitle: "Under-abayas, inner slips & accessories",
    href: "/category/all",
    image: "/categories/bath-body.jpg",
  },
];

export default function CategoryCollection() {
  return (
    <section className="bg-mb-bg py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-labelledby="cat-heading">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-mb-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
                Curated Silhouettes
              </span>
            </div>
            <h2 id="cat-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight">
              Collections by Category
            </h2>
          </div>
          <p className="font-body text-xs sm:text-sm text-mb-muted mt-3 md:mt-0 max-w-md">
            Each collection is thoughtfully designed in Kochi to offer maximum comfort, 
            complete coverage, and effortless modern elegance.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative flex flex-col bg-mb-surface border border-mb-border overflow-hidden focus:outline-none focus:ring-1 focus:ring-mb-accent"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-mb-surface">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.96]"
                />
                
                {/* Subtle Gradient & Badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-mb-primary/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {cat.badge && (
                  <span className="absolute top-3 left-3 bg-mb-bg text-mb-primary text-[10px] font-sans font-medium uppercase tracking-editorial px-2.5 py-0.5 border border-mb-border">
                    {cat.badge}
                  </span>
                )}

                {/* Text Content Overlay on Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-mb-bg">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight mb-1 group-hover:text-mb-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-body text-[11px] sm:text-xs text-mb-bg/80 line-clamp-1 mb-3">
                    {cat.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-editorial font-medium text-mb-gold group-hover:underline">
                    Explore Silhouettes →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
