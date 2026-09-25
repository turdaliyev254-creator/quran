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
      <label className="tile tile-plain flex items-center gap-3 rounded-2xl px-4 py-3">
        <MapPin size={20} className="shrink-0 text-cobalt dark:text-gold" />
        <select
          value={result?.locationLabel ?? ""}
          onChange={(e) => {
            if (e.target.value) loadByCity(e.target.value);
          }}
          aria-label="Shahar"
          className="w-full bg-transparent text-[16px] font-bold outline-none"
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
      </label>

      {loading && (
        <div className="tile tile-plain rounded-2xl p-6 text-center text-sm font-semibold text-muted">
          Yuklanmoqda…
        </div>
      )}

      {error && !loading && (
        <div className="tile tile-coral rounded-2xl p-4 text-center text-sm font-semibold">{error}</div>
      )}

      {result && !loading && (
        <>
          <div
            className="tile tile-cobalt khatam rounded-[24px] p-5"
            style={{ "--khatam-opacity": 0.13 } as React.CSSProperties}
          >
            <p className="font-display text-2xl font-extrabold tabular">{result.gregorianDate}</p>
            <p className="mt-1 text-sm text-white/85">{result.hijriDate} h.</p>
            {nextPrayer && (
              <p className="mt-4 text-[15px] font-semibold">
                Navbatdagi: <span className="text-gold">{PRAYER_LABELS[nextPrayer.key]}</span>{" "}
                <span className="tabular">{result.timings[nextPrayer.key]}</span>
              </p>
            )}
          </div>

          <ul className="flex flex-col gap-2.5">
            {(Object.keys(PRAYER_LABELS) as (keyof PrayerTimes)[]).map((key) => {
              const Icon = ICONS[key];
              const active = nextPrayer?.key === key;
              return (
                <li
                  key={key}
                  className={`tile flex items-center gap-3 rounded-[20px] px-4 py-3.5 ${
                    active ? "tile-gold" : "tile-plain"
                  }`}
                >
                  <Icon size={22} className={active ? "" : "text-cobalt dark:text-gold"} />
                  <span className="flex-1 text-[17px] font-bold">{PRAYER_LABELS[key]}</span>
                  <span className="font-display text-xl font-bold tabular">
                    {result.timings[key]}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="text-center text-xs leading-relaxed text-muted">
            Hisoblash usuli: Muslim World League. Vaqtlar mahalliy masjid e&apos;lonlaridan
            bir necha daqiqaga farq qilishi mumkin.
          </p>
        </>
      )}
    </div>
  );
}
