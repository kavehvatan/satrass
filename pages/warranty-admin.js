// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

const VENDORS = [
  "HPE",
  "Dell",
  "Cisco",
  "Lenovo",
  "Huawei",
  "Juniper",
  "Supermicro",
  "Fujitsu",
  "Oracle",
  "Quantum",
];

const STATUS_OPTS = [
  { value: "active", label: "فعال" },
  { value: "expired", label: "منقضی" },
  { value: "unknown", label: "نامشخص" },
];

const NOTES_YEARS = Array.from({ length: 10 }, (_, i) => `${i + 1} سال`);

const dashRE = /[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g;
const wsRE =
  /[\s\u200c\u200f\u200e\u202a-\u202e\u2066-\u2069]/g; // اسپیس‌ها و کنترل‌های RTL

const normalizeSerial = (s = "") =>
  s.toString().toUpperCase().replace(wsRE, "").replace(dashRE, "");

export default function WarrantyAdmin() {
  // token
  const [token, setToken] = useState("");
  const tokenOk = useMemo(() => !!token.trim(), [token]);

  // form fields
  const [serial, setSerial] = useState("");
  const [vendor, setVendor] = useState(VENDORS[0]);
  const [model, setModel] = useState("");
  const [status, setStatus] = useState(STATUS_OPTS[0].value);
  const [expireAt, setExpireAt] = useState("");
  const [notes, setNotes] = useState("");

  // queue
  const [queue, setQueue] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // load token
  useEffect(() => {
    const t = localStorage.getItem("SAT_ADMIN_TOKEN");
    if (t) setToken(t);
  }, []);

  // persist token
  useEffect(() => {
    localStorage.setItem("SAT_ADMIN_TOKEN", token || "");
  }, [token]);

  // today for date min
  const todayStr = useMemo(() => {
    const d = new Date();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);

  const canAdd = serial.trim() && expireAt.trim();

  const addRow = () => {
    if (!canAdd) return;

    const normalized = normalizeSerial(serial);
    const row = {
      serial: normalized, // ذخیرهٔ تمیز و یکنواخت
      brand: vendor,
      model: model?.trim() || "-",
      status: status || "active",
      expireAt, // به API می‌فرستیم؛ آن طرف در فیلد `end` ذخیره می‌شود
      notes: notes || "-",
    };

    setQueue((q) => [...q, row]);

    // ریست معقول فرم
    setSerial("");
    // vendor/status را نگه می‌داریم که سریع بتوانی ردیف‌های مشابه ثبت کنی
    setModel("");
    setExpireAt("");
    setNotes("");
  };

  const removeRow = (idx) => {
    setQueue((q) => q.filter((_, i) => i !== idx));
  };

  const saveAll = async () => {
    setMsg("");
    if (!queue.length) {
      setMsg("ردیفی برای ذخیره وجود ندارد.");
      return;
    }
    if (!tokenOk) {
      setMsg("توکن ادمین را وارد کنید.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({ rows: queue }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(
          `خطا در ذخیره‌سازی: ${data?.error || res.status + " " + res.statusText}`
        );
      } else if (data?.readonly && data?.updatedJSON) {
        setMsg(
          "هاست اجازهٔ نوشتن روی دیسک ندارد. JSON به‌روزشده را دریافت کنید و دستی جایگزین کنید."
        );
        // ساخت یک دانلود روی کلاینت
        const blob = new Blob([data.updatedJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "warranty.json";
        a.click();
        URL.revokeObjectURL(url);
        setQueue([]);
      } else {
        setMsg("ثبت شد.");
        setQueue([]);
      }
    } catch (e) {
      setMsg("خطا در اتصال به سرور.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white/70 backdrop-blur px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-800";
  const selectClass =
    "w-full rounded-xl border border-gray-300 bg-white/70 backdrop-blur px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-800 cursor-pointer";

  return (
    <div className="container mx-auto px-4 py-10" dir="rtl">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">
        مدیریت گارنتی
      </h1>

      {/* Token */}
      <div className="rounded-2xl border border-gray-200 bg-white/60 backdrop-blur p-4 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <input
            className={`${inputClass} md:max-w-md`}
            placeholder="Admin Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div
            className={`text-sm ${
              tokenOk ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            {tokenOk ? "توکن فعال است" : "توکن تنظیم نشده است"}
          </div>
        </div>
      </div>

      {/* Add Row Card */}
      <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">افزودن ردیف</h2>
        </div>

        {/* Grid: row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              * Serial
            </label>
            <input
              className={inputClass}
              placeholder="مثال: HPE-9J1234"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              onBlur={() => setSerial(normalizeSerial(serial))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Vendor</label>
            <select
              className={selectClass}
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            >
              {VENDORS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Model</label>
            <input
              className={inputClass}
              placeholder="مثلاً: ProLiant DL380 Gen10"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>

        {/* Grid: row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              * ExpireAt
            </label>
            <input
              type="date"
              className={inputClass}
              min={todayStr}
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <select
              className={selectClass}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            >
              <option value="">—</option>
              {NOTES_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Help + Add */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-4">
          <div className="text-xs text-gray-500">
            (وارد کردن «Serial» و «ExpireAt» الزامی است)
          </div>
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              canAdd
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={addRow}
            disabled={!canAdd}
          >
            افزودن ردیف
          </button>
        </div>
      </div>

      {/* Queue Card */}
      <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">ردیف‌های آماده ثبت</h2>
          <button
            onClick={saveAll}
            disabled={!queue.length || !tokenOk || saving}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              queue.length && tokenOk && !saving
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {saving ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>

        {!queue.length ? (
          <div className="text-gray-500 text-sm">ردیفی اضافه نشده است.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2 text-right">Serial</th>
                  <th className="py-2 text-right">Vendor</th>
                  <th className="py-2 text-right">Model</th>
                  <th className="py-2 text-right">Status</th>
                  <th className="py-2 text-right">ExpireAt</th>
                  <th className="py-2 text-right">Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {queue.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2">{r.serial}</td>
                    <td className="py-2">{r.brand}</td>
                    <td className="py-2">{r.model}</td>
                    <td className="py-2">
                      {
                        (STATUS_OPTS.find((s) => s.value === r.status) || {})
                          .label
                      }
                    </td>
                    <td className="py-2">{r.expireAt}</td>
                    <td className="py-2">{r.notes}</td>
                    <td className="py-2 text-left">
                      <button
                        className="text-red-600 hover:text-red-700 text-xs"
                        onClick={() => removeRow(i)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {msg && (
          <div className="mt-4 text-sm text-gray-700">
            {/* پیام سرور */}
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}