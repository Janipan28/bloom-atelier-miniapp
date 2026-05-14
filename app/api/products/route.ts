import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/mock-data";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({ products: PRODUCTS });
}
