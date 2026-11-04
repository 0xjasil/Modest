import React from "react";

const SRC = {
  primary: "/brand/logo-primary.svg",
  secondary: "/brand/logo-secondary.svg",
  horizontal: "/brand/logo-horizontal.svg",
  emblem: "/brand/logo-emblem.svg",
  gold: "/brand/logo-gold.svg",
  white: "/brand/logo-white.svg",
  wordmark: "/brand/logo-horizontal.svg",
  vector: "/brand/logo-primary.svg",
} as const;

type LogoVariant = keyof typeof SRC;

export default function BrandLogo({
  variant = "primary",
  className = "",
  alt,
}: {
  variant?: LogoVariant;
  className?: string;
  alt?: string;
}) {
  const label =
    alt ??
    (variant === "emblem"
      ? "Modest Studio emblem"
      : "Modest Studio");

  return (
    <img
      src={SRC[variant]}
      alt={label}
      onError={(e) => {
        const target = e.currentTarget;
        const fallbackName =
          variant === "emblem"
            ? "logo-emblem.png"
            : variant === "gold"
            ? "logo-gold.png"
            : variant === "secondary" || variant === "horizontal"
            ? "logo-secondary.png"
            : variant === "white"
            ? "logo-white.png"
            : "logo-primary.png";
        if (!target.src.endsWith(fallbackName)) {
          target.src = `/brand/${fallbackName}`;
        }
      }}
      className={`object-contain object-center select-none ${className}`}
      draggable={false}
    />
  );
}
