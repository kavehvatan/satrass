// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

/* ---- پیش‌فرض مدل‌ها برای هر Vendor (قابل گسترش) ---- */
const DEFAULT_MODELS = {
  "Dell EMC": [
    // Unity XT
    "Unity XT 380", "Unity XT 480", "Unity XT 680", "Unity XT 880",
    "Unity 300", "Unity 400", "Unity 500", "Unity 600",
  ],
  HPE: [
    // سرورها (Gen10/Gen11)
    "ProLiant DL380 Gen10", "ProLiant DL380 Gen11",
    "ProLiant DL360 Gen10", "ProLiant DL360 Gen11",
    "ProLiant ML350 Gen10", "ProLiant ML350 Gen11",
    "ProLiant DL385 Gen10", "ProLiant DL385 Gen11",
    // استوریج‌های پرمصرف HPE (مثال)
    "Alletra 5000", "Alletra 6000", "Nimble HF20", "Nimble AF20",
  ],
  Cisco: [
    "UCS C220 M5", "UCS C240 M5", "UCS C220 M6", "UCS C240 M6",
  ],
  Lenovo: [
    "ThinkSystem SR630 V2", "ThinkSystem SR650 V2",
    "ThinkSystem SR630", "ThinkSystem SR650",
  ],
};

const VENDORS = Object.keys(DEFAULT_MODELS);

const STATUS_OPTIONS = ["فعال", "منقضی", "نامشخص"];
const NOTES_OPTIONS = Array.from({ length: 10 }, (_, i) => `${i + 1} سال`);

const LS_KEY = "satrass-admin-model-lib"; // ذخیره مدل‌های سفارشی در localStorage

function titleCaseNormalize(s) {
  // عنوان‌گذاری و حذف فاصله‌های اضافی
  return (s || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function normalizeSerialInput(s) {
  // Uppercase و حذف فاصله‌های اضافی؛ خط تیره را نگه می‌داریم
  return (s || "").toUpperCase().replace(/\s+/g, "");
}

export default function WarrantyAdmin() {
  // احراز هویت با توکن
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authMsg, setAuthMsg] = useState("");

  // فیلدهای فرم یک ردیف
  const [serial, setSerial] = useState("");
  const [vendor, setVendor] = useState(VENDORS[0]);
  const [model, setModel] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [expireAt, setExpireAt] = useState(""); // yyyy-mm-dd
  const [notes, setNotes] = useState(NOTES_OPTIONS[2]); // پیش‌فرض ۳ سال

  // ردیف‌های آماده ثبت
  const [rows, setRows] = useState([]);

  // بانک مدل‌ها (پیش‌فرض + سفارشی)
  const [modelLib, setModelLib] = useState(DEFAULT_MODELS);

  // بارگذاری مدل‌های سفارشی از localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const extra = JSON.parse(raw);
        // ادغام با پیش‌فرض‌ها
        const merged = {};
        for (const v of VENDORS) {
          const base = new Set((DEFAULT_MODELS[v] || []).map(titleCaseNormalize));
          const plus = new Set((extra[v] || []).map(titleCaseNormalize));
          merged[v] = Array.from(new Set([...base, ...plus])).sort();
        }
        setModelLib(merged);
      } else {
        // فقط پیش‌فرض‌ها
        const merged = {};
        for (const v of VENDORS) {
          merged[v] = (DEFAULT_MODELS[v] || []).map(titleCaseNormalize).sort();
        }
        setModelLib(merged);
      }
    } catch {
      const merged = {};
      for (const v of VENDORS) {
        merged[v] = (DEFAULT_MODELS[v] || []).map(titleCaseNormalize).sort();
      }
      setModelLib(merged);
    }
  }, []);

  // مدل‌های نمایش‌داده‌شده بر اساس vendor انتخابی
  const modelsForVendor = useMemo(() => modelLib[vendor] || [], [modelLib, vendor]);

  // اگر vendor عوض شد و مدل انتخابی دیگر وجود نداشت، پاکش کن
  useEffect(() => {
    if (model && !modelsForVendor.includes(titleCaseNormalize(model))) {
      setModel("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendor]);

  // ورود با توکن – یک POST خالی برای چک کردن
  async function handleLogin(e) {
    e.preventDefault();
    setAuthMsg("");
    try {
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ rows: [] }), // چیزی ثبت نمی‌شود، فقط تست توکن
      });
      if (res.ok) {
        setAuthed(true);
        setAuthMsg("توکن فعال است");
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthed(false);
        setAuthMsg(data?.error || "توکن معتبر نیست");
      }
    } catch (err) {
      setAuthed(false);
      setAuthMsg("خطا در ارتباط با سرور");
    }
  }

  function resetForm() {
    setSerial("");
    setVendor(VENDORS[0]);
    setModel("");
    setStatus(STATUS_OPTIONS[0]);
    setExpireAt("");
    setNotes(NOTES_OPTIONS[2]);
  }

  function addRow() {
    const s = normalizeSerialInput(serial);
    if (!s) {
      alert("سریال را وارد کنید.");
      return;
    }
    if (!expireAt) {
      alert("تاریخ ExpireAt اجباری است.");
      return;
    }

    const normalizedModel = titleCaseNormalize(model);
    // اگر مدلی جدید تایپ شده باشد، در کتابخانه‌ی لوکال ذخیره کن
    if (normalizedModel) {
      setModelLib((prev) => {
        const next = { ...prev };
        const list = new Set([...(prev[vendor] || []), normalizedModel]);
        next[vendor] = Array.from(list).sort();
        try {
          const saveObj = {};
          for (const v of VENDORS) {
            // فقط سفارشی‌ها را نسبت به پیش‌فرض‌ها ذخیره کنیم
            const base = new Set((DEFAULT_MODELS[v] || []).map(titleCaseNormalize));
            const cur = new Set((next[v] || []).map(titleCaseNormalize));
            const onlyExtra = Array.from(cur).filter((m) => !base.has(m));
            saveObj[v] = onlyExtra;
          }
          localStorage.setItem(LS_KEY, JSON.stringify(saveObj));
        } catch {}
        return next;
      });
    }

    const row = {
      serial: s,
      brand: vendor,              // vendor → brand
      model: normalizedModel || "-", 
      status,
      end: expireAt,              // expireAt → end
      notes,
    };
    setRows((r) => [...r, row]);
    resetForm();
  }

  function removeRow(idx) {
    setRows((r) => r.filter((_, i) => i !== idx));
  }

  async function saveAll() {
    if (!rows.length) {
      alert("ردیفی برای ثبت وجود ندارد.");
      return;
    }
    try {
      const res = await fetch("/api/warranty-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "خطا در ثبت");
        return;
      }
      alert("ثبت شد.");
      setRows([]);
    } catch (e) {
      alert("خطا در ارتباط با سرور");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-extrabold mb-6">مدیریت گارانتی</h1>

      {/* ورود با توکن (نمایش مقدارِ خودِ توکن نداریم) */}
      <form onSubmit={handleLogin} className="mb-6 flex items-center gap-3">
        <input
          type="password"
          placeholder="Admin Token"
          className="w-64 rounded-xl border px-3 py-2"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-2xl px-5 py-2.5 font-semibold bg-brand-yellow text-black hover:opacity-90 transition"
        >
          ورود
        </button>
        <span className={authed ? "text-green-600" : "text-red-600"}>
          {authMsg}
        </span>
      </form>

      {!authed ? (
        <p className="text-gray-500">برای دسترسی، توکن ادمین را وارد کنید.</p>
      ) : (
        <>
          {/* فرم افزودن ردیف */}
          <div className="rounded-2xl border p-4 mb-6">
            <h2 className="font-bold text-lg mb-4">افزودن ردیف</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm">* Serial</label>
                <input
                  className="rounded-xl border px-3 py-2"
                  placeholder="مثال: HPE-9J1234"
                  value={serial}
                  onChange={(e) => setSerial(normalizeSerialInput(e.target.value))}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm">Vendor</label>
                <select
                  className="rounded-xl border px-3 py-2"
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

              <div className="flex flex-col">
                <label className="mb-1 text-sm">Model</label>
                {/* input + datalist برای پیشنهاد مدل‌ها */}
                <input
                  list="model-options"
                  className="rounded-xl border px-3 py-2"
                  placeholder={vendor === "Dell EMC" ? "مثال: Unity XT 480" : "مثال: ProLiant DL380 Gen10"}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
                <datalist id="model-options">
                  {modelsForVendor.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm">Status</label>
                <select
                  className="rounded-xl border px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm">* ExpireAt</label>
                <input
                  type="date"
                  className="rounded-xl border px-3 py-2"
                  value={expireAt}
                  onChange={(e) => setExpireAt(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm">Notes</label>
                <select
                  className="rounded-xl border px-3 py-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                >
                  {NOTES_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={addRow}
                className="rounded-2xl px-5 py-2.5 font-semibold bg-brand-yellow text-black hover:opacity-90 transition"
              >
                افزودن ردیف
              </button>
              <button
                onClick={resetForm}
                className="rounded-2xl px-4 py-2 border"
              >
                پاک‌سازی فرم
              </button>
            </div>
          </div>

          {/* ردیف‌های آماده ثبت */}
          <div className="rounded-2xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">ردیف‌های آمادهٔ ثبت</h2>
              <button
                onClick={saveAll}
                className="rounded-2xl px-5 py-2.5 font-semibold bg-brand-yellow text-black hover:opacity-90 transition"
              >
                ذخیره
              </button>
            </div>

            {rows.length === 0 ? (
              <p className="text-gray-500">ردیفی اضافه نشده است.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-sm text-gray-500">
                      <th className="py-2">سریال</th>
                      <th className="py-2">برند</th>
                      <th className="py-2">مدل</th>
                      <th className="py-2">وضعیت</th>
                      <th className="py-2">تاریخ پایان</th>
                      <th className="py-2">یادداشت</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">{r.serial}</td>
                        <td className="py-2">{r.brand}</td>
                        <td className="py-2">{r.model}</td>
                        <td className="py-2">{r.status}</td>
                        <td className="py-2">{r.end}</td>
                        <td className="py-2">{r.notes || "-"}</td>
                        <td className="py-2">
                          <button
                            onClick={() => removeRow(i)}
                            className="text-red-600 hover:underline"
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
          </div>
        </>
      )}
    </div>
  );
}