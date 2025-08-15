// pages/api/warranty.js
import fs from "fs";
import path from "path";

function normalize(s = "") {
  if (typeof s !== "string") s = String(s ?? "");
  // اعداد فارسی/عربی -> انگلیسی
  const map = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
                "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9" };
  s = s.replace(/[۰-۹٠-٩]/g, d => map[d] || d);
  // کوتیشن، فاصله‌های اضافه، CR/LF
  s = s.replace(/["'“”‘’]/g, "").replace(/\r/g, "").trim();
  return s;
}

function loadJson() {
  // یکی از این مسیرها وجود دارد
  const candidates = [
    path.join(process.cwd(), "public", "data", "warranty.json"),
    path.join(process.cwd(), "data", "warranty.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const rows = JSON.parse(raw);
      return { rows, source: p };
    }
  }
  return { rows: [], source: null };
}

export default function handler(req, res) {
  try {
    const { rows, source } = loadJson();

    // q می‌تواند در GET یا POST بیاید
    const qRaw = req.method === "POST" ? (req.body?.q ?? "") : (req.query?.q ?? "");
    const qs = String(qRaw ?? "");

    // چند سریال با خط جدید یا کاما
    const tokens = qs
      .split(/[\n,]+/)
      .map(t => normalize(t))
      .filter(Boolean);

    let result = [];
    if (tokens.length === 0) {
      result = []; // اگر چیزی وارد نشد، خروجی خالی
    } else {
      const index = rows.map(r => ({ ...r, _serial: normalize(r.serial || "") }));
      const set = new Set(tokens);
      result = index.filter(r => set.has(r._serial));
    }

    res.status(200).json({
      rows: result,
      meta: { updated: new Date().toISOString().slice(0,10) },
      debug: process.env.NODE_ENV !== "production" ? { source, records: result.length } : undefined,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server_error" });
  }
}