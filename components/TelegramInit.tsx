"use client";

import Script from "next/script";
import { useCallback } from "react";
import { applyTelegramTheme, getTelegramWebApp } from "@/lib/telegram";

export default function TelegramInit() {
  const handleLoad = useCallback(() => {
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    webApp.ready();
    webApp.expand();
    applyTelegramTheme(webApp);
    webApp.onEvent("themeChanged", () => applyTelegramTheme(webApp));
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}
