import React from "react";
import Link from "next/link";

export default function EditorialGalleryBanner() {
  return (
    <section className="w-full px-3 sm:px-6 my-10 sm:my-20 relative block clear-both" aria-label="Signature Visual Gallery">
      {/* Mobile-first Mosaic Gallery: 2-column asymmetrical on mobile (<md), 3-column on desktop (md+) */}
      <div className="w-full h-auto grid grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-4.5">
        
        {/* Column 1: Left Tall Vertical Card — Full height on mobile & desktop */}
        <div className="col-span-1 md:col-span-4 h-[340px] sm:h-[440px] md:h-[620px] lg:h-[680px]">
          <Link
            href="/category/syrian-collection"
            className="group relative block w-full h-full overflow-hidden rounded-[1px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
            aria-label="Explore Syrian Collection"
          >
            <img
              src="/abaya/hero/hero-6.jpg"
              alt="Syrian Collection — Modest Silhouettes & Artisanal Handwork | Modest Studio"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/banners/top-promo-banner.jpg")) {
                  target.src = "/banners/top-promo-banner.jpg";
                }
              }}
            />
            {/* Subtle Gradient & Floating Circular Arrow Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end justify-between p-3.5 sm:p-5">
              <span className="font-serif text-sm sm:text-base md:text-lg font-semibold text-white drop-shadow-md">
                Syrian Edits
              </span>
              <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white text-neutral-900 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Column 2: 2 Stacked Cards — Top & Bottom on mobile & desktop */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-2.5 sm:gap-4.5 h-[340px] sm:h-[440px] md:h-[620px] lg:h-[680px]">
          {/* Top Card */}
          <Link
            href="/category/the-classics"
            className="group flex-1 relative block w-full h-full overflow-hidden rounded-[1px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
            aria-label="Explore The Classics Collection"
          >
            <img
              src="/abaya/hero/hero-2.jpg"
              alt="The Classics — Silk & Midnight Nida Classic Abayas | Modest Studio"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/banners/category-highlights-banner.jpg")) {
                  target.src = "/banners/category-highlights-banner.jpg";
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end justify-between p-3 sm:p-4">
              <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-md">
                The Classics
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white text-neutral-900 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Bottom Card */}
          <Link
            href="/category/the-luxe-edit"
            className="group flex-1 relative block w-full h-full overflow-hidden rounded-[1px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
            aria-label="Explore The Luxe Edit"
          >
            <img
              src="/abaya/hero/hero-3.jpg"
              alt="The Luxe Edit — Earth Tones & Silk Organza Edits | Modest Studio"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/banners/timeless-beauty-banner.jpg")) {
                  target.src = "/banners/timeless-beauty-banner.jpg";
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end justify-between p-3 sm:p-4">
              <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-md">
                The Luxe Edit
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white text-neutral-900 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Column 3: Right Tall Vertical Card — Only on desktop (md+), hidden on mobile (<md) */}
        <div className="hidden md:block md:col-span-4 h-[420px] sm:h-[480px] md:h-[620px] lg:h-[680px]">
          <Link
            href="/category/occasion-wear"
            className="group relative block w-full h-full overflow-hidden rounded-[1px] bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all duration-300"
            aria-label="Explore Occasion Wear"
          >
            <img
              src="/abaya/hero/hero-4.jpg"
              alt="Occasion Wear — Bespoke Celebratory Cuts & Opulent Drapes | Modest Studio"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/banners/top-promo-banner.jpg")) {
                  target.src = "/banners/top-promo-banner.jpg";
                }
              }}
            />
            {/* Gradient & Floating Circular Arrow Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent flex items-end justify-between p-5">
              <span className="font-serif text-base sm:text-lg font-semibold text-white drop-shadow-md">
                Occasion Wear
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-neutral-900 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
