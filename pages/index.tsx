import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/modest/HeroSection";
import CategoryCollection from "@/components/modest/CategoryCollection";
import NewArrivals from "@/components/modest/NewArrivals";
import EditorialCampaign from "@/components/modest/EditorialCampaign";
import BestSellers from "@/components/modest/BestSellers";
import BrandStory from "@/components/modest/BrandStory";
import InstagramSection from "@/components/modest/InstagramSection";
import NewsletterSection from "@/components/modest/NewsletterSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Modest Studio Kochi | Contemporary Modest Fashion &amp; Abayas</title>
        <meta
          name="description"
          content="Discover thoughtfully curated contemporary modest fashion, signature abayas, and co-ord sets designed for effortless everyday elegance by Modest Studio Kochi."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta property="og:title" content="Modest Studio Kochi | Contemporary Modest Fashion" />
        <meta property="og:description" content="Elegance in Every Layer. Premium contemporary abayas, linen co-ords, and scarves handcrafted in Kochi, Kerala." />
        <meta property="og:type" content="website" />
      </Head>

      {/* ── 1. Announcement Bar & Navigation Header ─────────── */}
      <Header />

      <main id="main-content" className="min-h-screen bg-mb-bg w-full overflow-x-hidden">
        {/* ── 2. Editorial Fashion Campaign Hero ──────────────── */}
        <HeroSection />

        {/* ── 3. Category Collection ─────────────────────────── */}
        <CategoryCollection />

        {/* ── 4. New Arrivals with Quick View ────────────────── */}
        <NewArrivals />

        {/* ── 5. Editorial Campaign (Kochi Chronicles) ────────── */}
        <EditorialCampaign />

        {/* ── 6. Best Sellers ─────────────────────────────────── */}
        <BestSellers />

        {/* ── 7. Brand Story & Philosophy ─────────────────────── */}
        <BrandStory />

        {/* ── 8. Instagram Section (@modest_studio_kochi) ────── */}
        <InstagramSection />

        {/* ── 9. Minimal Newsletter Subscription ──────────────── */}
        <NewsletterSection />
      </main>

      {/* ── 10. Multi-Column Editorial Footer ────────────────── */}
      <Footer />
    </>
  );
}
