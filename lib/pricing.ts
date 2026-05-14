import { ADDONS, DELIVERY_PRICE, PROMO_CODES, getProductById } from "./mock-data";
import type {
  CartItem,
  DeliveryType,
  PriceBreakdown,
  SizeCode,
} from "./types";

export interface CalculateTotalParams {
  productPrice: number;
  deliveryType: DeliveryType;
  addons: string[];
  promoCode?: string;
}

export function calculateTotal(params: CalculateTotalParams): PriceBreakdown {
  const { productPrice, deliveryType, addons, promoCode } = params;

  let servicesTotal = 0;
  const addonLines: { label: string; amount: number }[] = [];
  for (const code of addons) {
    const addon = ADDONS.find((a) => a.code === code);
    if (addon) {
      servicesTotal += addon.price;
      addonLines.push({ label: addon.title, amount: addon.price });
    }
  }

  const deliveryPrice = deliveryType === "delivery" ? DELIVERY_PRICE : 0;
  const discountBase = productPrice + servicesTotal;

  let discountAmount = 0;
  let promoLabel: string | null = null;
  if (promoCode) {
    const normalized = promoCode.trim().toUpperCase();
    const promo = PROMO_CODES[normalized];
    if (promo) {
      if (promo.type === "percent") {
        discountAmount = Math.round(discountBase * (promo.value / 100));
        promoLabel = `Промокод ${normalized} (−${promo.value}%)`;
      } else {
        discountAmount = promo.value;
        promoLabel = `Промокод ${normalized}`;
      }
    }
  }

  const total = Math.max(
    productPrice + servicesTotal + deliveryPrice - discountAmount,
    0,
  );

  const lines: { label: string; amount: number }[] = [
    { label: "Букет", amount: productPrice },
    ...addonLines,
  ];
  if (deliveryPrice > 0) lines.push({ label: "Доставка", amount: deliveryPrice });
  if (discountAmount > 0 && promoLabel)
    lines.push({ label: promoLabel, amount: -discountAmount });

  return {
    productPrice,
    deliveryPrice,
    servicesTotal,
    discountAmount,
    total,
    lines,
  };
}

export function formatRub(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  return `${sign}${abs.toLocaleString("ru-RU").replace(/,/g, " ")} ₽`;
}

export function priceForSize(
  basePrice: number,
  multiplier: number | undefined,
): number {
  return Math.round(basePrice * (multiplier ?? 1));
}

/* ── Cart-level pricing ───────────────────────────────────────── */

export interface CartTotals {
  itemsTotal: number;
  addonsTotal: number;
  deliveryPrice: number;
  discountAmount: number;
  total: number;
  lines: { label: string; amount: number }[];
}

interface CalcCartParams {
  items: CartItem[];
  deliveryType: DeliveryType;
  promoCode?: string;
}

export function calculateCart({
  items,
  deliveryType,
  promoCode,
}: CalcCartParams): CartTotals {
  let itemsTotal = 0;
  let addonsTotal = 0;
  const lines: { label: string; amount: number }[] = [];

  for (const ci of items) {
    const product = getProductById(ci.productId);
    if (!product) continue;
    const mul =
      product.sizes?.find((s) => s.code === ci.size)?.multiplier ?? 1;
    const linePrice = priceForSize(product.price, mul) * ci.qty;
    itemsTotal += linePrice;
    lines.push({
      label: `${product.title} · ${ci.size} × ${ci.qty}`,
      amount: linePrice,
    });
    for (const code of ci.addons) {
      const addon = ADDONS.find((a) => a.code === code);
      if (addon) {
        addonsTotal += addon.price * ci.qty;
        lines.push({
          label: `↳ ${addon.title} × ${ci.qty}`,
          amount: addon.price * ci.qty,
        });
      }
    }
  }

  const deliveryPrice = deliveryType === "delivery" ? DELIVERY_PRICE : 0;
  if (deliveryPrice > 0) {
    lines.push({ label: "Доставка", amount: deliveryPrice });
  }

  const discountBase = itemsTotal + addonsTotal;
  let discountAmount = 0;
  if (promoCode) {
    const normalized = promoCode.trim().toUpperCase();
    const promo = PROMO_CODES[normalized];
    if (promo) {
      discountAmount =
        promo.type === "percent"
          ? Math.round(discountBase * (promo.value / 100))
          : promo.value;
      lines.push({
        label: `Промокод ${normalized}`,
        amount: -discountAmount,
      });
    }
  }

  const total = Math.max(
    itemsTotal + addonsTotal + deliveryPrice - discountAmount,
    0,
  );

  return { itemsTotal, addonsTotal, deliveryPrice, discountAmount, total, lines };
}

export type { SizeCode };
