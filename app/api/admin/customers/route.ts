import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface CustomerRecord {
  id: number;
  telegram_user_id: number;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  loyalty_points: number;
  tags: string | null;
  order_count: number;
  total_spent: number;
  created_at: string;
  last_seen_at: string | null;
}

function readCustomers(): CustomerRecord[] {
  const filePath = path.join(process.cwd(), "data", "customers.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  return data.customers ?? [];
}

export function GET() {
  const customers = readCustomers();
  const totalPoints = customers.reduce((s, c) => s + (c.loyalty_points ?? 0), 0);
  const totalSpent  = customers.reduce((s, c) => s + (c.total_spent ?? 0), 0);
  const totalOrders = customers.reduce((s, c) => s + (c.order_count ?? 0), 0);
  return NextResponse.json({
    customers,
    stats: {
      total: customers.length,
      totalPoints,
      totalSpent,
      totalOrders,
      vip: customers.filter(c => c.tags === "vip").length,
    },
  });
}
