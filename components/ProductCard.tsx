import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

import type { Product } from "@/lib/types";
export type { Product };

const StarIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const inCart = items.some(i => i.product.id === product.id);
  const wishlisted = isWishlisted(product.id);

  const onAdd = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addItem(product); };
  const onWish = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); };

  const formatPrice = (val: number) => `Rs. ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <article className="group relative flex flex-col bg-mb-surface border border-mb-border rounded-[1px] transition-all overflow-hidden select-none shadow-2xs hover:border-mb-accent/60">

      {/* ── Top Image Container ───────────────────────────────── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-mb-surface border-b border-mb-border/60">
        
        {/* Top-Left: Black Capsule Badge (1px subtle border radius) */}
        {product.discount ? (
          <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-10 bg-black/95 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-[1px] uppercase tracking-wider shadow-xs pointer-events-none">
            {product.discount}% OFF
          </span>
        ) : product.badge ? (
          <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-10 bg-black/95 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-[1px] uppercase tracking-wider shadow-xs pointer-events-none">
            {product.badge}
          </span>
        ) : null}

        {/* Top-Right: White Circular Wishlist Button */}
        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={onWish}
          className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-gray-900 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none"
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Link wrapping image only */}
        <Link
          href={`/product/${product.id}`}
          aria-label={`${product.brand} ${product.name}, ${formatPrice(product.price)}`}
          className="block w-full h-full relative cursor-pointer"
        >
          <img
            src={product.image}
            alt={`${product.name} — ${product.brand || "Modest Studio"} Luxury Designer Abaya`}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes("/abaya/products/abaya-1.jpg")) {
                target.src = "/abaya/products/abaya-1.jpg";
              }
            }}
            className={`w-full h-full object-cover object-top transition-all duration-700 ${
              product.images && product.images[1] ? "group-hover:opacity-0" : "group-hover:scale-105"
            }`}
          />
          {product.images && product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} — ${product.brand || "Modest Studio"} Detailed Fabric & Silhouette View`}
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("/abaya/products/abaya-1.jpg")) {
                  target.src = "/abaya/products/abaya-1.jpg";
                }
              }}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>
      </div>

      {/* ── Product Details Below Image (Exact Reference Image Typography & Plus Button) ───────────────── */}
      <div className="p-2 sm:p-2.5 flex items-start justify-between gap-1.5 bg-mb-surface flex-1">
        <Link href={`/product/${product.id}`} className="flex-1 min-w-0 group/link">
          {/* Title: Decreased font size, clean & modern */}
          <h2 className="text-xs sm:text-[13px] font-medium text-mb-text group-hover/link:text-mb-primary line-clamp-1 mb-0.5 transition-colors">
            {product.name}
          </h2>

          {/* Regular Price */}
          <p className="text-xs sm:text-[13px] font-semibold text-mb-text leading-tight">
            {formatPrice(product.price)}
          </p>

          {/* Strikethrough Original Price */}
          {product.originalPrice && (
            <p className="text-[10px] sm:text-[11px] text-gray-400 line-through leading-tight mt-0.5">
              {formatPrice(product.originalPrice)}
            </p>
          )}

          {/* Red/Rust Discount Percentage */}
          {product.discount && (
            <p className="text-[10px] sm:text-[11px] font-bold text-[#b03a2e] dark:text-[#e06655] leading-tight mt-0.5">
              {product.discount}% OFF
            </p>
          )}
        </Link>

        {/* Circular Plus Button (Reference Image Style) */}
        <button
          type="button"
          onClick={onAdd}
          aria-label={inCart ? `${product.name} in bag` : `Add ${product.name} to bag`}
          title={inCart ? "In Bag" : "Add to Bag"}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all flex-shrink-0 mt-0.5 shadow-2xs ${
            inCart
              ? "bg-black text-white border-black"
              : "border-gray-300 dark:border-white/20 bg-white dark:bg-[#181818] text-gray-800 dark:text-gray-200 hover:border-black dark:hover:border-white hover:scale-105"
          }`}
        >
          {inCart ? (
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {inCart ? `${product.name} added to bag` : ""}
      </span>
    </article>
  );
}
