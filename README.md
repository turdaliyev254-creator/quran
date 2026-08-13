# Qur'on — Islom ta'limi ilovasi

Telegram Mini App sifatida ishlashi mo'ljallangan Next.js web-sayt. Qur'on tilovati (Shayx
Alijon Qori videolari bilan), namoz vaqtlari, hadislar, arab tili va tajvid darslari, kundalik
ruhiyat va viktorina bo'limlarini o'z ichiga oladi.

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
| Hadislar, Arab tili, Tajvid, Ruhiyat, Viktorina | `data/*.json` — qo'lda kuratsiya qilingan, kengaytirish mumkin |

Yangi kontent qo'shish uchun tegishli `data/*.json` faylini tahrirlang — sahifalar avtomatik
yangilanadi.

## Telegram Mini App sifatida ulash

1. Loyihani Vercel (yoki boshqa hosting)ga deploy qiling.
2. [@BotFather](https://t.me/BotFather) orqali botingizni yarating (agar hali yo'q bo'lsa).
3. `/newapp` (yoki mavjud bot uchun `/mybots` → bot → **Bot Settings** → **Menu Button** /
   **Mini App**) buyrug'i orqali deploy qilingan URL'ni bot bilan bog'lang.
4. Botni ochib, Mini App tugmasini bosib tekshiring.

## Ma'lum cheklovlar

- Qur'on tarjimasi (`uz.sodik`) kirill yozuvida — hozircha lotin yozuvidagi bepul, ishonchli API
  topilmadi.
- Namoz vaqtlari Muslim World League usuli bilan hisoblanadi; mahalliy masjid e'lonlaridan bir
  necha daqiqaga farq qilishi mumkin.
- Hadis, arab tili, tajvid, ruhiyat va viktorina kontenti boshlang'ich to'plam sifatida
  tayyorlangan — `data/*.json` orqali istalgancha kengaytirish mumkin.
