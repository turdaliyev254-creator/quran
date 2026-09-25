export interface TelegramInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  isVersionAtLeast?: (version: string) => boolean;
  enableVerticalSwipes?: () => void;
  disableVerticalSwipes?: () => void;
  colorScheme: "light" | "dark";
  isFullscreen?: boolean;
  initData?: string;
  safeAreaInset?: TelegramInsets;
  contentSafeAreaInset?: TelegramInsets;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

/**
 * Telegram to'liq ekran rejimida o'z tugmalarini (yopish, menyu) kontent ustiga qo'yadi.
 * Xavfsiz zonalarni CSS o'zgaruvchilariga yozamiz: --safe-top, --safe-bottom, ...
 * `safe` = qurilma zonasi (notch), `content` = Telegram tugmalari egallagan zona; ikkalasi yig'iladi.
 */
export function applySafeAreas(webApp: TelegramWebApp) {
  const root = document.documentElement;
  const safe = webApp.safeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const content = webApp.contentSafeAreaInset ?? { top: 0, bottom: 0, left: 0, right: 0 };

  root.style.setProperty("--tg-top", `${safe.top + content.top}px`);
  root.style.setProperty("--tg-bottom", `${safe.bottom + content.bottom}px`);
  root.style.setProperty("--tg-left", `${safe.left + content.left}px`);
  root.style.setProperty("--tg-right", `${safe.right + content.right}px`);
}

/** Telegram tashqarisida skript doim "light" deydi, shuning uchun faqat haqiqiy Mini App'da qo'llaymiz. */
export function applyTelegramColorScheme(webApp: TelegramWebApp) {
  if (!webApp.initData) return;
  document.documentElement.dataset.theme = webApp.colorScheme;
}

/** Pastga surganda ilova yopilib qolmasligi uchun vertikal svaypni o'chiradi (Bot API 7.7+). */
export function lockVerticalSwipes(webApp: TelegramWebApp) {
  try {
    if (webApp.isVersionAtLeast && !webApp.isVersionAtLeast("7.7")) return;
    webApp.disableVerticalSwipes?.();
  } catch {
    // eski Telegram versiyasi — e'tibor bermaymiz
  }
}

export function hapticSelect() {
  getTelegramWebApp()?.HapticFeedback?.selectionChanged();
}

export function hapticImpact(style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light") {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
}

export function hapticNotify(type: "error" | "success" | "warning") {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred(type);
}
