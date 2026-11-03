import React, { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";


import HeroCarousel from "@/components/nykaa/HeroCarousel";
import DiscoverCategories from "@/components/nykaa/DiscoverCategories";
import OfferGifsCarousel from "@/components/nykaa/OfferGifsCarousel";
import TopBrandsSection from "@/components/nykaa/TopBrandsSection";
import UnmissableOffers from "@/components/nykaa/UnmissableOffers";
import SaveOnSunscreens from "@/components/nykaa/SaveOnSunscreens";
import HotListProducts from "@/components/nykaa/HotListProducts";
import SpotlightSection from "@/components/nykaa/SpotlightSection";
import RadarSection from "@/components/nykaa/RadarSection";

export default function Home() {
  const [showAppBanner, setShowAppBanner] = useState(true);

  return (
    <>
      <Head>
        <title>Moryelle Beauté: Beauty Beyond Today | Luxury Beauty &amp; Cosmetics</title>
        <meta
          name="description"
          content="Discover luxury skincare, couture cosmetics, fine fragrances and wellness at Moryelle Beauté - Beauty Beyond Today."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      {/* 1. Header (Moryelle Beauté) */}
      <Header />

      <main id="main-content" className="min-h-screen bg-mb-bg w-full overflow-x-hidden">
        {/* 2. Editorial Top Banner Strip */}
        <div className="w-full my-1 sm:my-2 overflow-hidden">
          <Link href="/category/all" className="block w-full">
            <img
              src="/banners/top-promo-banner.jpg"
              alt="Moryelle Beauté — Online Shopping New Arrivals Up to 70% Off"
              className="w-full h-auto max-h-[460px] object-cover object-center"
            />
          </Link>
        </div>

        {/* 3. Hero Carousel Cards */}
        <HeroCarousel />

        {/* 4. Discover Categories */}
        <DiscoverCategories />

        {/* 5. Category Highlights Banner */}
        <div className="w-full my-4 overflow-hidden">
          <Link href="/category/all" className="block w-full">
            <img
              src="/banners/category-highlights-banner.jpg"
              alt="Curated Category Highlights — Moryelle Beauté"
              className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover object-center"
            />
          </Link>
        </div>

        {/* 6. Animated Carousel */}
        <OfferGifsCarousel />

        {/* 7. Top Brands Section */}
        <TopBrandsSection />

        {/* 8. Unmissable Offers */}
        <UnmissableOffers />

        {/* 9. Save On Sunscreens */}
        <SaveOnSunscreens />

        {/* 10. Hot List Icons */}
        <HotListProducts />

        {/* 11. In The Spotlight */}
        <SpotlightSection />

        {/* 12. On Our Radar */}
        <RadarSection />

        {/* 13. Bottom Feature Banner */}
        <div className="w-full my-8 overflow-hidden">
          <Link href="/category/all" className="block w-full">
            <img
              src="/banners/timeless-beauty-banner.jpg"
              alt="Moryelle Beauté — Beauty Beyond Today"
              className="w-full h-36 sm:h-48 md:h-60 lg:h-72 object-cover object-center"
            />
          </Link>
        </div>

        {/* 14. Store Brand Statement */}
        <div className="w-full px-4 sm:px-6 py-14 text-center bg-mb-surface border-t border-mb-border">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-mb-primary mb-2">
            Moryelle Beauté
          </h2>
          <p className="text-xs sm:text-sm font-light text-mb-muted uppercase tracking-[0.3em]">
            Beauty Beyond Today
          </p>
        </div>
      </main>

      {/* Floating Widgets */}
      {/* 1. App Promotion QR Widget (Bottom-Left) */}
      {showAppBanner && (
        <aside
          aria-label="App Download Promotion"
          className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-3 bg-mb-surface p-3.5 rounded-[12px] shadow-dropdown border border-mb-border animate-fade-in"
        >
          <div className="w-12 h-12 bg-mb-bg border border-mb-border rounded-[8px] p-1 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-full h-full text-mb-primary" fill="currentColor">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h-4v2h2v2h-2v2h4v-2h2v-2h-2v-2zm-2-2h4v2h-4v-2zm2 6h2v2h-2v-2z" />
            </svg>
          </div>
          <div className="text-left pr-2">
            <p className="font-serif text-xs font-semibold text-mb-text leading-tight">Exclusive Offers On App</p>
            <p className="text-[11px] text-mb-muted leading-snug">Enjoy 20% off your initial order</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAppBanner(false)}
            aria-label="Dismiss app download banner"
            className="text-mb-placeholder hover:text-mb-primary text-sm font-bold p-1 leading-none rounded hover:bg-mb-bg"
          >
            ✕
          </button>
        </aside>
      )}

      {/* 2. Customer Care Help Pill (Bottom-Right) */}
      <aside aria-label="Customer Concierge Help" className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => alert("Moryelle Beauté Concierge: Our advisors are available daily, 8 AM - 10 PM. Call 1800-267-4444 or email concierge@moryelle.com")}
          className="flex items-center gap-2.5 bg-mb-surface px-4 py-3 rounded-full shadow-dropdown border border-mb-border hover:border-mb-accent hover:shadow-xl transition-all group cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-mb-accent group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span className="text-xs font-semibold text-mb-text group-hover:text-mb-primary transition-colors">
            How may we assist you?
          </span>
        </button>
      </aside>

      {/* 15. Footer (Moryelle Beauté) */}
      <Footer />
    </>
  );
}
