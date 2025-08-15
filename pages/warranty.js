// pages/warranty.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";

/** نرمال‌سازی سریال: Uppercase + حذف فاصله‌ها و همه‌ی انواع dash/hyphen یونیکد */
const normalize = (s) =>
  (s || "")
    .toString()
    .toUpperCase()
    // حذف فاصله‌ها و کنترل‌کاراکترها (برای RTL)
    .replace(/[\s\u200c\u200f\u200e\u202a-\u202e\u2066-\u2069]/g, "")
    // حذف تمام حالت‌های dash/hyphen
    .replace(/[-\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "");

const STATUS_LABEL = {
  active: "فعال",
  expired: "منقضی",
  not_found: "ثبت نشده",
};
const statusPillClass = (status) => {
  if (status === "active") return "bg-emerald-100 text-emerald-700 ring-emerald-200";
  if (status === "expired") return "bg-rose-100 text-rose-700 ring-rose-200";
  return "bg-amber-100 text-amber-700 ring-amber-200"; // not_found
};

/** تبدیل ردیف‌ها به CSV ساده */
function toCSV(rows) {
  const header = ["serial", "brand", "model", "status", "end", "notes"];
  const esc = (v) =>
    `"${String(v ?? "")
      .replace(/"/g, '""')
      .replace(/\r?\n/g, " ")}"`;
  const body = rows.map((r) =>
    [r.serial, r.brand, r.model, r.status, r.end, r.notes].map(esc).join(",")
  );
  return [header.join(","), ...body].join("\n");
}

/** پارس ورودی کاربر (کاما/خط جدید)، منحصربه‌فردسازی و نرمال‌سازی */
function parseInput(raw) {
  const parts = (raw || "")
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  const uniq = [];
  const seen = new Set();
  for (const p of parts) {
    const n = normalize(p);
    if (!n) continue;
    if (!seen.has(n)) {
      uniq.push({ raw: p, norm: n });
      seen.add(n);
    }
  }
  return uniq;
}

export default function WarrantyPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [apiRows, setApiRows] = useState([]); // نتیجه‌ی API
  const [displayRows, setDisplayRows] = useState([]); // چیزی که در جدول می‌بینیم

  const tokens = useMemo(() => parseInput(q), [q]);

  const hasQuery = tokens.length > 0;

  async function fetchAndRender() {
    try {
      setErr("");
      setLoading(true);
      // رشته‌ی ورودی را همان‌طور که هست می‌فرستیم، نرمال‌سازی سمت API هم هست
      const resp = await fetch(`/api/warranty?q=${encodeURIComponent(q)}`);
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`HTTP ${resp.status} – ${t}`);
      }
      const data = await resp.json();
      const rows = Array.isArray(data?.rows) ? data.rows : [];
      setApiRows(rows);

      // اگر ورودی مشخص شده: برای هر سریال ورودی، یا ردیف پیدا شده را می‌گذاریم
      // یا ردیف جایگزین با وضعیت «ثبت نشده»
      if (hasQuery) {
        const foundMap = new Map(
          rows.map((r) => [normalize(r.serial), r])
        );
        const out = tokens.map(({ raw, norm }) => {
          const f = foundMap.get(norm);
          if (f) return f;
          return { serial: raw, brand: "-", model: "-", status: "not_found", end: "-", notes: "-" };
        });
        setDisplayRows(out);
      } else {
        // اگر کاربر چیزی وارد نکرده، تمام ردیف‌های API را نشان بده
        setDisplayRows(rows);
      }
    } catch (e) {
      setErr(e?.message || "server_error");
      setApiRows([]);
      setDisplayRows([]);
    } finally {
      setLoading(false);
    }
  }

  // با Enter هم کار کند (در textarea با Ctrl/Cmd+Enter)
  function onKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      fetchAndRender();
    }
  }

  function exportCSV() {
    try {
      if (!displayRows.length) return;
      const csv = toCSV(displayRows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "warranty.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {}
  }

  return (
    <>
      <Head>
        <title>استعلام گارانتی | SATRASS</title>
      </Head>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">استعلام گارانتی</h1>
        <p className="text-gray-600 mb-4">
          سریال‌ها را وارد کنید (هر خط یک سریال یا با کاما جدا کنید). داده‌ها از پایگاه داخلی ساتراس خوانده می‌شود.
        </p>

        {/* نوار دکمه‌ها – سمت چپ */}
        <div className="flex gap-3 mb-3 justify-start">
          <button
            type="button"
            onClick={fetchAndRender}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition disabled:opacity-60"
          >
            {loading ? "در حال جستجو…" : "استعلام"}
          </button>
          <button
            type="button"
            onClick={exportCSV}
            disabled={!displayRows.length}
            className="px-5 py-3 rounded-xl border text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            خروجی CSV
          </button>
        </div>

        {/* باکس ورودی – کوتاه‌تر + Placeholder خاکستری */}
        <div className="mb-6">
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            rows={3}
            placeholder="مثال: HPE-9J1234 یا چند سریال با کاما/خط جدید"
            className="w-full rounded-2xl border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow/50 p-4"
          />
          {!!err && (
            <p className="text-rose-600 text-sm mt-2">
              خطا در ارتباط با سرور: {err}
            </p>
          )}
        </div>

        {/* جدول نتایج */}
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-50/60 px-4 py-3 text-gray-700 font-semibold">
            <div className="text-right">سریال</div>
            <div className="text-right">برند</div>
            <div className="text-right">مدل</div>
            <div className="text-right">وضعیت</div>
            <div className="text-right">تاریخ پایان</div>
            <div className="text-right">یادداشت</div>
          </div>

          {displayRows.length === 0 ? (
            <div className="px-4 py-8 text-gray-500 text-center">
              نتیجه‌ای برای نمایش نیست.
            </div>
          ) : (
            <div className="divide-y">
              {displayRows.map((r, idx) => {
                const s = (r.status || "").toString().toLowerCase();
                const pill = s === "active" ? "active" : s === "expired" ? "expired" : "not_found";
                return (
                  <div key={idx} className="grid grid-cols-6 px-4 py-4 items-center">
                    <div className="text-right break-all">{r.serial ?? "-"}</div>
                    <div className="text-right">{r.brand ?? "-"}</div>
                    <div className="text-right">{r.model ?? "-"}</div>

                    <div className="text-right">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-3 py-1 text-sm ring-1 " +
                          statusPillClass(pill)
                        }
                      >
                        {STATUS_LABEL[pill] ?? r.status ?? "-"}
                      </span>
                    </div>

                    <div className="text-right">{r.end ?? "-"}</div>
                    <div className="text-right">{r.notes ?? "-"}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* منبع داده */}
        <p className="text-gray-500 text-sm mt-3">
          * منبع داده:{" "}
          <code className="px-2 py-1 rounded bg-gray-100">data/warranty.json</code> — برای به‌روزرسانی، فایل را ادیت و دیپلوی کنید.
        </p>

        {/* لینک برگشت (دلخواه) */}
        <div className="mt-6">
          <Link
            href="/"
            className="text-sm text-brand-teal hover:underline"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </>
  );
}