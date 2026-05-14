"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/stores/cart";
import { ADDONS, getProductById, PROMO_CODES } from "@/lib/mock-data";
import { calculateCart, formatRub, priceForSize } from "@/lib/pricing";
import { ButtonLink, Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { hapticLight, hapticSuccess } from "@/lib/telegram";

export function CartClient() {
  const router = useRouter();
  const { items, hydrated, setQty, remove, clear } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const totals = calculateCart({
    items,
    deliveryType: "delivery",
    promoCode: appliedPromo ?? undefined,
  });

  function applyPromo() {
    hapticLight();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      hapticSuccess();
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError("Промокод не найден");
    }
  }

  if (!hydrated) {
    return (
      <main className="max-w-screen-sm mx-auto w-full px-5 py-8">
        <p className="text-body text-text-secondary">Загружаем корзину…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-screen-sm mx-auto w-full px-5 py-8">
        <EmptyState
          title="Корзина пуста"
          description="Добавьте букет — а если не знаете, что выбрать, флорист поможет."
          action={
            <ButtonLink href="/" variant="primary" size="lg">
              К каталогу
            </ButtonLink>
          }
        />
      </main>
    );
  }

  return (
    <main className="max-w-screen-sm mx-auto w-full pb-40">
      <div className="px-5 pt-3 flex items-center justify-between">
        <span className="text-micro text-text-secondary">
          {items.length} {pluralize(items.length, ["букет", "букета", "букетов"])}
        </span>
        <button
          type="button"
          onClick={() => {
            hapticLight();
            clear();
          }}
          className="text-micro text-text-secondary underline"
        >
          Очистить
        </button>
      </div>

      <ul className="px-5 pt-3 flex flex-col gap-3">
        {items.map((ci) => {
          const product = getProductById(ci.productId);
          if (!product) return null;
          const mul =
            product.sizes?.find((s) => s.code === ci.size)?.multiplier ?? 1;
          const linePrice = priceForSize(product.price, mul);
          return (
            <li
              key={`${ci.productId}-${ci.size}`}
              className="bg-surface rounded-card border border-border-soft p-3 flex gap-3"
            >
              <div className="relative w-24 h-24 rounded-card overflow-hidden bg-surface-muted shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-body font-semibold text-text-primary line-clamp-2">
                      {product.title}
                    </div>
                    <div className="text-micro text-text-secondary mt-0.5">
                      Размер {ci.size}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      remove(ci.productId, ci.size);
                    }}
                    aria-label="Удалить"
                    className="text-text-secondary p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 7h14M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                {ci.addons.length > 0 && (
                  <ul className="mt-1 text-micro text-text-secondary">
                    {ci.addons.map((code) => {
                      const a = ADDONS.find((x) => x.code === code);
                      return a ? (
                        <li key={code}>+ {a.title}</li>
                      ) : null;
                    })}
                  </ul>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <QtyControl
                    value={ci.qty}
                    onDec={() => setQty(ci.productId, ci.size, ci.qty - 1)}
                    onInc={() => setQty(ci.productId, ci.size, ci.qty + 1)}
                  />
                  <div className="text-label font-semibold text-text-primary">
                    {formatRub(linePrice * ci.qty)}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Promo */}
      <section className="px-5 mt-5">
        <div className="text-label uppercase tracking-wide text-text-secondary mb-2">
          Промокод
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="SPRING2026"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-1 h-12 px-4 rounded-button bg-surface border border-border-soft text-body uppercase focus:outline-none focus:border-accent-primary"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="h-12 px-5 rounded-button border border-border-soft bg-surface text-label text-text-primary active:scale-95"
          >
            Применить
          </button>
        </div>
        {appliedPromo && (
          <p className="text-micro text-success mt-2">
            ✓ Промокод {appliedPromo} применён ({PROMO_CODES[appliedPromo].description})
          </p>
        )}
        {promoError && (
          <p className="text-micro text-error mt-2">{promoError}</p>
        )}
      </section>

      {/* Summary */}
      <section className="px-5 mt-5">
        <div className="bg-surface rounded-card p-5 border border-border-soft flex flex-col gap-2">
          <Row label="Букеты" value={formatRub(totals.itemsTotal)} />
          {totals.addonsTotal > 0 && (
            <Row label="Дополнительно" value={formatRub(totals.addonsTotal)} />
          )}
          <Row
            label="Доставка"
            value={formatRub(totals.deliveryPrice)}
            muted={totals.deliveryPrice === 0}
          />
          {totals.discountAmount > 0 && (
            <Row
              label="Скидка"
              value={`−${formatRub(totals.discountAmount)}`}
              accent="success"
            />
          )}
          <div className="border-t border-border-soft pt-3 mt-1 flex items-center justify-between">
            <span className="text-h2 text-text-primary">Итого</span>
            <span className="text-h2 text-accent-primary">
              {formatRub(totals.total)}
            </span>
          </div>
        </div>
      </section>

      {/* Sticky CTA above bottom nav */}
      <div
        className="fixed bottom-[64px] inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border-soft"
        style={{ boxShadow: "var(--shadow-sticky)" }}
      >
        <div className="max-w-screen-sm mx-auto px-5 py-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              hapticLight();
              router.push("/checkout");
            }}
          >
            Оформить · {formatRub(totals.total)}
          </Button>
        </div>
      </div>
    </main>
  );
}

function QtyControl({
  value,
  onDec,
  onInc,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-0 border border-border-soft rounded-pill overflow-hidden bg-surface">
      <button
        type="button"
        onClick={() => {
          hapticLight();
          onDec();
        }}
        aria-label="Уменьшить"
        className="w-9 h-9 flex items-center justify-center text-text-primary active:bg-surface-muted"
      >
        −
      </button>
      <span className="w-8 text-center text-label text-text-primary">{value}</span>
      <button
        type="button"
        onClick={() => {
          hapticLight();
          onInc();
        }}
        aria-label="Увеличить"
        className="w-9 h-9 flex items-center justify-center text-text-primary active:bg-surface-muted"
      >
        +
      </button>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: "success";
}) {
  return (
    <div className="flex items-center justify-between text-body">
      <span className={muted ? "text-text-secondary" : "text-text-secondary"}>
        {label}
      </span>
      <span
        className={
          accent === "success"
            ? "text-success font-semibold"
            : "text-text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}

function pluralize(n: number, [one, few, many]: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
