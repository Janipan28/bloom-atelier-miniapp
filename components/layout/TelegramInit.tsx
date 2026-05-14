"use client";

import { useEffect } from "react";
import { getTelegram } from "@/lib/telegram";

/**
 * Client-only Telegram WebApp initializer.
 * Calls `ready()` and `expand()` once on mount. Safe to render outside Telegram —
 * gracefully no-ops if `window.Telegram.WebApp` is unavailable.
 */
export function TelegramInit() {
  useEffect(() => {
    const tg = getTelegram();
    if (!tg) return;
    try {
      tg.ready();
      tg.expand();
    } catch {
      /* swallow: not running inside Telegram */
    }
  }, []);
  return null;
}
