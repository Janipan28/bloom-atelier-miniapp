import Link from "next/link";
import type { ReactNode } from "react";

const BOT_USERNAME = "Flowersmessage_Bot";

const NAV = [
  { href: "/admin",              label: "Дашборд",     icon: "◻",  external: false },
  { href: "/admin/products",     label: "Товары",       icon: "🌸", external: false },
  { href: "/admin/orders",       label: "Заказы",       icon: "📦", external: false },
  { href: "/admin/promo-codes",  label: "Промокоды",    icon: "🏷", external: false },
  { href: "/admin/branches",     label: "Точки",        icon: "📍", external: false },
  {
    href: `https://t.me/${BOT_USERNAME}?start=admin`,
    label: "Посты → в ТГ",
    icon: "✉️",
    external: true,
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#F0EBE3]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[#2F241F] text-white min-h-screen sticky top-0">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="text-[11px] uppercase tracking-widest text-white/50 mb-1">Bloom Atelier</div>
          <div className="text-[17px] font-semibold">Админка</div>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] text-white/70 hover:bg-white/10 hover:text-white transition-colors border border-white/10 mt-1"
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="px-4 pb-6">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#2F241F] text-white flex items-center justify-between px-4 h-14">
        <span className="font-semibold text-[15px]">Bloom Admin</span>
        <MobileNav />
      </div>

      {/* Main */}
      <main className="flex-1 md:p-8 p-4 pt-18 md:pt-8 min-w-0">
        {children}
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/auth" method="DELETE">
      <LogoutClient />
    </form>
  );
}

// Client component for logout
import { LogoutClient, MobileNav } from "@/components/admin/AdminShell";
