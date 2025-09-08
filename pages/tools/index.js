// pages/tools/index.js
import React from "react";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

const TOOLS = [
  { title: "Unity MidrangeSizer", desc: "محاسبه ظرفیت و پیکربندی بهینه Unity", href: "/tools/unity-midrangesizer" },
  { title: "PowerStore Configurator", desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore", href: "/tools/powerstore-configurator" },
  { title: "Unity Configurator", desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT", href: "/tools/unity-configurator" },
  { title: "PowerStore RAID Calculator", desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore", href: "#", disabled: true },
];

function ToolCard({ title, desc, href, disabled = false, tone = "teal" }) {
  const bg = tone === "teal" ? TEAL : YELLOW;
  const fg = tone === "teal" ? "#fff" : "#0f172a";

  const card =
    "rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition " +
    // ارتفاع یکسان و کوچیک‌تر
    "h-[90px] sm:h-[100px] md:h-[110px] " +
    // متن وسط و فاصله داخلی کم
    "flex items-center justify-center text-center px-4";

  const innerText =
    "max-w-[520px] w-full"; // عرض متن محدود تا دانلود/کشش ایجاد نشه

  const body = (
    <article className={card} style={{ background: bg, color: fg }}>
      <div className={innerText}>
        <h2 className="text-base sm:text-lg md:text-xl font-extrabold leading-tight">
          {title}
        </h2>
        <p
          className="mt-1 text-xs sm:text-sm md:text-[15px] leading-relaxed"
          style={{ color: fg === "#fff" ? "rgba(255,255,255,.9)" : "#334155" }}
        >
          {desc}
        </p>
        {disabled && (
          <span
            className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{
              background: fg === "#fff" ? "rgba(255,255,255,.16)" : "rgba(15,23,42,.08)",
              color: fg,
              border: fg === "#fff" ? "1px solid rgba(255,255,255,.35)" : "1px solid rgba(15,23,42,.15)",
            }}
          >
            به‌زودی
          </span>
        )}
      </div>
    </article>
  );

  if (disabled) return <div className="block w-full max-w-[560px] mx-auto">{body}</div>;

  return (
    <Link
      href={href}
      className="block w-full max-w-[560px] mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 rounded-2xl"
      aria-label={title}
    >
      {body}
    </Link>
  );
}

export default function ToolsIndex() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc]">
      {/* بنر */}
      <section className="bg-slate-900 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>ابزار</span>
            <span className="mx-1" style={{ color: YELLOW }}>ها</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            مجموعه ابزارهای کمکی ساتراس برای برآورد، پیکربندی و محاسبه
          </p>
        </div>
      </section>

      {/* کارت‌ها: عرض محدود + ارتفاع یکسان */}
      <section className="max-w-7xl mx-auto px-4 pt-7 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center">
          {TOOLS.map((t, i) => (
            <ToolCard
              key={t.title}
              title={t.title}
              desc={t.desc}
              href={t.href}
              disabled={t.disabled}
              tone={i % 2 ? "yellow" : "teal"} // یکی در میان
            />
          ))}
        </div>
      </section>
    </main>
  );
}