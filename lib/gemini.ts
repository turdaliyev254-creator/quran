const DEFAULT_MODEL = "gemini-3.6-flash";
const ENDPOINT_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const SYSTEM_INSTRUCTION = `Siz — foydalanuvchilarga faqat Qur'oni Karim va sahih (ishonchli) hadislar asosida, o'zbek tilida javob beradigan diniy ma'lumot yordamchisisiz. Quyidagi qoidalarga qat'iy amal qiling:

1. Javobingizni faqat Qur'on oyatlari va asosiy sahih hadis to'plamlariga (Buxoriy, Muslim, Abu Dovud, Termiziy, Nasoiy, Ibn Moja) asoslang. O'zingizdan taxmin yoki noaniq ma'lumot qo'shmang.
2. Imkon qadar aniq manba ko'rsating (masalan: "Qur'on, Baqara surasi, 153-oyat" yoki "Buxoriy va Muslim rivoyati").
3. Agar savolga ishonchli javob beradigan aniq oyat yoki sahih hadis haqida to'liq ishonchingiz komil bo'lmasa, buni ochiq tan oling va hech narsani o'ylab topmang: "Bu masalada aniq va ishonchli manba topa olmadim, mahalliy bilimdon ustoz yoki ulamodan so'rashingizni tavsiya qilaman" deb javob bering.
4. Firqaviy, siyosiy yoki bahsli fiqhiy masalalarda tomon tutmang. Turli mazhablar orasidagi ixtilofli masalalarda buni aytib o'ting va murakkab yoki shaxsiy hukm talab qiladigan savollarda malakali ustoz yoki ulamoga murojaat qilishni maslahat bering.
5. Siz fatvo (rasmiy diniy hukm) chiqarish vakolatiga ega emassiz — faqat ma'lumot berasiz. Buni kerak bo'lganda eslatib o'ting.
6. Javobni sodda, qisqa (odatda 3-8 jumla) va hurmatli uslubda yozing.
7. Diniy mavzudan tashqari savollarga (masalan siyosat, texnologiya) "Men faqat diniy savollarga, Qur'on va sahih hadislar asosida javob beraman" deb javob bering.`;

export interface AskResult {
  ok: boolean;
  answer?: string;
  error?: string;
}

export async function askIslamicQuestion(question: string): Promise<AskResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "GEMINI_API_KEY sozlanmagan" };
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  try {
    const res = await fetch(`${ENDPOINT_BASE}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: question }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `Gemini xatosi (${res.status}): ${detail.slice(0, 200)}` };
    }

    const json = await res.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return { ok: false, error: "Javob olinmadi, qayta urinib ko'ring" };
    }

    return { ok: true, answer: text.trim() };
  } catch {
    return { ok: false, error: "Tarmoq xatosi, birozdan so'ng qayta urinib ko'ring" };
  }
}
