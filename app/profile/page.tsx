import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MOCK_ADDRESSES, MOCK_ORDERS } from "@/lib/mock-data";
import { formatRub } from "@/lib/pricing";

export default function ProfilePage() {
  const points = 1250;
  const nextTier = 2000;
  const progress = Math.min(100, Math.round((points / nextTier) * 100));

  return (
    <>
      <Header title="Профиль" />
      <main className="max-w-screen-sm mx-auto w-full px-5 py-4 flex flex-col gap-5">
        {/* User card */}
        <section className="flex items-center gap-4">
          <div
            aria-hidden
            className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center text-white text-h2 font-semibold"
          >
            Г
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-h2 text-text-primary">Гость</span>
            <span className="text-micro text-text-secondary">
              Войдите через Telegram, чтобы сохранить заказы
            </span>
          </div>
        </section>

        {/* Loyalty card */}
        <section
          className="rounded-card p-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #B24C63 0%, #963C52 50%, #5b2330 100%)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
            Bloom Club
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-display text-white">{points}</span>
            <span className="text-body text-white/80">бонусных ₽</span>
          </div>
          <p className="text-micro text-white/80 mt-2">
            1 балл = 1 ₽. Списываются при оформлении заказа.
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-white/80">
              <span>До «Серебряного» уровня</span>
              <span>
                {points} / {nextTier} ₽
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-pill bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-3 gap-2">
          <Tile href="/orders" emoji="📦" label="Заказы" />
          <Tile href="/wishlist" emoji="♥" label="Избранное" />
          <Tile href="/consultation" emoji="💬" label="Флорист" />
        </section>

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h2 text-text-primary">Последние заказы</h2>
            <Link href="/orders" className="text-label text-accent-primary">
              Все →
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {MOCK_ORDERS.slice(0, 2).map((o) => (
              <li
                key={o.id}
                className="p-4 bg-surface rounded-card border border-border-soft flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-text-secondary">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body font-semibold text-text-primary truncate">
                    {o.productTitle}
                  </div>
                  <div className="text-micro text-text-secondary mt-0.5">
                    №{o.id} · {o.createdAt} · {o.statusLabel}
                  </div>
                </div>
                <div className="text-label text-text-primary">
                  {formatRub(o.total)}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Addresses */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h2 text-text-primary">Адреса</h2>
            <button className="text-label text-accent-primary">+ Добавить</button>
          </div>
          <ul className="flex flex-col gap-2">
            {MOCK_ADDRESSES.map((a) => (
              <li
                key={a.id}
                className="p-4 bg-surface rounded-card border border-border-soft"
              >
                <div className="text-label text-text-secondary">{a.title}</div>
                <div className="text-body text-text-primary mt-1">{a.full}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Settings list */}
        <section className="bg-surface rounded-card border border-border-soft overflow-hidden">
          <SettingRow icon="🔔" label="Уведомления" hint="Все включены" />
          <SettingRow icon="💳" label="Способы оплаты" hint="2 карты" />
          <SettingRow icon="📍" label="Город" hint="Москва" />
          <SettingRow icon="❓" label="Помощь и поддержка" />
        </section>
      </main>
    </>
  );
}

function Tile({
  href,
  emoji,
  label,
}: {
  href: string;
  emoji: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="bg-surface rounded-card border border-border-soft p-3 flex flex-col items-center gap-1 active:scale-95 transition-transform"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-label text-text-primary">{label}</span>
    </Link>
  );
}

function SettingRow({
  icon,
  label,
  hint,
}: {
  icon: string;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 p-4 border-b border-border-soft last:border-b-0 active:bg-surface-muted text-left"
    >
      <span className="text-xl w-7">{icon}</span>
      <span className="flex-1 text-body text-text-primary">{label}</span>
      {hint && <span className="text-micro text-text-secondary">{hint}</span>}
      <span className="text-text-secondary">›</span>
    </button>
  );
}
