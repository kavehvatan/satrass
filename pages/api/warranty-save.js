// pages/api/warranty-save.js

import { readStore, writeStore } from "../../lib/dataStore";

/** نرمال‌سازی سریال برای مقایسه */
function normalizeSerial(s) {
  return String(s || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ""); // حذف - و فاصله و ...
}

/** نگاشت وضعیت به active/inactive */
function normalizeStatus(v) {
  const t = String(v || "").trim().toLowerCase();
  if (!t) return "active";
  // فارسی‌های پرکاربرد
  if (["فعال", "active", "on", "enabled", "enable", "yes", "true"].includes(t)) {
    return "active";
  }
  if (["غیرفعال", "inactive", "off", "disabled", "disable", "no", "false"].includes(t)) {
    return "inactive";
  }
  return "active";
}

/** تبدیل تاریخ ورودی به YYYY-MM-DD */
function toISODate(d) {
  if (!d) return "";
  let s = String(d).trim();

  // اگر YYYY-MM-DD باشد
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // اگر MM/DD/YYYY یا MM / DD / YYYY باشد
  s = s.replace(/\s/g, "");
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [_, mm, dd, yyyy] = m;
    const mm2 = String(mm).padStart(2, "0");
    const dd2 = String(dd).padStart(2, "0");
    return `${yyyy}-${mm2}-${dd2}`;
  }

  // تلاش نهایی با Date
  const dt = new Date(s);
  if (!isNaN(dt.getTime())) {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return "";
}

/** ولیدیشن و ساخت آبجکت استاندارد برای ذخیره */
function buildRow(raw) {
  const serialInput = (raw.serial ?? raw.Serial ?? "").toString();
  const vendorInput = (raw.vendor ?? raw.brand ?? raw.Vendor ?? "").toString();
  const modelInput = (raw.model ?? raw.Model ?? "").toString();
  const statusInput = (raw.status ?? raw.Status ?? "").toString();
  const notesInput = (raw.notes ?? raw.Notes ?? "").toString();
  const expireInput = (raw.expireAt ?? raw.end ?? raw.ExpireAt ?? raw.End ?? "").toString();

  const serialTrimmed = serialInput.trim().toUpperCase();
  const serialNorm = normalizeSerial(serialTrimmed);

  if (!serialTrimmed || !serialNorm) {
    return { ok: false, error: "serial is required" };
  }

  const endISO = toISODate(expireInput);
  if (!endISO) {
    return { ok: false, error: "expireAt is required" };
  }

  const brand = vendorInput.trim();
  const model = modelInput.trim();
  const status = normalizeStatus(statusInput);
  const notes = notesInput.trim();

  // فرمت نهایی مطابق API جستجو: serial, brand, model, status, end, notes
  return {
    ok: true,
    row: {
      serial: serialTrimmed,  // برای نمایش
      serialNorm,            // فقط برای تطبیق داخلی
      brand,
      model,
      status,
      end: endISO,
      notes,
    },
  };
}

/** جایگزینی یا اضافه‌کردن ردیف در store */
function upsertRows(store, list) {
  // مطمئن شو ساختار rows وجود دارد
  if (!store || typeof store !== "object") store = {};
  if (!Array.isArray(store.rows)) store.rows = [];

  // Map برای جستجوی سریع براساس serialNorm
  const index = new Map();
  store.rows.forEach((r, i) => {
    const norm = normalizeSerial(r.serial || "");
    if (norm) index.set(norm, i);
  });

  list.forEach((item) => {
    // اگر قبلاً با همین serialNorm بوده، جایگزین کن
    const i = index.get(item.serialNorm);
    if (typeof i === "number") {
      // serialNorm را در فایل نهایی ذخیره نمی‌کنیم (فقط برای تطبیق داخلی بود)
      const { serialNorm, ...clean } = item;
      store.rows[i] = clean;
    } else {
      const { serialNorm, ...clean } = item;
      store.rows.push(clean);
    }
  });

  store.updated = new Date().toISOString();
  return store;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // بررسی توکن اگر در محیط تعریف شده باشد
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
    if (ADMIN_TOKEN) {
      const bearer = req.headers.authorization || "";
      let token = "";
      if (/^Bearer\s+/i.test(bearer)) {
        token = bearer.replace(/^Bearer\s+/i, "").trim();
      } else if (req.body && req.body.token) {
        token = String(req.body.token).trim();
      }
      if (!token || token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: "unauthorized" });
      }
    }

    const payload = req.body || {};
    const inputRows = Array.isArray(payload.rows)
      ? payload.rows
      : (payload.row ? [payload.row] : [payload]);

    // ولیدیشن و ساخت ردیف‌های استاندارد
    const prepared = [];
    for (const r of inputRows) {
      const built = buildRow(r);
      if (!built.ok) {
        return res.status(400).json({ error: built.error });
      }
      prepared.push(built.row);
    }

    // خواندن، آپسرت، نوشتن
    const store = readStore();
    const next = upsertRows(store, prepared);
    const savedPath = writeStore(next);

    return res.status(200).json({
      ok: true,
      savedTo: savedPath,
      rowsCount: next.rows.length,
      updated: next.updated,
    });
  } catch (err) {
    console.error("warranty-save error:", err);
    return res.status(500).json({ error: "server_error" });
  }
}