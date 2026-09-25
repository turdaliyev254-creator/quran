"use client";

import Script from "next/script";
import { useCallback, useEffect } from "react";
import {
  applySafeAreas,
  applyTelegramColorScheme,
  getTelegramWebApp,
  lockVerticalSwipes,
} from "@/lib/telegram";

let initialised = false;

function setupTelegram() {
  const webApp = getTelegramWebApp();
  if (!webApp || initialised) return;
  initialised = true;

  webApp.ready();
  webApp.expand();
  lockVerticalSwipes(webApp);
  applySafeAreas(webApp);
  applyTelegramColorScheme(webApp);

  const onInsets = () => applySafeAreas(webApp);
  const onTheme = () => applyTelegramColorScheme(webApp);
  const onFullscreen = () => {
    applySafeAreas(webApp);
    lockVerticalSwipes(webApp);
  };
  webApp.onEvent("safeAreaChanged", onInsets);
  webApp.onEvent("contentSafeAreaChanged", onInsets);
  webApp.onEvent("themeChanged", onTheme);
  webApp.onEvent("fullscreenChanged", onFullscreen);
  webApp.onEvent("viewportChanged", onInsets);

  const userId = webApp.initDataUnsafe?.user?.id;
  if (userId) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  }
}

export default function TelegramInit() {
  const handleLoad = useCallback(() => setupTelegram(), []);

  // Skript allaqachon yuklangan bo'lsa (klient navigatsiyasi) qayta sozlaymiz.
  useEffect(() => {
    if (getTelegramWebApp()) setupTelegram();
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}
