# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Yosh va talaba o'zbek musulmonlari (asosan telefondan, Telegram Mini App ichida kiradi). Ular Qur'onni o'qish/tinglashni va arab tilini o'rganishni xohlaydi va diniy savollarga tezkor, ishonchli javob qidiradi.

## Product Purpose
O'zbek tilidagi Islom ta'limi ilovasi: Qur'on (arab matni, o'zbekcha tarjima, Shayx Alijon Qori tilovati), arab tili darslari (yozma + 129 video dars), arab–o'zbek lug'ati, arab so'zlari o'yini, namoz vaqtlari, hadislar, islomiy videolar va faqat Qur'on hamda sahih hadisga asoslangan AI qidiruv. Muvaffaqiyat: foydalanuvchi har kuni qaytib keladi, arab so'zlarini o'rganadi va savoliga ishonchli manbali javob oladi.

## Positioning
O'zbek tilida, Telegram ichida ishlaydigan, arab tilini o'rganish (video darslar, lug'at, o'yin) va manbaga asoslangan AI javobni bitta joyda birlashtirgan ilova.

## Operating Context
Telegram Mini App (WebView, to'liq ekran rejimi, xavfsiz zonalar). Asosan telefon. Kontent `data/*.json` fayllarida; Qur'on matni alquran.cloud'dan, namoz vaqtlari Aladhan'dan, AI javoblar Gemini'dan.

## Capabilities and Constraints
- Diniy hukm (fatvo) berilmaydi; AI javoblari faqat Qur'on va sahih hadis asosida, manba ko'rsatilgan holda; noaniq bo'lsa ulamoga yo'naltiriladi.
- Lug'at manbasi: faqat ochiq litsenziyali Wiktionary (CC BY-SA) va ilova darslari. Nashr etilgan lug'atlar (masalan an-Na'im, Muallimi soniy nashrlari) mualliflik huquqi sababli ko'chirilmaydi; AI bilan yaratilgan tarjimalar xato ma'no berishi mumkinligi sababli lug'atga qo'shilmaydi.
- Kunning hadisi, kundalik ruhiyat, tajvid darslari va diniy viktorina olib tashlangan.
- Til: o'zbek (lotin). Qur'on tarjimasi hozircha kirill yozuvida.

## Brand Commitments
Ilova nomi va Alijon Qori, Ibrat Farzandlari, Towards Eternity kanallaridan olingan videolar manbasi ko'rsatilib turadi.

## Evidence on Hand
`data/videos.json`, `data/arab-tili-videolar.json`, `data/islomiy-videolar.json`, `data/hadislar.json`. Foydalanuvchi statistikasi yo'q (yangi loyiha).

## Product Principles
1. Ishonch birinchi: manba ko'rsatilmagan diniy da'vo yo'q.
2. Arab tilini o'rganish har kuni qilinadigan odat bo'lsin (o'yin, lug'at, video).
3. Telefonda, bir qo'l bilan, Telegram ichida qulay.
