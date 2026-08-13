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
| Hadislar, Arab tili (yozma darslar), Tajvid, Ruhiyat, Viktorina | `data/*.json` — qo'lda kuratsiya qilingan, kengaytirish mumkin |
| Arab tili video darslari (129 ta) | Ibrat Farzandlari YouTube kanali, `data/arab-tili-videolar.json` |
| Islomiy videolar (Siyrat seriali, Jannat onalari) | Towards Eternity - O'zbek YouTube kanali, `data/islomiy-videolar.json` |
| Xayriya kategoriyalari | `data/xayriya.json` — to'lov Payme/Click orqali (pastga qarang) |

Yangi kontent qo'shish uchun tegishli `data/*.json` faylini tahrirlang — sahifalar avtomatik
yangilanadi.

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

## Xayriya bo'limi (Payme / Click)

`/xayriya` sahifasida kategoriyalar (masjidlar, shifoxonalar, maktablar va h.k.), summa tanlash
va Payme/Click orqali to'lash imkoniyati bor. Ishlashi uchun quyidagi muhit o'zgaruvchilarini
sozlang:

| O'zgaruvchi | Tavsif |
| --- | --- |
| `PAYME_MERCHANT_ID` | Payme Business kabinetidagi kassa (merchant) ID'si |
| `PAYME_ACCOUNT_FIELD` | Payme kassa sozlamalarida "account" uchun belgilangan maydon nomi (ixtiyoriy, standart: `category`) |
| `CLICK_MERCHANT_ID` | Click Merchant Cabinet'dagi merchant ID |
| `CLICK_SERVICE_ID` | Click'dagi xizmat (service) ID |

**Muhim:** bu haqiqiy pul operatsiyasi, shuning uchun quyidagilarni o'zingiz bajarishingiz
kerak — men (Claude) buni siz uchun sozlab bera olmayman:

1. [Payme Business](https://business.payme.uz) va/yoki [Click Merchant](https://merchant.click.uz)da
   yuridik shaxs sifatida ro'yxatdan o'ting va kassa (xizmat) oching.
2. Payme kassa sozlamalarida "to'lov ma'lumotlari" (account) uchun bitta maydon nomini
   belgilang (masalan `category`) va shuni `PAYME_ACCOUNT_FIELD`ga yozing.
3. Olingan ID'larni Vercel loyihasida environment variable sifatida qo'shing va qayta deploy
   qiling.
4. Click uchun `lib/payment.ts` dagi `buildClickCheckoutUrl` havola shaklini o'z merchant
   kabinetingizdagi aniq ko'rsatmalarga solishtirib tekshiring — integratsiya turiga qarab
   parametr nomlari farq qilishi mumkin.

Bu o'zgaruvchilar sozlanmagan bo'lsa, to'lov tugmalari bosilganda aniq xatolik xabari
ko'rsatiladi ("PAYME_MERCHANT_ID sozlanmagan" va h.k.) — ilovaning qolgan qismi normal
ishlayveradi.

## Ma'lum cheklovlar

- Qur'on tarjimasi (`uz.sodik`) kirill yozuvida — hozircha lotin yozuvidagi bepul, ishonchli API
  topilmadi.
- Namoz vaqtlari Muslim World League usuli bilan hisoblanadi; mahalliy masjid e'lonlaridan bir
  necha daqiqaga farq qilishi mumkin.
- Hadis, arab tili, tajvid, ruhiyat va viktorina kontenti boshlang'ich to'plam sifatida
  tayyorlangan — `data/*.json` orqali istalgancha kengaytirish mumkin.
