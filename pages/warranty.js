// pages/warranty.js
import { useState } from "react";

function Badge({ status }) {
  const map = {
    active: "bg-emerald-100 text-emerald-700",
    expired: "bg-rose-100 text-rose-700",
    unknown: "bg-gray-100 text-gray-700",
    not_found: "bg-amber-100 text-amber-700",
  };
  const label =
    { active: "فعال", expired: "منقضی", unknown: "نامشخص", not_found: "ثبت نشده" }[status] ||
    "نامشخص";
  return <span className={`px-2 py-1 rounded text-sm ${map[status] || map.unknown}`}>{label}</span>;
}

export default function Warranty() {
  const [input, setInput] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const serials = input
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 200);
    if (!serials.length) return;

    setLoading(true);
    try {
      const r = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serials }),
      });
      const data = await r.json();
      setRows(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  const dlCsv = () => {
    const head = "Serial,Vendor,Model,Status,ExpireAt,Notes\n";
    const body = rows
      .map((r) =>
        [r.serial, r.vendor || "", r.model || "", r.status || "", r.expireAt || "", r.notes || ""].join(",")
      )
      .join("\n");
    const blob = new Blob([head + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warranty.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen font-sans">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">استعلام گارانتی</h1>
        <p className="text-gray-600 mb-6">
          سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از پایگاه داخلی ساتراس خوانده می‌شود.
        </p>

        <form onSubmit={submit} className="flex flex-col md:flex-row gap-3 md:items-end">
          <textarea
            className="w-full md:w-2/3 min-h-[140px] border rounded-lg p-3 font-mono"
            placeholder="مثال: CN12345ABCD&#10;HPE-9J1234"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-3">
            <button className="rounded-lg px-4 py-2 bg-black text-white hover:bg-zinc-800 transition" disabled={loading}>
              {loading ? "در حال استعلام…" : "استعلام"}
            </button>
            {rows.length > 0 && (
              <button
                type="button"
                onClick={dlCsv}
                className="rounded-lg px-4 py-2 border hover:bg-gray-50 transition"
              >
                خروجی CSV
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="[&>th]:p-3 [&>th]:text-right [&>th]:text-sm [&>th]:font-semibold">
                <th>سریال</th>
                <th>برند</th>
                <th>مدل</th>
                <th>وضعیت</th>
                <th>تاریخ پایان</th>
                <th>یادداشت</th>
              </tr>
            </thead>
            <tbody className="[&>tr>td]:p-3 [&>tr>td]:border-t">
              {rows.map((r) => (
                <tr key={r.serial}>
                  <td className="font-mono">{r.serial}</td>
                  <td>{r.vendor || "-"}</td>
                  <td>{r.model || "-"}</td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                  <td>{r.expireAt || "-"}</td>
                  <td>{r.notes || "-"}</td>
                </tr>
              ))}
              {!rows.length && !loading && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    نتیجه‌ای برای نمایش نیست.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          * منبع داده: <code className="px-1 bg-gray-100 rounded">data/warranty.json</code> — برای به‌روزرسانی، فایل را ادیت و
          دیپلوی کنید.
        </p>
      </section>
    </main>
  );
}