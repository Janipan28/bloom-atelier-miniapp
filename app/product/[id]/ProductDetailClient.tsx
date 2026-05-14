"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADDONS,
  REVIEWS,
  getRelatedProducts,
} from "@/lib/mock-data";
import { formatRub, priceForSize } from "@/lib/pricing";
import type { Product, SizeCode } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { hapticLight, hapticSuccess } from "@/lib/telegram";

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const cart = useCart();
  const wishlist = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<SizeCode>(
    product.sizes?.find((s) => s.code === "M")?.code ?? product.sizes?.[0]?.code ?? "M",
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const sizeMul =
    product.sizes?.find((s) => s.code === size)?.multiplier ?? 1;
  const priced = priceForSize(product.price, sizeMul);
  const addonsSum = selectedAddons.reduce((sum, code) => {
    const a = ADDONS.find((x) => x.code === code);
    return sum + (a?.price ?? 0);
  }, 0);
  const total = priced + addonsSum;

  const related = useMemo(
    () => getRelatedProducts(product.id, 4),
    [product.id],
  );

  function toggleAddon(code: string) {
    hapticLight();
    setSelectedAddons((curr) =>
      curr.includes(code) ? curr.filter((c) => c !== code) : [...curr, code],
    );
  }

  function addToCart() {
    hapticSuccess();
    cart.add({
      productId: product.id,
      qty: 1,
      size,
      addons: selectedAddons,
    });
    router.push("/cart");
  }

  function buyNow() {
    hapticSuccess();
    cart.add({
      productId: product.id,
      qty: 1,
      size,
      addons: selectedAddons,
    });
    router.push("/checkout");
  }

  const isFav = wishlist.has(product.id);

  return (
    <main className="flex-1 max-w-screen-sm mx-auto w-full pb-32">
      {/* Gallery */}
      <div className="relative aspect-[4/5] w-full bg-surface-muted overflow-hidden">
        <Image
          src={product.images[activeImg] ?? product.images[0]}
          alt={product.title}
          fill
          sizes="(min-width: 640px) 600px, 100vw"
          priority
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => {
            hapticLight();
            wishlist.toggle(product.id);
          }}
          aria-label={isFav ? "Убрать из избранного" : "В избранное"}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-4.35-9-9.05C1.6 8.27 4 5 7.5 5c1.7 0 3.3.8 4.5 2.2C13.2 5.8 14.8 5 16.5 5c3.5 0 5.9 3.27 4.5 6.95C19 16.65 12 21 12 21z"
              stroke={isFav ? "#B24C63" : "#2F241F"}
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill={isFav ? "#B24C63" : "none"}
            />
          </svg>
        </button>

        {/* Pagination dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`Фото ${i + 1}`}
                className={`h-1.5 rounded-pill transition-all ${
                  i === activeImg ? "w-6 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex gap-2 px-5 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {product.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveImg(i)}
              className={`shrink-0 relative w-16 h-16 rounded-card overflow-hidden border-2 transition-colors ${
                i === activeImg ? "border-accent-primary" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 pt-5 flex flex-col gap-5">
        {/* Title + rating */}
        <div>
          <div className="flex items-center gap-2 text-[12px] text-text-secondary">
            <span className="text-accent-secondary text-[14px]">★★★★★</span>
            <span className="text-text-primary font-semibold">
              {product.rating.toFixed(1)}
            </span>
            <span>·</span>
            <span>{product.reviewCount} отзывов</span>
          </div>
          <h1 className="text-h1 text-text-primary mt-2">{product.title}</h1>
          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-display text-accent-primary">
              {formatRub(priced)}
            </span>
            {product.oldPrice && (
              <span className="text-body text-text-secondary line-through">
                {formatRub(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="text-body text-text-secondary mt-3">
            {product.description}
          </p>
        </div>

        {/* Size picker */}
        {product.sizes && product.sizes.length > 1 && (
          <section>
            <Label>Размер</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {product.sizes.map((s) => {
                const sPrice = priceForSize(product.price, s.multiplier);
                const isActive = s.code === size;
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setSize(s.code);
                    }}
                    className={`p-3 rounded-card border text-left transition-colors ${
                      isActive
                        ? "bg-accent-primary/5 border-accent-primary"
                        : "bg-surface border-border-soft"
                    }`}
                  >
                    <div className="text-[14px] font-semibold text-text-primary">
                      {s.code}
                    </div>
                    <div className="text-[11px] text-text-secondary line-clamp-1">
                      {s.label.replace(/^[SML]·?\s*/, "")}
                    </div>
                    <div className="text-[12px] text-accent-primary font-semibold mt-1">
                      {formatRub(sPrice)}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Addons */}
        <section>
          <Label>Дополнительно</Label>
          <div className="flex flex-col gap-2 mt-2">
            {ADDONS.map((a) => {
              const isOn = selectedAddons.includes(a.code);
              return (
                <button
                  key={a.code}
                  type="button"
                  onClick={() => toggleAddon(a.code)}
                  className={`flex items-center justify-between p-4 rounded-card border transition-colors text-left ${
                    isOn
                      ? "bg-accent-primary/5 border-accent-primary"
                      : "bg-surface border-border-soft"
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <div className="text-body font-semibold text-text-primary">
                      {a.title}
                    </div>
                    <div className="text-[12px] text-text-secondary mt-0.5">
                      {a.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-label text-text-primary">
                      +{formatRub(a.price)}
                    </div>
                    <div
                      className={`mt-1 w-6 h-6 ml-auto rounded-full flex items-center justify-center ${
                        isOn ? "bg-accent-primary text-white" : "bg-surface-muted"
                      }`}
                    >
                      {isOn ? "✓" : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Composition */}
        <section className="bg-surface rounded-card p-5 border border-border-soft">
          <Label>Состав</Label>
          <p className="text-body text-text-primary mt-2">
            {product.composition}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
            <Spec label="Срок жизни" value="7–10 дней" />
            <Spec label="Доставка" value="2–4 часа" />
            <Spec label="Размер" value={size} />
            <Spec label="Уход" value="Подрезать стебли" />
          </div>
        </section>

        {/* Reviews */}
        <section>
          <Label>Отзывы ({product.reviewCount})</Label>
          <div className="mt-3 flex flex-col gap-3">
            {REVIEWS.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="bg-surface rounded-card p-4 border border-border-soft"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-text-primary text-[14px]">
                    {r.author}
                  </div>
                  <div className="text-accent-secondary text-[13px]">
                    {"★".repeat(r.rating)}
                  </div>
                </div>
                <div className="text-micro text-text-secondary mt-1">
                  {r.date}
                </div>
                <p className="text-body text-text-primary mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <Label>Похожие букеты</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-[64px] inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border-soft"
        style={{ boxShadow: "var(--shadow-sticky)" }}
      >
        <div className="max-w-screen-sm mx-auto px-5 py-3 flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-text-secondary">Итого</span>
            <span className="text-[18px] font-semibold text-text-primary">
              {formatRub(total)}
            </span>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={addToCart}
            className="flex-1 max-w-[44%]"
          >
            В корзину
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={buyNow}
            className="flex-1"
          >
            Купить
          </Button>
        </div>
      </div>
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-label uppercase tracking-[0.12em] text-text-secondary">
      {children}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-text-secondary">{label}</div>
      <div className="text-text-primary font-semibold mt-0.5">{value}</div>
    </div>
  );
}
