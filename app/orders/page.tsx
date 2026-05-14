import { Header } from "@/components/layout/Header";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { formatRub } from "@/lib/pricing";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default function OrdersPage() {
  const orders = MOCK_ORDERS;

  return (
    <>
      <Header title="Мои заказы" showBack />
      <main className="flex-1 max-w-screen-sm mx-auto w-full px-5 py-6">
        {orders.length === 0 ? (
          <EmptyState
            title="Здесь пока пусто"
            description="Выберите букет — и он появится здесь после оформления."
            action={
              <ButtonLink href="/" variant="primary" size="lg">
                Выбрать букет
              </ButtonLink>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="bg-surface rounded-card p-5 border border-border-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label text-text-secondary">
                    №{order.id} · {order.createdAt}
                  </span>
                  <span className="text-micro text-accent-primary uppercase tracking-wide">
                    {order.status}
                  </span>
                </div>
                <div className="text-body text-text-primary font-semibold">
                  {order.productTitle}
                </div>
                <div className="mt-2 text-h2 text-text-primary">
                  {formatRub(order.total)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
