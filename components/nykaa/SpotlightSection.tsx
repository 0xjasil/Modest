import React from "react";
import Link from "next/link";

const spotlightItems = [
  {
    img: "/categories/fragrance.jpg",
    name: "Aromatherapy Candles",
    link: "/category/fragrance"
  },
  {
    img: "/categories/fragrance.jpg",
    name: "Body Mists",
    link: "/category/fragrance"
  },
  {
    img: "/categories/skincare.jpg",
    name: "Essential Oils",
    link: "/category/skincare"
  },
  {
    img: "/categories/bath-body.jpg",
    name: "Botanical Bath Salts",
    link: "/category/bath-body"
  },
  {
    img: "/categories/bath-body.jpg",
    name: "Massage Oils",
    link: "/category/bath-body"
  },
  {
    img: "/categories/skincare.jpg",
    name: "Exfoliating Scrubs",
    link: "/category/skincare"
  },
  {
    img: "/categories/bath-body.jpg",
    name: "Foot Care Rituals",
    link: "/category/bath-body"
  }
];

export default function SpotlightSection() {
  return (
    <section className="w-full px-3 sm:px-6 my-8" aria-label="In The Spotlight">
      <div className="mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text text-left">
          In The Spotlight
        </h2>
        <p className="text-xs sm:text-sm font-medium text-mb-muted mt-1">
          Self-Care &amp; Sanctuary Essentials
        </p>
      </div>

      {/* Hero Banner with text */}
      <div className="relative overflow-hidden rounded-[14px] shadow-card mb-6 group border border-mb-border">
        <Link href="/category/bath-body" className="block">
          <img
            src="/banners/timeless-beauty-banner.jpg"
            alt="In The Spotlight Self-Care"
            className="w-full h-36 sm:h-48 md:h-56 object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute bottom-4 left-4 bg-mb-primary/95 text-mb-bg px-5 py-3 rounded-[10px] shadow-card border border-mb-primary-hover">
            <p className="font-serif text-lg sm:text-xl font-bold leading-tight text-mb-bg">Up To 30% Off</p>
            <p className="text-xs text-mb-gold font-medium mt-0.5 uppercase tracking-wider">On Sanctuary Must-Haves</p>
          </div>
        </Link>
      </div>

      {/* 7 Item Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
        {spotlightItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.link}
            className="group flex flex-col items-center justify-center p-3 bg-mb-surface rounded-[12px] border border-mb-border shadow-card hover:shadow-dropdown transition-all text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full bg-mb-bg border border-mb-border-lite flex items-center justify-center mb-2.5 shadow-xs">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="font-serif text-xs sm:text-sm font-semibold text-mb-text group-hover:text-mb-primary transition-colors leading-tight">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
