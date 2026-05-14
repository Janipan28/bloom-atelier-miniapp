import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const product = db.products.find((p) => p.id === Number(id));
  if (!product) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-[#6B5B52] hover:text-[#2F241F] text-[14px]">← Товары</Link>
        <span className="text-[#E6D8CA]">/</span>
        <h1 className="text-[22px] font-semibold text-[#2F241F]">Редактировать</h1>
      </div>
      <ProductForm
        mode="edit"
        product={product}
        categories={db.categories}
        collections={db.collections}
      />
    </div>
  );
}
