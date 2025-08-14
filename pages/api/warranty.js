// pages/api/warranty.js
// JSON لوکال؛ داخل باندل Next هم میاد (standalone-friendly)
let DB = {};
try {
  DB = require("../../data/warranty.json");
} catch (e) {
  DB = {};
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  const { serials } = req.body || {};
  if (!Array.isArray(serials) || !serials.length) {
    return res.status(400).json({ error: "serials required" });
  }

  const items = serials.map((raw) => {
    const serial = String(raw || "").trim();
    const hit = DB[serial];
    if (hit) return { serial, ...hit };
    return { serial, status: "not_found" };
  });

  res.json({ items, source: "local-json", count: items.length });
}