"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { hapticLight, hapticSuccess } from "@/lib/telegram";

const OCCASIONS = [
  "День рождения",
  "Свидание",
  "Извинение",
  "Без повода",
];

const BUDGETS = ["до 3 000 ₽", "3 000–5 000 ₽", "5 000–8 000 ₽", "8 000+ ₽"];

export function ConsultationClient() {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [occasion, setOccasion] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = comment.trim().length >= 3 && !submitting;

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation",
          comment,
          occasion,
          budget,
        }),
      });
      hapticSuccess();
      router.push(`/success?orderId=консультация`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 max-w-screen-sm mx-auto w-full px-5 py-6 pb-40">
      <p className="text-body text-text-secondary mb-6">
        Опишите идею — флорист подберёт пару вариантов и напишет в личку.
      </p>

      <section className="flex flex-col gap-2 mb-6">
        <div className="text-label uppercase tracking-wide text-text-secondary">
          Комментарий
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Например: нежный букет с пионами до 5 000 ₽, на завтра вечер"
          rows={5}
          className="w-full p-4 rounded-card bg-surface border border-border-soft text-body focus:outline-none focus:border-accent-primary resize-none"
        />
      </section>

      <section className="mb-6">
        <div className="text-label uppercase tracking-wide text-text-secondary mb-2">
          Повод (опционально)
        </div>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <Pill
              key={o}
              active={occasion === o}
              onClick={() => {
                hapticLight();
                setOccasion(occasion === o ? null : o);
              }}
            >
              {o}
            </Pill>
          ))}
        </div>
      </section>

      <section>
        <div className="text-label uppercase tracking-wide text-text-secondary mb-2">
          Бюджет (опционально)
        </div>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <Pill
              key={b}
              active={budget === b}
              onClick={() => {
                hapticLight();
                setBudget(budget === b ? null : b);
              }}
            >
              {b}
            </Pill>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border-soft" style={{ boxShadow: "var(--shadow-sticky)" }}>
        <div className="max-w-screen-sm mx-auto px-5 pt-3 pb-[max(env(safe-area-inset-bottom),16px)]">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            onClick={submit}
          >
            {submitting ? "Отправляем…" : "Отправить флористу"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function Pill({
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
      onClick={onClick}
      className={`px-4 h-10 rounded-pill text-label transition-colors ${
        active
          ? "bg-text-primary text-bg"
          : "bg-surface border border-border-soft text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}
