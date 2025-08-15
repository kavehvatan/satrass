// pages/warranty.js
import { useMemo, useState } from "react";

export default function WarrantyPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // نرمال‌سازی سریال (حساس نبودن به خط فاصله/فاصله/حروف کوچک‌وبزرگ)
  const normalize = (s) =>
    (s || "")
      .toString()
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "")
      .replace(/-/g, "");

  // خروجی CSV
  const exportCSV = () => {
    if (!rows.length) return;
    const header = ["serial", "brand", "model", "status", "end", "notes"];
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.serial ?? "",
          r.brand ?? "",
          r.model ?? "",
          r.status ?? "",
          r.end ?? "",
          (r.notes ?? "").toString().replace(/[\r\n,]+/g, " "),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warranty.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // استعلام از API و تکمیل ردیف‌های «نیافتن» برای ورودی‌ها
  const handleQuery = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/warranty?q=${encodeURIComponent(q || "")}`
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();

      // ردیف‌های برگشتی از API
      const apiRows = Array.isArray(data?.rows) ? data.rows : [];

      // ورودی‌های کاربر (هر خط/کاما)
      const inputs = (q || "")
        .split(/[\n,]+/g)
        .map((s) => s.trim())
        .filter(Boolean);

      // اگر ورودی داده شده، ردیف‌های «نیافتن» بسازیم
      let merged = [...apiRows];
      if (inputs.length) {
        const found = new Set(apiRows.map((r) => normalize(r.serial)));
        inputs.forEach((s) => {
          const ns = normalize(s);
          if (!found.has(ns)) {
            merged.push({
              serial: s,
              brand: "—",
              model: "—",
              status: "not_found",
              end: "—",
              notes: "—",
            });
          }
        });
      }

      setRows(merged);
    } catch (e) {
      setErr(e.message || "server_error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const isActive = /active|فعال/i.test(status || "");
    const text = isActive ? "فعال" : "ثبت نشده";
    const cls = isActive
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${cls}`}
      >
        {text}
      </span>
    );
  };

  const hasRows = rows.length > 0;

  return (
    <main dir="rtl" className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-extrabold">استعلام گارانتی</h1>
      <p className="mb-6 text-gray-600">
        سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از
        پایگاه داخلی ساتراس خوانده می‌شود.
      </p>

      {/* چیدمان: ابتدا textarea (ستون راست)، سپس دکمه‌ها (ستون چپ) */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] items-start gap-4">
        {/* باکس ورودی – کوتاه‌تر و خاکستری با Placeholder راست‌چین */}
        <textarea
          dir="auto"
          className="min-h-[110px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-[15px] leading-7 outline-none placeholder:text-right placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
          placeholder="مثال: HPE-9J1234 (یا چند سریال با خط جدید/کاما)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {/* دکمه‌ها – ستون چپ */}
        <div className="flex w-[150px] flex-col gap-2">
          <button
            onClick={handleQuery}
            disabled={loading}
            className="min-w-[150px] rounded-xl bg-black px-4 py-2 text-center font-semibold text-white hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "در حال استعلام…" : "استعلام"}
          </button>

          <button
            onClick={exportCSV}
            className="min-w-[150px] rounded-xl border border-gray-300 bg-white/80 px-4 py-2 text-center text-gray-700 hover:bg-white"
          >
            خروجی CSV
          </button>
        </div>
      </div>

      {/* پیام خطا از API */}
      {err && (
        <p className="mt-3 text-sm text-red-600">
          خطا در ارتباط با سرور: <span className="font-mono">{err}</span>
        </p>
      )}

      {/* جدول نتایج */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-right">
          <thead className="bg-gray-50/60 text-gray-600">
            <tr>
              <th className="px-4 py-3">سریال</th>
              <th className="px-4 py-3">برند</th>
              <th className="px-4 py-3">مدل</th>
              <th className="px-4 py-3">وضعیت</th>
              <th className="px-4 py-3">تاریخ پایان</th>
              <th className="px-4 py-3">یادداشت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!hasRows ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  نتیجه‌ای برای نمایش نیست.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={`${r.serial}-${idx}`} className="odd:bg-white even:bg-gray-50/40">
                  <td className="whitespace-nowrap px-4 py-3 font-mono">
                    {r.serial ?? "—"}
                  </td>
                  <td className="px-4 py-3">{r.brand ?? "—"}</td>
                  <td className="px-4 py-3">{r.model ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">{r.end ?? "—"}</td>
                  <td className="px-4 py-3">{r.notes ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        * منبع داده:{" "}
        <span className="rounded-md bg-gray-100 px-2 py-1 font-mono">
          data/warranty.json
        </span>
        — برای به‌روزرسانی، فایل را ادیت و دیپلوی کنید.
      </p>
    </main>
  );
}