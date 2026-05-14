import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <>
      <Header title="Оформление" showBack />
      <Suspense
        fallback={
          <main className="flex-1 max-w-screen-sm mx-auto w-full px-5 py-8">
            <p className="text-body text-text-secondary">Загружаем…</p>
          </main>
        }
      >
        <CheckoutClient />
      </Suspense>
    </>
  );
}
