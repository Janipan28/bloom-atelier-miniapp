import { readDB } from "@/lib/db";
import { BranchDelete, AddBranchForm } from "./BranchClient";

export const dynamic = "force-dynamic";

export default function AdminBranchesPage() {
  const db = readDB();

  return (
    <div className="max-w-3xl">
      <h1 className="text-[26px] font-semibold text-[#2F241F] mb-6">Филиалы</h1>

      <div className="flex flex-col gap-3 mb-8">
        {db.branches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm p-5 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-[#2F241F] mb-0.5">{b.title}</div>
              <div className="text-[13px] text-[#6B5B52]">{b.address}</div>
              <div className="flex gap-4 mt-2 text-[12px] text-[#6B5B52]">
                <span>🕐 {b.work_hours}</span>
                <span>📞 {b.phone}</span>
              </div>
            </div>
            <BranchDelete id={b.id} />
          </div>
        ))}
        {db.branches.length === 0 && (
          <div className="bg-white rounded-[16px] border border-[#E6D8CA] p-12 text-center text-[#6B5B52]">
            Филиалов пока нет
          </div>
        )}
      </div>

      <div className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm p-5">
        <h2 className="text-[15px] font-semibold text-[#2F241F] mb-4">Добавить филиал</h2>
        <AddBranchForm />
      </div>
    </div>
  );
}
