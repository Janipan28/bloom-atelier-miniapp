"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { hapticLight } from "@/lib/telegram";

interface Tab {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  badge?: number;
}

export function BottomNav() {
  const pathname = usePathname();
  const cartCount = useCart((s) => s.count());
  const wishlistCount = useWishlist((s) => s.ids.length);

  const tabs: Tab[] = [
    { href: "/", label: "Каталог", icon: HomeIcon },
    { href: "/catalog", label: "Все", icon: GridIcon },
    {
      href: "/cart",
      label: "Корзина",
      icon: BagIcon,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      href: "/wishlist",
      label: "Избранное",
      icon: HeartIcon,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
    },
    { href: "/profile", label: "Профиль", icon: UserIcon },
  ];

  // Hide on checkout/success for focus
  if (pathname === "/checkout" || pathname === "/success") return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border-soft"
      style={{ boxShadow: "var(--shadow-sticky)" }}
    >
      <div className="max-w-screen-sm mx-auto flex items-stretch h-[64px] pb-[max(env(safe-area-inset-bottom),0px)]">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => hapticLight()}
              className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0"
            >
              <div className="relative">
                {tab.icon(isActive)}
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-accent-primary text-white text-[10px] font-semibold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] leading-none ${
                  isActive
                    ? "text-accent-primary font-semibold"
                    : "text-text-secondary"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon(active: boolean) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z"
        stroke={active ? "#B24C63" : "#6B5B52"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "#B24C63" : "none"}
      />
    </svg>
  );
}

function GridIcon(active: boolean) {
  const c = active ? "#B24C63" : "#6B5B52";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
    </svg>
  );
}

function BagIcon(active: boolean) {
  const c = active ? "#B24C63" : "#6B5B52";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 8h14l-1.2 11.2a2 2 0 01-2 1.8H8.2a2 2 0 01-2-1.8L5 8z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 8V6a3 3 0 116 0v2" stroke={c} strokeWidth="1.8" />
    </svg>
  );
}

function HeartIcon(active: boolean) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7-4.35-9-9.05C1.6 8.27 4 5 7.5 5c1.7 0 3.3.8 4.5 2.2C13.2 5.8 14.8 5 16.5 5c3.5 0 5.9 3.27 4.5 6.95C19 16.65 12 21 12 21z"
        stroke={active ? "#B24C63" : "#6B5B52"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "#B24C63" : "none"}
      />
    </svg>
  );
}

function UserIcon(active: boolean) {
  const c = active ? "#B24C63" : "#6B5B52";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8" />
      <path
        d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
