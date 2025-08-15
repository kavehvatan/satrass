// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

/* ---------- تنظیمات ثابت ---------- */
const VENDORS = [
  "Dell EMC",
  "HPE",
  "Cisco",
  "Lenovo",
  "Oracle",
  "Fujitsu",
  "Huawei",
  "Juniper",
  "Quantum",
];

const BASE_MODELS = {
  "Dell EMC": [
    "Unity XT 380",
    "Unity XT 480",
    "Unity XT 680",
    "Unity XT 880",
    "Unity XT 380F",
    "Unity XT 480F",
    "Unity XT 680F",
    "Unity XT 880F",
    "PowerStore 500",
    "PowerStore 1200",
    "PowerStore 3200",
    "PowerStore 5200",
  ],
  HPE: [
    "ProLiant DL360 Gen10",
    "ProLiant DL380 Gen10",
    "ProLiant DL360 Gen11",
    "ProLiant DL380 Gen11",
    "ProLiant ML350 Gen10",
    "ProLiant ML350 Gen11",
    "3PAR 8200",
    "Nimble HF20",
    "Nimble AF20",
  ],
  Cisco: ["UCS C220 M5", "UCS C240 M5", "UCS C220 M6", "UCS C240 M6"],
  Lenovo: [
    "ThinkSystem SR630",
    "ThinkSystem SR650",
    "ThinkSystem SR630 V2",
    "ThinkSystem SR650 V2",
  ],
  Oracle: ["Oracle ZFS 7-2", "Oracle ZFS 7-4", "Oracle Exadata X10M"],
  Fujitsu: ["PRIMERGY RX2540 M5", "PRIMERGY RX2540 M6"],
  Huawei: ["OceanStor 5300", "OceanStor 5500", "FusionCompute 8.3"],
  Juniper: ["QFX5120", "EX4300", "SRX1500"],
  Quantum: ["Scalar i3", "Scalar i6", "DXi4800"],
};

const STATUS_OPTIONS = ["فعال", "غیرفعال"];
const NOTES_OPTIONS = Array.from({ length: 10 }, (_, i) => `${i + 1} سال`);

/* ---------- کمک‌تابع ---------- */
function normalizeSerial(s) {
  if (!s) return "";
  // فاصله، کاراکترهای غیرمجاز و حروف بزرگ را یکنواخت می‌کنیم
  return String(s).trim().replace(/\s+/g, "").toUpperCase();
}

function saveLocalModels(vendor, list) {
  try {
    const raw = localStorage.getItem("vendorModels") || "{}";
    const obj = JSON.parse(raw);
    obj[vendor] = Array.from(new Set(list)); // دسته‌بندی + یکتا
    localStorage.setItem("vendorModels", JSON.stringify(obj));
  } catch (e) {}
}

function loadLocalModels(vendor) {
  try {
    const raw = localStorage.getItem("vendorModels");
    if (!raw) return [];
    const obj = JSON.parse(raw);
    return Array.isArray(obj[vendor]) ? obj[vendor] : [];
  } catch (e) {
    return [];
  }
}

/* ---------- صفحهٔ ادمین ---------- */
export default function WarrantyAdminPage() {
  // توکن ادمین
  const [token, setToken] = useState("");
  const [tokenModalOpen, setTokenModalOpen] = useState(true);
  const [tokenInput, setTokenInput] = useState("");

  // فرم افزودن ردیف
  const [vendor, setVendor] = useState("Dell EMC");
  const [serial, setSerial] = useState("");
  const [model, setModel] = useState("");
  const [status, setStatus] = useState("فعال");
  const [expireAt, setExpireAt] = useState("");
  const [notes, setNotes] = useState(NOTES_OPTIONS[2]); // پیشفرض: ۳ سال

  // ردیف‌های آمادهٔ ثبت
  const [rows, setRows] = useState([]);

  // وضعیت ذخیره
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | success | error
  const [savedAt, setSavedAt] = useState(null);

  // مدل‌های پیشنهادی بر اساس Vendor + مدل‌های ذخیره شده
  const vendorModels = useMemo(() => {
    const base = BASE_MODELS[vendor] || [];
    const local = loadLocalModels(vendor);
    return Array.from(new Set([...base, ...local]));
  }, [vendor]);

  // لود توکن از localStorage
  useEffect(() => {
    const t = localStorage.getItem("ADMIN_TOKEN") || "";
    if (t) {
      setToken(t);
      setTokenModalOpen(false);
    }
  }, []);

  // ذخیرهٔ توکن در localStorage
  function applyToken() {
    const t = tokenInput.trim();
    if (!t) return;
    localStorage.setItem("ADMIN_TOKEN", t);
    setToken(t);
    setTokenInput("");
    setTokenModalOpen(false);
  }
  function clearToken() {
    localStorage.removeItem("ADMIN_TOKEN");
    setToken("");
    setTokenModalOpen(true);
  }

  function resetForm() {
    setVendor("Dell EMC");
    setSerial("");
    setModel("");
    setStatus("فعال");
    setExpireAt("");
    setNotes(NOTES_OPTIONS[2]);
  }

  function addRow() {
    const s = normalizeSerial(serial);
    if (!s) {
      alert("Serial را وارد کنید.");
      return;
    }
    if (!expireAt) {
      alert("ExpireAt را وارد کنید.");
      return;
    }
    if (!model) {
      alert("Model را انتخاب کنید.");
      return;
    }

    const row = {
      vendor,
      serial: s,
      model,
      status, // همون فارسی ذخیره می‌کنیم؛ اگر لازم داشتی در API مپ کن
      expireAt, // فرمت YYYY-MM-DD
      notes,
    };
    setRows((p) => [...p, row]);

    // اگر مدل جدید است، به پیشنهادها اضافه‌اش کن
    const base = BASE_MODELS[vendor] || [];
    if (!base.includes(model)) {
      const local = loadLocalModels(vendor);
      if (!local.includes(model)) {
        const next = [...local, model];
        saveLocalModels(vendor, next);
      }
    }
    resetForm();
  }

  function removeRow(idx) {
    setRows((p) => p.filter((_, i) => i !== idx));
  }

  async function saveAll() {
    if (!rows.length) return;
    setSaveStatus("saving");
    try {
      const payload = rows.map((r) => ({
        vendor: r.vendor,
        serial: r.serial,
        model: r.model,
        status: r.status, // اگر نیاز داشتی در API به active/inactive تبدیل کن
        expireAt: r.expireAt,
        notes: r.notes,
      }));

      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ rows: payload }),
      });

      if (!res.ok) throw new Error("server_error");

      // موفق
      setSaveStatus("success");
      setSavedAt(Date.now());
      // پاکسازی ردیف‌ها پس از ثبت
      setRows([]);

      setTimeout(() => {
        setSaveStatus("idle");
        setSavedAt(null);
      }, 2500);
    } catch (e) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3500);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">مدیریت گارانتی</h1>

          <div className="flex items-center gap-3">
            {token ? (
              <span className="text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 text-sm">
                توکن فعال است
              </span>
            ) : (
              <span className="text-amber-700 bg-amber-100 rounded-full px-3 py-1 text-sm">
                نیاز به ورود توکن
              </span>
            )}

            {token ? (
              <button
                onClick={clearToken}
                className="rounded-xl px-3 py-1 text-sm bg-neutral-100 hover:bg-neutral-200"
              >
                خروج
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* فرم افزودن ردیف */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold">افزودن ردیف</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Vendor</label>
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {VENDORS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Serial */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">
                Serial <span className="text-rose-600">*</span>
                <span className="text-neutral-400 mr-2">مثال: HPE-9J1234</span>
              </label>
              <input
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="HPE-9J1234"
                className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">
                Model <span className="text-neutral-400 mr-2">مثال: Unity XT 480</span>
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="" disabled>
                  انتخاب کنید…
                </option>
                {vendorModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* ExpireAt */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">
                ExpireAt <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                value={expireAt}
                onChange={(e) => setExpireAt(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm text-neutral-600">Notes</label>
              <select
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {NOTES_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* اکشن‌ها */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={addRow}
              className="rounded-2xl px-5 py-2 bg-amber-500 text-black hover:bg-amber-400"
            >
              افزودن ردیف
            </button>

            <button
              onClick={resetForm}
              className="rounded-2xl px-4 py-2 bg-neutral-100 hover:bg-neutral-200"
            >
              پاکسازی فرم
            </button>
          </div>

          <p className="text-xs text-neutral-500 mt-3">
            (فیلدهای <span className="text-rose-600">*</span> الزامی هستند)
          </p>
        </section>

        {/* جدول ردیف‌های آماده ثبت */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base md:text-lg font-semibold">ردیف‌های آمادهٔ ثبت</h3>

            {/* دکمه ذخیره + نشان موفقیت */}
            <div className="flex items-center gap-3">
              <button
                onClick={saveAll}
                disabled={saveStatus === "saving" || rows.length === 0}
                className="rounded-2xl px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                {saveStatus === "saving" ? "در حال ذخیره..." : "ذخیره"}
              </button>

              {saveStatus === "success" && (
                <span className="text-emerald-700 bg-emerald-100 rounded-full px-3 py-1 text-sm">
                  ذخیره شد
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-700 bg-red-100 rounded-full px-3 py-1 text-sm">
                  خطا در ذخیره
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-neutral-600">
                  <th className="py-3 px-3 text-right">سریال</th>
                  <th className="py-3 px-3 text-right">برند</th>
                  <th className="py-3 px-3 text-right">مدل</th>
                  <th className="py-3 px-3 text-right">وضعیت</th>
                  <th className="py-3 px-3 text-right">تاریخ پایان</th>
                  <th className="py-3 px-3 text-right">یادداشت</th>
                  <th className="py-3 px-3 text-right">اکشن</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-neutral-400"
                    >
                      ردیفی اضافه نشده است.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr
                      key={`${r.serial}-${idx}`}
                      className="border-t border-neutral-200"
                    >
                      <td className="py-3 px-3 whitespace-nowrap">{r.serial}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{r.vendor}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{r.model}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{r.status}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{r.expireAt}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{r.notes}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeRow(idx)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            حذف
                          </button>
                          {/* اگر بخواهی کنار حذف هم نشان سبز بیاید: */}
                          {saveStatus === "success" && (
                            <span className="text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 text-xs">
                              ذخیره شد
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* مودال ورود توکن */}
      {tokenModalOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold mb-4">ورود توکن ادمین</h4>
            <p className="text-sm text-neutral-600 mb-4">
              برای ثبت اطلاعات، توکن ادمین را وارد کنید. (توکن نمایش‌ داده
              نمی‌شود و فقط اعتبارسنجی می‌شود)
            </p>

            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Admin Token"
              className="w-full rounded-2xl border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={applyToken}
                className="rounded-2xl px-4 py-2 bg-amber-500 text-black hover:bg-amber-400"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}