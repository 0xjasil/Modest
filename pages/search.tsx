import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSearch } from '@/context/SearchContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SearchFilters from '@/components/SearchFilters';
import SearchBar from '@/components/SearchBar';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const { results, total, filters, search, setFilter, isLoading, error } = useSearch();
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('relevance');

  useEffect(() => {
    if (q) {
      search({
        query: q as string,
        sortBy,
        page: 1,
        limit: 20,
      });
    }
  }, [q, sortBy, search]);

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort);
    setFilter({ sortBy: newSort, page: 1 });
  };

  const handleFiltersApply = () => {
    search({
      ...filters,
      sortBy,
    });
  };

  return (
    <>
      <Head>
        <title>Search {q ? `"${q}"` : "Collection"} | Modest Studio Kochi</title>
        <meta name="description" content="Search contemporary modest fashion, abayas, and co-ords at Modest Studio Kochi." />
      </Head>

      <Header />
      <main id="main-content" className="min-h-screen bg-mb-bg py-8 sm:py-12 border-b border-mb-border">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar Strip */}
          <div className="max-w-xl mx-auto mb-10">
            <SearchBar showSuggestions={true} />
          </div>

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
                Search Results {q && `for "${q}"`}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar: Filters */}
            <div className="lg:col-span-1">
              <SearchFilters onFiltersChange={handleFiltersApply} />
            </div>

            {/* Main: Results */}
            <div className="lg:col-span-3">
              {/* Header with Sort */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mb-border mb-6 gap-3">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-mb-primary">
                  Search Results
                  {total > 0 && <span className="font-sans text-xs font-normal text-mb-muted ml-2">({total} items)</span>}
                </h1>

                <div className="flex items-center gap-2 text-xs font-sans">
                  <label htmlFor="search-sort" className="uppercase tracking-wider text-mb-muted text-[11px]">Sort by:</label>
                  <select
                    id="search-sort"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="px-3 py-1.5 border border-mb-border bg-mb-surface text-mb-primary text-xs outline-none focus:border-mb-primary font-medium"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="mb-6 p-4 bg-red-50/80 border border-red-200">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="py-16 text-center text-xs font-sans uppercase tracking-widest text-mb-muted">
                  Curating silhouettes...
                </div>
              )}

              {/* Empty State */}
              {!isLoading && results.length === 0 && (
                <div className="bg-mb-surface border border-mb-border p-12 text-center">
                  <h3 className="font-serif text-2xl text-mb-primary mb-2 font-normal">No pieces found</h3>
                  <p className="text-xs font-body text-mb-muted mb-6">
                    {q ? `No creations matched "${q}". Try searching for abaya, kimono, linen, or wrap.` : 'Enter a search term above.'}
                  </p>
                  <Link
                    href="/category/all"
                    className="luxury-btn-primary inline-block px-8 py-3 text-xs tracking-editorial"
                  >
                    Explore Complete Catalog
                  </Link>
                </div>
              )}

              {/* Product Grid */}
              {!isLoading && results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
