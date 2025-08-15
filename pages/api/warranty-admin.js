// pages/api/warranty-admin.js
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

  // احراز هویت ساده با Bearer
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let body;
  try {
    body = req.body;
    if (!body || !Array.isArray(body.rows)) {
      return res.status(400).json({ error: "Invalid payload" });
    }
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // خواندن فایل موجود
  let current = { rows: [], meta: {} };
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.rows)) current.rows = parsed.rows;
    if (parsed?.meta) current.meta = parsed.meta;
  } catch {
    // اگر نبود، از صفر می‌سازیم
    current = { rows: [], meta: {} };
  }

  // اندیس سریال‌های موجود
  const map = new Map(
    current.rows.map((r) => [normalize(r.serial), r])
  );

  // مرج ردیف‌های ورودی
  let changed = false;
  for (const r of body.rows) {
    const key = normalize(r.serial);
    if (!key) continue;

    const nextRow = {
      serial: r.serial,         // نمایش با dash یا بدون؛ همان چیزی که ادمین وارد می‌کند
      brand: r.brand || r.vendor || "-", // همخوان با API خواندن
      model: r.model || "-",
      status: r.status || "active",
      end: r.end || r.expireAt || "-",   // تاریخ پایان
      notes: r.notes || "-",
    };

    if (map.has(key)) {
      // بروزرسانی
      const existing = map.get(key);
      existing.brand = nextRow.brand;
      existing.model = nextRow.model;
      existing.status = nextRow.status;
      existing.end = nextRow.end;
      existing.notes = nextRow.notes;
      changed = true;
    } else {
      current.rows.push(nextRow);
      map.set(key, nextRow);
      changed = true;
    }
  }

  current.meta.updated = new Date().toISOString().slice(0, 10);

  if (!changed) {
    return res.status(200).json({ ok: true, message: "No changes" });
  }

  const pretty = JSON.stringify(current, null, 2);

  try {
    await fs.writeFile(filePath, pretty, "utf-8");
    return res.status(200).json({ ok: true });
  } catch (e) {
    // هاست read-only: فایل را به‌صورت خروجی برگردان که دانلود شود
    return res
      .status(200)
      .json({ ok: false, readonly: true, updatedJSON: pretty });
  }
}