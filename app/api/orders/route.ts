import { NextResponse, type NextRequest } from "next/server";

/**
 * Mock /api/orders — accepts any payload and returns a fake order id.
 * No DB writes in demo mode.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId = Math.floor(1000 + Math.random() * 9000);
    return NextResponse.json({
      ok: true,
      orderId,
      received: body,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 },
    );
  }
}
