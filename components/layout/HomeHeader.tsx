"use client";

import Link from "next/link";
import { useCart } from "@/lib/stores/cart";

export function HomeHeader() {
  const cartCount = useCart((s) => s.count());

  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="max-w-screen-sm mx-auto h-14 px-5 flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <span className="text-[11px] uppercase tracking-[0.18em] text-accent-secondary">
            Bloom Atelier
          </span>
          <span className="text-[15px] font-semibold text-text-primary mt-0.5">
            Доставка сегодня
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/catalog"
            aria-label="Поиск"
            className="w-10 h-10 rounded-full bg-surface border border-border-soft flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#2F241F" strokeWidth="1.8" />
              <path d="M20 20l-3.5-3.5" stroke="#2F241F" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/cart"
            aria-label="Корзина"
            className="relative w-10 h-10 rounded-full bg-surface border border-border-soft flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z"
                stroke="#2F241F"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M9 8V6a3 3 0 116 0v2" stroke="#2F241F" strokeWidth="1.8" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-primary text-white text-[10px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
