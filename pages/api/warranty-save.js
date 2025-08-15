// pages/api/warranty-save.js
import fs from "fs/promises";
import path from "path";

function titleCase(str = "") {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeDate(input = "") {
  const s = String(input).trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // MM/DD/YYYY یا MM-DD-YYYY
  const m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) {
    const [, mm, dd, yyyy] = m;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  // اگر ناشناخته بود همان را برگردان
  return s;
}

function mapStatusToStored(s = "") {
  const k = s.toString().toLowerCase();
  if (k.includes("فعال") || k.includes("active")) return "active";
  if (k.includes("منقضی") || k.includes("expired")) return "expired";
  return "unknown";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const token = req.headers["x-admin-token"] || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }

  let rows = [];
  try {
    const body = req.body || {};
    rows = Array.isArray(body.rows) ? body.rows : [];
  } catch {
    rows = [];
  }

  if (!rows.length) {
    return res.status(200).json({ ok: true, saved: 0 });
  }

  const cleaned = [];
  for (const r of rows) {
    const serial = String(r.serial || "").toUpperCase().trim();
    if (!serial) return res.status(400).json({ error: "serial is required" });

    const brand = String(r.brand || r.vendor || "").trim();
    const model = titleCase(r.model || "-");
    const notes = String(r.notes || "").trim();

    // قبول هر دو نام: expireAt یا end
    const rawEnd = r.end || r.expireAt || r.expire_at || "";
    if (!rawEnd) return res.status(400).json({ error: "expireAt is required" });
    const end = normalizeDate(rawEnd);

    const status = mapStatusToStored(r.status || "");

    cleaned.push({ serial, brand, model, status, end, notes });
  }

  const file = path.join(process.cwd(), "data", "warranty.json");
  let db = { rows: [] };
  try {
    const txt = await fs.readFile(file, "utf8");
    db = JSON.parse(txt || "{}");
    if (!Array.isArray(db.rows)) db.rows = [];
  } catch {
    db = { rows: [] };
  }

  // ادغام بر اساس serial
  const map = new Map(db.rows.map((x) => [String(x.serial).toUpperCase(), x]));
  for (const c of cleaned) {
    map.set(c.serial, c);
  }

  const out = {
    rows: Array.from(map.values()),
    meta: { updated: new Date().toISOString().slice(0, 10) },
  };

  await fs.mkdir(path.dirname(file), { recursive: true }).catch(() => {});
  await fs.writeFile(file, JSON.stringify(out, null, 2), "utf8");

  return res.status(200).json({ ok: true, saved: cleaned.length });
}