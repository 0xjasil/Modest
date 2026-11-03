import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/types";

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SIZES = ["52 (5'1\" - 5'3\")", "54 (5'3\" - 5'5\")", "56 (5'5\" - 5'7\")", "58 (5'7\"+)"];

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("54 (5'3\" - 5'5\")");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mb-primary/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-mb-bg border border-mb-border max-w-2xl w-full shadow-dropdown z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-mb-primary hover:text-mb-accent-deep bg-mb-bg/80 border border-mb-border transition-colors"
          aria-label="Close dialog"
        >
          <CloseIcon />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-mb-surface relative aspect-[3/4] md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-mb-primary text-mb-bg text-[10px] uppercase tracking-editorial px-2.5 py-1">
              {product.brand === "Moryelle" ? "Modest Studio" : product.brand}
            </span>
          </div>
        </div>

        {/* Details & Selection */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-editorial text-mb-muted mb-1">
              <span>{product.category || "Modest Silhouette"}</span>
              <span className="text-mb-gold">★ {product.rating.toFixed(1)}</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-mb-text font-medium leading-snug mb-3">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-sans text-lg font-semibold text-mb-text">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-sans text-sm text-mb-muted line-through">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.discount && (
                <span className="text-xs font-sans text-mb-accent-deep font-semibold">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider mb-2">
                <span className="text-mb-primary font-medium">Standard Length &amp; Fit</span>
                <span className="text-[10px] text-mb-muted italic">Abaya Length Guide</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-2 text-[11px] font-sans border text-center transition-colors ${
                      selectedSize === s
                        ? "border-mb-primary bg-mb-primary text-mb-bg font-medium"
                        : "border-mb-border bg-mb-bg text-mb-body hover:border-mb-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-sans uppercase tracking-wider text-mb-primary font-medium">
                Quantity:
              </span>
              <div className="flex items-center border border-mb-border bg-mb-surface">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1 text-sm font-sans text-mb-primary hover:bg-mb-border transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-1 text-xs font-sans font-semibold text-mb-primary">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1 text-sm font-sans text-mb-primary hover:bg-mb-border transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-mb-border-lite">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added}
                className="luxury-btn-primary flex-1 py-3 px-4 text-center text-xs tracking-editorial"
              >
                {added ? "Added to Bag ✓" : `Add to Bag • ₹${(product.price * qty).toLocaleString("en-IN")}`}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist toggle"
                className={`p-3 border border-mb-border transition-colors ${
                  wishlisted
                    ? "bg-mb-primary text-mb-bg border-mb-primary"
                    : "bg-mb-bg text-mb-primary hover:border-mb-primary"
                }`}
              >
                <HeartIcon filled={wishlisted} />
              </button>
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={onClose}
              className="block text-center text-[11px] font-sans uppercase tracking-widest text-mb-muted hover:text-mb-primary pt-1"
            >
              View Full Silhouette &amp; Fabric Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
