// pages/warranty.js
import { useEffect, useRef, useState } from "react";
import Head from "next/head";

/** نرمال‌سازی سریال‌ها (حذف کوتیشن انگلیسی/فارسی و فاصله‌ها) */
function normalizeSerial(s) {
  return String(s || "")
    .trim()
    .replace(/^['"'“”]+|['"'“”]+$/g, "");
}

/** تبدیل ورودی کاربر به لیست سریال‌ها (با حفظ ترتیب) */
function parseInputList(input) {
  return String(input || "")
    .split(/[\n,]+/g)
    .map((x) => normalizeSerial(x))
    .filter((x) => x.length > 0);
}

export default function WarrantyPage() {
  const [q, setQ] = useState(""); // خالی → placeholder دیده میشه
  const [rows, setRows] = useState([]); // ردیف‌های نهایی برای نمایش (پیدا شده + ثبت نشده)
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  // ــ Auto-expand برای textarea
  const taRef = useRef(null);
  const autosize = () => {
    if (!taRef.current) return;
    const el = taRef.current;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 640) + "px"; // حداکثر ارتفاع ~40rem
  };
  useEffect(() => {
    autosize();
  }, []);

  async function doQuery() {
    setLoading(true);
    setErr(null);
    setRows([]);

    // ورودی کاربر به‌صورت لیست
    const wanted = parseInputList(q);
    try {
      const res = await fetch(`/api/warranty?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const apiRows = Array.isArray(json.rows) ? json.rows : [];

      // مپ سریال‌های پیدا شده (normalised → row)
      const foundMap = new Map();
      apiRows.forEach((r) => {
        const key = normalizeSerial(r.serial);
        if (key) foundMap.set(key.toLowerCase(), r);
      });

      // برای هر سریال ورودی، اگر پیدا شد همان ردیف؛ وگرنه ردیف «ثبت نشده»
      const display = wanted.map((serial) => {
        const key = serial.toLowerCase();
        if (foundMap.has(key)) {
          const r = foundMap.get(key);
          return {
            serial: normalizeSerial(r.serial) || serial,
            brand: r.brand || "—",
            model: r.model || "—",
            status: r.status || "—",
            end: r.end || "—",
            notes: r.notes || "—",
            _notFound: false,
          };
        }
        // ردیف ثبت نشده
        return {
          serial,
          brand: "—",
          model: "—",
          status: "ثبت نشده",
          end: "—",
          notes: "—",
          _notFound: true,
        };
      });

      setRows(display);
    } catch (e) {
      setErr(e.message || "server_error");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    const header = ["serial", "brand", "model", "status", "end", "notes"];
    const lines = [header.join(",")];
    rows.forEach((r) => {
      lines.push(
        [
          r.serial ?? "",
          r.brand ?? "",
          r.model ?? "",
          r.status ?? "",
          r.end ?? "",
          String(r.notes ?? "").replace(/[\n\r,]+/g, " "),
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "warranty.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <Head>
        <title>استعلام گارانتی</title>
      </Head>

      <div className="container mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">استعلام گارانتی</h1>
        <p className="text-gray-600 mb-4">
          سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از پایگاه داخلی ساتراس خوانده می‌شود.
        </p>

        {/* اکشن‌ها */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={exportCSV}
            className="rounded-xl border bg-white text-gray-700 px-4 py-2 shadow-sm hover:bg-gray-50"
          >
            خروجی CSV
          </button>

          <button
            type="button"
            onClick={doQuery}
            disabled={loading}
            className="rounded-xl bg-black text-white px-6 py-2.5 hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "در حال استعلام…" : "استعلام"}
          </button>
        </div>

        {/* ورودی سریال‌ها: کوچک + placeholder خاکستری + auto-expand */}
        <div className="mt-4">
          <textarea
            ref={taRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              autosize();
            }}
            onInput={autosize}
            onFocus={autosize}
            dir="ltr"
            placeholder="مثال: HPE-9J1234"
            className="
              w-full
              min-h-24 md:min-h-28
              max-h-96
              resize-y overflow-hidden
              rounded-2xl border border-gray-300
              bg-white/70 backdrop-blur-sm
              px-4 py-3
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400
              transition-all
            "
          />
        </div>

        {/* خطای سرور */}
        {err && (
          <div className="mt-3 text-sm text-red-600">
            خطا در ارتباط با سرور: {err}
          </div>
        )}

        {/* جدول نتایج (پیدا شده + ثبت نشده) */}
        <div className="mt-6 rounded-2xl border bg-white/70 backdrop-blur-sm overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-600">
              <tr className="divide-x">
                <th className="p-3 w-[18%]">سریال</th>
                <th className="p-3 w-[12%]">برند</th>
                <th className="p-3 w-[28%]">مدل</th>
                <th className="p-3 w-[12%]">وضعیت</th>
                <th className="p-3 w-[14%]">تاریخ پایان</th>
                <th className="p-3 w-[16%]">یادداشت</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-gray-500 text-center">
                    نتیجه‌ای برای نمایش نیست.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className="divide-x">
                    <td className="p-3 font-mono">{r.serial}</td>
                    <td className="p-3">{r.brand}</td>
                    <td className="p-3">{r.model}</td>
                    <td className="p-3">
                      {/* نشان رنگی وضعیت */}
                      {r._notFound ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                          ثبت نشده
                        </span>
                      ) : r.status?.toLowerCase() === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">
                          {r.status || "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{r.end}</td>
                    <td className="p-3">{r.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          * منبع داده:{" "}
          <code className="px-1 py-0.5 rounded bg-gray-100">data/warranty.json</code>
        </p>
      </div>
    </>
  );
}