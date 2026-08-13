const BASE_URL = "https://api.alquran.cloud/v1";
const REVALIDATE_SECONDS = 60 * 60 * 24;

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  audio?: string;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

interface AlQuranSurahListResponse {
  data: SurahMeta[];
}

interface AlQuranEditionAyah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
}

interface AlQuranEditionSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  ayahs: AlQuranEditionAyah[];
  edition: { identifier: string };
}

interface AlQuranMultiEditionResponse {
  data: AlQuranEditionSurah[];
}

export async function getSurahList(): Promise<SurahMeta[]> {
  const res = await fetch(`${BASE_URL}/surah`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error("Suralar ro'yxatini yuklab bo'lmadi");
  const json: AlQuranSurahListResponse = await res.json();
  return json.data;
}

export async function getSurahDetail(number: number): Promise<SurahDetail> {
  const res = await fetch(
    `${BASE_URL}/surah/${number}/editions/quran-uthmani,uz.sodik,ar.alafasy`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!res.ok) throw new Error("Sura matnini yuklab bo'lmadi");
  const json: AlQuranMultiEditionResponse = await res.json();

  const arabic = json.data.find((e) => e.edition.identifier === "quran-uthmani");
  const translation = json.data.find((e) => e.edition.identifier === "uz.sodik");
  const audio = json.data.find((e) => e.edition.identifier === "ar.alafasy");
  if (!arabic || !translation) throw new Error("Sura ma'lumotlari to'liq emas");

  const ayahs: Ayah[] = arabic.ayahs.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    translation: translation.ayahs[i]?.text ?? "",
    audio: audio?.ayahs[i]?.audio,
  }));

  return {
    number: arabic.number,
    name: arabic.name,
    englishName: arabic.englishName,
    englishNameTranslation: arabic.englishNameTranslation,
    numberOfAyahs: arabic.numberOfAyahs,
    revelationType: arabic.revelationType,
    ayahs,
  };
}
