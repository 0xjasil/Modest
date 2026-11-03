import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import ReviewForm from "@/components/ReviewForm";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products as fallbackProducts } from "@/components/ProductGrid";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { productAPI, reviewAPI, mapBackendProductToProduct } from "@/lib/api";
import type { Product } from "@/lib/types";
import type { Review } from "@/lib/types";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SIZES = [
  { label: "Size 52", desc: "Petite (5'1\" - 5'3\")" },
  { label: "Size 54", desc: "Regular (5'3\" - 5'5\")" },
  { label: "Size 56", desc: "Medium (5'5\" - 5'7\")" },
  { label: "Size 58", desc: "Tall (5'7\"+)" },
];

const COLOUR_SWATCHES = [
  { name: "Espresso Noir", bg: "#302D27" },
  { name: "Warm Sand",     bg: "#D7CCBB" },
  { name: "Olive Earth",   bg: "#777B5A" },
  { name: "Raw Ivory",     bg: "#F8F6F0" },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Size 54");
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "care" | "shipping">("desc");
  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addItem, items } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const refreshReviews = async () => {
    if (!id) return;
    try {
      const revData = await reviewAPI.getByProduct(id as string);
      if (revData && Array.isArray(revData.reviews)) {
        setReviews(revData.reviews);
        setShowReviewForm(false);
      }
    } catch {}
  };

  // Initial fallback product
  const initialFallback = fallbackProducts.find((p) => p.id === id) ?? fallbackProducts[0];
  const product = liveProduct ?? initialFallback;

  // Fetch product and reviews from NestJS backend
  useEffect(() => {
    if (!id) return;
    let isSubscribed = true;

    (async () => {
      try {
        const raw = await productAPI.getById(id as string);
        if (isSubscribed && raw) {
          const mapped = mapBackendProductToProduct(raw);
          setLiveProduct(mapped);
          if (mapped.variantId) {
            setSelectedVariantId(mapped.variantId);
          }
        }
      } catch {
        // Fallback to local item
      }

      try {
        const revData = await reviewAPI.getByProduct(id as string);
        if (isSubscribed && revData && Array.isArray(revData.reviews)) {
          setReviews(revData.reviews);
        }
      } catch {
        // Fallback
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  if (!product) return null;

  const inCart = items.some((i) => i.product.id === product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    const itemToAdd: Product = {
      ...product,
      variantId: selectedVariantId || product.variantId,
    };
    for (let i = 0; i < qty; i++) {
      addItem(itemToAdd);
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 2500);
  };

  const handleBuyNow = () => {
    const itemToAdd: Product = {
      ...product,
      variantId: selectedVariantId || product.variantId,
    };
    for (let i = 0; i < qty; i++) {
      addItem(itemToAdd);
    }
    router.push("/checkout");
  };

  // Related companion pieces
  const relatedProducts = fallbackProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Head>
        <title>{product.name} | Modest Studio Kochi</title>
        <meta
          name="description"
          content={`Discover ${product.name} crafted in luxury breathable fabrics by Modest Studio Kochi.`}
        />
      </Head>

      <Header />

      <main id="main-content" className="min-h-screen bg-mb-bg py-8 sm:py-12 border-b border-mb-border">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs font-sans text-mb-muted uppercase tracking-editorial" role="list">
              <li>
                <Link href="/" className="hover:text-mb-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li>
                <Link href={`/category/${product.category}`} className="capitalize hover:text-mb-primary transition-colors">
                  {product.category || "Collection"}
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li className="text-mb-primary font-semibold truncate max-w-[280px]" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* ── Main Product Display ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">

            {/* Left: Product Gallery (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative aspect-[3/4] bg-mb-surface border border-mb-border overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span className="bg-mb-primary text-mb-bg text-[10px] font-sans font-medium uppercase tracking-editorial px-2.5 py-1">
                    Atelier Handcrafted
                  </span>
                  {product.discount && (
                    <span className="bg-mb-accent text-mb-bg text-[10px] font-sans font-medium uppercase tracking-editorial px-2.5 py-1">
                      {product.discount}% Off
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              <div className="grid grid-cols-4 gap-3">
                {[product.image, "/hero/card-1.jpg", "/hero/card-2.jpg", "/hero/card-3.jpg"].map((img, idx) => (
                  <div key={idx} className="aspect-square bg-mb-surface border border-mb-border p-1 overflow-hidden opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Purchase Controls (5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Brand / Subtitle */}
                <div className="flex items-center justify-between text-xs font-sans uppercase tracking-[0.2em] text-mb-muted mb-2">
                  <span>Modest Studio Kochi</span>
                  <span className="text-mb-gold font-semibold">★ {product.rating.toFixed(1)} / 5.0</span>
                </div>

                {/* Product Title */}
                <h1 className="font-serif text-3xl sm:text-4xl text-mb-primary font-normal tracking-tight leading-[1.15] mb-4">
                  {product.name}
                </h1>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 pb-6 border-b border-mb-border mb-6">
                  <span className="font-sans text-2xl sm:text-3xl font-semibold text-mb-primary">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="font-sans text-base text-mb-muted line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-xs font-body text-mb-muted ml-auto">
                    Inclusive of all taxes • Free Shipping
                  </span>
                </div>

                {/* Colour Selection */}
                <div className="mb-6">
                  <span className="text-xs font-sans uppercase tracking-editorial font-semibold text-mb-primary block mb-2.5">
                    Select Shade: <strong className="normal-case font-body text-mb-muted">{COLOUR_SWATCHES[selectedColor].name}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    {COLOUR_SWATCHES.map((swatch, idx) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => setSelectedColor(idx)}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          selectedColor === idx ? "ring-2 ring-mb-primary ring-offset-2 scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: swatch.bg, borderColor: "#DCD4C8" }}
                        title={swatch.name}
                        aria-label={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-sans uppercase tracking-editorial mb-2.5">
                    <span className="font-semibold text-mb-primary">Abaya Length &amp; Sizing:</span>
                    <button type="button" onClick={() => alert("Size Guide:\n52: Height 5'1\" - 5'3\"\n54: Height 5'3\" - 5'5\"\n56: Height 5'5\" - 5'7\"\n58: Height 5'7\"+")} className="text-mb-accent-deep hover:underline">
                      Length Chart ↗
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SIZES.map(s => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setSelectedSize(s.label)}
                        className={`p-3 text-left border transition-colors ${
                          selectedSize === s.label
                            ? "bg-mb-primary text-mb-bg border-mb-primary"
                            : "bg-mb-surface border-mb-border text-mb-primary hover:border-mb-primary"
                        }`}
                      >
                        <span className="block text-xs font-sans font-semibold uppercase tracking-wider">{s.label}</span>
                        <span className={`block text-[11px] font-body mt-0.5 ${selectedSize === s.label ? "text-mb-bg/80" : "text-mb-muted"}`}>
                          {s.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-sans uppercase tracking-editorial font-semibold text-mb-primary">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-mb-border bg-mb-surface">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-4 py-2 text-sm font-sans font-medium text-mb-primary hover:bg-mb-border transition-colors"
                    >
                      −
                    </button>
                    <span className="px-5 py-2 text-xs font-sans font-semibold text-mb-primary min-w-[40px] text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="px-4 py-2 text-sm font-sans font-medium text-mb-primary hover:bg-mb-border transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-body text-mb-muted">
                    Total: <strong className="text-mb-primary">₹{(product.price * qty).toLocaleString("en-IN")}</strong>
                  </span>
                </div>

                {/* Purchase CTAs */}
                <div className="space-y-3 pt-4 border-t border-mb-border-lite mb-8">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="luxury-btn-primary flex-1 py-4 text-xs tracking-editorial"
                    >
                      {flash ? "Added to Bag ✓" : inCart ? "Add Another to Bag" : "Add to Shopping Bag"}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label="Wishlist toggle"
                      className={`px-4 border border-mb-border transition-colors flex items-center justify-center ${
                        wishlisted ? "bg-mb-primary text-mb-bg border-mb-primary" : "bg-mb-bg text-mb-primary hover:border-mb-primary"
                      }`}
                    >
                      <HeartIcon filled={wishlisted} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="luxury-btn-secondary w-full py-4 text-xs tracking-editorial"
                  >
                    Buy Now • Instant Checkout →
                  </button>
                </div>
              </div>

              {/* ── Editorial Information Accordion / Tabs ───────────── */}
              <div className="border border-mb-border bg-mb-surface p-5">
                <div className="flex border-b border-mb-border-lite pb-3 mb-4 gap-6 text-xs font-sans uppercase tracking-editorial">
                  <button
                    type="button"
                    onClick={() => setActiveTab("desc")}
                    className={`font-semibold pb-1 border-b-2 transition-colors ${
                      activeTab === "desc" ? "border-mb-primary text-mb-primary" : "border-transparent text-mb-muted hover:text-mb-primary"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("care")}
                    className={`font-semibold pb-1 border-b-2 transition-colors ${
                      activeTab === "care" ? "border-mb-primary text-mb-primary" : "border-transparent text-mb-muted hover:text-mb-primary"
                    }`}
                  >
                    Fabric &amp; Care
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shipping")}
                    className={`font-semibold pb-1 border-b-2 transition-colors ${
                      activeTab === "shipping" ? "border-mb-primary text-mb-primary" : "border-transparent text-mb-muted hover:text-mb-primary"
                    }`}
                  >
                    Delivery &amp; Exchange
                  </button>
                </div>

                <div className="font-body text-xs text-mb-body leading-relaxed">
                  {activeTab === "desc" && (
                    <div>
                      <p className="mb-2">
                        {product.description || (
                          `A signature piece from Modest Studio Kochi. Sculpted with generous ease, soft drape, and timeless proportions designed for effortless modesty and daily comfort.`
                        )}
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-mb-muted">
                        <li>Draped modest cut with deep raglan / batwing sleeve</li>
                        <li>Concealed side seam pockets</li>
                        <li>Pre-washed to prevent shrinkage</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "care" && (
                    <ul className="space-y-1.5 text-mb-muted">
                      <li><strong>Composition:</strong> 100% Breathable Japanese Crêpe / Washed Linen blend</li>
                      <li><strong>Care Instructions:</strong> Dry clean recommended, or gentle cold hand wash</li>
                      <li><strong>Ironing:</strong> Steam on reverse side or iron on low silk setting</li>
                      <li><strong>Origin:</strong> Handcrafted in Kochi, Kerala</li>
                    </ul>
                  )}

                  {activeTab === "shipping" && (
                    <ul className="space-y-1.5 text-mb-muted">
                      <li><strong>Dispatch:</strong> Orders dispatch within 24–48 hours from our Kochi studio</li>
                      <li><strong>Pan-India Shipping:</strong> 3–5 business days via express courier</li>
                      <li><strong>Exchanges:</strong> Seamless 7-day exchange for length or sizing adjustments</li>
                      <li><strong>Packaging:</strong> Arrives in recyclable atelier box with cotton garment pouch</li>
                    </ul>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ── Related Companion Silhouettes ────────────────────────── */}
          <div className="pt-16 border-t border-mb-border mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium block mb-1">
                  Complete the Look
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-mb-primary font-normal">
                  Related Modest Silhouettes
                </h2>
              </div>
              <Link href="/category/all" className="font-sans text-xs uppercase tracking-editorial text-mb-accent-deep hover:underline mt-2 sm:mt-0">
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>

          {/* ── Customer Reviews Section ────────────────────────────── */}
          <div className="bg-mb-surface border border-mb-border p-6 sm:p-10 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-mb-border-lite">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-mb-primary font-normal">
                  Client Impressions ({reviews.length})
                </h2>
                <p className="text-xs font-body text-mb-muted mt-1">
                  Verified testimonials from women wearing Modest Studio Kochi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(v => !v)}
                className="luxury-btn-secondary px-5 py-2.5 text-xs tracking-editorial self-start sm:self-auto"
              >
                {showReviewForm ? "Close Review Form" : "Write an Impression"}
              </button>
            </div>

            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm
                  productId={Number(id)}
                  productName={product.name}
                  onSuccess={refreshReviews}
                />
              </div>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="pb-4 border-b border-mb-border-lite last:border-b-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-mb-gold">
                        {"★".repeat(rev.rating)}
                      </span>
                      <span className="text-xs font-semibold text-mb-primary">
                        {rev.title || "Verified Client"}
                      </span>
                    </div>
                    {rev.body && <p className="text-xs text-mb-body mt-1">{rev.body}</p>}
                    <span className="text-[10px] text-mb-muted mt-1 block">
                      By {rev.user?.firstName || "Client"} • {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-body text-mb-muted text-center py-6">
                Be the first to share your thoughts on {product.name}. Click &ldquo;Write an Impression&rdquo; above.
              </p>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
