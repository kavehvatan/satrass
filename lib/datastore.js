// lib/dataStore.js
import fs from "fs/promises";
import path from "path";

export const dataFilePath = path.join(process.cwd(), "data", "warranty.json");

export async function readStore() {
  try {
    const text = await fs.readFile(dataFilePath, "utf8");
    const json = text?.trim() ? JSON.parse(text) : [];
    // ساپورت هر دو فرم: آرایه خالی یا آبجکت {rows:[]}
    return Array.isArray(json) ? json : (json.rows || []);
  } catch (err) {
    if (err.code === "ENOENT") return []; // اگر فایل نبود، آرایه خالی
    throw err;
  }
}

export async function writeStore(rows) {
  const out = Array.isArray(rows) ? rows : (rows.rows || []);
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(out, null, 2), "utf8");
  return { ok: true, count: out.length };
}