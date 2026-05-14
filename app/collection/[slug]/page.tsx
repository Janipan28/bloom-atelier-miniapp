import Image from "next/image";
import { notFound } from "next/navigation";
import { COLLECTIONS, getProductsByCollection } from "@/lib/mock-data";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  const products = getProductsByCollection(slug);

  return (
    <>
      <Header title={collection.title} showBack />
      <main className="max-w-screen-sm mx-auto w-full pb-8">
        {/* Cover */}
        <div className="relative aspect-[16/9] bg-surface-muted">
          <Image
            src={collection.cover}
            alt={collection.title}
            fill
            sizes="(min-width: 640px) 600px, 100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="text-display max-w-[260px]">{collection.title}</div>
            <div className="text-body text-white/85 mt-2 max-w-md">
              {collection.subtitle}
            </div>
          </div>
        </div>

        <div className="px-5 pt-6">
          <div className="text-micro text-text-secondary mb-3">
            {products.length} букетов в коллекции
          </div>
          {products.length === 0 ? (
            <EmptyState
              title="Скоро здесь появятся букеты"
              description="Эта коллекция в подготовке. Загляните позже."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
