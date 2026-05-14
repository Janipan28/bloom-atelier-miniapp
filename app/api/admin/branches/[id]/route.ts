import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = readDB();
  const idx = db.branches.findIndex((b) => b.id === Number(id));
  if (idx === -1) return NextResponse.json({ error: "not found" }, { status: 404 });
  db.branches[idx] = { ...db.branches[idx], ...body, id: Number(id) };
  writeDB(db);
  return NextResponse.json({ ok: true, branch: db.branches[idx] });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const before = db.branches.length;
  db.branches = db.branches.filter((b) => b.id !== Number(id));
  if (db.branches.length === before) return NextResponse.json({ error: "not found" }, { status: 404 });
  writeDB(db);
  return NextResponse.json({ ok: true });
}
