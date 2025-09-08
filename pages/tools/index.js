// pages/tools/index.js
import React from "react";
import Link from "next/link";

/** رنگ‌های برند */
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

/** لیست ابزارها */
const TOOLS = [
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "/tools/powerstore-configurator",
  },
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "/tools/unity-midrangesizer",
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "#",
    disabled: true,
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "/tools/unity-configurator",
  },
];

/** کارت ابزار (تمام کارت لینک است) */
function ToolCard({ title, desc, href, disabled = false, tone = "teal" }) {
  const bg = tone === "teal" ? TEAL : YELLOW;
  const fg = tone === "teal" ? "#fff" : "#0f172a"; // روی زرد، متن تیره؛ روی تیِل، متن سفید

  const base =
    "w-full max-w-[520px] rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition " +
    "min-h-[110px] md:min-h-[120px] lg:min-h-[130px] flex items-center justify-center text-center px-5";

  const inner = (
    <article
      className={base}
      style={{ background: bg, color: fg }}
      aria-label={title}
    >
      <div className="max-w-[640px]">
        <h2 className="text-lg md:text-xl font-extrabold leading-tight">{title}</h2>
        <p
          className="mt-1 text-sm md:text-base leading-relaxed"
          style={{ color: fg === "#fff" ? "rgba(255,255,255,.9)" : "#334155" }}
        >
          {desc}
        </p>

        {disabled && (
          <span
            className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: fg === "#fff" ? "rgba(255,255,255,.15)" : "rgba(15,23,42,.08)",
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

  if (disabled) {
    return <div className="cursor-not-allowed select-none">{inner}</div>;
  }
  return (
    <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 rounded-2xl">
      {inner}
    </Link>
  );
}

export default function ToolsIndex() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc]">
      {/* بنر بالا */}
      <section className="bg-slate-900 text-white py-7 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            <span style={{ color: TEAL }}>ابزار</span>
            <span className="mx-1" style={{ color: YELLOW }}>
              ها
            </span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            مجموعه ابزارهای کمکی ساتراس برای برآورد، پیکربندی و محاسبه
          </p>
        </div>
      </section>

      {/* کارت‌ها (عرض محدود و یکدست؛ دیگر «دراز» نیستند) */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
          {TOOLS.map((t, i) => (
            <ToolCard
              key={t.title}
              title={t.title}
              desc={t.desc}
              href={t.href}
              disabled={t.disabled}
              tone={i % 2 === 0 ? "yellow" : "teal"} // تناوب زرد/تیِل
            />
          ))}
        </div>
      </section>
    </main>
  );
}