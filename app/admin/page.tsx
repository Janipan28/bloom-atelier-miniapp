import Link from "next/link";
import { readDB } from "@/lib/db";
import { formatRub } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const db = readDB();
  const total = db.orders.reduce((s, o) => s + o.total, 0);
  const pending = db.orders.filter((o) => o.status === "pending" || o.status === "in_progress").length;
  const recentOrders = [...db.orders].reverse().slice(0, 5);

  const stats = [
    { label: "Товаров", value: db.products.length, href: "/admin/products", color: "bg-rose-50 text-rose-700" },
    { label: "Заказов", value: db.orders.length, href: "/admin/orders", color: "bg-amber-50 text-amber-700" },
    { label: "В работе", value: pending, href: "/admin/orders", color: "bg-blue-50 text-blue-700" },
    { label: "Выручка", value: formatRub(total), href: "/admin/orders", color: "bg-green-50 text-green-700" },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-[26px] font-semibold text-[#2F241F] mb-6">Дашборд</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-[16px] p-5 shadow-sm border border-[#E6D8CA] hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide mb-3 ${s.color}`}>
              {s.label}
            </div>
            <div className="text-[28px] font-bold text-[#2F241F]">{s.value}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm mb-8">
        <div className="px-5 py-4 border-b border-[#E6D8CA] flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-[#2F241F]">Последние заказы</h2>
          <Link href="/admin/orders" className="text-[13px] text-[#B24C63]">Все →</Link>
        </div>
        <div className="divide-y divide-[#F0E8DE]">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-5 py-3 flex items-center gap-4">
              <span className="text-[13px] text-[#6B5B52] w-14">#{order.id}</span>
              <span className="flex-1 text-[14px] text-[#2F241F] truncate">{order.productTitle}</span>
              <span className="text-[13px] font-semibold text-[#2F241F]">{formatRub(order.total)}</span>
              <StatusDot status={order.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { href: "/admin/products/new", label: "Добавить товар", icon: "➕" },
          { href: "/admin/promo-codes", label: "Промокоды", icon: "🏷" },
          { href: "/admin/branches", label: "Точки продаж", icon: "📍" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 bg-white rounded-[14px] px-4 py-3 border border-[#E6D8CA] text-[14px] text-[#2F241F] hover:bg-[#F7F2EC] transition-colors"
          >
            <span>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-blue-400",
    in_progress: "bg-amber-400",
    ready: "bg-purple-400",
    delivered: "bg-green-400",
    cancelled: "bg-red-400",
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status] ?? "bg-gray-400"}`} />;
}
