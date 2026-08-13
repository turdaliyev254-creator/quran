const BASE_URL = "https://api.aladhan.com/v1";
// Muslim World League — keng tarqalgan xalqaro standart. Mahalliy masjid vaqtlaridan bir necha
// daqiqaga farq qilishi mumkin.
const CALCULATION_METHOD = 3;

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesResult {
  timings: PrayerTimes;
  gregorianDate: string;
  hijriDate: string;
  locationLabel: string;
}

interface AladhanResponse {
  data: {
    timings: PrayerTimes & Record<string, string>;
    date: {
      readable: string;
      hijri: { day: string; month: { en: string }; year: string };
    };
  };
}

function pickTimings(raw: PrayerTimes & Record<string, string>): PrayerTimes {
  return {
    Fajr: raw.Fajr,
    Sunrise: raw.Sunrise,
    Dhuhr: raw.Dhuhr,
    Asr: raw.Asr,
    Maghrib: raw.Maghrib,
    Isha: raw.Isha,
  };
}

export async function getPrayerTimesByCoords(
  latitude: number,
  longitude: number,
  locationLabel: string
): Promise<PrayerTimesResult> {
  const res = await fetch(
    `${BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=${CALCULATION_METHOD}`
  );
  if (!res.ok) throw new Error("Namoz vaqtlarini yuklab bo'lmadi");
  const json: AladhanResponse = await res.json();
  return {
    timings: pickTimings(json.data.timings),
    gregorianDate: json.data.date.readable,
    hijriDate: `${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year}`,
    locationLabel,
  };
}

export async function getPrayerTimesByCity(
  city: string,
  country: string,
  locationLabel: string
): Promise<PrayerTimesResult> {
  const res = await fetch(
    `${BASE_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(
      country
    )}&method=${CALCULATION_METHOD}`
  );
  if (!res.ok) throw new Error("Namoz vaqtlarini yuklab bo'lmadi");
  const json: AladhanResponse = await res.json();
  return {
    timings: pickTimings(json.data.timings),
    gregorianDate: json.data.date.readable,
    hijriDate: `${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year}`,
    locationLabel,
  };
}

export const UZBEK_CITIES = [
  { name: "Toshkent", country: "Uzbekistan" },
  { name: "Samarqand", country: "Uzbekistan" },
  { name: "Buxoro", country: "Uzbekistan" },
  { name: "Andijon", country: "Uzbekistan" },
  { name: "Farg'ona", country: "Uzbekistan" },
  { name: "Namangan", country: "Uzbekistan" },
  { name: "Nukus", country: "Uzbekistan" },
  { name: "Qarshi", country: "Uzbekistan" },
  { name: "Termiz", country: "Uzbekistan" },
  { name: "Urganch", country: "Uzbekistan" },
  { name: "Jizzax", country: "Uzbekistan" },
  { name: "Guliston", country: "Uzbekistan" },
  { name: "Navoiy", country: "Uzbekistan" },
];

export const PRAYER_LABELS: Record<keyof PrayerTimes, string> = {
  Fajr: "Bomdod",
  Sunrise: "Quyosh",
  Dhuhr: "Peshin",
  Asr: "Asr",
  Maghrib: "Shom",
  Isha: "Xufton",
};
