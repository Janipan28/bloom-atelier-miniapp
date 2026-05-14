"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PromoToggle({ code, active }: { code: string; active: boolean }) {
  const router = useRouter();
  const [val, setVal] = useState(active);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !val;
    setVal(next);
    await fetch(`/api/admin/promo-codes/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`relative w-10 h-6 rounded-full transition-colors disabled:opacity-50 ${val ? "bg-[#B24C63]" : "bg-[#E6D8CA]"}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${val ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

export function PromoDelete({ code }: { code: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function del() {
    if (!confirm(`Удалить промокод ${code}?`)) return;
    setLoading(true);
    await fetch(`/api/admin/promo-codes/${code}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={del}
      disabled={loading}
      className="text-[13px] text-[#6B5B52] hover:text-[#A83C3C] transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "Удалить"}
    </button>
  );
}

export function AddPromoForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, type, value: Number(value), description: desc }),
    });
    const data = await res.json();
    if (data.ok) {
      setCode(""); setValue(""); setDesc(""); setType("percent");
      router.refresh();
    } else {
      setError(data.error ?? "Ошибка");
    }
    setSaving(false);
  }

  const inputCls = "h-10 px-3 rounded-[10px] border border-[#E6D8CA] bg-[#F7F2EC] text-[14px] text-[#2F241F] focus:outline-none focus:border-[#B24C63]";

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      {error && <p className="text-[13px] text-[#A83C3C]">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="PROMO10" required className={inputCls} />
        <select value={type} onChange={(e) => setType(e.target.value as "percent" | "fixed")} className={inputCls}>
          <option value="percent">Процент %</option>
          <option value="fixed">Фикс. ₽</option>
        </select>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="10" required className={inputCls} />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Описание" className={inputCls} />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="self-start px-5 py-2.5 rounded-[12px] bg-[#B24C63] text-white text-[14px] font-semibold disabled:opacity-50 hover:bg-[#963C52] transition-colors"
      >
        {saving ? "Сохраняем…" : "Создать промокод"}
      </button>
    </form>
  );
}
