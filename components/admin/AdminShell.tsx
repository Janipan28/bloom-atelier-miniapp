"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const BOT_USERNAME = "Flowersmessage_Bot";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: "◻" },
  { href: "/admin/products", label: "Товары", icon: "🌸" },
  { href: "/admin/orders", label: "Заказы", icon: "📦" },
  { href: "/admin/promo-codes", label: "Промокоды", icon: "🏷" },
  { href: "/admin/branches", label: "Точки", icon: "📍" },
  { href: `https://t.me/${BOT_USERNAME}?start=admin`, label: "Посты → в ТГ", icon: "✉️", external: true },
];

export function LogoutClient() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="w-full text-left px-3 py-2 rounded-[12px] text-[13px] text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
    >
      Выйти →
    </button>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="p-2 text-white">
        ☰
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-64 bg-[#2F241F] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <span className="font-semibold text-white">Меню</span>
              <button type="button" onClick={() => setOpen(false)} className="text-white/60 text-xl">×</button>
            </div>
            <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
              {NAV.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] transition-colors text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] transition-colors ${
                      pathname === item.href
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              )}
            </nav>
            <div className="px-4 pb-6">
              <button
                type="button"
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-[12px] text-[13px] text-white/40 hover:text-white/70"
              >
                Выйти →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:     { label: "Новый",            cls: "bg-blue-100 text-blue-700" },
    in_progress: { label: "Собирают",         cls: "bg-amber-100 text-amber-700" },
    ready:       { label: "Готов",            cls: "bg-purple-100 text-purple-700" },
    delivered:   { label: "Доставлен",        cls: "bg-green-100 text-green-700" },
    cancelled:   { label: "Отменён",          cls: "bg-red-100 text-red-700" },
    available:   { label: "В наличии",        cls: "bg-green-100 text-green-700" },
    low_stock:   { label: "Заканчивается",    cls: "bg-amber-100 text-amber-700" },
    out_of_stock:{ label: "Нет в наличии",    cls: "bg-red-100 text-red-700" },
  };
  const info = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${info.cls}`}>
      {info.label}
    </span>
  );
}
