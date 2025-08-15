// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

const VENDORS = [
  "HPE", "Dell EMC", "Cisco", "Lenovo", "HPE Aruba", "Huawei",
  "Oracle", "Fujitsu", "Juniper", "Quantum", "IBM"
];

const STATUSES = [
  { value: "active", label: "فعال" },
  { value: "expired", label: "منقضی" },
  { value: "registered", label: "ثبت‌شده" },
  { value: "pending", label: "در انتظار" },
];

const YEAR_NOTES = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  // نمایش فارسی: «۱ سال»، «۲ سال» ...
  const faDigits = n.toString().replace(/[0-9]/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  return `${faDigits} سال`;
});

export default function WarrantyAdmin() {
  const [tokenInput, setTokenInput] = useState("");
  const [token, setToken] = useState("");          // توکن ذخیره‌شده
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // ردیف جدید
  const [draft, setDraft] = useState({
    serial: "",
    vendor: VENDORS[0],
    model: "",
    status: STATUSES[0].value,
    expireAt: "", // اجباری
    notes: YEAR_NOTES[0], // پیش‌فرض «۱ سال»
  });

  useEffect(() => {
    const t = localStorage.getItem("ADMIN_TOKEN");
    if (t) {
      setToken(t);
      setTokenInput(t);
    }
  }, []);

  function saveToken() {
    if (!tokenInput.trim()) return;
    localStorage.setItem("ADMIN_TOKEN", tokenInput.trim());
    setToken(tokenInput.trim());
    setOk("توکن ذخیره شد.");
    setTimeout(() => setOk(""), 1500);
  }

  function clearToken() {
    localStorage.removeItem("ADMIN_TOKEN");
    setToken("");
    setTokenInput("");
    setOk("توکن پاک شد.");
    setTimeout(() => setOk(""), 1500);
  }

  // اعتبارسنجی «الزامی بودن ExpireAt»
  function validateRow(r) {
    if (!r.serial.trim()) return "سریال الزامی است.";
    if (!r.expireAt) return "تاریخ پایان (ExpireAt) الزامی است.";
    return "";
  }

  function addRow() {
    setError("");
    const msg = validateRow(draft);
    if (msg) {
      setError(msg);
      return;
    }
    setRows(prev => [...prev, { ...draft }]);
    setDraft(prev => ({
      ...prev,
      serial: "",
      // expireAt را خالی نکن تا اگر می‌خواهی پشت سر هم اضافه کنی تغییر ندهی؛
      // اگر ترجیح می‌دهی خالی شود، خط بعد را فعال کن.
      // expireAt: "",
    }));
    setOk("ردیف اضافه شد.");
    setTimeout(() => setOk(""), 1200);
  }

  function removeRow(idx) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  async function submitAll() {
    setError("");
    setOk("");

    // اعتبارسنجی همه ردیف‌ها
    for (const r of rows) {
      const msg = validateRow(r);
      if (msg) {
        setError(`خطا در یکی از ردیف‌ها: ${msg}`);
        return;
      }
    }
    if (!rows.length) {
      setError("هیچ ردیفی برای ثبت وجود ندارد.");
      return;
    }
    if (!token) {
      setError("توکن ادمین تنظیم نشده است.");
      return;
    }

    try {
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      setOk("ثبت با موفقیت انجام شد.");
      setRows([]);
    } catch (e) {
      setError(`خطا در ثبت: ${e.message}`);
    }
  }

  const canAdd = useMemo(() => {
    return draft.serial.trim() && draft.expireAt;
  }, [draft.serial, draft.expireAt]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">مدیریت گارانتی</h1>

      {/* بخش توکن */}
      <div className="mb-6 rounded-xl border p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">Admin Token</label>
          <input
            dir="ltr"
            className="input bg-white/60 focus:bg-white"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="توکن ادمین را وارد کنید"
          />
          <button onClick={saveToken} className="btn">ذخیره</button>
          <button onClick={clearToken} className="btn-secondary">حذف</button>
          {token && <span className="text-xs text-emerald-600">توکن فعال است</span>}
        </div>
        {ok && <div className="text-emerald-600 text-sm">{ok}</div>}
        {error && <div className="text-rose-600 text-sm">{error}</div>}
      </div>

      {/* فرم ردیف جدید */}
      <div className="rounded-xl border p-4 mb-6">
        <h2 className="font-semibold mb-3">افزودن ردیف</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Serial */}
          <div className="md:col-span-2">
            <label className="label">Serial *</label>
            <input
              className="input"
              value={draft.serial}
              onChange={(e) => setDraft({ ...draft, serial: e.target.value })}
              placeholder="مثال: HPE-9J1234"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="label">Vendor</label>
            <select
              className="input"
              value={draft.vendor}
              onChange={(e) => setDraft({ ...draft, vendor: e.target.value })}
            >
              {VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="label">Model</label>
            <input
              className="input"
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              placeholder="مثلاً: ProLiant DL380 Gen10"
            />
          </div>

          {/* Status */}
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value })}
            >
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* ExpireAt – الزامی */}
          <div>
            <label className="label">ExpireAt *</label>
            <input
              type="date"
              className="input"
              value={draft.expireAt}
              onChange={(e) => setDraft({ ...draft, expireAt: e.target.value })}
              required
            />
          </div>

          {/* Notes – ۱ تا ۱۰ سال */}
          <div>
            <label className="label">Notes</label>
            <select
              className="input"
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            >
              {YEAR_NOTES.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={addRow} className="btn" disabled={!canAdd}>
            افزودن ردیف
          </button>
          {!canAdd && (
            <span className="text-xs text-gray-500">
              (وارد کردن «Serial» و «ExpireAt» الزامی است)
            </span>
          )}
        </div>
      </div>

      {/* جدول ردیف‌ها */}
      <div className="rounded-xl border p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">ردیف‌های آماده ثبت</h3>
          <button onClick={submitAll} className="btn" disabled={!rows.length}>
            ثبت / Import
          </button>
        </div>

        {!rows.length ? (
          <div className="text-sm text-gray-500">ردیفی اضافه نشده است.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right text-gray-500">
                  <th className="p-2">#</th>
                  <th className="p-2">Serial</th>
                  <th className="p-2">Vendor</th>
                  <th className="p-2">Model</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">ExpireAt</th>
                  <th className="p-2">Notes</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2 font-mono">{r.serial}</td>
                    <td className="p-2">{r.vendor}</td>
                    <td className="p-2">{r.model || "-"}</td>
                    <td className="p-2">
                      {STATUSES.find(s => s.value === r.status)?.label || r.status}
                    </td>
                    <td className="p-2">{r.expireAt}</td>
                    <td className="p-2">{r.notes || "-"}</td>
                    <td className="p-2 text-left">
                      <button
                        className="btn-danger"
                        onClick={() => removeRow(i)}
                        title="حذف"
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

        {error && <div className="mt-3 text-rose-600 text-sm">{error}</div>}
        {ok && <div className="mt-3 text-emerald-600 text-sm">{ok}</div>}
      </div>

      {/* استایل‌های کوچک Tailwind-مانند */}
      <style jsx>{`
        .label { @apply text-xs text-gray-500 block mb-1; }
        .input { @apply w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400; }
        .btn { @apply rounded-lg bg-black text-white px-4 py-2 hover:bg-gray-900 disabled:opacity-50; }
        .btn-secondary { @apply rounded-lg border px-3 py-2 hover:bg-gray-50; }
        .btn-danger { @apply rounded-lg bg-rose-600 text-white px-3 py-1 hover:bg-rose-700; }
      `}</style>
    </div>
  );
}