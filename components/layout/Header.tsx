"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getTelegram, hapticLight } from "@/lib/telegram";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  /** Override default back navigation (router.back). */
  onBack?: () => void;
}

export function Header({ title, showBack = false, onBack }: HeaderProps) {
  const router = useRouter();

  // Wire Telegram BackButton if available
  useEffect(() => {
    const tg = getTelegram();
    if (!tg) return;
    if (!showBack) {
      tg.BackButton.hide();
      return;
    }
    const handler = () => {
      hapticLight();
      if (onBack) onBack();
      else router.back();
    };
    tg.BackButton.show();
    tg.BackButton.onClick(handler);
    return () => {
      tg.BackButton.offClick(handler);
      tg.BackButton.hide();
    };
  }, [showBack, onBack, router]);

  return (
    <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="max-w-screen-sm mx-auto h-14 px-5 flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={() => {
              hapticLight();
              if (onBack) onBack();
              else router.back();
            }}
            aria-label="Назад"
            className="w-11 h-11 -ml-2 flex items-center justify-center rounded-pill text-text-primary active:bg-surface-muted"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 4L6 10l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {title && (
          <h1 className="text-h2 text-text-primary truncate">{title}</h1>
        )}
      </div>
    </header>
  );
}
