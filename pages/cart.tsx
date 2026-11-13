import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import BrandLogo from "@/components/BrandLogo";
import { getShippingFee, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import InfoNote from "@/components/InfoNote";

export default function Cart() {
  const { items, updateQty, removeItem, total, itemCount, isLoading } = useCart();

  // Only count genuine markdowns (never surface a negative "saving")
  const savings = items.reduce(
    (s, i) =>
      s +
      Math.max(0, (i.product.originalPrice ?? i.product.price) - i.product.price) * i.qty,
    0
  );

  // Same rule the backend uses when the order is placed, so the bag never
  // promises "free shipping" that checkout then charges for.
  const shippingFee = getShippingFee(total);
  const grandTotal = total + shippingFee;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD + 1 - Math.floor(total));

  return (
    <>
      <Head>
        <title>Shopping Bag | Modest Studio</title>
      </Head>
      <Header />
      <main id="main-content" className="min-h-screen bg-mb-bg py-8">
        <div className="mx-auto max-w-content px-4 md:px-6">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-xs text-mb-muted" role="list">
              <li role="listitem">
                <Link href="/" className="hover:text-mb-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mb-accent rounded">
                  Home
                </Link>
              </li>
              <li role="listitem" aria-hidden="true" className="text-mb-dusty">/</li>
              <li role="listitem" className="text-mb-text font-semibold" aria-current="page">
                Shopping Bag
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text mb-6">
            Shopping Bag ({itemCount} {itemCount === 1 ? "creation" : "creations"})
          </h1>

          {isLoading && items.length === 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]" aria-busy="true" aria-label="Loading your bag">
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-mb-surface rounded-[6px] border border-mb-border shadow-card p-4 sm:p-5 flex gap-4 animate-pulse">
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-[8px] bg-mb-border/40" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 w-24 bg-mb-border/40 rounded" />
                      <div className="h-4 w-2/3 bg-mb-border/40 rounded" />
                      <div className="h-4 w-20 bg-mb-border/40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-mb-surface rounded-[6px] border border-mb-border shadow-card p-6 h-64 animate-pulse" />
            </div>
          ) : items.length === 0 ? (
            /* ── Empty state with Emblem Only ───────────────── */
            <div className="bg-mb-surface rounded-[6px] md:rounded-[8px] border border-mb-border shadow-card p-12 text-center max-w-md mx-auto my-8">
              <div className="flex justify-center mb-4">
                <BrandLogo variant="emblem" className="w-16 h-16 opacity-80" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-mb-text mb-2">Your Bag is Empty</h2>
              <p className="text-xs sm:text-sm text-mb-body mb-6">
                Discover exceptional handcrafted luxury abayas, modest wear, and signature stoles.
              </p>
              <Link
                href="/"
                className="inline-block bg-mb-primary hover:bg-mb-primary-hover text-mb-bg text-sm font-semibold px-8 py-3 rounded-[10px] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent"
              >
                Explore Curations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

              {/* ── Cart items ──────────────────────────────── */}
              <div className="flex flex-col gap-4" aria-label="Cart items">
                {items.map(({ product, qty }) => (
                  <article
                    key={product.id}
                    className="bg-mb-surface rounded-[4px] sm:rounded-[6px] border border-mb-border shadow-card p-4 sm:p-5 flex gap-4 sm:gap-5"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent rounded-[8px]"
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.image}
                        alt={`${product.name} — Luxury Modest Abaya`}
                        width={100}
                        height={100}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes("/abaya/products/abaya-1.jpg")) {
                            target.src = "/abaya/products/abaya-1.jpg";
                          }
                        }}
                        className="h-24 w-24 sm:h-28 sm:w-28 object-contain rounded-[8px] bg-mb-bg p-2 border border-mb-border-lite"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-mb-muted mb-1">
                          {product.brand}
                        </p>
                        <h2 className="font-serif text-sm sm:text-base font-semibold text-mb-text line-clamp-2 leading-snug">
                          {product.name}
                        </h2>
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-base font-bold text-mb-text">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-mb-muted line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {product.discount && (
                            <span className="text-xs font-bold text-mb-accent-deep">
                              {product.discount}% Off
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        {/* Quantity */}
                        <div
                          className="flex items-center border border-mb-border bg-mb-bg rounded-[8px] overflow-hidden"
                          role="group"
                          aria-label={`Quantity for ${product.name}`}
                        >
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() => updateQty(product.id, -1)}
                            className="px-3 py-1 text-sm font-bold text-mb-text hover:bg-mb-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mb-accent"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold text-mb-text border-x border-mb-border min-w-[32px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            onClick={() => updateQty(product.id, 1)}
                            className="px-3 py-1 text-sm font-bold text-mb-text hover:bg-mb-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mb-accent"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${product.name} from bag`}
                          onClick={() => removeItem(product.id)}
                          className="text-xs font-semibold text-mb-accent-deep hover:text-mb-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mb-accent rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── Order summary ────────────────────────────── */}
              <aside aria-label="Order summary">
                <div className="bg-mb-surface rounded-[6px] md:rounded-[8px] border border-mb-border shadow-card p-6 sticky top-[130px]">
                  <h2 className="font-serif text-lg font-semibold text-mb-text mb-4 pb-3 border-b border-mb-border-lite">
                    Order Summary
                  </h2>

                  <dl className="flex flex-col gap-3 text-sm text-mb-body">
                    <div className="flex justify-between">
                      <dt>Total MRP</dt>
                      <dd className="font-medium text-mb-text">₹{(total + savings).toLocaleString()}</dd>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-mb-success font-semibold">
                        <dt>Privilege Savings</dt>
                        <dd>−₹{savings.toLocaleString()}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd className={shippingFee === 0 ? "text-mb-success font-semibold" : "font-medium text-mb-text"}>
                        {shippingFee === 0 ? "Complimentary" : `₹${shippingFee.toLocaleString("en-IN")}`}
                      </dd>
                    </div>
                    <div className="flex justify-between text-base font-bold text-mb-text pt-3 border-t border-mb-border-lite">
                      <dt>Total</dt>
                      <dd className="text-mb-primary font-bold">₹{grandTotal.toLocaleString("en-IN")}</dd>
                    </div>
                  </dl>

                  {shippingFee > 0 && amountToFreeShipping > 0 && (
                    <InfoNote icon="lucide:truck" className="mt-4">
                      Add{" "}
                      <span className="font-semibold">
                        ₹{amountToFreeShipping.toLocaleString("en-IN")}
                      </span>{" "}
                      more for complimentary shipping (orders above ₹
                      {FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}).
                    </InfoNote>
                  )}

                  {savings > 0 && (
                    <p className="mt-4 text-xs text-mb-success font-semibold bg-mb-bg border border-mb-border-lite rounded-[8px] px-3 py-2">
                      You are enjoying ₹{savings.toLocaleString()} in savings on this order
                    </p>
                  )}

                  <Link
                    href="/checkout"
                    className="mt-6 block w-full text-center bg-mb-primary hover:bg-mb-primary-hover text-mb-bg text-sm font-semibold py-3.5 rounded-[10px] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-mb-accent"
                    aria-label="Proceed to checkout"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="mt-4 text-[11px] text-mb-muted text-center">
                    Complimentary Returns · Guaranteed Authentic
                  </p>
                </div>
              </aside>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
