"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Удалить этот товар?")) return;
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-[13px] text-[#6B5B52] hover:text-[#A83C3C] transition-colors disabled:opacity-50"
    >
      {loading ? "…" : "Удалить"}
    </button>
  );
}
