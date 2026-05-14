"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  hydrated: boolean;
  toggle(id: number): void;
  has(id: number): boolean;
  clear(): void;
  _setHydrated(): void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,
      toggle(id) {
        set((state) =>
          state.ids.includes(id)
            ? { ids: state.ids.filter((x) => x !== id) }
            : { ids: [...state.ids, id] },
        );
      },
      has(id) {
        return get().ids.includes(id);
      },
      clear() {
        set({ ids: [] });
      },
      _setHydrated() {
        set({ hydrated: true });
      },
    }),
    {
      name: "bloom-wishlist-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    },
  ),
);
