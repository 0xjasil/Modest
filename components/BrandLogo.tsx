import React from "react";

const SRC = {
  primary: "/brand/logo-primary.png",
  secondary: "/brand/logo-secondary.png",
  horizontal: "/brand/logo-horizontal.png",
  emblem: "/brand/logo-emblem.png",
  gold: "/brand/logo-gold.png",
  white: "/brand/logo-white.png",
  wordmark: "/brand/logo-wordmark.png",
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
        if (!target.src.includes("/brand/logo-primary.png")) {
          target.src = "/brand/logo-primary.png";
        }
      }}
      className={`object-contain object-center select-none ${className}`}
      draggable={false}
    />
  );
}
