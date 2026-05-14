"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BranchDelete({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function del() {
    if (!confirm("Удалить филиал?")) return;
    setLoading(true);
    await fetch(`/api/admin/branches/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={del}
      disabled={loading}
      className="shrink-0 px-3 py-1.5 rounded-[10px] text-[13px] text-[#6B5B52] border border-[#E6D8CA] hover:border-[#A83C3C] hover:text-[#A83C3C] transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "Удалить"}
    </button>
  );
}

export function AddBranchForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, address, work_hours: hours, phone }),
    });
    const data = await res.json();
    if (data.ok) {
      setTitle(""); setAddress(""); setHours(""); setPhone("");
      router.refresh();
    } else {
      setError(data.error ?? "Ошибка");
    }
    setSaving(false);
  }

  const inputCls =
    "h-10 px-3 rounded-[10px] border border-[#E6D8CA] bg-[#F7F2EC] text-[14px] text-[#2F241F] focus:outline-none focus:border-[#B24C63]";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      {error && <p className="text-[13px] text-[#A83C3C]">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название (Центральный)" required className={inputCls} />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес" required className={inputCls} />
        <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Часы работы (Пн–Вс 9:00–21:00)" className={inputCls} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (900) 000-00-00" className={inputCls} />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="self-start px-5 py-2.5 rounded-[12px] bg-[#B24C63] text-white text-[14px] font-semibold disabled:opacity-50 hover:bg-[#963C52] transition-colors"
      >
        {saving ? "Сохраняем…" : "Добавить филиал"}
      </button>
    </form>
  );
}
