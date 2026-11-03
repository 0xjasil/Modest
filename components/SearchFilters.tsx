'use client';

import React, { useState } from 'react';
import { useSearch } from '@/context/SearchContext';

interface SearchFiltersProps {
  onFiltersChange?: () => void;
}

export default function SearchFiltersPanel({ onFiltersChange }: SearchFiltersProps) {
  const { filters, setFilter, facets, resetFilters } = useSearch();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    rating: true,
    brand: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setFilter({ minPrice: min, maxPrice: max, page: 1 });
    onFiltersChange?.();
  };

  const handleRatingChange = (rating: number) => {
    setFilter({
      minRating: filters.minRating === rating ? undefined : rating,
      page: 1,
    });
    onFiltersChange?.();
  };

  const handleBrandChange = (brand: string) => {
    setFilter({
      brand: filters.brand === brand ? undefined : brand,
      page: 1,
    });
    onFiltersChange?.();
  };

  const handleReset = () => {
    resetFilters();
    onFiltersChange?.();
  };

  const hasActiveFilters =
    filters.minPrice || filters.maxPrice || filters.minRating || filters.brand;

  return (
    <div className="bg-mb-surface border border-mb-border p-5">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-mb-border">
        <h3 className="font-sans text-xs uppercase tracking-editorial font-semibold text-mb-primary">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-[11px] font-sans uppercase tracking-wider text-mb-accent-deep hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-5 pb-5 border-b border-mb-border-lite">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full mb-3 text-xs font-sans uppercase tracking-editorial font-semibold text-mb-primary"
        >
          <span>Price Range</span>
          <span>{expandedSections.price ? '−' : '+'}</span>
        </button>

        {expandedSections.price && (
          <div className="space-y-2 font-body text-xs text-mb-body">
            {[
              { label: 'Under ₹1,500', min: 0, max: 1500 },
              { label: '₹1,500 - ₹3,000', min: 1500, max: 3000 },
              { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
              { label: 'Above ₹5,000', min: 5000, max: 999999 },
            ].map((range) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:text-mb-primary">
                <input
                  type="radio"
                  name="price"
                  checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="w-3.5 h-3.5 accent-mb-primary"
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-5 pb-5 border-b border-mb-border-lite">
        <button
          onClick={() => toggleSection('rating')}
          className="flex justify-between items-center w-full mb-3 text-xs font-sans uppercase tracking-editorial font-semibold text-mb-primary"
        >
          <span>Client Rating</span>
          <span>{expandedSections.rating ? '−' : '+'}</span>
        </button>

        {expandedSections.rating && (
          <div className="space-y-2">
            {facets.ratings.map((item) => (
              <label
                key={item.rating}
                className="flex items-center justify-between cursor-pointer font-body text-xs text-mb-body hover:text-mb-primary"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === item.rating}
                    onChange={() => handleRatingChange(item.rating)}
                    className="w-3.5 h-3.5 accent-mb-primary"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < item.rating ? 'text-mb-gold' : 'text-mb-border'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-[11px] text-mb-muted ml-1">&amp; above</span>
                  </div>
                </div>
                <span className="text-[11px] text-mb-muted">({item.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleSection('brand')}
          className="flex justify-between items-center w-full mb-3 text-xs font-sans uppercase tracking-editorial font-semibold text-mb-primary"
        >
          <span>Studio / Brand</span>
          <span>{expandedSections.brand ? '−' : '+'}</span>
        </button>

        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {facets.brands.map((brand) => (
              <label key={brand.name} className="flex items-center justify-between cursor-pointer font-body text-xs text-mb-body hover:text-mb-primary">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.brand === brand.name}
                    onChange={() => handleBrandChange(brand.name)}
                    className="w-3.5 h-3.5 accent-mb-primary"
                  />
                  <span>{brand.name}</span>
                </div>
                <span className="text-[11px] text-mb-muted">({brand.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
