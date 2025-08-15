// pages/warranty.js
import { useMemo, useState } from "react";

export default function Warranty() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [notFound, setNotFound] = useState([]); // سریال‌هایی که در فایل نبود
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // نرمال‌سازی سریال‌ها برای مقایسه (حذف کوتیشن، فاصله و حروف کوچک)
  const normalize = (s) =>
    (s || "")
      .toString()
      .replace(/^"+|"+$/g, "")
      .trim()
      .toUpperCase();

  const serialsFromTextarea = useMemo(() => {
    if (!q.trim()) return [];
    // تفکیک بر اساس خط جدید یا کاما
    return q
      .split(/[\n,]+/g)
      .map(normalize)
      .filter(Boolean);
  }, [q]);

  async function handleQuery() {
    setLoading(true);
    setErr(null);
    setRows([]);
    setNotFound([]);
    try {
      const url = `/api/warranty?q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(
          data?.error
            ? `HTTP ${res.status} — ${data.error}`
            : `HTTP ${res.status} — server_error`
        );
        return;
      }

      const got = Array.isArray(data?.rows) ? data.rows : [];
      setRows(got);

      // محاسبه سریال‌های یافت‌نشده نسبت به ورودی
      const foundSet = new Set(
        got.map((r) => normalize(r.serial ?? r.SERIAL ?? r.s))
      );
      const missing = serialsFromTextarea.filter((s) => !foundSet.has(s));
      setNotFound(missing);
    } catch (e) {
      setErr("HTTP 500 – server_error");
    } finally {
      setLoading(false);
    }
  }

  function exportCSV() {
    // خروجی ساده‌ی نتایج موجود (فقط ردیف‌های پیدا شده)
    const headers = ["serial", "brand", "model", "status", "start", "end", "notes"];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.serial ?? "",
          r.brand ?? "",
          r.model ?? "",
          r.status ?? "",
          r.start ?? "",
          r.end ?? "",
          r.notes ?? "",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warranty.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">استعلام گارانتی</h1>
      <p className="text-gray-600 mb-6">
        سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از
        پایگاه داخلی ساتراس خوانده می‌شود.
      </p>

      {/* کنترل‌ها */}
      <div className="flex items-start gap-3">
        <button
          onClick={exportCSV}
          className="rounded-xl border border-gray-300 bg-white/80 px-4 py-2 text-gray-700 hover:bg-white"
        >
          خروجی CSV
        </button>

        <button
          onClick={handleQuery}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-2 font-semibold text-white hover:bg-black/90 disabled:opacity-60"
        >
          {loading ? "در حال استعلام…" : "استعلام"}
        </button>

        {/* باکس ورودی: کمی کوتاه‌تر + placeholder خاکستری */}
        <textarea
          dir="ltr"
          className="min-h-[110px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-[15px] leading-7 outline-none placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
          placeholder='مثال: HPE-9J1234 یا چند سریال با خط جدید/کاما'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* خطا */}
      {err && (
        <div className="mt-3 text-sm font-medium text-red-600">{err}</div>
      )}

      {/* جدول نتایج */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
        <table className="w-full text-right">
          <thead className="bg-gray-50/70 text-gray-600">
            <tr>
              <th className="px-4 py-3">سریال</th>
              <th className="px-4 py-3">برند</th>
              <th className="px-4 py-3">مدل</th>
              <th className="px-4 py-3">وضعیت</th>
              <th className="px-4 py-3">تاریخ پایان</th>
              <th className="px-4 py-3">یادداشت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {/* ردیف‌های پیدا شده */}
            {rows.map((r, idx) => (
              <tr key={`f-${idx}`} className="bg-white">
                <td className="px-4 py-3 font-mono text-sm">
                  {normalize(r.serial ?? r.SERIAL ?? r.s)}
                </td>
                <td className="px-4 py-3">{r.brand ?? "—"}</td>
                <td className="px-4 py-3">{r.model ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.status ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      {r.status}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">{r.end ?? "—"}</td>
                <td className="px-4 py-3">{r.notes ?? "—"}</td>
              </tr>
            ))}

            {/* ردیف‌های ثبت‌نشده (Badge رنگی) */}
            {notFound.map((s, i) => (
              <tr key={`nf-${i}`} className="bg-white">
                <td className="px-4 py-3 font-mono text-sm">{s}</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[13px] font-semibold text-amber-700 ring-1 ring-amber-200">
                    ثبت نشده
                  </span>
                </td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
              </tr>
            ))}

            {/* اگر هیچ چیز برای نمایش نبود */}
            {!loading && rows.length === 0 && notFound.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  نتیجه‌ای برای نمایش نیست.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        * منبع داده: <code className="rounded bg-gray-100 px-1">data/warranty.json</code>
      </p>
    </div>
  );
}