import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET() {
  const db = readDB();
  return NextResponse.json({ branches: db.branches });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.address) {
    return NextResponse.json({ ok: false, error: "title and address required" }, { status: 400 });
  }
  const db = readDB();
  const nextId = Math.max(0, ...db.branches.map((b) => b.id)) + 1;
  const branch = {
    id: nextId,
    slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-").substring(0, 40),
    title: body.title,
    address: body.address,
    work_hours: body.work_hours ?? "",
    phone: body.phone ?? "",
  };
  db.branches.push(branch);
  writeDB(db);
  return NextResponse.json({ ok: true, branch });
}
