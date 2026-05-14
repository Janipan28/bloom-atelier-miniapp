import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const product = db.products.find((p) => p.id === Number(id));
  if (!product) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === Number(id));
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  db.products[idx] = { ...db.products[idx], ...body, id: Number(id) };
  writeDB(db);
  return NextResponse.json({ ok: true, product: db.products[idx] });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== Number(id));
  if (db.products.length === before) return NextResponse.json({ error: "not found" }, { status: 404 });
  writeDB(db);
  return NextResponse.json({ ok: true });
}
