// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";

export default function WarrantyAdmin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tokenInput, setTokenInput] = useState("");

  // فرم ساده‌ی اضافه‌کردن ردیف (در صورت نیاز)
  const [form, setForm] = useState({
    vendor: "",
    model: "",
    serial: "",
    expireAt: "",
    status: "active",
    notes: "",
  });

  // نقشه‌ی Vendor -> مدل‌ها (برای DropDown پویا)
  const vendorOptions = useMemo(
    () => [
      "Dell EMC",
      "HPE",
      "Cisco",
      "Lenovo",
      "Huawei",
      "Fujitsu",
      "NetApp",
      "Oracle",
    ],
    []
  );

  const modelMap = useMemo(
    () => ({
      "Dell EMC": [
        "Unity XT 380",
        "Unity XT 480",
        "Unity XT 680",
        "Unity XT 880",
        "PowerStore 1200",
        "PowerStore 3200",
      ],
      HPE: [
        "ProLiant DL360 Gen10",
        "ProLiant DL380 Gen10",
        "ProLiant DL360 Gen11",
        "ProLiant DL380 Gen11",
        "Alletra 6000",
        "Alletra 9000",
      ],
      Cisco: ["UCS C220 M5", "UCS C240 M5", "UCS C220 M6", "UCS C240 M6"],
      Lenovo: ["ThinkSystem SR630 V2", "ThinkSystem SR650 V2"],
      Huawei: ["OceanStor 5300", "OceanStor 5500"],
      Fujitsu: ["PRIMERGY RX2540 M5", "PRIMERGY RX2540 M6"],
      NetApp: ["AFF A250", "AFF A400", "FAS2750"],
      Oracle: ["Oracle ZFS", "Oracle Exadata X9-2"],
    }),
    []
  );

  const notesOptions = useMemo(
    () => ["1 سال", "2 سال", "3 سال", "4 سال", "5 سال", "6 سال", "7 سال", "8 سال", "9 سال", "10 سال"],
    []
  );

  useEffect(() => {
    // بررسی خودکار کوکی لاگین
    (async () => {
      try {
        const r = await fetch("/api/admin-check");
        const j = await r.json();
        setAuthed(Boolean(j.ok));
      } catch (e) {
        setAuthed(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // ورود
  const doLogin = async () => {
    if (!tokenInput.trim()) return alert("توکن را وارد کنید.");
    const r = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenInput.trim() }),
    });
    const j = await r.json();
    if (!j.ok) return alert("توکن صحیح نیست.");
    setTokenInput("");
    setAuthed(true);
    alert("ورود انجام شد.");
  };

  // خروج
  const doLogout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    setAuthed(false);
    alert("خارج شدید.");
  };

  const handleChange = (key, val) => setForm((s) => ({ ...s, [key]: val }));

  const availableModels = useMemo(() => {
    if (!form.vendor) return [];
    return modelMap[form.vendor] || [];
  }, [form.vendor, modelMap]);

  // نمای کمینه فرم (مثل قبل): وقتی وارد نیستیم، فرم قفل می‌شود
  return (
    <div className="min-h-screen bg-neutral-50 text-right p-4 sm:p-6" dir="rtl">
      {/* نوار ورود/خروج (نسخه‌ی اول) */}
      <div className="mb-6 flex items-center gap-3">
        {!authed ? (
          <>
            <input
              type="password"
              placeholder="توکن ادمین…"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full max-w-md rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={doLogin}
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-white text-sm shadow hover:bg-emerald-800 transition"
              disabled={checking}
            >
              ورود
            </button>
          </>
        ) : (
          <>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700 text-sm">
              توکن فعال است
            </span>
            <button
              onClick={doLogout}
              className="rounded-full bg-neutral-100 px-5 py-2.5 text-neutral-800 text-sm hover:bg-neutral-200 transition"
            >
              خروج
            </button>
          </>
        )}
      </div>

      {/* فرم نمونه (اختیاری؛ اگر از قبل داری می‌تونی نگه داری) */}
      <div
        className={`rounded-2xl border bg-white p-4 sm:p-6 shadow-sm ${
          !authed ? "opacity-50 pointer-events-none select-none" : ""
        }`}
      >
        <h2 className="mb-4 text-lg font-semibold">افزودن ردیف</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-neutral-500">Vendor</label>
            <select
              value={form.vendor}
              onChange={(e) => handleChange("vendor", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <option value="">— انتخاب Vendor —</option>
              {vendorOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">Model</label>
            <select
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <option value="">— انتخاب مدل —</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">Serial *</label>
            <input
              type="text"
              placeholder="مثال: HPE-9J1234"
              value={form.serial}
              onChange={(e) => handleChange("serial", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">ExpireAt *</label>
            <input
              type="date"
              value={form.expireAt}
              onChange={(e) => handleChange("expireAt", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="expired">منقضی</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">Notes</label>
            <select
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <option value="">— انتخاب —</option>
              {notesOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* اینجا اگر ذخیره سرور داری، دکمه‌اش رو بگذار؛ این بخش صرفاً نمایشی است */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => alert("این بخش ذخیره به API اختصاصی خودت وصل می‌شود.")}
            className="rounded-full bg-amber-500 px-6 py-2.5 text-white text-sm shadow hover:bg-amber-600 transition"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}