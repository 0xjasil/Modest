import React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface InfoNoteProps {
  children: React.ReactNode;
  /** Iconify name; defaults to the information glyph */
  icon?: string;
  className?: string;
  /** Denser padding/typography for use inside summaries and sidebars */
  compact?: boolean;
}

/**
 * Baby-blue informational notice.
 *
 * Reserved for neutral, helpful information (shipping thresholds, delivery
 * estimates, policy notes, "info" notifications). Success stays green and
 * failures stay red so the three brand colours keep their meaning.
 */
export default function InfoNote({
  children,
  icon = "lucide:info",
  className,
  compact = false,
}: InfoNoteProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-[8px] border border-mb-info-border bg-mb-info-bg text-mb-info-deep",
        compact ? "px-2.5 py-1.5 text-[11px]" : "px-3.5 py-2.5 text-xs",
        className
      )}
    >
      <Icon
        icon={icon}
        aria-hidden="true"
        className={cn("shrink-0 text-mb-info", compact ? "mt-px size-3.5" : "mt-[1px] size-4")}
      />
      <div className="min-w-0 leading-relaxed">{children}</div>
    </div>
  );
}

/** Small baby-blue dot used to mark an unread / live notification. */
export function InfoDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-1.5 shrink-0 rounded-full bg-mb-info", className)}
    />
  );
}
