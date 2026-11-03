import React from "react";
import Link from "next/link";

export default function EditorialCampaign() {
  return (
    <section className="bg-mb-surface py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-label="Editorial Campaign">
      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ── Left Editorial Photography Block (7 cols) ────── */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6 relative">
            <div className="space-y-4 sm:space-y-6">
              <div className="aspect-[3/4] bg-mb-bg border border-mb-border overflow-hidden shadow-card">
                <img
                  src="/hero/card-3.jpg"
                  alt="Modest Studio Editorial Campaign Detail 1"
                  className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4 bg-mb-bg border border-mb-border hidden sm:block">
                <p className="font-sans text-[10px] uppercase tracking-editorial text-mb-muted font-medium mb-1">
                  Textile Focus
                </p>
                <p className="font-serif italic text-sm text-mb-primary">
                  100% Breathable Japanese Crêpe &amp; Washed Linen
                </p>
              </div>
            </div>

            <div className="pt-8 sm:pt-12 space-y-4 sm:space-y-6">
              <div className="p-4 bg-mb-primary text-mb-bg hidden sm:block">
                <span className="font-serif text-2xl text-mb-gold font-normal block mb-1">
                  01
                </span>
                <p className="font-sans text-[11px] uppercase tracking-wider text-mb-bg/90">
                  Draped for graceful movement without excess bulk.
                </p>
              </div>
              <div className="aspect-[3/4] bg-mb-bg border border-mb-border overflow-hidden shadow-card">
                <img
                  src="/hero/card-2.jpg"
                  alt="Modest Studio Editorial Campaign Detail 2"
                  className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* ── Right Editorial Text & Call to Action (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-mb-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
                Editorial Campaign • Kochi Atelier
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight leading-[1.15] mb-6">
              Rooted in Grace. <br />
              <span className="italic font-light">Crafted for Now.</span>
            </h2>

            <p className="font-body text-sm sm:text-base text-mb-body leading-relaxed mb-6">
              Conceived in the coastal air of Kochi, Kerala, our latest campaign explores the harmony between timeless modesty and modern architectural drapery. 
            </p>
            <p className="font-body text-xs sm:text-sm text-mb-muted leading-relaxed mb-8">
              We reject fleeting trends in favour of enduring silhouettes that transition effortlessly from morning meetings to intimate evening gatherings. Every seam is finished by hand in our local workshop.
            </p>

            {/* Spec Highlights */}
            <div className="grid grid-cols-2 gap-4 py-5 border-y border-mb-border mb-8 text-xs font-sans">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-mb-muted block mb-1">Fabric Sourcing</span>
                <span className="text-mb-primary font-medium">Sustainable &amp; Temperature Regulating</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-mb-muted block mb-1">Silhouettes</span>
                <span className="text-mb-primary font-medium">Batwing, Kimono &amp; Relaxed Co-ord</span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/category/fashion"
                className="luxury-btn-primary inline-block px-9 py-4 text-xs tracking-editorial shadow-sm"
              >
                View Campaign Collection →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
