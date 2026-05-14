"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(data.error ?? "Ошибка");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2EC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-[32px] mb-2">🌸</div>
          <h1 className="text-[24px] font-semibold text-[#2F241F]">Bloom Atelier</h1>
          <p className="text-[14px] text-[#6B5B52] mt-1">Панель управления</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-[20px] p-6 shadow-[0_10px_30px_rgba(80,54,36,0.10)]"
        >
          <label className="block mb-1 text-[12px] font-semibold uppercase tracking-wider text-[#6B5B52]">
            Пароль
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className="w-full h-12 px-4 rounded-[14px] border border-[#E6D8CA] bg-[#F7F2EC] text-[15px] text-[#2F241F] focus:outline-none focus:border-[#B24C63] mb-4"
          />
          {error && (
            <p className="text-[13px] text-[#A83C3C] mb-3">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full h-12 rounded-[14px] bg-[#B24C63] text-white text-[15px] font-semibold disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {loading ? "Входим…" : "Войти"}
          </button>
        </form>

        <p className="text-center text-[12px] text-[#6B5B52] mt-6">
          Пароль по умолчанию: <code className="bg-white px-2 py-0.5 rounded text-[#B24C63]">admin123</code>
        </p>
      </div>
    </div>
  );
}
