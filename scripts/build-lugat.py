#!/usr/bin/env python3
"""Arab–o'zbek lug'at bazasini yig'adi: data/lugat.json va public/oyin-sozlari.json.

Manbalar (hammasi ochiq litsenziya, CC BY-SA, Wiktionary; kaikki.org orqali):
  pairs_en*.jsonl  — inglizcha Wiktionary tarjima jadvallaridan (arab + o'zbek bir ma'noda)
  pairs_uz.json    — o'zbekcha Wiktionary: arabchadan kirgan so'zlar
  ar_lemmas.jsonl  — arabcha Wiktionary lemmalari (inglizcha ma'nolar bilan)
  data/lugat-asosiy.json — qo'lda tekshirilgan asosiy islomiy va Qur'on so'zlari (manba "k")
  quran_freq.json (ixtiyoriy) — Qur'ondagi so'z chastotasi: ro'yxatni tartiblash uchun
Foydalanish: python3 scripts/build-lugat.py <ishchi-papka>
"""
import json, re, sys, os, collections

work = sys.argv[1]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DIAC = re.compile("[ؐ-ًؚ-ٰٟۖ-ۭـ]")
CYR = re.compile("[Ѐ-ӿ]")

def norm_ar(t):
    t = DIAC.sub("", t)
    t = re.sub("[أإآٱ]", "ا", t).replace("ى", "ي").replace("ؤ", "و").replace("ئ", "ي")
    return t.strip()

ROMAN = {"ā":"a","ī":"i","ū":"u","Ā":"A","ḥ":"h","ṣ":"s","ḍ":"d","ṭ":"t","ẓ":"z","ʿ":"ʻ","ʾ":"ʼ",
         "š":"sh","ǧ":"j","ḫ":"x","ḵ":"x","ġ":"g'","ṯ":"s","ḏ":"z","ẖ":"x","ʼ":"ʼ","ʕ":"ʻ","ʔ":"ʼ"}
def roman(t):
    return "".join(ROMAN.get(c, c) for c in t)

def clean_uz(t):
    t = t.replace("ʻ", "'").replace("ʼ", "'").replace("’", "'").replace("‘", "'").replace("`", "'")
    return re.sub(r"\s+", " ", t).strip()

def latin_ok(t):
    return t and not CYR.search(t) and len(t) <= 60

entries = {}  # plain -> dict
locked = set()  # qo'lda tekshirilgan so'zlarga Wiktionary ma'nolari qo'shilmaydi

def add(ar, tr, uz_list, src):
    plain = norm_ar(ar)
    if not plain or " " in plain and len(plain) > 30:
        return
    if plain in locked and src != "k":
        return
    e = entries.get(plain)
    uz_list = [clean_uz(u) for u in uz_list if latin_ok(clean_uz(u))]
    if not uz_list:
        return
    if e is None:
        entries[plain] = {"a": ar, "p": plain, "t": tr, "u": uz_list[:], "s": src}
    else:
        for u in uz_list:
            if u.lower() not in [x.lower() for x in e["u"]]:
                e["u"].append(u)
        if not e["t"] and tr:
            e["t"] = tr
        if len(ar) > len(e["a"]) and DIAC.search(ar):
            e["a"] = ar

# 0) Qo'lda tekshirilgan asosiy so'zlar
for ar, tr, uz in json.load(open(os.path.join(root, "data", "lugat-asosiy.json"), encoding="utf-8")):
    add(ar, tr, [x.strip() for x in uz.split(";")], "k")
    locked.add(norm_ar(ar))

# 1) Wiktionary translation pairs (arabcha + o'zbekcha bir ma'noda)
cnt = collections.Counter()
by_ar = collections.defaultdict(lambda: collections.Counter())
info = {}
import glob
seen_rows = set()
for path in sorted(glob.glob(os.path.join(work, "pairs_en*.jsonl"))):
    for line in open(path, encoding="utf-8"):
        r = json.loads(line)
        if not r["ar"] or not r["uz"]:
            continue
        key = (r["en"], r["sense"], r["ar"], r["uz"])
        if key in seen_rows:
            continue
        seen_rows.add(key)
        by_ar[r["ar"]][r["uz"]] += 1
        info[r["ar"]] = roman(r.get("roman", ""))
for ar, cs in by_ar.items():
    uzs = [u for u, _ in cs.most_common(4)]
    add(ar, info.get(ar, ""), uzs, "w")

# 2) Arabcha lemmalar — tekshirish va transliteratsiya uchun
lemmas = {}
for line in open(os.path.join(work, "ar_lemmas.jsonl"), encoding="utf-8"):
    r = json.loads(line)
    key = norm_ar(r["w"])
    lemmas.setdefault(key, []).append(r)

# 3) O'zbekcha o'zlashma so'zlar: faqat ingliz ma'nosi arabcha lemma ma'nosi bilan mos kelsa
def words(s):
    return set(re.findall(r"[a-z]{3,}", s.lower()))

uzpairs = json.load(open(os.path.join(work, "pairs_uz.json"), encoding="utf-8"))
for p in uzpairs:
    key = norm_ar(p["ar"])
    cand = lemmas.get(key, [])
    uz_gl = set()
    for g in p.get("en", []):
        uz_gl |= words(g)
    match = None
    for c in cand:
        gl = set()
        for g in c["gl"]:
            gl |= words(g)
        if gl & uz_gl:
            match = c
            break
    if match:
        add(p["ar"], roman(match.get("roman", "")), [p["uz"]], "w")

# 4) Dars so'zlari
lessons = json.load(open(os.path.join(root, "data", "arab-tili.json"), encoding="utf-8"))
for les in lessons:
    for row in les.get("jadval", []) or []:
        uz = re.sub(r"^\d+\s*—\s*", "", row["ozbekcha"])
        add(row["arabcha"], "", [uz], "d")

# transliteratsiyani lemmalardan to'ldirish
for plain, e in entries.items():
    if not e["t"]:
        for c in lemmas.get(plain, []):
            if c.get("roman"):
                e["t"] = roman(c["roman"])
                break

out = []
for plain, e in entries.items():
    out.append({"a": e["a"], "p": e["p"], "t": e["t"], "u": "; ".join(e["u"]), "s": e["s"]})
freq = {}
fp = os.path.join(work, "quran_freq.json")
if os.path.exists(fp):
    freq = json.load(open(fp, encoding="utf-8"))
# dars so'zlari birinchi, keyin Qur'onda ko'p uchraydiganlar, so'ng alifbo tartibida
out.sort(key=lambda x: (x["s"] == "w", -freq.get(x["p"], 0), x["p"]))
json.dump(out, open(os.path.join(root, "data", "lugat.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

# O'yin bazasi: faqat tekshirilgan (w, d) qisqa so'zlar
game = []
for e in out:
    first = re.split(r"[;,]", e["u"])[0].strip()
    if len(first) < 2 or len(first) > 24 or " " in e["p"] or len(e["p"]) > 12:
        continue
    if first[0].isupper() or re.search(r"\d", first):
        continue  # xos otlar va raqamli yozuvlar o'yinga kirmaydi
    game.append({"id": "l-" + e["p"], "ar": e["a"], "tr": e["t"], "uz": e["u"]})
os.makedirs(os.path.join(root, "public"), exist_ok=True)
json.dump({"words": game}, open(os.path.join(root, "public", "oyin-sozlari.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

by_src = collections.Counter(e["s"] for e in out)
print("lug'at:", len(out), dict(by_src), "| o'yin:", len(game))
