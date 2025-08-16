// lib/dataStore.js
import fs from "fs";
import path from "path";

/**
 * ترتیب اولویت برای نوشتن:
 *  1) DATA_DIR (اگر ست شده باشد)
 *  2) ./data داخل پروژه (لوکال OK، روی Render معمولا read-only)
 *  3) /tmp (روی Render قابل‌نوشتن ولی موقتی)
 */

const envDir = process.env.DATA_DIR || "";
const repoDir = path.join(process.cwd(), "data");
const tmpDir = "/tmp";

const candidates = [
  envDir && path.resolve(envDir),
  repoDir,
  tmpDir,
].filter(Boolean);

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

let chosenPath = null; // مسیر فایل انتخاب‌شده برای نوشتن

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
  // اول از مسیر انتخابی، بعد از ./data، بعد /tmp هر کدام که وجود داشته باشد
  const arr = [];
  try {
    const p = chooseWritePath();
    arr.push(p);
  } catch {
    // ignore
  }
  arr.push(path.join(repoDir, "warranty.json"));
  arr.push(path.join(tmpDir, "warranty.json"));

  // یکتا
  return Array.from(new Set(arr));
}

export function ensureStore() {
  // فایل را اگر نبود می‌سازد در مسیر قابل‌نوشتن
  const target = chooseWritePath();
  const dir = path.dirname(target);
  ensureDir(dir);
  if (!fs.existsSync(target)) {
    fs.writeFileSync(
      target,
      JSON.stringify(
        { rows: [], updated: new Date().toISOString() },
        null,
        2
      ),
      "utf-8"
    );
  }
  return target;
}

export function readStore() {
  // به ترتیب از اولین فایلی که وجود دارد می‌خوانیم
  for (const p of readOrder()) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf-8");
        return JSON.parse(raw || '{"rows":[]}');
      } catch {
        // اگر خراب بود، بعدی
      }
    }
  }
  // اگر هیچ‌کدام موجود نبود، یک فایل سالم در مسیر نوشتن بساز
  const target = ensureStore();
  const raw = fs.readFileSync(target, "utf-8");
  return JSON.parse(raw || '{"rows":[]}');
}

export function writeStore(next) {
  const target = ensureStore();
  fs.writeFileSync(target, JSON.stringify(next, null, 2), "utf-8");
  return target; // برای دیباگ
}