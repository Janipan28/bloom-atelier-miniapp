import { NextResponse, type NextRequest } from "next/server";

/**
 * Mock /api/session — accepts Telegram initData and returns a mock user.
 * In demo mode we don't validate the signature.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    user: {
      id: 1,
      username: body?.user?.username ?? "demo_user",
      first_name: body?.user?.first_name ?? "Гость",
    },
  });
}
