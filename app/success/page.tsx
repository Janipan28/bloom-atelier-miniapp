import { Suspense } from "react";
import { SuccessClient } from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 max-w-screen-sm mx-auto w-full px-5 py-12">
          <p className="text-body text-text-secondary">Загружаем…</p>
        </main>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
