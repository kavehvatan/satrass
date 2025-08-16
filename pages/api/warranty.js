// pages/api/warranty.js
import { readStore } from "../../lib/dataStore";

const normalize = (s) =>
  String(s || "")
    .toUpperCase()
    .replace(/[^\w]/g, "");

export default async function handler(req, res) {
  const q = String(req.query.q || "").trim();
  const dbg = req.query.debug !== undefined;

  const store = await readStore();
  const all = Array.isArray(store.rows) ? store.rows : [];

  let rows = all;
  if (q) {
    const key = normalize(q);
    rows = all.filter((r) => normalize(r.serial) === key);
  }

  const body = { rows };
  if (dbg) {
    body.meta = {
      total: all.length,
      updated: store.updated || null,
      source: store.__source || "unknown",
      queried: q || null,
    };
  }
  res.json(body);
}