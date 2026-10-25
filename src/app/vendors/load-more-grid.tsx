"use client";

import { Children, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Phones: shows `pageSize` cards, then a "Load more" button that reveals the next batch.
 * The button disappears once everything is showing.
 * Tablet / desktop: always shows every card (no button).
 */
export default function LoadMoreGrid({
  children,
  pageSize = 10,
  className,
}: {
  children: ReactNode;
  pageSize?: number;
  className?: string;
}) {
  const items = Children.toArray(children);
  const [visible, setVisible] = useState(pageSize);
  const remaining = items.length - visible;

  return (
    <>
      <div className={className}>
        {items.map((item, i) => (
          <div
            key={i}
            // Extra cards are only hidden on phones; md and up always show them
            className={cn("h-full", i >= visible && "hidden md:block")}
          >
            {item}
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-8 flex flex-col items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setVisible((v) => v + pageSize)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Load more
            <ChevronDown className="h-4 w-4" />
          </button>
          <p className="text-xs text-muted-foreground">
            Showing {visible} of {items.length} vendors
          </p>
        </div>
      )}
    </>
  );
}
