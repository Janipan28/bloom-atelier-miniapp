"use client";

import { formatRub } from "@/lib/pricing";
import type { Addon } from "@/lib/types";

interface AddonToggleProps {
  addon: Addon;
  selected: boolean;
  onToggle: (code: string) => void;
}

export function AddonToggle({ addon, selected, onToggle }: AddonToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(addon.code)}
      className={`w-full flex items-center justify-between p-4 rounded-card border transition-colors duration-[120ms] min-h-[56px] text-left ${
        selected
          ? "bg-accent-primary/5 border-accent-primary"
          : "bg-surface border-border-soft hover:border-accent-secondary"
      }`}
      aria-pressed={selected}
    >
      <div className="flex flex-col gap-1">
        <span className="text-body font-semibold text-text-primary">
          {addon.title}
        </span>
        <span className="text-micro text-text-secondary">
          +{formatRub(addon.price)}
        </span>
      </div>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
          selected
            ? "bg-accent-primary text-white"
            : "bg-surface-muted text-transparent"
        }`}
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7l3.5 3.5L12 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}
