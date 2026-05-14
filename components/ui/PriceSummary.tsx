import type { PriceBreakdown } from "@/lib/types";
import { formatRub } from "@/lib/pricing";

interface PriceSummaryProps {
  breakdown: PriceBreakdown;
  title?: string;
}

export function PriceSummary({ breakdown, title }: PriceSummaryProps) {
  return (
    <div className="bg-surface rounded-card p-5 border border-border-soft">
      {title && (
        <div className="text-label text-text-secondary uppercase tracking-wide mb-3">
          {title}
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {breakdown.lines.map((line, idx) => (
          <li
            key={`${line.label}-${idx}`}
            className="flex items-center justify-between text-body"
          >
            <span
              className={
                line.amount < 0
                  ? "text-success"
                  : "text-text-secondary"
              }
            >
              {line.label}
            </span>
            <span
              className={
                line.amount < 0
                  ? "text-success font-semibold"
                  : "text-text-primary"
              }
            >
              {formatRub(line.amount)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-border-soft flex items-center justify-between">
        <span className="text-h2 text-text-primary">Итого</span>
        <span className="text-h2 text-accent-primary">
          {formatRub(breakdown.total)}
        </span>
      </div>
    </div>
  );
}
