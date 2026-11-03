/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modest Studio Kochi Brand Tokens
        mb: {
          bg:              "var(--color-bg)",
          surface:         "var(--color-surface)",
          dusty:           "var(--color-surface-strong)",
          primary:         "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          accent:          "var(--color-accent)",
          "accent-deep":   "var(--color-accent-deep)",
          gold:            "var(--color-gold)",
          "gold-deep":     "var(--color-gold-deep)",
          text:            "var(--color-text-main)",
          body:            "var(--color-text-body)",
          muted:           "var(--color-text-muted)",
          placeholder:     "var(--color-text-placeholder)",
          border:          "var(--color-border)",
          "border-lite":   "var(--color-border-lite)",
          success:         "var(--color-success)",
          error:           "var(--color-error)",
          // Palette direct hex mappings
          ivory:           "#F8F6F0",
          sand:            "#E9E2D6",
          "sand-strong":   "#D7CCBB",
          espresso:        "#302D27",
          olive:           "#777B5A",
          "olive-deep":    "#5E6345",
          antiqueGold:     "#B69A70",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Jost'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        heading: ["'Cormorant Garamond'", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(48, 45, 39, 0.05)",
        dropdown: "0 8px 24px rgba(48, 45, 39, 0.08)",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        xl: "6px",
        "2xl": "8px",
        full: "9999px",
      },
      maxWidth: {
        content: "1320px",
        site:    "1440px",
      },
      letterSpacing: {
        subbrand: "0.25em",
        tagline:  "0.30em",
        editorial: "0.15em",
      },
    },
  },
  plugins: [],
};
