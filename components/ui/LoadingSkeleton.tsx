export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-card overflow-hidden shadow-card">
      <div className="aspect-[4/5] bg-surface-muted animate-pulse" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-surface-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-surface-muted rounded animate-pulse w-1/2" />
        <div className="h-4 bg-surface-muted rounded animate-pulse w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
