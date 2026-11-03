import React from "react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const POSTS = [
  { id: 1, image: "/hero/card-4.jpg", caption: "The raw linen kimono layered over our sand slip dress. Designed for Kochi humidity.", likes: "482" },
  { id: 2, image: "/hero/card-5.jpg", caption: "Close up details on French seams and mother-of-pearl buttons in our studio.", likes: "614" },
  { id: 3, image: "/hero/card-6.jpg", caption: "Signature Noir Batwing Abaya back in stock in sizes 52 to 58.", likes: "920" },
  { id: 4, image: "/hero/card-7.jpg", caption: "Morning coffee & atelier fittings in Panampilly Nagar, Kochi.", likes: "350" },
  { id: 5, image: "/hero/card-8.jpg", caption: "Earthy olive hues from our Autumn Lookbook. Which shade is your favourite?", likes: "740" },
  { id: 6, image: "/hero/card-1.jpg", caption: "Modal hijabs folded and ready for dispatch across India.", likes: "518" },
];

export default function InstagramSection() {
  return (
    <section className="bg-mb-bg py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-labelledby="insta-heading">
      <div className="max-w-[1360px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-mb-accent" />
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
                Social Diary
              </span>
            </div>
            <h2 id="insta-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight">
              @modest_studio_kochi
            </h2>
            <p className="font-body text-xs sm:text-sm text-mb-muted mt-2 max-w-lg">
              Follow our daily atelier moments, client styling diaries, and first looks at limited capsule drops.
            </p>
          </div>

          <a
            href="https://www.instagram.com/modest_studio_kochi/"
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-btn-secondary inline-flex items-center gap-2 px-6 py-3 text-xs tracking-editorial self-start md:self-auto"
          >
            <InstagramIcon />
            <span>Follow on Instagram ↗</span>
          </a>
        </div>

        {/* 6-Grid of Instagram Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {POSTS.map(post => (
            <a
              key={post.id}
              href="https://www.instagram.com/modest_studio_kochi/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-mb-surface border border-mb-border overflow-hidden block focus:outline-none"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 filter brightness-[0.98]"
                loading="lazy"
              />

              {/* Hover Overlay with Icon & Likes */}
              <div className="absolute inset-0 bg-mb-primary/75 backdrop-blur-xs p-4 flex flex-col justify-between text-mb-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-end">
                  <InstagramIcon />
                </div>
                <div>
                  <p className="font-body text-[11px] line-clamp-3 text-mb-bg/90 mb-2 leading-snug">
                    {post.caption}
                  </p>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-mb-gold font-semibold">
                    ♥ {post.likes} Loves
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Community Footer */}
        <p className="text-center font-sans text-xs uppercase tracking-editorial text-mb-muted mt-10">
          Tag <strong className="text-mb-primary">#ModestStudioKochi</strong> in your styles to be featured in our community story.
        </p>

      </div>
    </section>
  );
}
