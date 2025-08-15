// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

/* ======================= AUTH (ساده و سازگار) ======================= */
const AUTH_KEY = "sat_admin_token";

const getToken = () => {
  try { return sessionStorage.getItem(AUTH_KEY) || ""; } catch { return ""; }
};
const setToken = (t) => { try { sessionStorage.setItem(AUTH_KEY, t); } catch {} };
const clearToken = () => { try { sessionStorage.removeItem(AUTH_KEY); } catch {} };

const isAuthed = () => !!getToken();

async function tryAdminCheck(token) {
  // اگر /api/admin-check موجود بود، با هر دو هدر تست می‌کنیم
  try {
    const r = await fetch("/api/admin-check", {
      method: "GET",
      headers: {
        "x-admin-token": token,
        authorization: `Bearer ${token}`,
      },
    });
    return r.ok;
  } catch {
    // اگر مسیر وجود نداشت/خطا داد، اجازه می‌دهیم هنگام ذخیره بررسی شود
    return true;
  }
}

// همه درخواست‌های ادمین با این تابع می‌روند (هر دو هدر ارسال می‌شود)
async function fetchAdmin(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "x-admin-token": token,
    authorization: `Bearer ${token}`,
  };
  const resp = await fetch(url, { ...options, headers });
  if (resp.status === 401) {
    clearToken();
    alert("دسترسی ادمین منقضی/نامعتبر شد. دوباره وارد شوید.");
    location.reload();
    throw new Error("Unauthorized");
  }
  return resp;
}

/* ======================= داده‌های ثابت ======================= */
const VENDORS = ["Dell EMC", "HPE", "Cisco", "Lenovo"];

const MODELS_BY_VENDOR = {
  "Dell EMC": [
    "Unity XT 380", "Unity XT 480", "Unity XT 680", "Unity XT 880",
    "Unity 300", "Unity 400", "Unity 500", "Unity 600",
  ],
  "HPE": [
    "ProLiant DL360 Gen10", "ProLiant DL360 Gen11",
    "ProLiant DL380 Gen10", "ProLiant DL380 Gen11",
    "ProLiant ML350 Gen10",
  ],
  "Cisco": ["UCS C220 M5", "UCS C220 M6", "UCS C240 M5", "UCS C240 M6"],
  "Lenovo": ["ThinkSystem SR650 V2", "ThinkSystem SR630 V2"],
};

const STATUS_LIST = ["فعال", "غیرفعال"];
const NOTES_YEARS = Array.from({ length: 10 }, (_, i) => `${i + 1} سال`);

/* ======================= کمکی‌ها ======================= */
function normalizeSerial(val) {
  if (!val) return "";
  // UpperCase + حذف فاصله‌ها (خط تیره اختیاری می‌ماند)
  return String(val).toUpperCase().replace(/\s+/g, "");
}

/* ======================= صفحه مدیریت ======================= */
export default function WarrantyAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  // امکان ورود از طریق ?token=... هم هست
  useEffect(() => {
    const url = new URL(window.location.href);
    const t = url.searchParams.get("token");
    if (t && !isAuthed()) {
      setToken(t);
      setTokenInput(t);
      setAuthed(true);
    } else {
      setTokenInput(getToken());
      setAuthed(isAuthed());
    }
  }, []);

  const onLogin = async () => {
    const t = tokenInput.trim();
    if (!t) { alert("لطفاً توکن را وارد کنید."); return; }
    const ok = await tryAdminCheck(t);
    if (!ok) { alert("توکن صحیح نیست."); return; }
    setToken(t);
    setAuthed(true);
  };

  const onLogout = () => {
    clearToken();
    setAuthed(false);
  };

  /* --------------------------- وضعیت فرم --------------------------- */
  const [vendor, setVendor] = useState(VENDORS[0]);
  const modelOptions = useMemo(() => MODELS_BY_VENDOR[vendor] || [], [vendor]);

  const [useCustomModel, setUseCustomModel] = useState(false);
  const [model, setModel] = useState("");
  const [modelCustom, setModelCustom] = useState("");

  const [serial, setSerial] = useState("");
  const [expireAt, setExpireAt] = useState(""); // yyyy-mm-dd
  const [status, setStatus] = useState(STATUS_LIST[0]);
  const [notes, setNotes] = useState(NOTES_YEARS[2]); // ۳ سال

  useEffect(() => {
    setUseCustomModel(false);
    setModel(modelOptions[0] || "");
    setModelCustom("");
  }, [vendor, modelOptions]);

  /* --------------------------- ردیف‌ها --------------------------- */
  const [rows, setRows] = useState([]);

  const addRow = () => {
    const s = normalizeSerial(serial);
    if (!s) { alert("Serial را وارد کنید."); return; }
    if (!expireAt) { alert("ExpireAt اجباری است."); return; }

    const chosenModel = useCustomModel ? (modelCustom || "").trim() : (model || "").trim();
    if (!chosenModel) { alert("Model را وارد یا انتخاب کنید."); return; }

    const row = {
      serial: s,
      brand: vendor,
      model: chosenModel,
      status: status,
      expireAt: expireAt,   // API همین کلید را می‌خواهد
      notes: notes || "-",
    };
    setRows((prev) => [...prev, row]);

    // فرم را سبک نگه می‌داریم
    setSerial("");
    setExpireAt("");
  };

  const removeRow = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const saveAll = async () => {
    if (!rows.length) { alert("ردیفی برای ثبت وجود ندارد."); return; }
    try {
      const resp = await fetchAdmin("/api/warranty-save", {
        method: "POST",
        body: JSON.stringify({ rows }),
      });
      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        alert(`خطا در ثبت: ${t || resp.status}`);
        return;
      }
      alert("ذخیره شد.");
      setRows([]);
    } catch {
      alert("خطا در ارتباط با سرور.");
    }
  };

  const clearForm = () => {
    setSerial("");
    setExpireAt("");
    setStatus(STATUS_LIST[0]);
    setNotes(NOTES_YEARS[2]);
    setUseCustomModel(false);
    setModelCustom("");
    setVendor(VENDORS[0]);
  };

  /* --------------------------- UI --------------------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* نوار ساده‌ی ورود/خروج توکن */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="password"
            dir="ltr"
            placeholder="Admin Token"
            className="rounded-xl border border-gray-200 px-3 py-2 w-72"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          {!authed ? (
            <button
              onClick={onLogin}
              className="rounded-2xl bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-500"
            >
              ورود
            </button>
          ) : (
            <>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">
                توکن فعال است
              </span>
              <button
                onClick={onLogout}
                className="rounded-2xl bg-gray-100 hover:bg-gray-200 px-4 py-2"
              >
                خروج
              </button>
            </>
          )}
        </div>
        <div className="text-xs text-gray-500">
          اگر /api/admin-check روی سرور موجود نباشد، اعتبار توکن هنگام «ذخیره» بررسی می‌شود.
        </div>
      </div>

      {!authed ? (
        <div className="text-gray-500">برای ادامه، توکن را وارد و «ورود» را بزنید.</div>
      ) : (
        <>
          {/* فرم افزودن ردیف */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-6">
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-bold text-lg">افزودن ردیف</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Vendor</label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                >
                  {VENDORS.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Serial */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  Serial <span className="text-red-500">*</span>
                </label>
                <input
                  dir="ltr"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  placeholder="مثال: HPE-9J1234"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                />
              </div>

              {/* Model */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Model</label>
                {!useCustomModel ? (
                  <div className="flex gap-2">
                    <select
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    >
                      {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                      <option value="__custom__">مدل دلخواه…</option>
                    </select>
                    {model === "__custom__" && (
                      <button
                        type="button"
                        className="px-3 rounded-xl border border-gray-200 hover:bg-gray-50"
                        onClick={() => { setUseCustomModel(true); setModelCustom(""); }}
                      >
                        تایید
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-xl border border-gray-200 px-3 py-2"
                      placeholder="مثال: ProLiant DL380 Gen10"
                      value={modelCustom}
                      onChange={(e) => setModelCustom(e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-3 rounded-xl border border-gray-200 hover:bg-gray-50"
                      onClick={() => { setUseCustomModel(false); setModel(modelOptions[0] || ""); }}
                    >
                      بازگشت
                    </button>
                  </div>
                )}
              </div>

              {/* ExpireAt */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">
                  ExpireAt <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={expireAt}
                  onChange={(e) => setExpireAt(e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Status</label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block mb-1 text-sm text-gray-600">Notes</label>
                <select
                  className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                >
                  {NOTES_YEARS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={addRow}
                className="rounded-2xl bg-amber-500 text-black px-5 py-2 hover:bg-amber-400 transition"
              >
                افزودن ردیف
              </button>
              <button
                onClick={clearForm}
                className="rounded-2xl border border-gray-200 px-5 py-2 hover:bg-gray-50 transition"
              >
                پاکسازی فرم
              </button>
            </div>
          </div>

          {/* جدول ردیف‌ها */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-bold text-lg">ردیف‌های آماده‌ی ثبت</h2>
              <button
                onClick={saveAll}
                className="rounded-2xl bg-emerald-600 text-white px-5 py-2 hover:bg-emerald-500 transition"
              >
                ذخیره
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="text-gray-500">ردیفی اضافه نشده است.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="p-2 text-right">حذف</th>
                      <th className="p-2 text-right">یادداشت</th>
                      <th className="p-2 text-right">تاریخ پایان</th>
                      <th className="p-2 text-right">وضعیت</th>
                      <th className="p-2 text-right">مدل</th>
                      <th className="p-2 text-right">برند</th>
                      <th className="p-2 text-right">سریال</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">
                          <button
                            onClick={() => removeRow(i)}
                            className="text-red-600 hover:underline"
                          >
                            حذف
                          </button>
                        </td>
                        <td className="p-2">{r.notes || "-"}</td>
                        <td className="p-2">{r.expireAt || "-"}</td>
                        <td className="p-2">
                          {r.status === "فعال" ? (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">فعال</span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">غیرفعال</span>
                          )}
                        </td>
                        <td className="p-2">{r.model}</td>
                        <td className="p-2">{r.brand}</td>
                        <td className="p-2" dir="ltr">{r.serial}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}