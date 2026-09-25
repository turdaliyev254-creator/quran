---
name: Qur'on va arab tili
description: Registan majolikasi — shishalangan plitkalardan yig'ilgan, yorqin va zamonaviy o'zbek tilidagi Islom ta'limi ilovasi.
colors:
  cobalt: "#2149f0"
  cobalt-deep: "#0f2a9e"
  turquoise: "#20d3c4"
  gold: "#ffc42e"
  coral: "#ff6b4a"
  plum: "#7a3cf0"
  ink-fixed: "#0d1747"
  ground-light: "#f1f4ff"
  surface-light: "#ffffff"
  surface-2-light: "#e4eaff"
  ink-light: "#0d1747"
  muted-light: "#4b5788"
  ground-dark: "#070c2a"
  surface-dark: "#121a4e"
  surface-2-dark: "#0b1240"
  ink-dark: "#f1f4ff"
  muted-dark: "#a9b4e8"
typography:
  display:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Unbounded, Onest, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
  arabic-reading:
    fontFamily: "Noto Naskh Arabic, serif"
    fontSize: "28px"
    lineHeight: 2.1
  arabic-display:
    fontFamily: "Reem Kufi, Noto Naskh Arabic, serif"
    fontSize: "52px"
    lineHeight: 1.2
rounded:
  tile-lg: "26px"
  tile: "22px"
  row: "20px"
  badge: "16px"
  control: "14px"
  pill: "9999px"
spacing:
  page: "16px"
  gap-tile: "16px"
  gap-row: "10px"
components:
  tile-cobalt:
    backgroundColor: "{colors.cobalt}"
    textColor: "#ffffff"
    rounded: "{rounded.tile-lg}"
    padding: "20px"
  tile-turquoise:
    backgroundColor: "{colors.turquoise}"
    textColor: "{colors.ink-fixed}"
    rounded: "{rounded.tile-lg}"
    padding: "16px"
  tile-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink-fixed}"
    rounded: "{rounded.tile-lg}"
  tile-plain:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.row}"
    padding: "12px"
  bottom-nav-item:
    textColor: "{colors.muted-light}"
    height: "60px"
    rounded: "{rounded.row}"
---

# Design System: Qur'on va arab tili

## Overview

**Creative North Star: "Registan majolikasi"**

Ilova shishalangan sopol plitkalardan yig'ilgan mozaikaga o'xshaydi: har bo'lim o'z glazuri (kobalt, firuza, oltin, marjon, binafsha) bilan alohida plitka, ustida sakkiz qirrali xatam yulduzi naqshi. Eng katta plitkalar — AI qidiruv, Qur'on va Arab tili; qolganlari ular atrofida kichik va sokin. Yoshlar uchun yorqin, o'yinchoq emas: ranglar kuchli, matn esa har doim to'q ko'k siyoh yoki oq bilan aniq o'qiladi.

Yorug' rejimda sovuq oq-ko'k shisha zamin, qorong'i rejimda kobalt-tun zamin. Telegram temasi rang tokenlarini o'zgartirmaydi, faqat yorug'/qorong'i tanlovini belgilaydi.

**Key Characteristics:**
- Glaze tiles: bir plitka — bir rang, bir vazifa.
- Xatam naqshi faqat plitka ichida, 11–16% shaffoflikda.
- Arabcha harflar plitkaning bezagi ham, kontenti ham (Kufi bezak, Naskh o'qish uchun).
- Barcha o'zaro ta'sir tugmalari kamida 44–60px balandlikda (bosish qulayligi).

## Colors

Committed strategy: kobalt bosh sahifa yuzasining eng katta qismini egallaydi, qolgan glazurlar plitka darajasida ishlatiladi.

### Primary
- **Kobalt** (#2149f0): AI qidiruv, asosiy tugmalar, faol tab, foydalanuvchi savoli. Ustiga oq matn.

### Secondary
- **Firuza** (#20d3c4): Qur'on, to'g'ri javob, manba belgilari.
- **Oltin** (#ffc42e): urg'u tugmalari (yuborish, o'ynash), ogohlantirish plitkasi, kombo va rekord.
- **Marjon** (#ff6b4a): xato javob, xatolik xabari.
- **Binafsha** (#7a3cf0): so'z o'yini plitkasi, videolar.

### Neutral
- **To'q ko'k siyoh** (#0d1747): yorug' rejimda matn; glazur ustida (firuza, oltin, marjon) doim shu rang — `ink-fixed`.
- **Shisha zamin** (#f1f4ff) / **Kobalt tun** (#070c2a): sahifa foni.
- **Yuza** (#ffffff / #121a4e), **cho'kkan yuza** (#e4eaff / #0b1240): kartalar va tab paneli.
- **Susaytirilgan matn** (#4b5788 / #a9b4e8): ikkinchi darajali matn.

### Named Rules
**The Fixed Ink Rule.** Firuza, oltin va marjon ustida matn har doim `ink-fixed` (#0d1747); `ink` tokeni qorong'i rejimda och tusga aylanadi va glazurda o'qilmaydi.
**The One Gold Rule.** Oltin — harakat va mukofot rangi (yuborish, o'ynash, kombo, rekord); bezak uchun ishlatilmaydi.

## Typography

**Display Font:** Unbounded (Onest, sans-serif zaxira)
**Body Font:** Onest (system-ui zaxira)
**Arabic:** Noto Naskh Arabic (o'qish, harakatli matn), Reem Kufi (katta bezak harflar, sura nomlari)

**Character:** Unbounded — keng, yumaloq, plitka kabi og'ir sarlavhalar; Onest — kirill va lotin-kengaytma (oʻ, gʻ) bilan tinch, o'qiluvchan matn.

### Hierarchy
- **Display** (800, 30px, 1.05): bosh sahifa salomi, katta raqamlar.
- **Title** (700, 18–24px, 1.1–1.2): sahifa va plitka sarlavhalari.
- **Body** (400–600, 15–16px, 1.6): tarjima, javoblar, ro'yxat matni.
- **Label** (700, 12–13px): tab, chip, manba belgisi.
- **Arabic reading** (Naskh, 28px, 2.1): oyat matni. **Arabic display** (Kufi, 52–104px): sura nomi va plitka harflari.

### Named Rules
**The Tabular Score Rule.** Ball, vaqt, raqamlar `tabular-nums` bilan yoziladi.

## Layout

Bir ustunli mobil oqim, 16px yon bo'shliq, plitkalar orasida 16px (qatorlar orasida 10px). Bosh sahifa: sarlavha, to'liq kenglikdagi AI plitka, ikki ustunli Qur'on/Arab tili, to'liq kenglikdagi o'yin plitkasi, 2×2 kichik bo'limlar. Sahifa sarlavhasi va pastki navigatsiya Telegram xavfsiz zonalari (`--safe-top`, `--safe-bottom`) bilan suriladi. Kontent kengligi taxminan 36rem bilan cheklanadi.

## Elevation & Depth

Plitkalar glazur chuqurligi bilan ko'tariladi: yumshoq pastga tushgan soya (`0 14px 28px -14px` kobalt tusli), yuqorida 2px yorug' chiziq va pastda 3px qorong'i chiziq (`inset` — sopolning qirrasi). Tugma bosilganda 2px pastga tushadi. Blur faqat yopishqoq sarlavha va navigatsiya uchun.

### Shadow Vocabulary
- **Tile** (`0 14px 28px -14px rgba(15,42,158,.5), inset 0 2px 0 rgba(255,255,255,.4), inset 0 -3px 0 rgba(0,0,0,.12)`): rangli plitkalar.
- **Plain tile** (`0 10px 24px -16px rgba(15,42,158,.45), inset 0 0 0 1px var(--line)`): oq yuzalar.

## Shapes

Burchaklar katta va izchil: katta plitka 26px, oddiy plitka 22px, qator 20px, raqam nishoni 16px, kichik tugma 14px. Doiralar faqat ovoz/mute tugmalari va kapsulali tablar uchun. Naqsh — sakkiz qirrali yulduz (xatam) va burchak romblari, plitka bo'ylab takrorlanadi.

## Components

### Tiles
Bir rang, yumaloq, xatam naqshli. Katta plitkada (AI, Qur'on, Arab tili) bezak harf yoki belgi plitka chetidan chiqib turadi.

### Bottom navigation
Besh element, markazda AI: ko'tarilgan kobalt plitka, oltin belgi. Faol bo'lim kobalt matn va och kobalt kapsula bilan belgilanadi; balandligi 60px.

### List rows
Oq plitka qatori: chapda glazurli raqam nishoni (5 rang aylanadi), o'rtada nom va tavsif, o'ngda arabcha yozuv yoki belgi.

### Segmented tabs
Cho'kkan panelda ikki katta tugma; faol tugma to'liq glazurli plitka.

### Word game
Binafsha plitka: bosh ekranda ikki rejim plitkasi (oltin, firuza), o'yinda jon, vaqt chizig'i, ball, kombo nishoni; javob tugmalari yuza rangida, natijada firuza (to'g'ri) va marjon (xato).

## Do's and Don'ts

### Do
- Har yangi bo'limga bitta glazur bering va uni butun sahifada saqlang.
- Glazur ustida `ink-fixed` yoki oq ishlating, kontrastni tekshiring.
- Harakatli arabcha matnni Naskh'da, bezak va sura nomlarini Kufi'da yozing.

### Don't
- Bir xil o'lchamdagi ikonka+sarlavha+matn kartalar ro'yxatini bosh sahifa tuzilmasi qilmang.
- Sarlavha ustiga eyebrow/kicker yozuv qo'ymang.
- Gradient matn, qattiq (blur'siz) offset soya, rangli chap chegara ishlatmang.
- Overshoot/bounce easing ishlatmang: harakat eksponensial ease-out bilan.

Canonized emas: hozirgi buildda `press` tugmalarida `filter: brightness` bosilish holati — vaqtinchalik yechim; xatam naqshi kontrasti (`--khatam-opacity`) plitkaga qarab qo'lda sozlangan.
