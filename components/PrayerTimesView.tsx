"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Sunrise as SunriseIcon, Sun, CloudSun, Sunset, Moon, Star } from "lucide-react";
import {
  getPrayerTimesByCity,
  getPrayerTimesByCoords,
  UZBEK_CITIES,
  PRAYER_LABELS,
  type PrayerTimesResult,
  type PrayerTimes,
} from "@/lib/prayerApi";

const ICONS: Record<keyof PrayerTimes, typeof Sun> = {
  Fajr: Star,
  Sunrise: SunriseIcon,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
};

function parseTimeToday(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export default function PrayerTimesView() {
  const [result, setResult] = useState<PrayerTimesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  async function loadByCity(cityName: string) {
    const city = UZBEK_CITIES.find((c) => c.name === cityName) ?? UZBEK_CITIES[0];
    setLoading(true);
    setError(null);
    try {
      const data = await getPrayerTimesByCity(city.name, city.country, city.name);
      setResult(data);
    } catch {
      setError("Namoz vaqtlarini yuklashda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      const id = setTimeout(() => loadByCity(UZBEK_CITIES[0].name), 0);
      return () => clearTimeout(id);
    }
    const timeout = setTimeout(() => loadByCity(UZBEK_CITIES[0].name), 6000);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeout);
        setLoading(true);
        setError(null);
        try {
          const data = await getPrayerTimesByCoords(
            pos.coords.latitude,
            pos.coords.longitude,
            "Joriy joylashuv"
          );
          setResult(data);
        } catch {
          setError("Namoz vaqtlarini yuklashda xatolik yuz berdi.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        clearTimeout(timeout);
        loadByCity(UZBEK_CITIES[0].name);
      },
      { timeout: 5000 }
    );
    return () => clearTimeout(timeout);
  }, []);

  const nextPrayer = useMemo(() => {
    if (!result) return null;
    const entries = (Object.keys(PRAYER_LABELS) as (keyof PrayerTimes)[])
      .filter((k) => k !== "Sunrise")
      .map((key) => ({ key, time: parseTimeToday(result.timings[key]) }));
    const upcoming = entries.find((e) => e.time.getTime() > now.getTime());
    return upcoming ?? entries[0];
  }, [result, now]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-[var(--tg-hint-color)]" />
        <select
          value={result?.locationLabel ?? ""}
          onChange={(e) => {
            if (e.target.value) loadByCity(e.target.value);
          }}
          className="flex-1 rounded-lg border border-black/10 bg-[var(--tg-secondary-bg-color)] px-3 py-2 text-sm dark:border-white/10"
        >
          {result && !UZBEK_CITIES.some((c) => c.name === result.locationLabel) && (
            <option value={result.locationLabel}>{result.locationLabel}</option>
          )}
          {UZBEK_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="rounded-xl bg-[var(--tg-secondary-bg-color)] p-6 text-center text-sm text-[var(--tg-hint-color)]">
          Yuklanmoqda...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl bg-red-500/10 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {result && !loading && (
        <>
          <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-center text-white">
            <p className="text-xs text-emerald-100">{result.gregorianDate}</p>
            <p className="mt-1 text-sm">{result.hijriDate} h.</p>
          </div>

          <ul className="flex flex-col divide-y divide-black/5 overflow-hidden rounded-xl bg-[var(--tg-secondary-bg-color)] dark:divide-white/10">
            {(Object.keys(PRAYER_LABELS) as (keyof PrayerTimes)[]).map((key) => {
              const Icon = ICONS[key];
              const active = nextPrayer?.key === key;
              return (
                <li
                  key={key}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    active ? "bg-emerald-600/10" : ""
                  }`}
                >
                  <Icon
                    size={18}
                    className={active ? "text-emerald-600" : "text-[var(--tg-hint-color)]"}
                  />
                  <span
                    className={`flex-1 text-sm ${
                      active ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""
                    }`}
                  >
                    {PRAYER_LABELS[key]}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      active ? "font-semibold text-emerald-700 dark:text-emerald-400" : ""
                    }`}
                  >
                    {result.timings[key]}
                  </span>
                  {active && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
                      Navbatdagi
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="text-center text-[11px] leading-relaxed text-[var(--tg-hint-color)]">
            Hisoblash usuli: Muslim World League. Vaqtlar mahalliy masjid e&apos;lonlaridan
            bir necha daqiqaga farq qilishi mumkin.
          </p>
        </>
      )}
    </div>
  );
}
