// pages/warranty-admin.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

const DASH_RE = /[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g;
const WS_RE = /[\s\u200c\u200f\u200e\u202a-\u202e\u2066-\u2069]/g;
const normalize = (s = "") =>
  s.toString().toUpperCase().replace(WS_RE, "").replace(DASH_RE, "");

const VENDORS = ["HPE", "Dell EMC", "Cisco", "Lenovo", "Fujitsu", "Juniper", "Oracle", "Quantum"];
const MODELS = {
  "HPE": ["ProLiant DL380 Gen10", "ProLiant DL360 Gen10", "Alletra", "Primera"],
  "Dell EMC": ["Unity XT", "PowerStore", "PowerEdge", "VxRail"],
  "Cisco": ["UCS", "MDS", "Nexus"],
  "Lenovo": ["ThinkSystem SR650", "ThinkSystem SR630"],
  "Fujitsu": ["PRIMERGY RX2540", "ETERNUS"],
  "Juniper": ["QFX", "MX", "SRX"],
  "Oracle": ["Exadata", "ZFS"],
  "Quantum": ["Scalar i3", "Scalar i6"],
};
const STATUSES = [
  { value: "active", label: "active (فعال)" },
  { value: "expired", label: "expired (منقضی)" },
];
const NOTES = ["-", "3yr NBD support", "5yr ProSupport", "Renewal", "—"];

function emptyRow() {
  return {
    serial: "",
    vendor: VENDORS[0],
    model: MODELS[VENDORS[0]][0],
    status: "active",
    expireAt: "",
    notes: "-",
  };
}

export default function WarrantyAdmin() {
  const [rows, setRows] = useState([emptyRow()]);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // token در مرورگر باقی بماند
  useEffect(() => {
    const t = localStorage.getItem("ADMIN_TOKEN") || "";
    if (t) setToken(t);
  }, []);
  useEffect(() => {
    if (token) localStorage.setItem("ADMIN_TOKEN", token);
  }, [token]);

  function updateRow(i, patch) {
    setRows((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], ...patch };
      // در تغییر vendor، مدل را به اولین مدل همان vendor ست کن
      if (patch.vendor) {
        const vendorModels = MODELS[patch.vendor] || ["-"];
        if (!vendorModels.includes(copy[i].model)) {
          copy[i].model = vendorModels[0];
        }
      }
      return copy;
    });
  }
  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }
  function removeRow(i) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  const payloadRows = useMemo(() => {
    // فقط ردیف‌هایی که سریال دارند
    return rows
      .map((r) => ({ ...r, serial: r.serial.trim() }))
      .filter((r) => r.serial.length > 0)
      .map((r) => ({
        serial: r.serial,                // نسخه نمایش
        brand: r.vendor,                 // با نام brand ذخیره می‌کنیم چون API خواندن هم brand دارد
        model: r.model,
        status: r.status,                // "active" | "expired"
        end: r.expireAt || "-",          // فیلد end
        notes: r.notes || "-",
        // کلید مقایسه: سریال نرمال‌شده (بدون dash و uppercase)
        _key: normalize(r.serial),
      }));
  }, [rows]);

  async function submit() {
    setMessage("");
    if (!token) {
      setMessage("لطفاً Admin Token را وارد کنید.");
      return;
    }
    if (!payloadRows.length) {
      setMessage("هیچ ردیفی با Serial وارد نشده است.");
      return;
    }
    setBusy(true);
    try {
      const resp = await fetch("/api/warranty-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rows: payloadRows }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        // اگر سرور readonly بود، نسخه‌ی JSON برگردانده می‌شود تا دانلود کنیم
        if (data?.readonly && data?.updatedJSON) {
          setMessage(
            "⚠️ فایل روی هاست قابل‌نوشتن نیست. فایل به‌روزشده را دانلود و جایگزین کنید."
          );
          // ساخت لینک دانلود
          const blob = new Blob([data.updatedJSON], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "warranty.json";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          setMessage(`خطا: ${data?.error || resp.statusText}`);
        }
        return;
      }

      setMessage("✅ بروزرسانی با موفقیت انجام شد.");
      // گزینه: پاک‌کردن فرم
      // setRows([emptyRow()]);
    } catch (e) {
      setMessage("خطای اتصال به سرور.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Warranty Admin</title>
      </Head>

      <div className="container mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">مدیریت گارانتی</h1>

        {/* Admin Token */}
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Admin Token</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3"
              placeholder="توکن ادمین را وارد کنید"
            />
            <p className="text-xs text-gray-500 mt-1">
              برای امنیت، backend فقط درخواست‌های دارای این توکن را می‌پذیرد.
            </p>
          </div>
        </div>

        {/* Rows Editor */}
        <div className="space-y-3">
          {rows.map((r, i) => {
            const vendorModels = MODELS[r.vendor] || ["-"];
            return (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-2xl border border-gray-200 p-3"
              >
                {/* Serial */}
                <div className="lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">Serial</label>
                  <input
                    type="text"
                    value={r.serial}
                    onChange={(e) => updateRow(i, { serial: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="مثال: HPE-9J1234"
                  />
                </div>

                {/* Vendor */}
                <div className="lg:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Vendor</label>
                  <select
                    value={r.vendor}
                    onChange={(e) => updateRow(i, { vendor: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 bg-white"
                  >
                    {VENDORS.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div className="lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">Model</label>
                  <select
                    value={r.model}
                    onChange={(e) => updateRow(i, { model: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 bg-white"
                  >
                    {vendorModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="lg:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select
                    value={r.status}
                    onChange={(e) => updateRow(i, { status: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ExpireAt */}
                <div className="lg:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">ExpireAt</label>
                  <input
                    type="date"
                    value={r.expireAt}
                    onChange={(e) => updateRow(i, { expireAt: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 bg-white"
                  />
                </div>

                {/* Notes */}
                <div className="lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1">Notes</label>
                  <select
                    value={r.notes}
                    onChange={(e) => updateRow(i, { notes: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 bg-white"
                  >
                    {NOTES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="lg:col-span-12 flex justify-end gap-2">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                    >
                      حذف ردیف
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={addRow}
            className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            + افزودن ردیف
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "در حال ثبت…" : "ثبت / Import"}
          </button>
        </div>

        {!!message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </>
  );
}