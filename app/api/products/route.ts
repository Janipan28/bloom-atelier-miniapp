import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  const db = readDB();
  return NextResponse.json({ products: db.products });
}
