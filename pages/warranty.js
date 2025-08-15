// pages/api/warranty.js
import fs from "fs";
import path from "path";

function normalizeSerial(s = "") {
  return String(s)
    .replace(/[\"'“”‘’]/g, "")  // حذف کوتیشن‌های مختلف
    .trim()
    .toUpperCase();
}

function normalizeInput(raw = "") {
  // چند سریال با خط جدید یا کاما/سیمی‌کالن
  const enMap = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
                  "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9" };
  const faToEn = (t) => String(t).replace(/[۰-۹٠-٩]/g, d => enMap[d] || d);

  return faToEn(raw)
    .split(/[\n,;]+/)
    .map(s => normalizeSerial(s))
    .filter(Boolean);
}

export default function handler(req, res) {
  try {
    // محل فایل JSON
    const src = path.join(process.cwd(), "data", "warranty.json");
    const txt = fs.readFileSync(src, "utf8");

    // پارس امن: هم آرایه‌ی مستقیم و هم آبجکتِ {rows:[], updated:"..."} را پشتیبانی کن
    const data = JSON.parse(txt);
    const allRows = Array.isArray(data) ? data : (Array.isArray(data.rows) ? data.rows : []);

    // ورودی از GET یا POST
    const rawQ = req.method === "POST" ? (req.body?.q ?? "") : (req.query?.q ?? "");
    const wanted = normalizeInput(rawQ);

    // ایندکس سریال‌ها
    const index = new Map(allRows.map(r => [normalizeSerial(r.serial), r]));

    const out = wanted.length ? wanted.map(s => index.get(s)).filter(Boolean) : [];

    const payload = {
      rows: out,
      meta: { updated: data?.updated ?? null }
    };

    // حالت دیباگ اختیاری
    if (req.query?.debug) {
      payload.debug = {
        source: src,
        q: wanted,
        records: out.length
      };
    }

    return res.status(200).json(payload);
  } catch (e) {
    console.error("warranty api error:", e);
    return res.status(500).json({ error: "server_error", detail: e.message });
  }
}

// (Body parser پیش‌فرض Next فعاله؛ نیازی به تنظیم خاصی نیست.)