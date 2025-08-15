import { useEffect, useRef, useState } from "react";
import Head from "next/head";

// ——— Utils ———
const normalize = (s) =>
  String(s || "")
    .trim()
    .replace(/^['"'“”]+|['"'“”]+$/g, "");

const parseList = (input) =>
  String(input || "")
    .split(/[\n,]+/g)
    .map((x) => normalize(x))
    .filter(Boolean);

// ردیف "ثبت‌نشده" بساز
const makeNotFoundRows = (serials) =>
  serials.map((serial) => ({
    serial,
    brand: "—",
    model: "—",
    status: "ثبت نشده",
    end: "—",
    notes: "—",
    _notFound: true,
  }));

export default function WarrantyPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  // auto-expand
  const taRef = useRef(null);
  const autosize = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 560) + "px"; // تا ~35rem
  };
  useEffect(() => autosize(), []);

  async function doQuery() {
    setLoading(true);
    setErr(null);
    setRows([]);

    const wanted = parseList(q);

    try {
      const res = await fetch(`/api/warranty?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const apiRows = Array.isArray(json.rows) ? json.rows : [];

      // map بر اساس سریال نرمال‌شده
      const m = new Map();
      apiRows.forEach((r) => {
        const key = normalize(r.serial).toLowerCase();
        if (key) m.set(key, r);
      });

      // برای هر ورودی، یا ردیف واقعی یا "ثبت‌نشده"
      const display = wanted.map((serial) => {
        const key = serial.toLowerCase();
        if (m.has(key)) {
          const r = m.get(key);
          return {
            serial: normalize(r.serial) || serial,
            brand: r.brand || "—",
            model: r.model || "—",
            status: r.status || "—",
            end: r.end || "—",
            notes: r.notes || "—",
            _notFound: false,
          };
        }
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
      // حتی در صورت خطا، خروجی «ثبت نشده» بده
      setErr(e.message || "server_error");
      setRows(makeNotFoundRows(wanted));
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

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          استعلام گارانتی
        </h1>
        <p className="text-gray-600 mb-4">
          سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از
          پایگاه داخلی ساتراس خوانده می‌شود.
        </p>

        {/* چیدمان: دکمه‌ها کنار تکست‌اریا (مثل قبل) */}
        <div className="md:flex md:items-stretch md:gap-4">
          {/* ستون دکمه‌ها */}
          <div className="flex md:block gap-3 mb-3 md:mb-0 shrink-0">
            <button
              type="button"
              onClick={doQuery}
              disabled={loading}
              className="rounded-xl bg-black text-white px-5 py-2.5 hover:bg-gray-900 disabled:opacity-50 w-full md:w-36"
            >
              {loading ? "در حال استعلام…" : "استعلام"}
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="rounded-xl border bg-white text-gray-700 px-4 py-2.5 shadow-sm hover:bg-gray-50 w-full md:w-36"
            >
              خروجی CSV
            </button>
          </div>

          {/* تکست‌اریا */}
          <div className="flex-1">
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
                min-h-12 md:min-h-16
                max-h-80
                resize-y overflow-hidden
                rounded-2xl border border-gray-300
                bg-white/70 backdrop-blur-sm
                px-4 py-2.5
                placeholder-gray-400
                text-sm md:text-base
                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400
                transition-all
              "
            />
          </div>
        </div>

        {/* خطا (در عین حال جدول را هم نشان می‌دهیم) */}
        {err && (
          <div className="mt-2 text-sm text-red-600">
            خطا در ارتباط با سرور: {err}
          </div>
        )}

        {/* جدول */}
        <div className="mt-4 rounded-2xl border bg-white/70 backdrop-blur-sm overflow-hidden">
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
                      {r._notFound ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                          ثبت نشده
                        </span>
                      ) : String(r.status).toLowerCase() === "active" ? (
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