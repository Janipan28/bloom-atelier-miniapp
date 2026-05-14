"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, SizeCode } from "@/lib/types";
import { getProductById } from "@/lib/mock-data";

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  add(item: CartItem): void;
  remove(productId: number, size: SizeCode): void;
  setQty(productId: number, size: SizeCode, qty: number): void;
  clear(): void;
  count(): number;
  subtotal(): number;
  _setHydrated(): void;
}

function key(productId: number, size: SizeCode) {
  return `${productId}__${size}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      add(newItem) {
        set((state) => {
          const idx = state.items.findIndex(
            (i) =>
              key(i.productId, i.size) ===
              key(newItem.productId, newItem.size),
          );
          if (idx >= 0) {
            const next = [...state.items];
            next[idx] = {
              ...next[idx],
              qty: next[idx].qty + newItem.qty,
              addons: Array.from(
                new Set([...next[idx].addons, ...newItem.addons]),
              ),
            };
            return { items: next };
          }
          return { items: [...state.items, newItem] };
        });
      },
      remove(productId, size) {
        set((state) => ({
          items: state.items.filter(
            (i) => key(i.productId, i.size) !== key(productId, size),
          ),
        }));
      },
      setQty(productId, size, qty) {
        if (qty <= 0) {
          get().remove(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            key(i.productId, i.size) === key(productId, size)
              ? { ...i, qty }
              : i,
          ),
        }));
      },
      clear() {
        set({ items: [] });
      },
      count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
      subtotal() {
        return get().items.reduce((sum, i) => {
          const product = getProductById(i.productId);
          if (!product) return sum;
          const sizeMul =
            product.sizes?.find((s) => s.code === i.size)?.multiplier ?? 1;
          const linePrice = Math.round(product.price * sizeMul);
          return sum + linePrice * i.qty;
        }, 0);
      },
      _setHydrated() {
        set({ hydrated: true });
      },
    }),
    {
      name: "bloom-cart-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    },
  ),
);
