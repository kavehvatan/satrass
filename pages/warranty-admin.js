// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

const VENDORS = ["HPE", "Dell EMC", "Lenovo", "Cisco", "Huawei", "Fujitsu"];
const STATUSES = ["فعال", "غیرفعال"];
const NOTES_YEARS = Array.from({ length: 10 }, (_, i) => `${i + 1} سال`);

// چند مدل پرمصرف نمونه؛ در اجرا مدل‌های جدیدِ ثبت‌شده هم به این لیست اضافه می‌شوند
const PRESET_MODELS = [
  // Unity (نمونه)
  "Unity XT 480", "Unity XT 380", "Unity XT 680", "Unity XT 880",
  // HPE ProLiant (نمونه)
  "ProLiant DL360 Gen10", "ProLiant DL380 Gen10", "ProLiant DL380 Gen11",
  "ProLiant ML350 Gen10", "ProLiant DL325 Gen10 Plus",
  // Dell EMC PowerEdge (نمونه)
  "PowerEdge R740", "PowerEdge R650", "PowerEdge R750",
  // Lenovo (نمونه)
  "ThinkSystem SR650", "ThinkSystem SR630",
  // Cisco (نمونه)
  "UCS C220 M5", "UCS C240 M5",
];

export default function WarrantyAdmin() {
  const [rows, setRows] = useState([]);
  const [vendor, setVendor] = useState("HPE");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("فعال");
  const [expireAt, setExpireAt] = useState("");
  const [serial, setSerial] = useState("");
  const [note, setNote] = useState("");
  const [models, setModels] = useState(PRESET_MODELS);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // {type:'ok'|'err', text:string}
  const [hasToken, setHasToken] = useState(false); // فقط وضعیت؛ خود توکن نمایش داده نمی‌شود

  // وضعیت نمایش پیام
  function toastOk(t) { setMessage({ type: "ok", text: t }); setTimeout(() => setMessage(null), 3000); }
  function toastErr(t) { setMessage({ type: "err", text: t }); setTimeout(() => setMessage(null), 5000); }

  // فقط وضعیت توکن را چک می‌کنیم؛ مقدارش نمایش داده نمی‌شود
  useEffect(() => {
    const t = typeof window !== "undefined" ? window.localStorage.getItem("warranty_token") : "";
    setHasToken(!!t);
  }, []);

  function handleAdminLogin() {
    const val = window.prompt("توکن مدیریتی را وارد کنید:");
    if (!val) return;
    window.localStorage.setItem("warranty_token", val.trim());
    setHasToken(true);
    toastOk("توکن ذخیره شد.");
  }

  function handleAdminLogout() {
    window.localStorage.removeItem("warranty_token");
    setHasToken(false);
    toastOk("توکن پاک شد.");
  }

  // افزودن ردیف به بافر محلی (پایین صفحه)
  function addRow() {
    if (!serial.trim()) {
      toastErr("فیلد سریال الزامی است.");
      return;
    }
    if (!expireAt) {
      toastErr("فیلد تاریخ پایان (ExpireAt) الزامی است.");
      return;
    }

    const normalized = {
      serial: serial.trim(),
      vendor: vendor.trim(),
      model: model.trim(),
      status: status === "فعال" ? "active" : "inactive",
      expireAt,
      notes: note || "",
    };

    setRows((prev) => [...prev, normalized]);

    // اگر مدل جدیدی بود، به پیشنهادها اضافه شود
    setModels((prev) => {
      const next = new Set(prev.map((m) => m.trim()));
      if (normalized.model) next.add(normalized.model);
      return Array.from(next);
    });

    // پاک کردن فرم
    setSerial("");
    setExpireAt("");
    setNote("");
    // model را نگه می‌داریم تا برای ردیف‌های بعدی سریع‌تر باشد
  }

  // ارسال به API برای ذخیره در data/warranty.json
  async function saveAll() {
    if (!hasToken) {
      toastErr("ابتدا با دکمه «ورود مدیر» توکن را وارد کنید.");
      return;
    }
    if (rows.length === 0) {
      toastErr("ردیفی برای ذخیره وجود ندارد.");
      return;
    }
    setBusy(true);
    try {
      const token = window.localStorage.getItem("warranty_token") || "";
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token, // فقط در هدر ارسال می‌شود
        },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "خطای نامشخص از سرور");
      }
      setRows([]);
      toastOk("ذخیره شد.");
    } catch (e) {
      toastErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const statusBadge = useMemo(() => {
    if (!hasToken) return (
      <button onClick={handleAdminLogin} className="px-3 py-1 rounded-full bg-brand-yellow text-black text-sm">
        ورود مدیر
      </button>
    );
    return (
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">توکن فعال است</span>
        <button onClick={handleAdminLogout} className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-sm">
          خروج
        </button>
      </div>
    );
  }, [hasToken]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* سربرگ بدون نمایش توکن */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت گارنتی</h1>
        {statusBadge}
      </div>

      {/* فرم افزودن ردیف */}
      <div className="rounded-2xl border p-4 md:p-6 bg-white mb-6">
        <h2 className="font-semibold mb-4">افزودن ردیف</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Serial */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">* Serial (مثال: HPE-9J1234)</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              placeholder="HPE-9J1234"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Vendor</label>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            >
              {VENDORS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Model with datalist */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Model</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              list="models-datalist"
              placeholder="مثلاً: ProLiant DL380 Gen10"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <datalist id="models-datalist">
              {models.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* ExpireAt */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">* ExpireAt</label>
            <input
              type="date"
              className="w-full rounded-xl border px-3 py-2"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            >
              <option value="">—</option>
              {NOTES_YEARS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={addRow}
            className="px-4 py-2 rounded-2xl bg-brand-yellow text-black font-medium"
          >
            افزودن ردیف
          </button>
          <button
            onClick={saveAll}
            disabled={busy || rows.length === 0}
            className="px-4 py-2 rounded-2xl bg-black text-white font-medium disabled:opacity-50"
          >
            {busy ? "در حال ذخیره…" : "ذخیره"}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          (فیلدهای * «Serial» و «ExpireAt» اجباری هستند)
        </p>
      </div>

      {/* ردیف‌های آماده ثبت */}
      <div className="rounded-2xl border p-4 md:p-6 bg-white">
        <h2 className="font-semibold mb-3">ردیف‌های آماده ثبت</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500">ردیفی اضافه نشده است.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full">
              <thead>
                <tr className="text-right text-sm text-gray-600">
                  <th className="p-2">Serial</th>
                  <th className="p-2">Vendor</th>
                  <th className="p-2">Model</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">ExpireAt</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 font-mono">{r.serial}</td>
                    <td className="p-2">{r.vendor}</td>
                    <td className="p-2">{r.model}</td>
                    <td className="p-2">{r.status === "active" ? "فعال" : "غیرفعال"}</td>
                    <td className="p-2">{r.expireAt}</td>
                    <td className="p-2">{r.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نوتیفیکیشن */}
      {message && (
        <div
          className={`fixed bottom-4 left-4 rounded-xl px-4 py-2 text-sm shadow ${
            message.type === "ok" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}