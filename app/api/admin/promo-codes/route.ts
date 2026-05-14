import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET() {
  const db = readDB();
  return NextResponse.json({ promoCodes: db.promoCodes });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.code || !body?.type || body?.value === undefined) {
    return NextResponse.json({ ok: false, error: "code, type, value required" }, { status: 400 });
  }
  const db = readDB();
  const code = String(body.code).trim().toUpperCase();
  if (db.promoCodes.find((p) => p.code === code)) {
    return NextResponse.json({ ok: false, error: "code already exists" }, { status: 409 });
  }
  const record = { code, type: body.type, value: Number(body.value), description: body.description ?? "", active: true };
  db.promoCodes.push(record);
  writeDB(db);
  return NextResponse.json({ ok: true, promoCode: record });
}
