import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function readCustomersCount(): { total: number; vip: number; totalPoints: number } {
  const p = path.join(process.cwd(), "data", "customers.json");
  if (!fs.existsSync(p)) return { total: 0, vip: 0, totalPoints: 0 };
  const data = JSON.parse(fs.readFileSync(p, "utf-8"));
  const customers: Array<{ tags?: string; loyalty_points?: number }> = data.customers ?? [];
  return {
    total: customers.length,
    vip: customers.filter((c) => c.tags === "vip").length,
    totalPoints: customers.reduce((s, c) => s + (c.loyalty_points ?? 0), 0),
  };
}

export async function GET() {
  const db = readDB();
  const webTotal   = db.orders.reduce((s, o) => s + o.total, 0);
  const pending    = db.orders.filter((o) => o.status === "pending" || o.status === "in_progress").length;
  const customers  = readCustomersCount();

  return NextResponse.json({
    productsCount:   db.products.filter((p) => p.stock_status !== "out_of_stock").length,
    ordersCount:     db.orders.length,
    ordersTotal:     webTotal,
    pendingOrders:   pending,
    promoCodesCount: db.promoCodes.filter((p) => p.active).length,
    customersCount:  customers.total,
    vipCount:        customers.vip,
    loyaltyPoints:   customers.totalPoints,
  });
}
