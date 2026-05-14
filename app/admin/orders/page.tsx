import { readDB } from "@/lib/db";
import { formatRub } from "@/lib/pricing";
import { StatusBadge } from "@/components/admin/AdminShell";
import { OrderStatusSelect } from "./OrdersClient";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  pending: "Новый",
  in_progress: "Собирают",
  ready: "Готов",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export default function AdminOrdersPage() {
  const db = readDB();
  const orders = [...db.orders].reverse();

  return (
    <div className="max-w-5xl">
      <h1 className="text-[26px] font-semibold text-[#2F241F] mb-6">Заказы</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-[16px] border border-[#E6D8CA] shadow-sm p-5"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="text-[13px] text-[#6B5B52]">#{order.id}</span>
                  <StatusBadge status={order.status} />
                  <span className="text-[12px] text-[#6B5B52]">{order.createdAt}</span>
                </div>
                <div className="text-[15px] font-semibold text-[#2F241F] mb-1 truncate">{order.productTitle}</div>
                {order.recipient && (
                  <div className="text-[13px] text-[#6B5B52]">
                    {order.recipient} · {order.phone}
                  </div>
                )}
                {order.delivery === "delivery" && order.address && (
                  <div className="text-[13px] text-[#6B5B52] mt-0.5">🚚 {order.address}</div>
                )}
                {order.delivery === "pickup" && (
                  <div className="text-[13px] text-[#6B5B52] mt-0.5">🏪 Самовывоз</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="text-[18px] font-bold text-[#2F241F]">{formatRub(order.total)}</div>
                <OrderStatusSelect orderId={order.id} current={order.status} labels={STATUS_LABELS} />
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="bg-white rounded-[16px] border border-[#E6D8CA] p-12 text-center text-[#6B5B52]">
            Заказов пока нет
          </div>
        )}
      </div>
    </div>
  );
}
