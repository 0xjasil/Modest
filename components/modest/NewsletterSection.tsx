import React, { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-mb-surface py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-mb-border" aria-labelledby="newsletter-heading">
      <div className="max-w-[760px] mx-auto text-center">
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-6 h-px bg-mb-accent" />
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-mb-muted font-medium">
            Atelier Dispatches
          </span>
          <span className="w-6 h-px bg-mb-accent" />
        </div>

        <h2 id="newsletter-heading" className="font-serif text-3xl sm:text-4xl lg:text-5xl text-mb-primary font-normal tracking-tight mb-4">
          Join the Studio Circle
        </h2>

        <p className="font-body text-xs sm:text-sm text-mb-body leading-relaxed mb-8 max-w-lg mx-auto">
          Receive private previews of limited capsule drops, bespoke fitting schedules at our Kochi studio, and seasonal lookbook dispatches.
        </p>

        {submitted ? (
          <div className="p-6 bg-mb-bg border border-mb-border max-w-md mx-auto animate-fadeIn">
            <span className="font-serif text-lg text-mb-primary font-medium block mb-1">
              Welcome to Modest Studio.
            </span>
            <p className="font-body text-xs text-mb-muted">
              We have noted your email. Your welcome dispatch will arrive shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto mb-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full sm:flex-1 py-3.5 px-4 bg-mb-bg border border-mb-border text-xs font-body text-mb-primary placeholder-mb-placeholder outline-none focus:border-mb-primary transition-colors"
            />
            <button
              type="submit"
              className="luxury-btn-primary w-full sm:w-auto py-3.5 px-8 text-xs tracking-editorial whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="font-body text-[11px] text-mb-muted">
          We honor your privacy. Unsubscribe at any time with a single click.
        </p>

      </div>
    </section>
  );
}
