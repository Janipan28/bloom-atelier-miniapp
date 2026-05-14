"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderStatusSelect({
  orderId,
  current,
  labels,
}: {
  orderId: number;
  current: string;
  labels: Record<string, string>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className="h-9 px-3 rounded-[10px] border border-[#E6D8CA] bg-[#F7F2EC] text-[13px] text-[#2F241F] focus:outline-none focus:border-[#B24C63] disabled:opacity-50"
    >
      {Object.entries(labels).map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}
