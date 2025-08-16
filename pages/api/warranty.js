// pages/api/warranty.js
import { readStore } from "../../lib/dataStore";

const normalize = (s) =>
  (s ?? "")
    .toString()
    .toUpperCase()
    .replace(/[\s\-_/\\]+/g, ""); // فاصله و خط‌تیره حذف می‌شود

export default function handler(req, res) {
  try {
    const { q = "", debug } = req.query;
    const store = readStore();
    const rows = Array.isArray(store.rows) ? store.rows : [];

    let result = rows;
    const nq = normalize(q);
    if (nq) {
      result = rows.filter((r) => normalize(r.serial) === nq);
    }

    return res.status(200).json({
      rows: result,
      meta: { updated: store.updated || null },
      ...(debug ? { debug: { source: "dataStore", records: rows.length } } : {}),
    });
  } catch (err) {
    console.error("warranty api error:", err);
    return res.status(500).json({ error: "server_error" });
  }
}