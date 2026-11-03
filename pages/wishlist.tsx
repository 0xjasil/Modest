import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import BrandLogo from "@/components/BrandLogo";

export default function Wishlist() {
  const { products, wishlistCount } = useWishlist();

  return (
    <>
      <Head>
        <title>Saved Silhouettes | Modest Studio Kochi</title>
        <meta name="description" content="Review your saved modest fashion silhouettes at Modest Studio Kochi." />
      </Head>
      <Header />
      <main id="main-content" className="min-h-screen bg-mb-bg py-8 sm:py-12 border-b border-mb-border">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-sans text-mb-muted uppercase tracking-editorial" role="list">
              <li>
                <Link href="/" className="hover:text-mb-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li className="text-mb-primary font-semibold" aria-current="page">
                Saved Pieces
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mb-primary mb-8 tracking-tight">
            Saved Silhouettes ({wishlistCount} {wishlistCount === 1 ? "piece" : "pieces"})
          </h1>

          {products.length === 0 ? (
            /* ── Empty state with Atelier Emblem ───────────────── */
            <div className="bg-mb-surface border border-mb-border p-12 sm:p-16 text-center max-w-lg mx-auto my-8">
              <div className="flex justify-center mb-5">
                <BrandLogo variant="emblem" className="w-16 h-16 opacity-80" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-mb-primary mb-3">Your Saved List is Empty</h2>
              <p className="font-body text-xs sm:text-sm text-mb-body mb-8 max-w-xs mx-auto">
                Save your favourite abayas and ensembles by tapping the heart icon on any piece.
              </p>
              <Link
                href="/category/all"
                className="luxury-btn-primary inline-block px-8 py-3.5 text-xs tracking-editorial"
              >
                Discover Silhouettes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
