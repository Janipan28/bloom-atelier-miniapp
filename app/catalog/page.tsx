import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { CatalogClient } from "./CatalogClient";

export default function CatalogPage() {
  return (
    <>
      <Header title="Каталог" />
      <Suspense
        fallback={
          <main className="max-w-screen-sm mx-auto w-full px-5 py-6">
            <p className="text-body text-text-secondary">Загружаем каталог…</p>
          </main>
        }
      >
        <CatalogClient />
      </Suspense>
    </>
  );
}
