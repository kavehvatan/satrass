// pages/warranty.js
import { useState, useMemo } from "react";
import Head from "next/head";

function faToEnDigits(str = "") {
  const map = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
                "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9" };
  return String(str).replace(/[۰-۹٠-٩]/g, d => map[d] || d);
}
function normalizeInput(raw = "") {
  // حذف کوتیشن و فاصله‌های اضافی و نرمال‌سازی اعداد
  return faToEnDigits(raw).replace(/["'“”‘’]/g, "").trim();
}

export default function Warranty() {
  const [q, setQ] = useState("HPE-9J1234");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function fetchWarranty(nq) {
    // 1) تلاش با GET
    let r = await fetch("/api/warranty?q=" + encodeURIComponent(nq));
    if (r.ok) return r.json();

    // 2) اگر GET خطا بود، با POST تلاش کن (fallback)
    r = await fetch("/api/warranty", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ q: nq }),
    });
    if (r.ok) return r.json();

    // اگر هر دو خطا شدند، متن خطا را بخوان
    const text = await r.text().catch(() => "");
    const reason = `HTTP ${r.status} ${r.statusText}${text ? " – " + text : ""}`;
    throw new Error(reason);
  }

  async function doQuery() {
    setLoading(true);
    setErr("");
    setRows([]);
    try {
      const nq = normalizeInput(q);
      const data = await fetchWarranty(nq);
      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } catch (e) {
      console.error("Warranty error:", e);
      setErr("خطا در ارتباط با سرور: " + (e.message || "نامشخص"));
    } finally {
      setLoading(false);
    }
  }

  const csvHref = useMemo(() => {
    if (!rows.length) return "";
    const cols = ["serial", "brand", "model", "status", "start", "end", "notes"];
    const head = cols.join(",");
    const body = rows
      .map(r => cols.map(k => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(head + "\n" + body);
  }, [rows]);

  return (
    <>
      <Head><title>استعلام گارانتی | Satrass</title></Head>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-6">استعلام گارانتی</h1>
        <p className="text-gray-600 mb-6">
          سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از پایگاه داخلی ساتراس خوانده می‌شود.
        </p>

        <div className="flex items-start gap-3 mb-6">
          <textarea
            className="w-full min-h-[140px] rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow/70"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onBlur={(e)=>setQ(normalizeInput(e.target.value))}
            dir="ltr"
            placeholder='HPE-9J1234'
          />
          <button
            onClick={doQuery}
            disabled={loading}
            className="whitespace-nowrap rounded-lg bg-black text-white px-5 py-3 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "در حال استعلام…" : "استعلام"}
          </button>
          <a
            className={`whitespace-nowrap rounded-lg border px-5 py-3 ${rows.length ? "opacity-100" : "opacity-40 pointer-events-none"}`}
            href={csvHref}
            download="warranty.csv"
          >
            خروجی CSV
          </a>
        </div>

        {err && <div className="text-red-600 mb-4">{err}</div>}

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-right">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="p-3">سریال</th>
                <th className="p-3">برند</th>
                <th className="p-3">مدل</th>
                <th className="p-3">وضعیت</th>
                <th className="p-3">تاریخ پایان</th>
                <th className="p-3">یادداشت</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td className="p-6 text-gray-500" colSpan={6}>نتیجه‌ای برای نمایش نیست.</td></tr>
              ) : rows.map((r,i)=>(
                <tr key={i} className="border-t">
                  <td className="p-3 font-mono">{r.serial}</td>
                  <td className="p-3">{r.brand || "-"}</td>
                  <td className="p-3">{r.model || "-"}</td>
                  <td className="p-3">
                    {(r.status||"").toLowerCase().includes("active") || (r.status||"").toLowerCase().includes("registered")
                      ? <span className="inline-block rounded bg-emerald-100 text-emerald-700 text-sm px-2 py-1">ثبت شده</span>
                      : <span className="inline-block rounded bg-rose-100 text-rose-700 text-sm px-2 py-1">نامشخص</span>}
                  </td>
                  <td className="p-3">{r.end || "-"}</td>
                  <td className="p-3">{r.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          * منبع داده: <code className="px-1 py-0.5 rounded bg-gray-100">data/warranty.json</code>
        </p>
      </div>
    </>
  );
}