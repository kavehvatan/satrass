// pages/api/warranty.js
import fs from "fs/promises";
import path from "path";

async function readFirstExisting(paths) {
  for (const p of paths) {
    try {
      const txt = await fs.readFile(p, "utf8");
      return { json: JSON.parse(txt), source: p };
    } catch {}
  }
  return { json: { meta: {}, records: [] }, source: null };
}

async function loadWarranty() {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "public", "data", "warranty.json"),
    path.join(cwd, "data", "warranty.json"),
    path.join(cwd, ".next", "standalone", "public", "data", "warranty.json"),
  ];
  return readFirstExisting(candidates);
}

// ⬅️ اینجا را عوض کردیم: هر چیزی به جز حروف و اعداد حذف می‌شود
function norm(s = "") {
  return String(s).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export default async function handler(req, res) {
  const bodyOrQuery = req.method === "POST" ? req.body : req.query;
  const q = (bodyOrQuery.q || bodyOrQuery.serial || "").toString();
  const debug = bodyOrQuery.debug === "1" || bodyOrQuery.debug === "true";

  const { json, source } = await loadWarranty();

  const serials = q
    .split(/[,\n\r]+/)       // هر سریال در یک خط یا جدا با کاما
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
      notes: hit?.notes || "-",
    };
  });

  res.status(200).json({
    rows,
    meta: json.meta || {},
    ...(debug ? { debug: { source, records: json.records?.length || 0 } } : {}),
  });
}