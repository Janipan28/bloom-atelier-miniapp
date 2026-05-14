import Link from "next/link";
import Image from "next/image";
import { readDB } from "@/lib/db";
import { formatRub } from "@/lib/pricing";
import { StatusBadge } from "@/components/admin/AdminShell";
import { DeleteProductButton } from "./ProductsClient";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const db = readDB();

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-semibold text-[#2F241F]">Товары</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#B24C63] text-white text-[14px] font-semibold hover:bg-[#963C52] transition-colors"
        >
          + Добавить
        </Link>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0E8DE] text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Фото</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Название</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Цена</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Статус</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]">Фичер</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B5B52]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F2EC]">
              {db.products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FDFAF7] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded-[10px] overflow-hidden bg-[#F0E8DE] shrink-0">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt={p.title} fill sizes="48px" className="object-cover" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-xl">🌸</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[14px] font-semibold text-[#2F241F] max-w-[200px] truncate">{p.title}</div>
                    <div className="text-[12px] text-[#6B5B52] mt-0.5">{p.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[14px] font-semibold text-[#2F241F]">{formatRub(p.price)}</div>
                    {p.oldPrice && (
                      <div className="text-[12px] text-[#6B5B52] line-through">{formatRub(p.oldPrice)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.stock_status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[13px] ${p.is_featured ? "text-[#B24C63]" : "text-[#6B5B52]"}`}>
                      {p.is_featured ? "⭐ Да" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-[13px] text-[#B24C63] hover:underline"
                      >
                        Изменить
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
