"use client";

import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";

export function SuccessClient() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") ?? "1042";

  return (
    <main className="flex-1 max-w-screen-sm mx-auto w-full px-5 py-12 flex flex-col items-center text-center">
      <div
        aria-hidden
        className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M10 20l7 7 14-14"
            stroke="#3B7A57"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-h1 text-text-primary">Заявка №{orderId} отправлена</h1>
      <p className="text-body text-text-secondary mt-3 max-w-xs">
        Флорист проверит наличие, согласует доставку и оплату.
        Обычно отвечаем в течение 5–10 минут.
      </p>
      <div className="mt-10 flex flex-col gap-3 w-full max-w-sm">
        <ButtonLink href="/orders" variant="primary" size="lg" fullWidth>
          Мои заказы
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg" fullWidth>
          Вернуться в каталог
        </ButtonLink>
      </div>
    </main>
  );
}
