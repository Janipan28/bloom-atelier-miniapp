import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";

  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
  }

  const token = btoa(password);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("adm_tok", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("adm_tok");
  return res;
}
