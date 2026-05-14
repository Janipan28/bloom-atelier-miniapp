"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BRANCHES, getProductById, PROMO_CODES } from "@/lib/mock-data";
import { calculateCart, formatRub, priceForSize } from "@/lib/pricing";
import type { DeliveryType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/stores/cart";
import { hapticLight, hapticSuccess } from "@/lib/telegram";

type PaymentMethod = "card" | "telegram" | "cash";

export function CheckoutClient() {
  const router = useRouter();
  const { items, hydrated, clear } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Recipient
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  // Delivery
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [address, setAddress] = useState("");
  const [branchId, setBranchId] = useState<number>(BRANCHES[0]?.id ?? 1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");

  // Payment
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const userPoints = 1250;

  const [submitting, setSubmitting] = useState(false);

  const totals = calculateCart({
    items,
    deliveryType,
    promoCode: appliedPromo ?? undefined,
  });

  const pointsDiscount = usePoints ? Math.min(userPoints, totals.total) : 0;
  const finalTotal = Math.max(totals.total - pointsDiscount, 0);

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

  const phoneOk = /^\+?[\d\s\-()]{7,15}$/.test(recipientPhone.trim());
  const step1Ok = recipientName.trim().length >= 2 && phoneOk;
  const step2Ok =
    (deliveryType === "delivery" ? address.trim().length > 3 : true) &&
    date.trim().length > 0 &&
    time.trim().length > 0;
  const step3Ok = Boolean(payment);

  async function submit() {
    if (!step3Ok || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { name: recipientName, phone: recipientPhone, anonymous },
          delivery: { type: deliveryType, address, branchId, date, time, comment },
          items,
          payment,
          promo: appliedPromo,
          pointsSpent: pointsDiscount,
          total: finalTotal,
        }),
      });
      const data = await res.json();
      hapticSuccess();
      clear();
      router.push(`/success?orderId=${data.orderId ?? 1042}`);
    } catch {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="max-w-screen-sm mx-auto w-full px-5 py-12">
        <p className="text-body text-text-secondary">Загружаем…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-screen-sm mx-auto w-full px-5 py-12 text-center">
        <p className="text-body text-text-secondary mb-4">
          Корзина пуста. Сначала выберите букет.
        </p>
        <Button variant="primary" size="lg" onClick={() => router.push("/")}>
          К каталогу
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-screen-sm mx-auto w-full pb-40">
      {/* Stepper */}
      <div className="px-5 pt-3">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                  step >= s
                    ? "bg-accent-primary text-white"
                    : "bg-surface-muted text-text-secondary"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 ${
                    step > s ? "bg-accent-primary" : "bg-surface-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-text-secondary">
          <span>Получатель</span>
          <span>Доставка</span>
          <span>Оплата</span>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-5">
        {step === 1 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-h1 text-text-primary">Кто получит букет?</h2>
            <Field
              label="Имя получателя"
              placeholder="Алина"
              value={recipientName}
              onChange={setRecipientName}
            />
            <Field
              label="Телефон получателя"
              placeholder="+7 999 123-45-67"
              value={recipientPhone}
              onChange={setRecipientPhone}
              inputMode="tel"
            />
            <label className="flex items-center gap-3 p-4 rounded-card bg-surface border border-border-soft cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-5 h-5 accent-accent-primary"
              />
              <div className="flex-1">
                <div className="text-body font-semibold text-text-primary">
                  Анонимная доставка
                </div>
                <div className="text-micro text-text-secondary mt-0.5">
                  Не указывать отправителя в открытке
                </div>
              </div>
            </label>
          </section>
        )}

        {step === 2 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-h1 text-text-primary">Как доставить?</h2>

            {/* Delivery type toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-muted rounded-button">
              <Segment
                active={deliveryType === "delivery"}
                onClick={() => setDeliveryType("delivery")}
              >
                🚚 Доставка
              </Segment>
              <Segment
                active={deliveryType === "pickup"}
                onClick={() => setDeliveryType("pickup")}
              >
                🏪 Самовывоз
              </Segment>
            </div>

            {deliveryType === "delivery" ? (
              <Field
                label="Адрес доставки"
                placeholder="Улица, дом, квартира"
                value={address}
                onChange={setAddress}
              />
            ) : (
              <div className="flex flex-col gap-2">
                <Label>Магазин</Label>
                {BRANCHES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setBranchId(b.id);
                    }}
                    className={`text-left p-4 rounded-card border transition-colors ${
                      branchId === b.id
                        ? "bg-accent-primary/5 border-accent-primary"
                        : "bg-surface border-border-soft"
                    }`}
                  >
                    <div className="text-body font-semibold text-text-primary">
                      {b.title}
                    </div>
                    <div className="text-micro text-text-secondary mt-1">
                      {b.address} · {b.work_hours}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div>
              <Label>Дата и время</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="ДД.ММ"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 px-4 rounded-button bg-surface border border-border-soft text-body focus:outline-none focus:border-accent-primary"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="ЧЧ:ММ"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-12 px-4 rounded-button bg-surface border border-border-soft text-body focus:outline-none focus:border-accent-primary"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Chip
                  onClick={() => {
                    const d = new Date();
                    setDate(
                      d.toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                      }),
                    );
                  }}
                >
                  Сегодня
                </Chip>
                <Chip
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setDate(
                      d.toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                      }),
                    );
                  }}
                >
                  Завтра
                </Chip>
                {["12:00", "15:00", "18:00", "20:00"].map((t) => (
                  <Chip key={t} onClick={() => setTime(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <Label>Комментарий курьеру (опционально)</Label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Например: позвонить за 15 минут, не звонить в домофон"
                className="mt-2 w-full p-4 rounded-card bg-surface border border-border-soft text-body focus:outline-none focus:border-accent-primary resize-none"
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-h1 text-text-primary">Способ оплаты</h2>

            {/* Items mini-list */}
            <div className="bg-surface rounded-card border border-border-soft p-4">
              <Label>Заказ</Label>
              <ul className="mt-2 flex flex-col gap-2">
                {items.map((ci) => {
                  const p = getProductById(ci.productId);
                  if (!p) return null;
                  const mul =
                    p.sizes?.find((s) => s.code === ci.size)?.multiplier ?? 1;
                  return (
                    <li
                      key={`${ci.productId}-${ci.size}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-card overflow-hidden bg-surface-muted shrink-0">
                        <Image
                          src={p.images[0]}
                          alt={p.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-text-primary truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-text-secondary">
                          {ci.size} × {ci.qty}
                        </div>
                      </div>
                      <div className="text-label text-text-primary">
                        {formatRub(priceForSize(p.price, mul) * ci.qty)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Payment methods */}
            <div className="flex flex-col gap-2">
              <Label>Оплата</Label>
              <PaymentOption
                active={payment === "card"}
                onClick={() => setPayment("card")}
                emoji="💳"
                title="Картой онлайн"
                hint="VISA, MasterCard, МИР"
              />
              <PaymentOption
                active={payment === "telegram"}
                onClick={() => setPayment("telegram")}
                emoji="✈️"
                title="Telegram Payments"
                hint="Stars или подключённая карта"
              />
              <PaymentOption
                active={payment === "cash"}
                onClick={() => setPayment("cash")}
                emoji="💵"
                title="Наличными при получении"
                hint="Подойдёт для доставки"
              />
            </div>

            {/* Promo */}
            <div>
              <Label>Промокод</Label>
              <div className="flex gap-2 mt-2">
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
                  ✓ Промокод {appliedPromo} применён
                </p>
              )}
              {promoError && (
                <p className="text-micro text-error mt-2">{promoError}</p>
              )}
            </div>

            {/* Loyalty */}
            <label className="flex items-center gap-3 p-4 rounded-card bg-surface border border-border-soft">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
                className="w-5 h-5 accent-accent-primary"
              />
              <div className="flex-1">
                <div className="text-body font-semibold text-text-primary">
                  Списать {userPoints} бонусных ₽
                </div>
                <div className="text-micro text-text-secondary mt-0.5">
                  1 балл = 1 ₽
                </div>
              </div>
            </label>

            {/* Summary */}
            <div className="bg-surface rounded-card p-5 border border-border-soft">
              <div className="flex flex-col gap-2 text-body">
                <Row label="Букеты" value={formatRub(totals.itemsTotal)} />
                {totals.addonsTotal > 0 && (
                  <Row
                    label="Дополнительно"
                    value={formatRub(totals.addonsTotal)}
                  />
                )}
                <Row label="Доставка" value={formatRub(totals.deliveryPrice)} />
                {totals.discountAmount > 0 && (
                  <Row
                    label="Скидка"
                    value={`−${formatRub(totals.discountAmount)}`}
                    accent="success"
                  />
                )}
                {pointsDiscount > 0 && (
                  <Row
                    label="Бонусы"
                    value={`−${formatRub(pointsDiscount)}`}
                    accent="success"
                  />
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border-soft flex items-center justify-between">
                <span className="text-h2 text-text-primary">Итого</span>
                <span className="text-h2 text-accent-primary">
                  {formatRub(finalTotal)}
                </span>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border-soft"
        style={{ boxShadow: "var(--shadow-sticky)" }}
      >
        <div className="max-w-screen-sm mx-auto px-5 py-3 pb-[max(env(safe-area-inset-bottom),12px)] flex items-center gap-3">
          {step > 1 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            >
              Назад
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={step === 1 ? !step1Ok : !step2Ok}
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
            >
              Дальше · {formatRub(finalTotal)}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!step3Ok || submitting}
              onClick={submit}
            >
              {submitting ? "Отправляем…" : `Оплатить · ${formatRub(finalTotal)}`}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

/* ── small helpers ─────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-label uppercase tracking-wide text-text-secondary">
      {children}
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "text" | "tel" | "numeric";
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-12 px-4 rounded-button bg-surface border border-border-soft text-body focus:outline-none focus:border-accent-primary"
      />
    </div>
  );
}

function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        hapticLight();
        onClick();
      }}
      className={`h-11 rounded-button text-label transition-colors ${
        active
          ? "bg-surface text-text-primary shadow-card"
          : "text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        hapticLight();
        onClick();
      }}
      className="px-3 h-9 rounded-pill bg-surface border border-border-soft text-[12px] text-text-primary"
    >
      {children}
    </button>
  );
}

function PaymentOption({
  active,
  onClick,
  emoji,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        hapticLight();
        onClick();
      }}
      className={`flex items-center gap-3 p-4 rounded-card border transition-colors text-left ${
        active
          ? "bg-accent-primary/5 border-accent-primary"
          : "bg-surface border-border-soft"
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <div className="text-body font-semibold text-text-primary">{title}</div>
        <div className="text-micro text-text-secondary">{hint}</div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          active
            ? "border-accent-primary bg-accent-primary"
            : "border-border-soft"
        }`}
      >
        {active && (
          <div className="w-full h-full rounded-full flex items-center justify-center text-white text-[10px]">
            ✓
          </div>
        )}
      </div>
    </button>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
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
