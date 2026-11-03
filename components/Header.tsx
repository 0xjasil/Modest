import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/components/ProductGrid";
import BrandLogo from "@/components/BrandLogo";

/* ── Minimal Editorial Icons ───────────────────────────────────── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7.5" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
);

const UserIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BagIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ChevronDown = ({ open = false }: { open?: boolean }) => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Navigation Configuration ──────────────────────────────────── */
const SHOP_CATEGORIES = [
  { name: "All Modest Wear", href: "/category/all", desc: "Complete contemporary collection" },
  { name: "Abayas & Kaftans", href: "/category/fashion", desc: "Signature silhouettes & drape" },
  { name: "Kimonos & Outerwear", href: "/category/luxe", desc: "Layered elegance & fine linen" },
  { name: "Hijabs & Scarves", href: "/category/makeup", desc: "Modal, silk & chiffon wraps" },
  { name: "Co-ord Sets", href: "/category/skincare", desc: "Effortless tailored ensembles" },
  { name: "Luxury Accessories", href: "/category/fragrance", desc: "Belts, pins & evening accents" },
];

const COLLECTIONS = [
  { name: "Signature Abaya Edit", href: "/category/fashion", desc: "Crafted in breathable premium crepes" },
  { name: "Everyday Modest Luxe", href: "/category/all", desc: "Understated silhouettes for daily grace" },
  { name: "Occasion & Festive", href: "/category/luxe", desc: "Intricate hand embroidery and metallics" },
  { name: "Kochi Studio Exclusives", href: "/category/offers", desc: "Limited edition atelier pieces" },
];

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const navTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sticky header transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    setAccountMenuOpen(false);
  }, [router.asPath]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setSearchOpen(false);
        setAccountMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered search recommendations
  const searchResults = useMemo(() => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchVal]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearchOpen(false);
    router.push(`/category/all?q=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleMouseEnter = (menu: string) => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    navTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  return (
    <>
      {/* ── 1. Announcement Bar ──────────────────────────────────── */}
      <div className="bg-mb-primary text-mb-bg border-b border-mb-primary-hover text-[11px] font-sans tracking-editorial py-2 px-4 transition-colors">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between text-center sm:text-left">
          <p className="w-full sm:w-auto uppercase font-medium">
            Complimentary shipping across India on orders above ₹2,500 • Modest Studio Kochi
          </p>
          <div className="hidden sm:flex items-center gap-6 text-[10px] tracking-widest uppercase opacity-80">
            <Link href="/orders" className="hover:text-mb-gold transition-colors">Track Order</Link>
            <span className="opacity-30">|</span>
            <a href="https://www.instagram.com/modest_studio_kochi/" target="_blank" rel="noopener noreferrer" className="hover:text-mb-gold transition-colors">
              @modest_studio_kochi
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. Main Sticky Navigation Bar ────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-mb-bg/95 backdrop-blur-md transition-all duration-300 border-b ${
          scrolled ? "border-mb-border shadow-xs py-2.5" : "border-mb-border-lite py-3.5"
        }`}
        role="banner"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none"
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </button>
          </div>

          {/* Brand Logo & Wordmark */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              aria-label="Modest Studio Kochi — Home"
              className="flex items-center gap-3 focus:outline-none focus:ring-1 focus:ring-mb-accent"
            >
              <BrandLogo variant="secondary" className="h-8 sm:h-9 md:h-10 w-auto min-w-[120px] max-w-[190px]" />
              <div className="hidden xl:flex flex-col border-l border-mb-border pl-3 text-left">
                <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-mb-muted leading-tight">
                  Kochi Atelier
                </span>
                <span className="font-serif italic text-xs text-mb-accent-deep leading-tight">
                  Modern Modest Wear
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-sans text-xs tracking-editorial uppercase font-medium text-mb-primary" aria-label="Main Navigation">
            
            {/* Shop Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("shop")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 hover:text-mb-accent transition-colors focus:outline-none"
                aria-expanded={activeDropdown === "shop"}
              >
                <span>Shop</span>
                <ChevronDown open={activeDropdown === "shop"} />
              </button>

              {activeDropdown === "shop" && (
                <div
                  className="absolute top-full left-0 w-[420px] bg-mb-bg border border-mb-border shadow-dropdown p-5 grid grid-cols-2 gap-4 animate-fadeIn"
                  role="menu"
                >
                  {SHOP_CATEGORIES.map(cat => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="group block p-2 hover:bg-mb-surface transition-colors"
                      role="menuitem"
                    >
                      <span className="block font-sans text-xs font-semibold text-mb-primary group-hover:text-mb-accent-deep tracking-wider uppercase transition-colors">
                        {cat.name}
                      </span>
                      <span className="block font-body text-[11px] text-mb-muted normal-case mt-0.5">
                        {cat.desc}
                      </span>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-3 border-t border-mb-border-lite flex items-center justify-between text-[11px] normal-case text-mb-muted">
                    <span className="font-serif italic text-mb-primary">Bespoke sizing available upon request</span>
                    <Link href="/category/all" className="font-sans text-[10px] uppercase font-semibold text-mb-accent-deep hover:underline tracking-widest">
                      View Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* New Arrivals */}
            <Link
              href="/category/all?sort=newest"
              className="hover:text-mb-accent transition-colors py-2"
            >
              New Arrivals
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("collections")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 hover:text-mb-accent transition-colors focus:outline-none"
                aria-expanded={activeDropdown === "collections"}
              >
                <span>Collections</span>
                <ChevronDown open={activeDropdown === "collections"} />
              </button>

              {activeDropdown === "collections" && (
                <div
                  className="absolute top-full left-0 w-[380px] bg-mb-bg border border-mb-border shadow-dropdown p-5 space-y-3 animate-fadeIn"
                  role="menu"
                >
                  {COLLECTIONS.map(col => (
                    <Link
                      key={col.name}
                      href={col.href}
                      className="group block p-2 hover:bg-mb-surface transition-colors"
                      role="menuitem"
                    >
                      <span className="block font-sans text-xs font-semibold text-mb-primary group-hover:text-mb-accent-deep tracking-wider uppercase transition-colors">
                        {col.name}
                      </span>
                      <span className="block font-body text-[11px] text-mb-muted normal-case mt-0.5">
                        {col.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <Link
              href="/#brand-story"
              className="hover:text-mb-accent transition-colors py-2"
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 text-mb-primary">
            
            {/* Search Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-2 text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none"
                aria-label="Search modest fashion"
              >
                <SearchIcon />
              </button>

              {/* Minimal Expandable Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[400px] bg-mb-bg border border-mb-border shadow-dropdown p-4 z-50 animate-fadeIn">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-mb-primary pb-2">
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchVal}
                      onChange={e => setSearchVal(e.target.value)}
                      placeholder="Search abayas, co-ords, scarves..."
                      className="w-full bg-transparent font-body text-xs text-mb-primary placeholder-mb-placeholder outline-none pr-8"
                    />
                    <button type="submit" className="text-mb-primary hover:text-mb-accent-deep" aria-label="Submit search">
                      <SearchIcon />
                    </button>
                  </form>

                  {searchResults.length > 0 && (
                    <div className="mt-3 divide-y divide-mb-border-lite max-h-64 overflow-y-auto">
                      {searchResults.map(p => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 py-2.5 px-1 hover:bg-mb-surface transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-9 h-11 object-cover bg-mb-surface border border-mb-border" />
                          <div className="min-w-0 flex-1">
                            <p className="font-sans text-xs font-medium text-mb-primary truncate">{p.name}</p>
                            <p className="font-body text-[11px] text-mb-muted">₹{p.price.toLocaleString("en-IN")}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchVal && searchResults.length === 0 && (
                    <p className="text-xs text-mb-muted mt-3 py-2 text-center">No styles matching &ldquo;{searchVal}&rdquo;</p>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-mb-accent text-mb-bg text-[9px] font-sans font-bold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Authentication */}
            <div className="relative" ref={accountRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="p-2 text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none flex items-center gap-1.5"
                    aria-label="User Account"
                  >
                    <UserIcon />
                    <span className="hidden sm:inline font-sans text-xs font-medium uppercase tracking-wider">
                      {user?.firstName || "Account"}
                    </span>
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-mb-bg border border-mb-border shadow-dropdown py-2 z-50 text-xs font-sans">
                      <div className="px-4 py-2 border-b border-mb-border-lite text-mb-muted text-[11px]">
                        Signed in as <strong className="text-mb-primary block truncate">{user?.email}</strong>
                      </div>
                      <Link href="/orders" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-mb-surface text-mb-primary">
                        Orders & Returns
                      </Link>
                      <Link href="/addresses" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-mb-surface text-mb-primary">
                        Saved Addresses
                      </Link>
                      <Link href="/wallet" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-mb-surface text-mb-primary">
                        Modest Credits
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setAccountMenuOpen(false); logout(); router.push("/"); }}
                        className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50/50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none flex items-center gap-1.5"
                  aria-label="Sign in"
                >
                  <UserIcon />
                  <span className="hidden md:inline font-sans text-xs font-medium uppercase tracking-wider">
                    Sign In
                  </span>
                </Link>
              )}
            </div>

            {/* Shopping Bag */}
            <Link
              href="/cart"
              className="relative p-2 text-mb-primary hover:text-mb-accent-deep transition-colors focus:outline-none"
              aria-label={`Shopping bag (${itemCount} items)`}
            >
              <BagIcon />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-mb-primary text-mb-bg text-[9px] font-sans font-bold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </header>

      {/* ── 3. Mobile Navigation Drawer ─────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-mb-bg h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-10 border-r border-mb-border">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-mb-border">
                <BrandLogo variant="secondary" className="h-7 w-auto" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-mb-primary hover:text-mb-accent-deep"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-5 font-sans uppercase tracking-editorial text-xs font-medium text-mb-primary">
                <div>
                  <Link
                    href="/category/all"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-semibold hover:text-mb-accent"
                  >
                    Shop All Modest Wear
                  </Link>
                  <div className="pl-3 mt-2 space-y-2 normal-case text-xs text-mb-muted font-body">
                    <Link href="/category/fashion" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-mb-primary">
                      Signature Abayas & Kaftans
                    </Link>
                    <Link href="/category/luxe" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-mb-primary">
                      Kimonos & Co-ords
                    </Link>
                    <Link href="/category/makeup" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-mb-primary">
                      Hijabs & Fine Scarves
                    </Link>
                    <Link href="/category/fragrance" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-mb-primary">
                      Curated Accessories
                    </Link>
                  </div>
                </div>

                <Link
                  href="/category/all?sort=newest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold hover:text-mb-accent border-t border-mb-border-lite pt-4"
                >
                  New Arrivals
                </Link>

                <Link
                  href="/#brand-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold hover:text-mb-accent border-t border-mb-border-lite pt-4"
                >
                  About Modest Studio
                </Link>

                <a
                  href="https://www.instagram.com/modest_studio_kochi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-xs text-mb-accent-deep font-semibold hover:underline"
                >
                  Follow on Instagram (@modest_studio_kochi) ↗
                </a>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-mb-border space-y-3 font-sans text-xs">
              {isAuthenticated ? (
                <>
                  <p className="text-[11px] text-mb-muted truncate">Logged in as {user?.email}</p>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-mb-primary">
                    Orders & Tracking
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); logout(); router.push("/"); }}
                    className="block py-1.5 text-red-700 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="luxury-btn-primary block w-full py-2.5 text-center text-xs"
                >
                  Sign In / Create Account
                </Link>
              )}
              <p className="text-[10px] text-mb-muted text-center pt-2">
                Kochi, Kerala • Worldwide Shipping
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
