"use client";

// Minimal Telegram WebApp typing — only what we use.
type ThemeParams = Record<string, string>;

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface BackButton {
  show(): void;
  hide(): void;
  onClick(fn: () => void): void;
  offClick(fn: () => void): void;
}

interface MainButton {
  text: string;
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
  onClick(fn: () => void): void;
  offClick(fn: () => void): void;
  setText(text: string): void;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: { user?: TelegramUser };
  ready(): void;
  expand(): void;
  close(): void;
  BackButton: BackButton;
  MainButton: MainButton;
  colorScheme: "light" | "dark";
  themeParams: ThemeParams;
  HapticFeedback?: {
    impactOccurred(style: "light" | "medium" | "heavy"): void;
    notificationOccurred(type: "error" | "success" | "warning"): void;
    selectionChanged(): void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegram(): boolean {
  const tg = getTelegram();
  return Boolean(tg && tg.initData && tg.initData.length > 0);
}

export function hapticLight(): void {
  getTelegram()?.HapticFeedback?.impactOccurred("light");
}

export function hapticSuccess(): void {
  getTelegram()?.HapticFeedback?.notificationOccurred("success");
}
