"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatRub } from "@/lib/pricing";
import { useWishlist } from "@/lib/stores/wishlist";
import { useCart } from "@/lib/stores/cart";
import { hapticLight, hapticSuccess } from "@/lib/telegram";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "wide";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const wishlist = useWishlist();
  const add = useCart((s) => s.add);
  const [pulse, setPulse] = useState(false);

  const isFav = wishlist.has(product.id);
  const isWide = variant === "wide";

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    hapticLight();
    wishlist.toggle(product.id);
  }

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    hapticSuccess();
    const defaultSize = product.sizes?.find((s) => s.code === "M")?.code ??
      product.sizes?.[0]?.code ?? "M";
    add({ productId: product.id, qty: 1, size: defaultSize, addons: [] });
    setPulse(true);
    setTimeout(() => setPulse(false), 350);
  }

  const badges = [
    ...(product.badges.includes("new") ? [{ label: "Новинка", cls: "bg-success text-white" }] : []),
    ...(product.badges.includes("sale") && product.oldPrice
      ? [{ label: `−${Math.round((1 - product.price / product.oldPrice) * 100)}%`, cls: "bg-error text-white" }]
      : []),
    ...(product.badges.includes("bestseller") ? [{ label: "Хит", cls: "bg-accent-primary text-white" }] : []),
    ...(product.badges.includes("premium") ? [{ label: "Premium", cls: "bg-text-primary text-bg" }] : []),
  ];

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group block bg-surface rounded-card overflow-hidden border border-border-soft/50 transition-all duration-[180ms] ease-out active:scale-[0.98] hover:border-accent-secondary ${
        isWide ? "flex gap-3" : ""
      }`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className={`relative bg-surface-muted overflow-hidden ${
          isWide ? "w-32 h-32 shrink-0" : "aspect-[4/5] w-full"
        }`}
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes={isWide ? "128px" : "(min-width: 640px) 280px, 50vw"}
          className="object-cover transition-transform duration-[300ms] group-hover:scale-[1.04]"
        />

        {/* badges */}
        {!isWide && badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map((b) => (
              <span
                key={b.label}
                className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-pill ${b.cls}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}

        {/* fav */}
        {!isWide && (
          <button
            type="button"
            onClick={toggleFav}
            aria-label={isFav ? "Убрать из избранного" : "В избранное"}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center active:scale-90 transition-transform"
          >
            <HeartIcon filled={isFav} />
          </button>
        )}

        {/* stock badge */}
        {product.stock_status === "low_stock" && !isWide && (
          <div className="absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-pill bg-warning/90 text-white">
            мало осталось
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-1.5 ${isWide ? "py-2 pr-3 flex-1" : "p-3"}`}>
        <div className="flex items-center gap-1 text-[11px] text-text-secondary">
          <span className="text-accent-secondary">★</span>
          <span>{product.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{product.reviewCount} отзывов</span>
        </div>
        <h3 className="text-[14px] font-semibold text-text-primary line-clamp-2 leading-tight">
          {product.title}
        </h3>
        {!isWide && (
          <p className="text-[12px] text-text-secondary line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-[11px] text-text-secondary line-through">
                {formatRub(product.oldPrice)}
              </span>
            )}
            <span className="text-[15px] font-semibold text-accent-primary">
              {formatRub(product.price)}
            </span>
          </div>
          {!isWide && (
            <button
              type="button"
              onClick={quickAdd}
              aria-label="Добавить в корзину"
              className={`w-9 h-9 rounded-full bg-accent-primary text-white flex items-center justify-center shadow-card transition-transform active:scale-90 ${
                pulse ? "scale-110" : ""
              }`}
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4.35-9-9.05C1.6 8.27 4 5 7.5 5c1.7 0 3.3.8 4.5 2.2C13.2 5.8 14.8 5 16.5 5c3.5 0 5.9 3.27 4.5 6.95C19 16.65 12 21 12 21z"
        stroke={filled ? "#B24C63" : "#2F241F"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? "#B24C63" : "none"}
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
