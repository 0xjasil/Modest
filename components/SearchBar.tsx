'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSearch } from '@/context/SearchContext';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

export default function SearchBar({
  placeholder = 'Search abayas, co-ords, scarves...',
  onSearch,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const { getSuggestions, suggestions, clearSuggestions, setFilter } = useSearch();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && showSuggestions) {
        getSuggestions(query);
        setIsOpen(true);
      } else {
        clearSuggestions();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, getSuggestions, clearSuggestions, showSuggestions]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setFilter({ query: searchQuery, page: 1 });
    onSearch?.(searchQuery);

    if (router.pathname !== '/search') {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }

    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-12 border border-mb-border bg-mb-bg text-mb-primary placeholder-mb-placeholder text-xs font-body focus:border-mb-primary focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mb-primary hover:text-mb-accent-deep transition-colors"
            aria-label="Submit search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7.5" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-mb-bg border border-mb-border shadow-dropdown z-50">
          <div className="p-2 divide-y divide-mb-border-lite">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-mb-surface text-xs font-sans text-mb-body hover:text-mb-primary transition-colors flex items-center justify-between"
              >
                <span>{suggestion}</span>
                <span className="text-[10px] text-mb-muted uppercase tracking-wider">Search →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
