import { notFound } from "next/navigation";
import { getProductById } from "@/lib/mock-data";
import { Header } from "@/components/layout/Header";
import { ProductDetailClient } from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();
  const product = getProductById(productId);
  if (!product) notFound();

  return (
    <>
      <Header title={product.title} showBack />
      <ProductDetailClient product={product} />
    </>
  );
}
