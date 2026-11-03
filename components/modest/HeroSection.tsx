import React from "react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-mb-bg border-b border-mb-border overflow-hidden" aria-label="Hero Campaign">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[640px] lg:min-h-[720px]">
          
          {/* ── Left Editorial Brand Statement (5 cols on lg) ───── */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10">
            {/* Top Eyebrow Tag */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-mb-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
                Atelier Edition • Kochi, India
              </span>
            </div>

            {/* Core Brand Headline & Statement */}
            <div className="my-8 lg:my-0 max-w-lg">
              <span className="font-serif italic text-base sm:text-lg text-mb-accent-deep block mb-2">
                Modest Studio
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-mb-primary font-normal tracking-tight leading-[1.08] mb-6">
                Elegance in <br className="hidden sm:inline" />
                <span className="italic font-light">Every Layer.</span>
              </h1>
              <p className="font-body text-sm sm:text-base text-mb-body leading-relaxed mb-8 max-w-md">
                Discover thoughtfully curated modest fashion designed for effortless everyday elegance. 
                Sculpted in breathable premium crepes, natural linens, and flowing modest silhouettes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/category/all"
                  className="luxury-btn-primary px-8 py-4 text-center text-xs tracking-editorial shadow-sm"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/category/all?sort=newest"
                  className="luxury-btn-secondary px-8 py-4 text-center text-xs tracking-editorial"
                >
                  New Arrivals
                </Link>
              </div>
            </div>

            {/* Bottom Atelier Micro-Features */}
            <div className="pt-6 border-t border-mb-border-lite flex items-center justify-between text-[11px] font-sans uppercase tracking-wider text-mb-muted">
              <span>Bespoke Fitting</span>
              <span>•</span>
              <span>100% Breathable</span>
              <span>•</span>
              <span>Handcrafted in India</span>
            </div>
          </div>

          {/* ── Right Editorial Fashion Campaign Imagery (7 cols on lg) ── */}
          <div className="lg:col-span-7 relative bg-mb-surface overflow-hidden min-h-[380px] lg:min-h-full">
            {/* Primary Fashion Imagery */}
            <img
              src="/categories/luxe.jpg"
              alt="Modest Studio Kochi — Contemporary Modest Fashion Campaign"
              className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-1000 ease-out hover:scale-[1.02]"
            />

            {/* Subtle Gradient Shadow & Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-mb-primary/40 via-transparent to-transparent pointer-events-none" />

            {/* Campaign Floating Card */}
            <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-mb-bg/95 backdrop-blur-md p-5 border border-mb-border max-w-xs shadow-dropdown hidden sm:block animate-fadeIn">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-mb-muted font-medium mb-1">
                The Signature Abaya
              </p>
              <p className="font-serif text-lg text-mb-primary font-medium leading-snug mb-2">
                Noir Flare &amp; Draped Batwing
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-mb-border-lite">
                <span className="font-sans text-xs font-semibold text-mb-primary">₹3,490</span>
                <Link
                  href="/category/fashion"
                  className="font-sans text-[11px] uppercase tracking-wider text-mb-accent-deep hover:underline font-medium"
                >
                  Explore →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
