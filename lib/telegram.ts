export interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  themeParams: TelegramThemeParams;
  colorScheme: "light" | "dark";
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

export function applyTelegramTheme(webApp: TelegramWebApp) {
  const root = document.documentElement;
  const theme = webApp.themeParams;

  const mapping: Record<string, string | undefined> = {
    "--tg-bg-color": theme.bg_color,
    "--tg-text-color": theme.text_color,
    "--tg-hint-color": theme.hint_color,
    "--tg-link-color": theme.link_color,
    "--tg-button-color": theme.button_color,
    "--tg-button-text-color": theme.button_text_color,
    "--tg-secondary-bg-color": theme.secondary_bg_color,
  };

  for (const [cssVar, value] of Object.entries(mapping)) {
    if (value) root.style.setProperty(cssVar, value);
  }

  root.dataset.tgColorScheme = webApp.colorScheme;
}

export function hapticSelect() {
  getTelegramWebApp()?.HapticFeedback?.selectionChanged();
}

export function hapticImpact(style: "light" | "medium" | "heavy" | "rigid" | "soft" = "light") {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
}
