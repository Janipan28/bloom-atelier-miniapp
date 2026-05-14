"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

type SortMode = "popular" | "price_asc" | "price_desc" | "new";

export function CatalogClient() {
  const sp = useSearchParams();
  const initialCat = sp.get("cat") ?? "";
  const onlyNew = sp.get("new") === "1";

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<SortMode>("popular");
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  const filtered = useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (onlyNew && !p.is_new) return false;
      if (p.price > maxPrice) return false;
      if (q && !`${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q))
        return false;
      return true;
    });
    switch (sort) {
      case "price_asc":
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case "new":
        list = list.slice().sort((a, b) => Number(b.is_new) - Number(a.is_new));
        break;
      default:
        list = list.slice().sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [query, cat, sort, maxPrice, onlyNew]);

  return (
    <main className="max-w-screen-sm mx-auto w-full px-5 pt-2 pb-8">
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          inputMode="search"
          placeholder="Поиск букетов, цветов, тегов…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-11 pr-4 rounded-pill bg-surface border border-border-soft text-body focus:outline-none focus:border-accent-primary"
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto mt-4 pb-1 -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={cat === ""} onClick={() => setCat("")}>
          Все
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.slug}
            active={cat === c.slug}
            onClick={() => setCat(cat === c.slug ? "" : c.slug)}
          >
            {c.emoji} {c.title}
          </Chip>
        ))}
      </div>

      {/* Sort + price slider */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <SortButton active={sort === "popular"} onClick={() => setSort("popular")}>
          Популярные
        </SortButton>
        <SortButton active={sort === "new"} onClick={() => setSort("new")}>
          Новинки
        </SortButton>
        <SortButton active={sort === "price_asc"} onClick={() => setSort("price_asc")}>
          Цена ↑
        </SortButton>
        <SortButton active={sort === "price_desc"} onClick={() => setSort("price_desc")}>
          Цена ↓
        </SortButton>
      </div>

      <div className="mt-4 p-4 bg-surface rounded-card border border-border-soft">
        <div className="flex items-center justify-between text-label text-text-secondary">
          <span>Максимальная цена</span>
          <span className="text-text-primary font-semibold">
            до {maxPrice.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <input
          type="range"
          min={2000}
          max={20000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full mt-3 accent-accent-primary"
        />
      </div>

      {/* Results */}
      <div className="mt-4 text-micro text-text-secondary">
        Найдено: {filtered.length}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="По вашему запросу ничего не нашлось"
          description="Попробуйте сбросить фильтры или изменить поиск."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-4 h-10 rounded-pill text-[13px] font-medium transition-colors ${
        active
          ? "bg-text-primary text-bg"
          : "bg-surface border border-border-soft text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 h-9 rounded-pill text-[12px] font-semibold ${
        active
          ? "bg-accent-primary text-white"
          : "bg-surface border border-border-soft text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}
