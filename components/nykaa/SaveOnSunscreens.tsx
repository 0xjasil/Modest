import React from "react";
import Link from "next/link";

const sunscreenItems = [
  "/categories/skincare.jpg",
  "/categories/bath-body.jpg",
  "/categories/wellness.jpg",
  "/categories/luxe.jpg",
  "/categories/skincare.jpg",
  "/categories/hair.jpg"
];

export default function SaveOnSunscreens() {
  return (
    <section className="w-full px-3 sm:px-6 my-8" aria-label="Save On Sunscreens">
      <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text mb-6 text-left">
        Solar Protection &amp; Sun Care
      </h2>

      {/* Main Feature Banner */}
      <div className="relative overflow-hidden rounded-[14px] shadow-card mb-5 group border border-mb-border">
        <Link href="/category/skincare" className="block">
          <img
            src="/banners/category-highlights-banner.jpg"
            alt="Save On Sunscreens"
            className="w-full h-36 sm:h-48 md:h-56 object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute bottom-4 left-4 bg-mb-primary/95 text-mb-bg px-5 py-3 rounded-[10px] shadow-card border border-mb-primary-hover">
            <p className="font-serif text-lg sm:text-xl font-bold leading-tight text-mb-bg">Up To 30% Off</p>
            <p className="text-xs text-mb-gold font-medium mt-0.5 uppercase tracking-wider">On SPF Essentials</p>
          </div>
        </Link>
      </div>

      {/* 6 item Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-5">
        {sunscreenItems.map((src, i) => (
          <Link
            key={i}
            href="/category/skincare"
            className="group flex flex-col items-center justify-center p-3 bg-mb-surface rounded-[12px] border border-mb-border shadow-card hover:shadow-dropdown transition-all"
          >
            <img
              src={src}
              alt="Sunscreen Product"
              className="w-full h-auto object-contain rounded-[8px] transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>

      {/* Secondary Bottom Banner */}
      <div className="overflow-hidden rounded-[14px] shadow-card border border-mb-border">
        <Link href="/category/skincare" className="block">
          <img
            src="/banners/category-highlights-banner.jpg"
            alt="Sunscreens Promotion"
            className="w-full h-28 sm:h-36 md:h-44 object-cover object-center"
          />
        </Link>
      </div>
    </section>
  );
}
