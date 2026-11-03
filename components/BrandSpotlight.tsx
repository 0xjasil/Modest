import React from "react";
import Link from "next/link";
import bannersData from "@/banners.json";

const allBanners = bannersData as any[];

const brandImages = allBanners
  .filter(b => b.image && Number(b.id?.split("-")[1]) >= 8 && Number(b.id?.split("-")[1]) <= 50)
  .slice(0, 12);

const BRANDS = [
  { name: "L'Oréal Paris",   slug: "loreal-paris",  deal: "Up To 55% Off"  },
  { name: "Maybelline",       slug: "maybelline",     deal: "Up To 50% Off"  },
  { name: "Lakmé",            slug: "lakme",          deal: "Up To 60% Off"  },
  { name: "Moryelle Beauté",  slug: "moryelle",       deal: "Signature Collection" },
  { name: "Fenty Beauty",     slug: "fenty-beauty",   deal: "New Launch"     },
  { name: "Biotique",         slug: "biotique",       deal: "Up To 50% Off"  },
  { name: "Mamaearth",        slug: "mamaearth",      deal: "Up To 28% Off"  },
  { name: "Himalaya",         slug: "himalaya",       deal: "Up To 30% Off"  },
  { name: "PIXI",             slug: "pixi",           deal: "Up To 35% Off"  },
  { name: "NuFace",           slug: "nuface",         deal: "Best Facial Tools" },
  { name: "Sol de Janeiro",   slug: "sol-de-janeiro", deal: "Two Icons, One Obsession" },
  { name: "PAT McGRATH",      slug: "pat-mcgrath",    deal: "Couture Colour"  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center font-serif text-xl sm:text-2xl font-semibold text-mb-text uppercase tracking-[0.15em] mb-6 flex items-center justify-center gap-3">
      <span className="text-mb-gold-deep" aria-hidden="true">✦</span>
      {children}
      <span className="text-mb-gold-deep" aria-hidden="true">✦</span>
    </h2>
  );
}

export default function BrandSpotlight() {
  return (
    <section className="bg-mb-bg py-8 px-4 md:px-6 border-t border-mb-border-lite" aria-label="Brand spotlight">
      <div className="mx-auto max-w-content">

        {/* Exclusive launch banner */}
        <div className="mb-8 bg-mb-surface border border-mb-border shadow-card flex items-center overflow-hidden rounded-[14px] min-h-[80px]">
          {brandImages[0]?.image && (
            <img src={brandImages[0].image} alt="Fenty Beauty"
              width={160} height={80} loading="lazy"
              className="h-full flex-shrink-0 object-contain p-2"
              style={{ width: "clamp(110px, 14vw, 160px)" }}
            />
          )}
          <div className="flex-1 px-5 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mb-accent-deep mb-1">Exclusive Premiere</p>
            <p className="font-serif text-lg sm:text-xl font-semibold text-mb-text">Fenty Beauty</p>
            <p className="text-xs sm:text-sm text-mb-body">Now available exclusively at Moryelle Beauté</p>
          </div>
          <Link href="/category/fenty-beauty"
            className="flex-shrink-0 mr-5 text-xs sm:text-sm font-semibold bg-mb-primary hover:bg-mb-primary-hover text-mb-bg px-4 py-2.5 rounded-[10px] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent">
            Explore Collection →
          </Link>
        </div>

        {/* IN THE SPOTLIGHT title */}
        <SectionTitle>In The Spotlight</SectionTitle>

        {/* Brand grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 mb-8">
          {BRANDS.slice(0, 8).map((brand, i) => (
            <Link key={brand.slug} href={`/category/${brand.slug}`}
              className="group relative overflow-hidden bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent"
              style={{ aspectRatio: "2 / 1" }}>
              {brandImages[i]?.image ? (
                <img src={brandImages[i].image} alt={brand.name}
                  width={300} height={150} loading="lazy"
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-mb-surface flex items-center justify-center">
                  <span className="font-serif text-sm font-bold text-mb-text">{brand.name}</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-mb-primary/90 via-mb-primary/60 to-transparent">
                <p className="font-serif text-xs sm:text-sm font-semibold text-mb-bg truncate">{brand.name}</p>
                <p className="text-[11px] text-mb-gold font-medium">{brand.deal}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Top brands strip */}
        <div className="mt-8">
          <SectionTitle>Maison &amp; Icons</SectionTitle>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {BRANDS.map((brand, i) => (
              <Link key={brand.slug} href={`/category/${brand.slug}`}
                className="group flex-shrink-0 relative overflow-hidden bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent"
                style={{ width: "clamp(120px, 14vw, 160px)" }}>
                <div style={{ paddingTop: "70%", position: "relative" }}>
                  {brandImages[i]?.image ? (
                    <img src={brandImages[i].image} alt={brand.name}
                      width={160} height={112} loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-mb-surface flex items-center justify-center">
                      <span className="font-serif text-base font-bold text-mb-primary">{brand.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="px-3 pb-3 pt-1 border-t border-mb-border-lite">
                  <p className="font-serif text-xs font-semibold text-mb-text truncate">{brand.name}</p>
                  <p className="text-[11px] text-mb-accent-deep font-semibold">{brand.deal}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
