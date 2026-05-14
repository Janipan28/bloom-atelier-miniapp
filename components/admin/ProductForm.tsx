"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

interface Props {
  product?: Partial<Product>;
  categories: { slug: string; title: string; emoji: string }[];
  collections: { slug: string; title: string }[];
  mode: "create" | "edit";
}

const BADGES = ["new", "sale", "bestseller", "premium"] as const;
const STOCK_OPTIONS = [
  { value: "available", label: "В наличии" },
  { value: "low_stock", label: "Заканчивается" },
  { value: "out_of_stock", label: "Нет в наличии" },
];

export function ProductForm({ product, categories, collections, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [oldPrice, setOldPrice] = useState(String(product?.oldPrice ?? ""));
  const [description, setDescription] = useState(product?.description ?? "");
  const [composition, setComposition] = useState(product?.composition ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? [""]);
  const [stockStatus, setStockStatus] = useState(product?.stock_status ?? "available");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [badges, setBadges] = useState<string[]>(product?.badges ?? []);
  const [category, setCategory] = useState(product?.category ?? "");
  const [selectedCollections, setSelectedCollections] = useState<string[]>(product?.collectionSlugs ?? []);
  const [tagsInput, setTagsInput] = useState((product?.tags ?? []).join(", "));
  const [rating, setRating] = useState(String(product?.rating ?? "0"));
  const [reviewCount, setReviewCount] = useState(String(product?.reviewCount ?? "0"));

  function toggleBadge(badge: string) {
    setBadges((prev) => prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]);
  }
  function toggleCollection(slug: string) {
    setSelectedCollections((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  }
  function addImageRow() { setImages((prev) => [...prev, ""]); }
  function removeImageRow(idx: number) { setImages((prev) => prev.filter((_, i) => i !== idx)); }
  function setImage(idx: number, val: string) {
    setImages((prev) => { const next = [...prev]; next[idx] = val; return next; });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !price.trim()) { setError("Название и цена обязательны"); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      description: description.trim(),
      composition: composition.trim(),
      images: images.filter(Boolean),
      stock_status: stockStatus,
      is_featured: isFeatured,
      is_new: isNew,
      badges,
      category,
      collectionSlugs: selectedCollections,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      rating: Number(rating) || 0,
      reviewCount: Number(reviewCount) || 0,
    };

    const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${product?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(data.error ?? "Ошибка сохранения");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl flex flex-col gap-6">
      {error && <div className="bg-red-50 text-red-700 text-[14px] px-4 py-3 rounded-[12px]">{error}</div>}

      {/* Basic */}
      <Card title="Основное">
        <Field label="Название" required>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Букет «Нежность»" className={inputCls} />
        </Field>
        <Field label="Slug (URL)">
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="nezhnost (оставьте пустым — сгенерируется)" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Цена, ₽" required>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4900" className={inputCls} />
          </Field>
          <Field label="Старая цена, ₽">
            <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="оставьте пустым" className={inputCls} />
          </Field>
        </div>
        <Field label="Описание">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={textareaCls} placeholder="Короткое описание для карточки..." />
        </Field>
        <Field label="Состав">
          <textarea value={composition} onChange={(e) => setComposition(e.target.value)} rows={2} className={textareaCls} placeholder="Пионы — 5 шт., эвкалипт..." />
        </Field>
      </Card>

      {/* Images */}
      <Card title="Фотографии">
        <div className="flex flex-col gap-2">
          {images.map((url, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={url}
                onChange={(e) => setImage(i, e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`${inputCls} flex-1`}
              />
              {images.length > 1 && (
                <button type="button" onClick={() => removeImageRow(i)} className="text-[#A83C3C] text-xl leading-none px-1">×</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addImageRow} className="mt-2 text-[13px] text-[#B24C63] hover:underline">
          + Добавить URL
        </button>
      </Card>

      {/* Status & flags */}
      <Card title="Статус и флаги">
        <Field label="Наличие">
          <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value as typeof stockStatus)} className={inputCls}>
            {STOCK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <div className="flex flex-wrap gap-4 mt-2">
          <Toggle label="Рекомендуем" checked={isFeatured} onChange={setIsFeatured} />
          <Toggle label="Новинка" checked={isNew} onChange={setIsNew} />
        </div>
        <Field label="Значки">
          <div className="flex flex-wrap gap-2 mt-1">
            {BADGES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => toggleBadge(b)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold border transition-colors ${
                  badges.includes(b)
                    ? "bg-[#B24C63] text-white border-[#B24C63]"
                    : "bg-white text-[#6B5B52] border-[#E6D8CA]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </Field>
      </Card>

      {/* Category & Collections */}
      <Card title="Категория и коллекции">
        <Field label="Категория">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            <option value="">— не выбрана —</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.emoji} {c.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Коллекции">
          <div className="flex flex-wrap gap-2 mt-1">
            {collections.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleCollection(c.slug)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold border transition-colors ${
                  selectedCollections.includes(c.slug)
                    ? "bg-[#2F241F] text-white border-[#2F241F]"
                    : "bg-white text-[#6B5B52] border-[#E6D8CA]"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Теги (через запятую)">
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="розы, пастель, свидание" className={inputCls} />
        </Field>
      </Card>

      {/* Rating */}
      <Card title="Рейтинг и отзывы">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Рейтинг (0–5)">
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Кол-во отзывов">
            <input type="number" min="0" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className={inputCls} />
          </Field>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-[14px] bg-[#B24C63] text-white text-[14px] font-semibold disabled:opacity-50 hover:bg-[#963C52] transition-colors"
        >
          {saving ? "Сохраняем…" : mode === "create" ? "Создать товар" : "Сохранить изменения"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-[14px] border border-[#E6D8CA] text-[#6B5B52] text-[14px] font-semibold hover:bg-[#F7F2EC] transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

/* ── helpers ── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-[#F0E8DE] text-[12px] font-semibold uppercase tracking-wider text-[#6B5B52]">
        {title}
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#6B5B52] mb-1.5">
        {label}{required && <span className="text-[#B24C63] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#B24C63]" : "bg-[#E6D8CA]"}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </div>
      <span className="text-[14px] text-[#2F241F]">{label}</span>
    </label>
  );
}

const inputCls = "w-full h-11 px-3 rounded-[12px] border border-[#E6D8CA] bg-[#F7F2EC] text-[14px] text-[#2F241F] focus:outline-none focus:border-[#B24C63] transition-colors";
const textareaCls = "w-full px-3 py-2.5 rounded-[12px] border border-[#E6D8CA] bg-[#F7F2EC] text-[14px] text-[#2F241F] focus:outline-none focus:border-[#B24C63] transition-colors resize-none";
