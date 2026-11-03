import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";
export type { Product };

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BagAddIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// Editorial colour palette dots for luxury fashion preview
const SAMPLE_COLORS = [
  { name: "Espresso", bg: "#302D27" },
  { name: "Sand",     bg: "#D7CCBB" },
  { name: "Olive",    bg: "#777B5A" },
  { name: "Warm Ivory", bg: "#F8F6F0" },
];

export default function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { addItem, items } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const inCart = items.some(i => i.product.id === product.id);
  const wishlisted = isWishlisted(product.id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const onWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <article
      className="group relative flex flex-col bg-mb-bg border border-mb-border hover:border-mb-primary transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Badges ────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount && product.discount > 0 ? (
          <span className="bg-mb-primary text-mb-bg text-[10px] font-sans font-medium uppercase tracking-editorial px-2 py-0.5">
            {product.discount}% Off
          </span>
        ) : product.badge ? (
          <span className="bg-mb-accent text-mb-bg text-[10px] font-sans font-medium uppercase tracking-editorial px-2 py-0.5">
            {product.badge}
          </span>
        ) : (
          <span className="bg-mb-surface-strong text-mb-primary text-[9px] font-sans font-semibold uppercase tracking-widest px-2 py-0.5">
            Studio Edit
          </span>
        )}
      </div>

      {/* ── Wishlist Button ───────────────────────────────────── */}
      <button
        type="button"
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
        onClick={onWish}
        className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-200 border ${
          wishlisted
            ? "bg-mb-primary text-mb-bg border-mb-primary"
            : "bg-mb-bg/90 text-mb-primary border-mb-border hover:border-mb-primary hover:text-mb-primary"
        }`}
      >
        <HeartIcon filled={wishlisted} />
      </button>

      {/* ── Image with Fashion Portrait Aspect Ratio ──────────── */}
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[3/4] bg-mb-surface overflow-hidden focus:outline-none"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Quick Actions Hover Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-mb-primary/80 via-mb-primary/30 to-transparent transition-opacity duration-300 flex items-center justify-between gap-2 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={onAdd}
            className="flex-1 py-2 px-3 bg-mb-bg text-mb-primary hover:bg-mb-primary hover:text-mb-bg text-[11px] font-sans font-medium uppercase tracking-editorial transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <BagAddIcon />
            <span>{inCart ? "In Bag (+1)" : "Add to Bag"}</span>
          </button>
          
          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickView}
              className="py-2 px-3 bg-mb-bg/90 text-mb-primary hover:bg-mb-bg text-[11px] font-sans font-medium uppercase tracking-editorial transition-colors"
            >
              Quick Look
            </button>
          )}
        </div>
      </Link>

      {/* ── Details Area ───────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-mb-bg">
        <div>
          {/* Category / Subtitle */}
          <div className="flex items-center justify-between mb-1 text-[11px] font-sans tracking-editorial uppercase text-mb-muted">
            <span>{product.brand === "Moryelle" ? "Modest Studio" : product.brand}</span>
            <span className="text-mb-gold text-[10px]">★ {product.rating.toFixed(1)}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-sm sm:text-base text-mb-text font-medium line-clamp-1 mb-2 hover:text-mb-accent-deep transition-colors">
            <Link href={`/product/${product.id}`} title={product.name}>
              {product.name}
            </Link>
          </h3>

          {/* Colour Swatches */}
          <div className="flex items-center gap-1.5 mb-3" aria-label="Available Colours">
            {SAMPLE_COLORS.map((col, idx) => (
              <button
                key={col.name}
                type="button"
                onClick={e => {
                  e.preventDefault();
                  setSelectedColor(idx);
                }}
                title={col.name}
                aria-label={col.name}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedColor === idx ? "ring-1 ring-mb-primary scale-110" : "opacity-75 hover:opacity-100"
                }`}
                style={{ backgroundColor: col.bg, borderColor: "#DCD4C8" }}
              />
            ))}
            <span className="text-[10px] font-body text-mb-muted ml-1">+2 shades</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-2 border-t border-mb-border-lite flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-sans text-sm font-semibold text-mb-text">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-sans text-xs text-mb-muted line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span className="text-[11px] font-sans uppercase tracking-wider text-mb-accent font-medium">
            Available
          </span>
        </div>
      </div>
    </article>
  );
}
