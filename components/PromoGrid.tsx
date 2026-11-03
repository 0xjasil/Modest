import React from "react";
import Link from "next/link";
import bannersData from "@/banners.json";

const allBanners = bannersData as any[];
const offerBanners   = allBanners.filter(b => b.image && Number(b.id?.split("-")[1]) >= 30 && Number(b.id?.split("-")[1]) <= 60).slice(0, 8);
const editBanners    = allBanners.filter(b => b.image && Number(b.id?.split("-")[1]) >= 60 && Number(b.id?.split("-")[1]) <= 75).slice(0, 8);

const OFFERS = [
  { text: "Up To 20% Off Gifts",    href: "/category/gifting"           },
  { text: "Flat 10% Off Skincare",  href: "/category/skincare"          },
  { text: "Buy 2 Get 1 Free",       href: "/category/all"               },
  { text: "Complimentary Luxe Gift", href: "/category/all"              },
  { text: "Luxe Gifting Studio",    href: "/category/luxe"              },
  { text: "Flat 25% On Perfumes",   href: "/category/fragrance"         },
  { text: "40% Off Hair Care",      href: "/category/hair"              },
  { text: "Signature Bestsellers",  href: "/category/all"               },
];

const EDITORIAL = [
  "The 9-to-5 Edit",        "Serving: Mocha Mousse",
  "Viral Beauty Essentials", "Bonjour, French Pharmacy",
  "No Makeup, Makeup",       "College Beauty Guide",
  "Exam Survival Guide",     "Skincare For All Ages",
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

function ImageTile({ image, label, href, aspect = "2/1" }: {
  image?: string; label: string; href: string; aspect?: string;
}) {
  return (
    <Link href={href}
      className="group relative overflow-hidden bg-mb-surface border border-mb-border shadow-card hover:shadow-dropdown transition-all rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent"
      style={{ aspectRatio: aspect }}>
      {image ? (
        <img src={image} alt={label} width={300} height={150} loading="lazy"
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-mb-surface flex items-center justify-center p-3">
          <p className="font-serif text-sm font-semibold text-mb-primary text-center">{label}</p>
        </div>
      )}
      <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-mb-primary/90 via-mb-primary/60 to-transparent">
        <p className="font-serif text-xs sm:text-sm font-semibold text-mb-bg truncate">{label}</p>
      </div>
    </Link>
  );
}

export default function PromoGrid() {
  return (
    <>
      {/* Today's Best Offers */}
      <section className="bg-mb-bg py-8 px-4 md:px-6" aria-label="Today's best offers">
        <div className="mx-auto max-w-content">
          <SectionTitle>Today&apos;s Curated Offers</SectionTitle>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
            {OFFERS.map((o, i) => (
              <ImageTile key={i} image={offerBanners[i]?.image} label={o.text} href={o.href} />
            ))}
          </div>
        </div>
      </section>

      {/* Help Concierge Banner */}
      <div className="bg-mb-surface border-y border-mb-border py-6 px-4 md:px-6 my-4">
        <div className="mx-auto max-w-content flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg sm:text-xl font-semibold text-mb-text">Seeking your signature routine?</p>
            <p className="text-xs sm:text-sm text-mb-body mt-0.5">Allow our beauty advisors to guide you to your ideal match</p>
          </div>
          <Link href="/category/skincare"
            className="flex-shrink-0 bg-mb-primary hover:bg-mb-primary-hover text-mb-bg text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-[10px] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mb-accent">
            Consult Beauty Guide →
          </Link>
        </div>
      </div>

      {/* Curated For You editorial */}
      <section className="bg-mb-bg py-8 px-4 md:px-6" aria-label="Curated editorial">
        <div className="mx-auto max-w-content">
          <SectionTitle>The Beauté Edit</SectionTitle>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
            {EDITORIAL.map((title, i) => (
              <ImageTile key={i} image={editBanners[i]?.image} label={title} href="/category/all" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
