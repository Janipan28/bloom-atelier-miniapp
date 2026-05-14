"use client";

import { useWishlist } from "@/lib/stores/wishlist";
import { getProductById } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export function WishlistClient() {
  const { ids, hydrated } = useWishlist();

  if (!hydrated) {
    return (
      <main className="max-w-screen-sm mx-auto w-full px-5 py-8">
        <p className="text-body text-text-secondary">Загружаем избранное…</p>
      </main>
    );
  }

  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <main className="max-w-screen-sm mx-auto w-full px-5 py-8">
        <EmptyState
          title="Пока пусто в избранном"
          description="Нажмите ♥ на карточке букета, чтобы сохранить идею на потом."
          action={
            <ButtonLink href="/" variant="primary" size="lg">
              К каталогу
            </ButtonLink>
          }
        />
      </main>
    );
  }

  return (
    <main className="max-w-screen-sm mx-auto w-full px-5 py-4">
      <div className="text-micro text-text-secondary mb-3">
        {products.length} {products.length === 1 ? "букет" : "букетов"} в избранном
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}
