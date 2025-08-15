// pages/api/warranty.js
import fs from "fs";
import path from "path";

const normalize = (s) =>
  (s || "")
    .toString()
    .toUpperCase()
    .replace(/[\s\u200c\u200f\u200e\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "");

export default function handler(req, res) {
  try {
    const file = path.join(process.cwd(), "data", "warranty.json");
    const raw = fs.readFileSync(file, "utf8");
    const json = JSON.parse(raw);

    // آرایه‌ی رکوردها از فایل
    const records = Array.isArray(json)
      ? json
      : Array.isArray(json.rows)
      ? json.rows
      : [];

    // مپ برای جستجوی سریع با سریال نرمال‌شده
    const bySerial = new Map();
    for (const r of records) {
      const key = normalize(r?.serial);
      if (key) bySerial.set(key, r);
    }

    const q = (req.query.q || "").toString();
    const inputs = q
      ? q.split(/[\n,]+/g).map((s) => s.trim()).filter(Boolean)
      : [];

    let out = [];
    if (inputs.length) {
      // فقط موارد درخواست‌شده را برگردان
      for (const s of inputs) {
        const found = bySerial.get(normalize(s));
        if (found) out.push(found);
      }
    } else {
      // اگر چیزی نخواستند، همه را برگردان
      out = records;
    }

    res.status(200).json({
      rows: out,
      meta: { updated: json.updated || null },
      ...(process.env.NODE_ENV !== "production"
        ? { debug: { records: records.length } }
        : {}),
    });
  } catch (e) {
    res.status(500).json({ error: "server_error" });
  }
}