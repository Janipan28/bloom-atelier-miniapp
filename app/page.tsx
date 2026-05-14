import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, PRODUCTS, categoryCount } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { HomeHeader } from "@/components/layout/HomeHeader";

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.is_featured).slice(0, 6);
  const newArrivals = PRODUCTS.filter((p) => p.is_new);
  const bestsellers = PRODUCTS.filter((p) => p.badges.includes("bestseller"));
  const cats = categoryCount();

  return (
    <>
      <HomeHeader />
      <main className="flex-1 max-w-screen-sm mx-auto w-full pb-8">
        {/* Hero banner */}
        <section className="px-5 pt-2 pb-6">
          <Link
            href="/collection/spring"
            className="relative block aspect-[16/10] rounded-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=1200&q=80"
              alt="Весна 2026"
              fill
              sizes="(min-width: 640px) 600px, 100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                Коллекция · Весна 2026
              </span>
              <h2 className="text-display mt-1 max-w-[260px]">
                Пастельные сочетания свежих цветов
              </h2>
              <span className="text-label mt-3 underline underline-offset-4">
                Смотреть коллекцию →
              </span>
            </div>
          </Link>
        </section>

        {/* Categories chips */}
        <section className="mb-8">
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 -mb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?cat=${cat.slug}`}
                className="shrink-0 px-4 h-10 rounded-pill bg-surface border border-border-soft flex items-center gap-2 text-[13px] font-medium text-text-primary active:scale-95 transition-transform"
              >
                <span>{cat.emoji}</span>
                <span>{cat.title}</span>
                {typeof cat.count === "number" && (
                  <span className="text-text-secondary text-[11px]">
                    {cat.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured grid */}
        <section className="px-5 mb-10">
          <SectionHeader title="Выбор флориста" link="/catalog" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Collections row */}
        <section className="mb-10">
          <div className="px-5">
            <SectionHeader title="Коллекции" />
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-3 mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.slug}
                href={`/collection/${c.slug}`}
                className="shrink-0 w-[220px] rounded-card overflow-hidden bg-surface border border-border-soft/50"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="relative aspect-[4/3] bg-surface-muted">
                  <Image
                    src={c.cover}
                    alt={c.title}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-3">
                  <div className="text-[14px] font-semibold text-text-primary">
                    {c.title}
                  </div>
                  <div className="text-[12px] text-text-secondary line-clamp-1 mt-0.5">
                    {c.subtitle}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New arrivals row */}
        <section className="px-5 mb-10">
          <SectionHeader title="Новинки" link="/catalog?new=1" />
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {newArrivals.map((p) => (
              <div key={p.id} className="shrink-0 w-[160px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        {/* Bestsellers */}
        <section className="px-5 mb-10">
          <SectionHeader title="Хиты продаж" link="/collection/bestsellers" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {bestsellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Floristic consultation banner */}
        <section className="px-5">
          <Link
            href="/consultation"
            className="block p-5 rounded-card bg-surface-muted border border-border-soft"
          >
            <div className="text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
              Не знаете, что выбрать?
            </div>
            <div className="text-h2 mt-1 text-text-primary">
              Флорист поможет подобрать букет
            </div>
            <div className="text-body text-text-secondary mt-2">
              Опишите повод и бюджет — пришлём 2-3 варианта в течение 15 минут.
            </div>
            <div className="mt-4 inline-flex items-center gap-1 text-label text-accent-primary">
              Спросить флориста <span>→</span>
            </div>
          </Link>
        </section>
      </main>
    </>
  );
}

function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-h1 text-text-primary">{title}</h2>
      {link && (
        <Link
          href={link}
          className="text-label text-accent-primary active:opacity-70"
        >
          Все →
        </Link>
      )}
    </div>
  );
}
