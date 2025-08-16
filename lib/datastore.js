// lib/dataStore.js
import fs from "fs";
import path from "path";

/**
 * ترتیب نوشتن:
 * 1) مسیر DATA_DIR اگر در env ست شده باشد
 * 2) ./data داخل ریپو (لوکال OK، روی Render معمولاً read-only)
 * 3) /tmp (روی Render قابل‌نوشتن اما موقتی)
 */

const envDir = process.env.DATA_DIR || "";
const repoDir = path.join(process.cwd(), "data");
const tmpDir = "/tmp";

const candidates = [envDir && path.resolve(envDir), repoDir, tmpDir].filter(Boolean);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function canWrite(dir) {
  try {
    ensureDir(dir);
    const p = path.join(dir, ".write-test-" + Date.now());
    fs.writeFileSync(p, "ok");
    fs.unlinkSync(p);
    return true;
  } catch {
    return false;
  }
}

let chosenPath = null;

function chooseWritePath() {
  if (chosenPath) return chosenPath;
  for (const dir of candidates) {
    if (canWrite(dir)) {
      chosenPath = path.join(dir, "warranty.json");
      return chosenPath;
    }
  }
  throw new Error("هیچ مسیری برای نوشتن داده‌ها پیدا نشد.");
}

function readOrder() {
  const arr = [];
  try {
    const p = chooseWritePath();
    arr.push(p);
  } catch {}
  arr.push(path.join(repoDir, "warranty.json"));
  arr.push(path.join(tmpDir, "warranty.json"));
  return Array.from(new Set(arr));
}

export function ensureStore() {
  const target = chooseWritePath();
  const dir = path.dirname(target);
  ensureDir(dir);
  if (!fs.existsSync(target)) {
    fs.writeFileSync(
      target,
      JSON.stringify({ rows: [], updated: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  }
  return target;
}

export function readStore() {
  for (const p of readOrder()) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf-8");
        return JSON.parse(raw || '{"rows":[]}');
      } catch {}
    }
  }
  const target = ensureStore();
  const raw = fs.readFileSync(target, "utf-8");
  return JSON.parse(raw || '{"rows":[]}');
}

export function writeStore(next) {
  const target = ensureStore();
  fs.writeFileSync(target, JSON.stringify(next, null, 2), "utf-8");
  return target; // برای دیباگ
}