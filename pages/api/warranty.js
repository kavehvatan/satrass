// pages/api/warranty.js
import fs from "fs/promises";
import path from "path";

async function readFirstExisting(paths) {
  for (const p of paths) {
    try {
      const txt = await fs.readFile(p, "utf8");
      return { json: JSON.parse(txt), source: p };
    } catch (e) {
      // بی‌صدا رد شو و مسیر بعدی رو تست کن
    }
  }
  return { json: { meta: {}, records: [] }, source: null };
}

async function loadWarranty() {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "public", "data", "warranty.json"),             // پیشنهاد اصلی
    path.join(cwd, "data", "warranty.json"),                       // اگر قدیمی گذاشتی
    path.join(cwd, ".next", "standalone", "public", "data", "warranty.json") // بعضی دیپلوی‌ها
  ];
  return readFirstExisting(candidates);
}

function norm(s = "") {
  return String(s).replace(/[\s-]+/g, "").toUpperCase();
}

export default async function handler(req, res) {
  const bodyOrQuery = req.method === "POST" ? req.body : req.query;
  const q = (bodyOrQuery.q || bodyOrQuery.serial || "").toString();
  const debug = bodyOrQuery.debug === "1" || bodyOrQuery.debug === "true";

  const { json, source } = await loadWarranty();
  const serials = q
    .split(/[,\n\r]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const bySerial = new Map(
    (json.records || []).map((r) => [norm(r.serial), r])
  );

  const rows = serials.map((s) => {
    const hit = bySerial.get(norm(s));
    return {
      serial: s,
      brand: hit?.brand || "-",
      model: hit?.model || "-",
      status: hit ? (hit.status || "registered") : "not_found",
      start: hit?.start || "-",
      end: hit?.end || "-",
      notes: hit?.notes || "-"
    };
  });

  res.status(200).json({
    rows,
    meta: json.meta || {},
    ...(debug ? { debug: { source, records: json.records?.length || 0 } } : {})
  });
}