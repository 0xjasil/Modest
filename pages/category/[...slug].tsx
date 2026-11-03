import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductCard, { type Product } from "@/components/ProductCard";
import QuickViewModal from "@/components/modest/QuickViewModal";
import { products as fallbackProducts } from "@/components/ProductGrid";
import { productAPI, mapBackendProductToProduct } from "@/lib/api";

/* ── Modest Fashion Filter Categories ─────────────────────────── */
const FILTER_SECTIONS = [
  {
    title: "Fabric & Material",
    options: ["Japanese Nida", "Organic Linen", "Double Georgette", "Silk Touch Modal", "Crepe de Chine"],
  },
  {
    title: "Silhouette & Cut",
    options: ["Batwing Abaya", "Open Kimono Duster", "Relaxed Co-ord Set", "Pleated Flare", "Tailored Slip"],
  },
  {
    title: "Length & Sizing",
    options: ["Size 52 (5'1\" - 5'3\")", "Size 54 (5'3\" - 5'5\")", "Size 56 (5'5\" - 5'7\")", "Size 58 (5'7\"+)", "Bespoke Length"],
  },
  {
    title: "Colour Palette",
    options: ["Noir / Espresso", "Warm Ivory / Sand", "Muted Olive", "Earthy Taupe", "Subtle Rose"],
  },
  {
    title: "Occasion",
    options: ["Everyday Minimal", "Atelier Evening", "Festive & Occasion", "Travel & Resort"],
  },
];

const SORT_OPTIONS = [
  { value: "popularity",  label: "Atelier Curations" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
  { value: "rating",      label: "Client Rating" },
  { value: "discount",    label: "Seasonal Privilege" },
  { value: "newest",      label: "New Arrivals" },
];

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function FilterAccordion({ section }: { section: typeof FILTER_SECTIONS[0] }) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (opt: string) => {
    setSelected(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    );
  };

  return (
    <div className="border-b border-mb-border-lite py-3.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between text-xs font-sans font-semibold tracking-editorial uppercase text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none"
      >
        <span>{section.title}</span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="mt-3 space-y-2 text-xs font-body text-mb-body pl-1">
          {section.options.map(opt => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer hover:text-mb-primary">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="w-3.5 h-3.5 rounded-none border-mb-border text-mb-primary focus:ring-0 accent-mb-primary"
              />
              <span className="text-[12px]">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Category() {
  const router = useRouter();
  const { slug, q } = router.query;
  const [sortBy, setSortBy] = useState("popularity");
  const [catalogItems, setCatalogItems] = useState<Product[]>(fallbackProducts);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categorySlug = Array.isArray(slug) ? slug[0] : slug ?? "all";
  const searchQuery = typeof q === "string" ? q.trim().toLowerCase() : "";

  // Fetch live products from NestJS backend if available
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const res = await productAPI.getAll({
          category: categorySlug === "all" ? undefined : categorySlug,
          search: searchQuery || undefined,
          limit: 50,
        });
        if (isSubscribed && res && Array.isArray(res.items) && res.items.length > 0) {
          const mapped = res.items.map(mapBackendProductToProduct);
          setCatalogItems(mapped);
        }
      } catch {
        // Fallback to static data
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, [categorySlug, searchQuery]);

  const categoryDisplay = searchQuery
    ? `Results for "${q}"`
    : categorySlug === "all"
    ? "All Modest Wear"
    : categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const baseProducts = useMemo(() => {
    let list = catalogItems;
    if (searchQuery) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.brand.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
      );
      return list;
    }
    if (categorySlug === "all") return catalogItems;
    const matched = catalogItems.filter(p =>
      p.category.toLowerCase() === categorySlug.toLowerCase() ||
      p.brand.toLowerCase().replace(/\s+/g, "-").includes(categorySlug.toLowerCase())
    );
    return matched.length > 0 ? matched : catalogItems;
  }, [categorySlug, searchQuery, catalogItems]);

  const sorted = useMemo(() => {
    const arr = [...baseProducts];
    switch (sortBy) {
      case "price-asc":  return arr.sort((a, b) => a.price - b.price);
      case "price-desc": return arr.sort((a, b) => b.price - a.price);
      case "rating":     return arr.sort((a, b) => b.rating - a.rating);
      case "discount":   return arr.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
      default:           return arr;
    }
  }, [baseProducts, sortBy]);

  return (
    <>
      <Head>
        <title>{categoryDisplay} | Modest Studio Kochi</title>
        <meta
          name="description"
          content={`Browse our curated collection of ${categoryDisplay}. High quality contemporary modest fashion by Modest Studio Kochi.`}
        />
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
              <li>
                <Link href="/category/all" className="hover:text-mb-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true" className="text-mb-border">/</li>
              <li className="text-mb-primary font-semibold" aria-current="page">
                {categoryDisplay}
              </li>
            </ol>
          </nav>

          {/* Category Editorial Banner */}
          <div className="border-b border-mb-border pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-serif italic text-sm text-mb-accent-deep block mb-1">
                Kochi Atelier Collection
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-mb-primary tracking-tight">
                {categoryDisplay}
              </h1>
            </div>

            {/* Sort & Count Header */}
            <div className="flex items-center gap-4 text-xs font-sans">
              <span className="text-mb-muted">
                Showing {sorted.length} {sorted.length === 1 ? "silhouette" : "silhouettes"}
              </span>

              {/* Desktop Sort Dropdown */}
              <div className="hidden sm:flex items-center gap-2">
                <label htmlFor="sort-select" className="uppercase tracking-wider text-mb-muted text-[11px]">
                  Sort By:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-mb-surface border border-mb-border text-mb-primary py-1.5 px-3 text-xs outline-none focus:border-mb-primary font-medium"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Layout: Filters Sidebar + Products Grid */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-mb-surface/60 border border-mb-border p-5">
              <div className="flex items-center justify-between pb-3 border-b border-mb-border mb-2">
                <span className="font-sans text-xs uppercase tracking-editorial font-bold text-mb-primary">
                  Filter By
                </span>
                <span className="text-[10px] font-sans uppercase tracking-wider text-mb-muted">
                  Studio Standards
                </span>
              </div>

              {FILTER_SECTIONS.map(section => (
                <FilterAccordion key={section.title} section={section} />
              ))}

              <div className="pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => router.push("/category/all")}
                  className="w-full text-center text-xs font-sans uppercase tracking-wider py-2 border border-mb-border text-mb-muted hover:text-mb-primary hover:border-mb-primary transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Mobile Filter & Sort Bar */}
            <div className="w-full lg:hidden flex items-center justify-between bg-mb-surface border border-mb-border p-3 mb-2">
              <label htmlFor="mobile-sort-select" className="text-xs font-sans uppercase tracking-wider text-mb-muted">
                Sort:
              </label>
              <select
                id="mobile-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-mb-bg border border-mb-border text-mb-primary py-1 px-3 text-xs outline-none"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {sorted.length === 0 ? (
                <div className="bg-mb-surface border border-mb-border p-12 text-center">
                  <h3 className="font-serif text-2xl text-mb-primary mb-2 font-normal">No pieces found</h3>
                  <p className="font-body text-xs text-mb-muted mb-6">
                    We couldn&apos;t find any pieces matching &ldquo;{categoryDisplay}&rdquo;.
                  </p>
                  <Link href="/category/all" className="luxury-btn-primary px-8 py-3 text-xs">
                    Explore All Collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                  {sorted.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={p => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </main>

      <Footer />
    </>
  );
}
