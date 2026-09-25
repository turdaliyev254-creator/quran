# Qur'on — Islom ta'limi ilovasi

Telegram Mini App sifatida ishlashi mo'ljallangan Next.js web-sayt. AI qidiruv (Qur'on va sahih
hadis asosida), Qur'on tilovati (Shayx Alijon Qori videolari bilan), arab tili darslari, arab–o'zbek
lug'ati, bosh sahifadagi arab so'zlari o'yini, namoz vaqtlari, hadislar va islomiy videolar.

## Ishga tushirish

```bash
npm install
npm run dev
```

`http://localhost:3000` manzilida ochiladi.

## Bo'limlar va ma'lumot manbalari

| Bo'lim | Manba |
| --- | --- |
| Qur'on matni va tarjimasi | [alquran.cloud](https://alquran.cloud/api) API (`quran-uthmani` + `uz.sodik` tarjimasi, kirill yozuvida) |
| Qori tilovati (audio) | alquran.cloud, `ar.alafasy` |
| Sura videolari | Shayx Alijon Qori rasmiy YouTube kanali ([@AlQuranuz](https://www.youtube.com/@AlQuranuz)), `data/videos.json` |
| Namoz vaqtlari | [Aladhan API](https://aladhan.com/prayer-times-api) (Muslim World League hisoblash usuli) |
| Hadislar, Arab tili (yozma darslar) | `data/*.json` — qo'lda kuratsiya qilingan, kengaytirish mumkin |
| Arab–o'zbek lug'ati va so'z o'yini | `data/lugat.json`, `public/oyin-sozlari.json` — Wiktionary (CC BY-SA) asosida, `scripts/build-lugat.py` bilan yig'iladi |
| Arab tili video darslari (129 ta) | Ibrat Farzandlari YouTube kanali, `data/arab-tili-videolar.json` |
| Islomiy videolar (Siyrat seriali, Jannat onalari) | Towards Eternity - O'zbek YouTube kanali, `data/islomiy-videolar.json` |
| AI qidiruv | Gemini API, faqat Qur'on va sahih hadis asosida javob berish uchun cheklangan (pastga qarang) |

Yangi kontent qo'shish uchun tegishli `data/*.json` faylini tahrirlang — sahifalar avtomatik
yangilanadi.

## Lug'at bazasi

`data/lugat.json` — arab–o'zbek lug'ati (qidiruv `/api/lugat` orqali), `public/oyin-sozlari.json` —
o'yin uchun qisqa so'zlar. Ikkalasi ochiq litsenziyali [Wiktionary](https://www.wiktionary.org)
ma'lumotlaridan (kaikki.org orqali) va ilova darslaridan yig'ilgan (CC BY-SA). Qayta yig'ish:
kaikki.org'dan `pairs_en.jsonl`, `pairs_uz.json`, `ar_lemmas.jsonl` tayyorlab, so'ng
`python3 scripts/build-lugat.py <ishchi-papka>` ishga tushiriladi. Nashr etilgan lug'atlar
(an-Na'im va boshqalar) mualliflik huquqi sababli kiritilmagan.

## Telegram Mini App sifatida ulash

1. Loyihani Vercel (yoki boshqa hosting)ga deploy qiling.
2. [@BotFather](https://t.me/BotFather) orqali botingizni yarating (agar hali yo'q bo'lsa).
3. `/newapp` (yoki mavjud bot uchun `/mybots` → bot → **Bot Settings** → **Menu Button** /
   **Mini App**) buyrug'i orqali deploy qilingan URL'ni bot bilan bog'lang.
4. Botni ochib, Mini App tugmasini bosib tekshiring.

## Admin dashboard (foydalanuvchilar statistikasi)

`/admin` sahifasida Telegram Mini App orqali kirgan foydalanuvchilar soni (bugun/oy faol,
jami) ko'rsatiladi. Ishlashi uchun quyidagi muhit o'zgaruvchilarini sozlang (Vercel loyihasida
**Settings → Environment Variables**):

| O'zgaruvchi | Tavsif |
| --- | --- |
| `ADMIN_PASSWORD` | `/admin` sahifasiga kirish paroli |
| `UPSTASH_REDIS_REST_URL` | Vercel Marketplace'dan "Redis" (Upstash) integratsiyasini qo'shganda avtomatik qo'shiladi |
| `UPSTASH_REDIS_REST_TOKEN` | Yuqoridagi bilan birga avtomatik qo'shiladi |

Sozlash tartibi: Vercel loyiha sahifasida **Storage → Create Database → Marketplace Database
→ Redis (Upstash)** ni tanlang va loyihaga ulang — kerakli `UPSTASH_*` o'zgaruvchilar
avtomatik qo'shiladi. So'ng `ADMIN_PASSWORD`ni qo'lda qo'shing va qayta deploy qiling.

Bu o'zgaruvchilar sozlanmagan bo'lsa, dashboard "Baza ulanmagan" ogohlantirishi bilan 0
ko'rsatadi — ilovaning qolgan qismiga ta'sir qilmaydi.

## Xayriya bo'limi

`/xayriya` sahifasida loyihaning rivojiga xayriya qilish uchun karta raqami ko'rsatiladi
(nusxalash tugmasi bilan). To'lov API integratsiyasi yo'q — foydalanuvchi kartaga qo'lda pul
o'tkazadi. Karta raqami va egasi nomini o'zgartirish uchun
[app/xayriya/page.tsx](app/xayriya/page.tsx) faylini tahrirlang.

## AI qidiruv (Gemini)

`/ai-qidiruv` sahifasida foydalanuvchi diniy savol yozadi, javob esa **faqat Qur'on va sahih
hadislarga asoslanib** beriladi (`lib/gemini.ts` dagi system instruction shuni majburlaydi —
noaniq bo'lsa, model o'ylab topmasdan "aniq manba topa olmadim" deb javob berishi so'raladi).

| O'zgaruvchi | Tavsif |
| --- | --- |
| `OPENAI_API_KEY` | Asosiy AI (OpenAI). Ixtiyoriy `OPENAI_MODEL`, standart: `gpt-5.1` |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey)dan olinadigan API kalit |
| `GEMINI_MODEL` | Ixtiyoriy, standart: `gemini-3.6-flash` (OpenAI ishlamasa zaxira sifatida) |

**Muhim:** bu — sun'iy intellekt javobi, rasmiy fatvo emas. Sahifada foydalanuvchiga shu haqda
doimiy ogohlantirish ko'rsatiladi va murakkab masalalarda ulamoga murojaat qilish tavsiya
etiladi. `GEMINI_API_KEY` sozlanmagan bo'lsa, foydalanuvchiga aniq xatolik xabari ko'rsatiladi.

## Ma'lum cheklovlar

- Qur'on tarjimasi (`uz.sodik`) kirill yozuvida — hozircha lotin yozuvidagi bepul, ishonchli API
  topilmadi.
- Namoz vaqtlari Muslim World League usuli bilan hisoblanadi; mahalliy masjid e'lonlaridan bir
  necha daqiqaga farq qilishi mumkin.
- Hadis va arab tili yozma darslari boshlang'ich to'plam sifatida tayyorlangan — `data/*.json`
  orqali kengaytirish mumkin.
- Lug'at hajmi Wiktionary'dagi arab–o'zbek juftliklari bilan cheklangan; nashr etilgan katta
  lug'atlar (an-Na'im va h.k.) mualliflik huquqi sababli kiritilmagan.
