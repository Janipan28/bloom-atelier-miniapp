"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { formatRub } from "@/lib/pricing";

interface BottomCTAProps {
  total?: number;
  totalLabel?: string;
  ctaLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Sticky footer with optional price summary and a single primary CTA.
 *
 * IMPORTANT: any screen using <BottomCTA /> must add bottom padding to its
 * scroll container (e.g. pb-32) to prevent the CTA from covering content.
 */
export function BottomCTA({
  total,
  totalLabel = "Итого",
  ctaLabel,
  onClick,
  disabled,
  children,
}: BottomCTAProps) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border-soft"
      style={{ boxShadow: "var(--shadow-sticky)" }}
    >
      <div className="max-w-screen-sm mx-auto px-5 pt-3 pb-[max(env(safe-area-inset-bottom),16px)] flex items-center gap-4">
        {typeof total === "number" && (
          <div className="flex flex-col">
            <span className="text-micro text-text-secondary">{totalLabel}</span>
            <span className="text-h2 text-text-primary">
              {formatRub(total)}
            </span>
          </div>
        )}
        {children}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onClick}
          disabled={disabled}
          className="ml-auto max-w-[60%]"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
