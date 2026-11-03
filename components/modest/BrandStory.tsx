import React from "react";
import BrandLogo from "@/components/BrandLogo";

export default function BrandStory() {
  return (
    <section id="brand-story" className="bg-mb-bg py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-labelledby="story-heading">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-mb-accent" />
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-mb-muted font-medium">
              The Atelier Philosophy
            </span>
            <span className="w-8 h-px bg-mb-accent" />
          </div>
          <h2 id="story-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight mb-5">
            Designed for Quiet Confidence
          </h2>
          <p className="font-body text-sm sm:text-base text-mb-body leading-relaxed">
            Modest Studio was established in Kochi to redefine contemporary modest dressing. 
            We design for women who seek both spiritual grace and effortless international elegance.
          </p>
        </div>

        {/* 3 Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16 sm:mb-20">
          
          <div className="p-8 bg-mb-surface border border-mb-border">
            <span className="font-serif italic text-3xl text-mb-gold font-light block mb-4">
              01
            </span>
            <h3 className="font-serif text-xl text-mb-primary font-medium mb-3">
              Sculptural Modesty
            </h3>
            <p className="font-body text-xs sm:text-sm text-mb-body leading-relaxed">
              We design generous fluid proportions, batwing sleeves, and thoughtful necklines that provide full, worry-free coverage while creating an unmistakable editorial presence.
            </p>
          </div>

          <div className="p-8 bg-mb-surface border border-mb-border">
            <span className="font-serif italic text-3xl text-mb-gold font-light block mb-4">
              02
            </span>
            <h3 className="font-serif text-xl text-mb-primary font-medium mb-3">
              Climate-True Textiles
            </h3>
            <p className="font-body text-xs sm:text-sm text-mb-body leading-relaxed">
              Living by the Malabar coast taught us the necessity of featherlight, moisture-wicking natural textiles. Our Japanese Nida, pure linens, and bamboo blends stay cool all day long.
            </p>
          </div>

          <div className="p-8 bg-mb-surface border border-mb-border">
            <span className="font-serif italic text-3xl text-mb-gold font-light block mb-4">
              03
            </span>
            <h3 className="font-serif text-xl text-mb-primary font-medium mb-3">
              Bespoke Kochi Craft
            </h3>
            <p className="font-body text-xs sm:text-sm text-mb-body leading-relaxed">
              Each piece is created in limited runs in our Kerala workshop. Master tailors inspect every French seam, concealed pocket, and hem before it is packaged for you.
            </p>
          </div>

        </div>

        {/* Editorial Quote & Atelier Seal */}
        <div className="p-8 sm:p-12 bg-mb-primary text-mb-bg border border-mb-primary-hover flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <p className="font-serif italic text-lg sm:text-2xl text-mb-bg font-light leading-relaxed mb-3">
              &ldquo;Modesty is not about hiding; it is the art of revealing character through graceful restraint.&rdquo;
            </p>
            <p className="font-sans text-[11px] uppercase tracking-editorial text-mb-gold">
              Modest Studio Creative Direction • Kochi
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center">
            <BrandLogo variant="gold" className="h-16 w-auto mb-2 opacity-90" />
            <span className="font-sans text-[9px] uppercase tracking-widest text-mb-gold/80">
              Kochi, Kerala
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
