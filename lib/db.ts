// Server-side only — not imported in client components
import fs from "fs";
import path from "path";
import type { Product, Category, Collection, Addon, Branch, OrderSummary } from "./types";

export interface PromoCodeRecord {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
  active: boolean;
}

export interface OrderRecord extends OrderSummary {
  recipient?: string;
  phone?: string;
  delivery?: string;
  address?: string;
}

export interface DB {
  nextProductId: number;
  nextOrderId: number;
  products: Product[];
  categories: Category[];
  collections: Collection[];
  addons: Addon[];
  branches: Branch[];
  promoCodes: PromoCodeRecord[];
  orders: OrderRecord[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DB;
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
