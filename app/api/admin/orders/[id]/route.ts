import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";

const STATUS_LABELS: Record<string, string> = {
  pending: "Новый",
  in_progress: "Флорист собирает",
  ready: "Готов",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json().catch(() => ({}));
  if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });
  const db = readDB();
  const idx = db.orders.findIndex((o) => o.id === Number(id));
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  db.orders[idx] = {
    ...db.orders[idx],
    status,
    statusLabel: STATUS_LABELS[status] ?? status,
  };
  writeDB(db);
  return NextResponse.json({ ok: true, order: db.orders[idx] });
}
