import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-16 px-6">
      <div
        aria-hidden
        className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-display text-accent-secondary"
      >
        ❀
      </div>
      <h2 className="text-h2 text-text-primary">{title}</h2>
      {description && (
        <p className="text-body text-text-secondary max-w-xs">{description}</p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
