import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-mb-primary border-t border-mb-primary-hover text-mb-bg" role="contentinfo">
      
      {/* ── Top Brand Statement & Socials ──────────────────────────── */}
      <div className="border-b border-mb-primary-hover/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Link href="/" aria-label="Modest Studio Kochi" className="inline-block">
              <BrandLogo variant="gold" className="h-12 sm:h-14 w-auto min-w-[120px] max-w-[200px]" />
            </Link>
            <div className="h-8 w-px bg-mb-gold/30 hidden md:block" />
            <div>
              <p className="font-serif italic text-base sm:text-lg text-mb-gold">
                Elegance in Every Layer
              </p>
              <p className="font-body text-xs text-mb-bg/80 mt-0.5">
                Kochi Atelier • Contemporary Modest Fashion &amp; Bespoke Abayas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans uppercase tracking-editorial">
            <span className="text-mb-gold/80 hidden sm:inline">Follow Our Journey</span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/modest_studio_kochi/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 border border-mb-gold/40 text-mb-gold hover:border-mb-gold hover:bg-mb-gold/10 transition-colors text-xs font-medium"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/?text=Hello%20Modest%20Studio%20Kochi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 border border-mb-gold/40 text-mb-gold hover:border-mb-gold hover:bg-mb-gold/10 transition-colors text-xs font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Columns ────────────────────────────────────── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Col 1: About Modest Studio */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <h3 className="font-serif text-lg text-mb-gold mb-3 font-medium">
              Modest Studio Kochi
            </h3>
            <p className="font-body text-xs text-mb-bg/80 leading-relaxed mb-4">
              Born in Kochi, Kerala, Modest Studio creates elevated modest attire designed for the modern woman. 
              Each silhouette is mindfully designed with premium breathable fabrics, graceful drape, and architectural 
              minimalism.
            </p>
            <div className="space-y-1.5 font-body text-xs text-mb-bg/70">
              <p><strong className="text-mb-gold">Studio Address:</strong> Marine Drive / Panampilly Nagar, Kochi, Kerala</p>
              <p><strong className="text-mb-gold">Concierge Desk:</strong> +91 98460 00000 • hello@modeststudio.in</p>
              <p><strong className="text-mb-gold">Hours:</strong> Monday – Saturday, 10:00 AM – 8:00 PM IST</p>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-editorial text-mb-gold font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-mb-bg/80">
              <li><Link href="/category/all" className="hover:text-mb-gold transition-colors">All Silhouettes</Link></li>
              <li><Link href="/category/fashion" className="hover:text-mb-gold transition-colors">Signature Abayas</Link></li>
              <li><Link href="/category/luxe" className="hover:text-mb-gold transition-colors">Kimonos &amp; Overcoats</Link></li>
              <li><Link href="/category/makeup" className="hover:text-mb-gold transition-colors">Modal &amp; Silk Hijabs</Link></li>
              <li><Link href="/category/skincare" className="hover:text-mb-gold transition-colors">Co-ord Sets</Link></li>
              <li><Link href="/category/all?sort=newest" className="hover:text-mb-gold transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Col 3: Client Care */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-editorial text-mb-gold font-semibold mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-mb-bg/80">
              <li><Link href="/orders" className="hover:text-mb-gold transition-colors">Track Your Order</Link></li>
              <li><Link href="/#brand-story" className="hover:text-mb-gold transition-colors">Bespoke Fitting &amp; Sizing</Link></li>
              <li><Link href="/category/offers" className="hover:text-mb-gold transition-colors">Studio Privileges</Link></li>
              <li><Link href="/addresses" className="hover:text-mb-gold transition-colors">Delivery &amp; Shipping</Link></li>
              <li><Link href="/wishlist" className="hover:text-mb-gold transition-colors">Saved Pieces</Link></li>
            </ul>
          </div>

          {/* Col 4: Assurance & Policies */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-editorial text-mb-gold font-semibold mb-4">
              Atelier Promise
            </h4>
            <ul className="space-y-2.5 font-body text-xs text-mb-bg/80">
              <li><span className="text-mb-gold/90">✓ Handcrafted in India</span></li>
              <li><span className="text-mb-gold/90">✓ Premium Linen, Silk &amp; Crepe</span></li>
              <li><span className="text-mb-gold/90">✓ Express Pan-India Delivery</span></li>
              <li><span className="text-mb-gold/90">✓ Seamless Exchanges</span></li>
            </ul>
            <div className="mt-5 pt-4 border-t border-mb-primary-hover/50">
              <span className="text-[11px] font-sans uppercase tracking-wider text-mb-gold block mb-2">Secure Payments</span>
              <p className="text-[11px] text-mb-bg/70 leading-relaxed">
                UPI • Razorpay • NetBanking • Credit/Debit Cards • Cash on Delivery
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom Strip ───────────────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-mb-primary-hover/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-mb-bg/60">
          <p>© {new Date().getFullYear()} Modest Studio Kochi. All rights reserved. Designed with contemporary grace.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/terms" className="hover:text-mb-gold transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-mb-gold transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-mb-gold transition-colors">Shipping &amp; Returns</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
