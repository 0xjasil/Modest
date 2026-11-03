import React from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import BrandLogo from "@/components/BrandLogo";

export default function Cart() {
  const { items, updateQty, removeItem, total, itemCount } = useCart();

  const savings = items.reduce(
    (s, i) =>
      s + ((i.product.originalPrice ?? i.product.price) - i.product.price) * i.qty,
    0
  );

  return (
    <>
      <Head>
        <title>Shopping Bag | Modest Studio Kochi</title>
        <meta name="description" content="Review your selected modest fashion pieces at Modest Studio Kochi." />
      </Head>
      <Header />
      <main id="main-content" className="min-h-screen bg-mb-bg py-8 sm:py-12 border-b border-mb-border">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs font-sans text-mb-muted uppercase tracking-editorial" role="list">
              <li>
                <Link href="/" className="hover:text-mb-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li className="text-mb-primary font-semibold" aria-current="page">
                Shopping Bag
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-mb-primary mb-8 tracking-tight">
            Shopping Bag ({itemCount} {itemCount === 1 ? "silhouette" : "silhouettes"})
          </h1>

          {items.length === 0 ? (
            /* ── Empty state with Atelier Emblem ───────────────── */
            <div className="bg-mb-surface border border-mb-border p-12 sm:p-16 text-center max-w-lg mx-auto my-8">
              <div className="flex justify-center mb-5">
                <BrandLogo variant="emblem" className="w-16 h-16 opacity-80" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-mb-primary mb-3">Your Bag is Empty</h2>
              <p className="font-body text-xs sm:text-sm text-mb-body mb-8 max-w-xs mx-auto">
                Explore our signature abayas, flowing kimonos, and tailored modest ensembles.
              </p>
              <Link
                href="/category/all"
                className="luxury-btn-primary inline-block px-8 py-3.5 text-xs tracking-editorial"
              >
                Explore Curations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">

              {/* ── Cart items ──────────────────────────────── */}
              <div className="flex flex-col gap-4" aria-label="Cart items">
                {items.map(({ product, qty }) => (
                  <article
                    key={product.id}
                    className="bg-mb-bg border border-mb-border p-4 sm:p-6 flex gap-4 sm:gap-6 hover:border-mb-primary transition-colors"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-shrink-0"
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        width={100}
                        height={120}
                        loading="lazy"
                        className="h-28 w-24 sm:h-32 sm:w-28 object-cover bg-mb-surface border border-mb-border"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <p className="text-[10px] font-sans font-semibold uppercase tracking-editorial text-mb-muted mb-1">
                          {product.brand === "Moryelle" ? "Modest Studio" : product.brand}
                        </p>
                        <h2 className="font-serif text-base sm:text-lg font-medium text-mb-primary line-clamp-1">
                          <Link href={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h2>
                        <div className="flex items-baseline gap-2.5 mt-2">
                          <span className="font-sans text-sm font-semibold text-mb-primary">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="font-sans text-xs text-mb-muted line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                          {product.discount && (
                            <span className="text-[11px] font-sans uppercase tracking-wider text-mb-accent-deep font-semibold">
                              Save {product.discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-mb-border-lite">
                        {/* Quantity Counter */}
                        <div
                          className="flex items-center border border-mb-border bg-mb-surface"
                          role="group"
                          aria-label={`Quantity for ${product.name}`}
                        >
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            onClick={() => updateQty(product.id, -1)}
                            className="px-3 py-1 text-sm font-sans font-medium text-mb-primary hover:bg-mb-border transition-colors"
                          >
                            −
                          </button>
                          <span className="px-3.5 py-1 text-xs font-sans font-semibold text-mb-primary min-w-[32px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            onClick={() => updateQty(product.id, 1)}
                            className="px-3 py-1 text-sm font-sans font-medium text-mb-primary hover:bg-mb-border transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${product.name} from bag`}
                          onClick={() => removeItem(product.id)}
                          className="text-[11px] font-sans uppercase tracking-wider text-mb-accent-deep hover:text-mb-primary transition-colors"
                        >
                          Remove Piece
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── Order summary ────────────────────────────── */}
              <aside aria-label="Order summary">
                <div className="bg-mb-surface border border-mb-border p-6 sticky top-[120px]">
                  <h2 className="font-serif text-xl font-normal text-mb-primary mb-4 pb-3 border-b border-mb-border">
                    Atelier Summary
                  </h2>

                  <dl className="flex flex-col gap-3 font-body text-xs text-mb-body">
                    <div className="flex justify-between">
                      <dt>Subtotal Value</dt>
                      <dd className="font-medium text-mb-primary">₹{(total + savings).toLocaleString("en-IN")}</dd>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-mb-accent-deep font-semibold">
                        <dt>Privilege Savings</dt>
                        <dd>−₹{savings.toLocaleString("en-IN")}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt>Pan-India Express Shipping</dt>
                      <dd className="text-mb-success font-semibold">Complimentary</dd>
                    </div>
                    <div className="flex justify-between font-sans text-base font-semibold text-mb-primary pt-4 border-t border-mb-border">
                      <dt>Total Payable</dt>
                      <dd>₹{total.toLocaleString("en-IN")}</dd>
                    </div>
                  </dl>

                  {savings > 0 && (
                    <p className="mt-4 text-[11px] font-body text-mb-accent-deep bg-mb-bg border border-mb-border px-3 py-2">
                      You are saving ₹{savings.toLocaleString("en-IN")} on this curated order
                    </p>
                  )}

                  <Link
                    href="/checkout"
                    className="mt-6 block w-full text-center luxury-btn-primary py-4 text-xs tracking-editorial"
                    aria-label="Proceed to checkout"
                  >
                    Proceed to Checkout →
                  </Link>

                  <div className="mt-5 pt-4 border-t border-mb-border-lite text-center space-y-1 text-[11px] font-body text-mb-muted">
                    <p>✓ Hand-packaged at Kochi atelier</p>
                    <p>✓ 7-Day seamless size &amp; length exchange</p>
                  </div>
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
