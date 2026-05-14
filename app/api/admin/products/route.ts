import { NextResponse, type NextRequest } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function GET() {
  const db = readDB();
  return NextResponse.json({ products: db.products });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.price) {
    return NextResponse.json({ ok: false, error: "title and price required" }, { status: 400 });
  }
  const db = readDB();
  const product: Product = {
    id: db.nextProductId,
    title: body.title,
    slug: body.slug || slugify(body.title),
    price: Number(body.price),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
    description: body.description ?? "",
    composition: body.composition ?? "",
    images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
    stock_status: body.stock_status ?? "available",
    is_featured: Boolean(body.is_featured),
    is_new: Boolean(body.is_new),
    badges: Array.isArray(body.badges) ? body.badges : [],
    category: body.category ?? "",
    collectionSlugs: Array.isArray(body.collectionSlugs) ? body.collectionSlugs : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    rating: Number(body.rating) || 0,
    reviewCount: Number(body.reviewCount) || 0,
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
  };
  db.products.push(product);
  db.nextProductId += 1;
  writeDB(db);
  return NextResponse.json({ ok: true, product });
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 60);
}
