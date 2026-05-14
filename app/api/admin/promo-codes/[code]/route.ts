import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const idx = db.promoCodes.findIndex((p) => p.code === code.toUpperCase());
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  db.promoCodes[idx] = { ...db.promoCodes[idx], ...body, code: code.toUpperCase() };
  writeDB(db);
  return NextResponse.json({ ok: true, promoCode: db.promoCodes[idx] });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const db = readDB();
  const before = db.promoCodes.length;
  db.promoCodes = db.promoCodes.filter((p) => p.code !== code.toUpperCase());
  if (db.promoCodes.length === before) return NextResponse.json({ error: "not found" }, { status: 404 });
  writeDB(db);
  return NextResponse.json({ ok: true });
}
