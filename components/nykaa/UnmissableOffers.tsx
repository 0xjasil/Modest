import React, { useRef } from "react";
import Link from "next/link";

const offers = [
  {
    img: "/hero/card-1.jpg",
    title: "Festive Grandeur Collection",
    link: "/category/makeup"
  },
  {
    img: "/hero/card-2.jpg",
    title: "Signature Radiance Rituals",
    link: "/category/skincare"
  },
  {
    img: "/hero/card-3.jpg",
    title: "Iconic Bestsellers",
    link: "/category/luxe"
  },
  {
    img: "/hero/card-4.jpg",
    title: "Botanical Hair Elixirs",
    link: "/category/hair"
  },
  {
    img: "/hero/card-5.jpg",
    title: "Curated Luxury Duos",
    link: "/category/wellness"
  }
];

export default function UnmissableOffers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-mb-surface border-y border-mb-border py-8 my-8" aria-label="Unmissable Offers For You">
      <div className="w-full px-3 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-mb-text mb-6 text-left">
          Unmissable Beauté Offers
        </h2>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous offers"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-mb-bg border border-mb-border text-mb-primary shadow-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-mb-surface hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {offers.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="flex-1 min-w-[260px] sm:min-w-[320px] rounded-[12px] overflow-hidden border border-mb-border shadow-card hover:shadow-dropdown transition-all bg-mb-surface"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-auto object-cover rounded-[12px]"
                />
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Next offers"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-mb-bg border border-mb-border text-mb-primary shadow-card flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-mb-surface hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
