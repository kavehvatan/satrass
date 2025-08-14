// pages/warranty-admin.js
import { useMemo, useState } from "react";

/** 🔐 اختیاری: اگر ADMIN_KEY در env ست شده باشد، برای دیدن صفحه باید ?key=همان مقدار را به URL اضافه کنی */
export async function getServerSideProps({ query }) {
  const required = process.env.ADMIN_KEY;
  if (required && query.key !== required) {
    return { notFound: true };
  }
  return { props: {} };
}

const SAMPLE = `Serial,Vendor,Model,Status,ExpireAt,Notes
CN12345ABCD,Dell EMC,Unity 480F,active,2026-07-31,تحت قرارداد طلایی
HPE-9J1234,HPE,ProLiant DL380 Gen10,expired,2024-03-01,`;

const VALID_STATUS = new Set(["active", "expired", "unknown"]);

function parseCSV(text) {
  // ساده و کافی: برش سطر/ستون با کاما؛ کوتیشن‌های ساده را هم پاک می‌کنیم
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) return { head: [], rows: [] };
  const head = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cols = line
      .split(",")
      .map((c) => c.replace(/^"(.*)"$/, "$1").trim());
    const rec = {};
    head.forEach((h, i) => (rec[h] = (cols[i] || "").trim()));
    return rec;
  });
  return { head, rows };
}

function toDB(rows) {
  const db = {};
  const errors = [];
  const dups = new Set();
  for (const r of rows) {
    const serial = (r.Serial || "").trim();
    if (!serial) {
      errors.push({ serial: "", msg: "ستون Serial خالی است" });
      continue;
    }
    if (db[serial]) dups.add(serial);
    const status = (r.Status || "unknown").toLowerCase();
    if (!VALID_STATUS.has(status)) {
      errors.push({
        serial,
        msg: `Status نامعتبر: "${r.Status}" (مجاز: active|expired|unknown)`,
      });
    }
    db[serial] = {
      vendor: r.Vendor || "",
      model: r.Model || "",
      status,
      expireAt: r.ExpireAt || "",
      notes: r.Notes || "",
    };
  }
  return { db, errors, dups: Array.from(dups) };
}

export default function WarrantyAdmin() {
  const [mode, setMode] = useState("csv"); // csv | json
  const [csvText, setCsvText] = useState(SAMPLE);
  const [jsonText, setJsonText] = useState("{\n}\n");

  // اگر کاربر JSON انتخاب کند، همان را پیش‌نمایش می‌کنیم
  const parsed = useMemo(() => {
    try {
      if (mode === "json") {
        const obj = JSON.parse(jsonText || "{}");
        const rows = Object.entries(obj).map(([Serial, v]) => ({
          Serial,
          Vendor: v.vendor || "",
          Model: v.model || "",
          Status: v.status || "unknown",
          ExpireAt: v.expireAt || "",
          Notes: v.notes || "",
        }));
        return { head: ["Serial","Vendor","Model","Status","ExpireAt","Notes"], rows };
      } else {
        return parseCSV(csvText);
      }
    } catch (e) {
      return { head: [], rows: [], error: e.message };
    }
  }, [mode, csvText, jsonText]);

  const { db, errors, dups } = useMemo(() => {
    if (!parsed.rows?.length) return { db: {}, errors: [], dups: [] };
    return toDB(parsed.rows);
  }, [parsed]);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warranty.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importExistingJson = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(String(reader.result || "{}"));
        setMode("json");
        setJsonText(JSON.stringify(obj, null, 2));
      } catch {
        alert("JSON نامعتبر است.");
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  };

  return (
    <main className="min-h-screen font-sans">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold">ساخت دیتابیس گارانتی (JSON)</h1>
          <label className="text-sm">
            <input type="file" accept="application/json" onChange={importExistingJson} className="hidden" />
            <span className="inline-block cursor-pointer rounded-lg border px-3 py-1.5 hover:bg-gray-50">بارگذاری JSON موجود</span>
          </label>
        </div>

        <p className="mt-2 text-gray-600">
          ورودی بده، پیش‌نمایش بگیر، و با یک کلیک <code className="bg-gray-100 px-1 rounded">warranty.json</code> دانلود کن. بعدش فقط بذار داخل
          <code className="bg-gray-100 mx-1 px-1 rounded">/data/warranty.json</code> و پوش بده.
        </p>

        {/* انتخاب حالت ورودی */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setMode("csv")}
            className={`rounded-lg px-3 py-1.5 border ${mode==="csv" ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            ورودی CSV/متن
          </button>
          <button
            onClick={() => setMode("json")}
            className={`rounded-lg px-3 py-1.5 border ${mode==="json" ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            ورودی JSON
          </button>
        </div>

        {/* ویرایشگر */}
        <div className="mt-3">
          {mode === "csv" ? (
            <textarea
              className="w-full min-h-[220px] border rounded-lg p-3 font-mono"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Serial,Vendor,Model,Status,ExpireAt,Notes"
            />
          ) : (
            <textarea
              className="w-full min-h-[220px] border rounded-lg p-3 font-mono"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='{"CN123": { "vendor": "...", "model":"...", "status":"active", "expireAt":"2026-01-01", "notes":"" }}'
            />
          )}
        </div>

        {/* خطاها */}
        {parsed.error && (
          <div className="mt-3 rounded-lg bg-rose-50 text-rose-800 p-3 border border-rose-200">
            خطای پارس: {parsed.error}
          </div>
        )}

        {(errors.length > 0 || dups.length > 0) && (
          <div className="mt-3 rounded-lg bg-amber-50 text-amber-800 p-3 border border-amber-200">
            {dups.length > 0 && <div>سریال تکراری: <b className="font-mono">{dups.join(", ")}</b></div>}
            {errors.map((e, i) => (
              <div key={i}>{e.serial ? <b className="font-mono">{e.serial}</b> : "رکورد"} — {e.msg}</div>
            ))}
          </div>
        )}

        {/* پیش‌نمایش */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-50">
              <tr className="[&>th]:p-2 [&>th]:text-right">
                <th>Serial</th><th>Vendor</th><th>Model</th><th>Status</th><th>ExpireAt</th><th>Notes</th>
              </tr>
            </thead>
            <tbody className="[&>tr>td]:p-2 [&>tr>td]:border-t">
              {Object.entries(db).map(([serial, v]) => (
                <tr key={serial}>
                  <td className="font-mono">{serial}</td>
                  <td>{v.vendor}</td>
                  <td>{v.model}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded bg-gray-100">{v.status}</span>
                  </td>
                  <td>{v.expireAt}</td>
                  <td>{v.notes}</td>
                </tr>
              ))}
              {Object.keys(db).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">داده‌ای برای پیش‌نمایش نیست.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* خروجی */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={downloadJson}
            className="rounded-lg px-4 py-2 bg-black text-white hover:bg-zinc-800 transition disabled:opacity-60"
            disabled={Object.keys(db).length === 0 || errors.length > 0}
            title={errors.length ? "اول خطاها را برطرف کن" : ""}
          >
            دانلود warranty.json
          </button>
          <span className="text-sm text-gray-500">
            وضعیت مجاز: <code className="bg-gray-100 px-1 rounded">active</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">expired</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">unknown</code>
          </span>
        </div>
      </section>
    </main>
  );
}