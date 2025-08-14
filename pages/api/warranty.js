// pages/api/warranty.js
import fs from "fs";
import path from "path";

function loadDB() {
  try {
    const p = path.join(process.cwd(), "data", "warranty.json");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      return JSON.parse(raw || "{}");
    }
  } catch (e) {}
  return {};
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  const { serials } = req.body || {};
  if (!Array.isArray(serials) || !serials.length) {
    return res.status(400).json({ error: "serials required" });
  }

  const DB = loadDB();
  const items = serials.map((raw) => {
    const serial = String(raw || "").trim();
    const hit = DB[serial];
    return hit ? { serial, ...hit } : { serial, status: "not_found" };
  });

  res.json({ items, source: "local-json", count: items.length });
}