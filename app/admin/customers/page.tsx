import fs from "fs";
import path from "path";
import { formatRub } from "@/lib/pricing";

export const dynamic = "force-dynamic";

interface Customer {
  id: number;
  telegram_user_id: number;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  loyalty_points: number;
  tags: string | null;
  order_count: number;
  total_spent: number;
  created_at: string;
}

function readCustomers(): Customer[] {
  const p = path.join(process.cwd(), "data", "customers.json");
  if (!fs.existsSync(p)) return [];
  return (JSON.parse(fs.readFileSync(p, "utf-8")).customers ?? []) as Customer[];
}

function tier(pts: number): string {
  if (pts >= 5000) return "🥇 Золото";
  if (pts >= 2000) return "🥈 Серебро";
  if (pts >= 1)    return "🥉 Бронза";
  return "👤 Новый";
}

function tierColor(pts: number): string {
  if (pts >= 5000) return "#F59E0B";
  if (pts >= 2000) return "#9CA3AF";
  if (pts >= 1)    return "#CD7C4B";
  return "#B0A09A";
}

export default function AdminCustomersPage() {
  const customers = readCustomers().sort((a, b) => b.loyalty_points - a.loyalty_points);

  const totalSpent  = customers.reduce((s, c) => s + c.total_spent, 0);
  const totalOrders = customers.reduce((s, c) => s + c.order_count, 0);
  const totalPts    = customers.reduce((s, c) => s + c.loyalty_points, 0);
  const vipCount    = customers.filter(c => c.tags === "vip").length;

  return (
    <div className="max-w-5xl">
      <h1 className="text-[26px] font-semibold text-[#2F241F] mb-6">
        👥 База клиентов
      </h1>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Всего клиентов", value: customers.length },
          { label: "Заказов (всего)", value: totalOrders },
          { label: "Выручка",        value: formatRub(totalSpent) },
          { label: "Bloom-баллов",   value: totalPts.toLocaleString("ru") },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-[16px] border border-[#E6D8CA] p-4">
            <div className="text-[12px] text-[#6B5B52] mb-1">{label}</div>
            <div className="text-[22px] font-bold text-[#2F241F]">{value}</div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="text-[13px] text-[#9B8880] mb-4">
        Данные синхронизируются из Telegram-бота командой <code className="bg-[#F5EDE8] px-1 rounded">/sync</code>.
        {vipCount > 0 && ` ⭐ VIP-клиентов: ${vipCount}`}
      </p>

      {/* Table */}
      <div className="flex flex-col gap-3">
        {customers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[15px] shrink-0"
              style={{ background: "linear-gradient(135deg,#B24C63,#5b2330)" }}
            >
              {(c.full_name || c.username || "?")[0].toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#2F241F] text-[15px]">
                  {c.full_name || c.username || `ID ${c.telegram_user_id}`}
                </span>
                {c.tags === "vip" && (
                  <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">VIP</span>
                )}
              </div>
              <div className="text-[13px] text-[#6B5B52] mt-0.5 flex gap-3 flex-wrap">
                {c.username && <span>@{c.username}</span>}
                {c.phone && <span>📞 {c.phone}</span>}
                <a
                  href={`tg://user?id=${c.telegram_user_id}`}
                  className="text-[#B24C63] hover:underline"
                >
                  TG #{c.telegram_user_id}
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 sm:gap-6 items-center shrink-0 text-center">
              <div>
                <div className="text-[11px] text-[#9B8880]">Заказов</div>
                <div className="text-[16px] font-bold text-[#2F241F]">{c.order_count}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#9B8880]">Потрачено</div>
                <div className="text-[16px] font-bold text-[#2F241F]">{formatRub(c.total_spent)}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#9B8880]">Bloom</div>
                <div
                  className="text-[16px] font-bold"
                  style={{ color: tierColor(c.loyalty_points) }}
                >
                  {c.loyalty_points}
                </div>
              </div>
            </div>

            {/* Tier badge */}
            <div
              className="text-[12px] font-semibold px-3 py-1 rounded-full shrink-0"
              style={{ color: tierColor(c.loyalty_points), background: tierColor(c.loyalty_points) + "20" }}
            >
              {tier(c.loyalty_points)}
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="bg-white rounded-[16px] border border-[#E6D8CA] p-12 text-center text-[#6B5B52]">
            Клиентов пока нет. Запустите <code>/sync</code> в боте.
          </div>
        )}
      </div>
    </div>
  );
}
