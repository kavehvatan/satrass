// pages/api/warranty-save.js
import fs from "fs/promises";
import path from "path";

const DASH_RE = /[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g;
const WS_RE = /[\s\u200c\u200f\u200e\u202a-\u202e\u2066-\u2069]/g;
const normalize = (s = "") =>
  s.toString().toUpperCase().replace(WS_RE, "").replace(DASH_RE, "");

const filePath = path.join(process.cwd(), "data", "warranty.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // احراز هویت: توکن از هدر x-admin-token و متغیر محیطی ADMIN_TOKEN
  const token = (req.headers["x-admin-token"] || "").toString();
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // بدنهٔ درخواست
  const body = req.body;
  if (!body || !Array.isArray(body.rows)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // اعتبارسنجی: Serial و ExpireAt الزامی
  for (const r of body.rows) {
    if (!r.serial || !String(r.serial).trim()) {
      return res.status(400).json({ error: "serial is required" });
    }
    if (!r.expireAt) {
      return res.status(400).json({ error: "expireAt is required" });
    }
  }

  // خواندن فایل فعلی (اگر نبود، از صفر شروع می‌کنیم)
  let current = { rows: [], meta: {} };
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) current.rows = parsed;
    else if (Array.isArray(parsed.rows)) current.rows = parsed.rows;
    if (parsed.meta) current.meta = parsed.meta;
  } catch {
    // ignore
  }

  // ایندکس روی سریالِ نرمال‌شده
  const map = new Map(current.rows.map((r) => [normalize(r.serial), r]));
  let changed = false;

  // مرج/به‌روزرسانی
  for (const r of body.rows) {
    const key = normalize(r.serial);
    const nextRow = {
      serial: r.serial,                     // نمایش همون چیزی که وارد می‌کنی
      brand: r.brand || r.vendor || "-",    // هم‌تراز با API خواندن
      model: r.model || "-",
      status: r.status || "active",
      end: r.end || r.expireAt || "-",      // ذخیره در فیلد end
      notes: r.notes || "-",
    };

    if (map.has(key)) {
      const ex = map.get(key);
      ex.brand = nextRow.brand;
      ex.model = nextRow.model;
      ex.status = nextRow.status;
      ex.end = nextRow.end;
      ex.notes = nextRow.notes;
      changed = true;
    } else {
      current.rows.push(nextRow);
      map.set(key, nextRow);
      changed = true;
    }
  }

  current.meta.updated = new Date().toISOString().slice(0, 10);
  const pretty = JSON.stringify(current, null, 2);

  // تلاش برای نوشتن روی دیسک
  try {
    await fs.writeFile(filePath, pretty, "utf-8");
    return res.status(200).json({ ok: true });
  } catch {
    // اگر هاست read-only بود، JSON آپدیت‌شده را بده که دانلود/کمیت کنی
    return res.status(200).json({ ok: false, readonly: true, updatedJSON: pretty });
  }
}