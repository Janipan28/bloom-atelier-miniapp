import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  const db = readDB();
  const total = db.orders.reduce((s, o) => s + o.total, 0);
  const pending = db.orders.filter((o) => o.status === "pending" || o.status === "in_progress").length;
  return NextResponse.json({
    productsCount: db.products.length,
    ordersCount: db.orders.length,
    ordersTotal: total,
    pendingOrders: pending,
    promoCodesCount: db.promoCodes.filter((p) => p.active).length,
  });
}
