import { readDB } from "@/lib/db";
import { formatRub } from "@/lib/pricing";
import { PromoToggle, PromoDelete, AddPromoForm } from "./PromoClient";

export const dynamic = "force-dynamic";

export default function AdminPromoCodesPage() {
  const db = readDB();

  return (
    <div className="max-w-3xl">
      <h1 className="text-[26px] font-semibold text-[#2F241F] mb-6">Промокоды</h1>

      {/* List */}
      <div className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F0E8DE]">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Код</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Скидка</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Описание</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Активен</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7F2EC]">
            {db.promoCodes.map((p) => (
              <tr key={p.code} className="hover:bg-[#FDFAF7]">
                <td className="px-4 py-3 font-mono text-[14px] font-semibold text-[#2F241F]">{p.code}</td>
                <td className="px-4 py-3 text-[14px] text-[#B24C63] font-semibold">
                  {p.type === "percent" ? `${p.value}%` : `−${formatRub(p.value)}`}
                </td>
                <td className="px-4 py-3 text-[13px] text-[#6B5B52] max-w-[200px] truncate">{p.description}</td>
                <td className="px-4 py-3">
                  <PromoToggle code={p.code} active={p.active} />
                </td>
                <td className="px-4 py-3">
                  <PromoDelete code={p.code} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm p-5">
        <h2 className="text-[15px] font-semibold text-[#2F241F] mb-4">Добавить промокод</h2>
        <AddPromoForm />
      </div>
    </div>
  );
}
