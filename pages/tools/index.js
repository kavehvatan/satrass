// pages/tools/index.js
import React from "react";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// لیست ابزارها (همه داخلی باز می‌شن مثل بقیه صفحات ابزار)
const TOOLS = [
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "/tools/unity-midrangesizer",
  },
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "/tools/powerstore-configurator",
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "/tools/unity-configurator",
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "#", // بعداً اگر صفحه‌اش آماده شد مسیرش را بگذار
    disabled: true,
  },
];

// استایل دکمه‌ها (چرخشی بر اساس ایندکس برای تنوع)
function variantForIndex(i) {
  const mod = i % 4;
  if (mod === 0) return { type: "filled", color: TEAL };
  if (mod === 1) return { type: "outlined", color: TEAL };
  if (mod === 2) return { type: "filled", color: YELLOW };
  return { type: "outlined", color: YELLOW };
}

export default function ToolsIndex() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc]">
      {/* بنر سرمه‌ای با تیتر دو رنگ */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
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

      {/* لیست کارت‌ها */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-10">
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((t, i) => {
            const v = variantForIndex(i);
            const isFilled = v.type === "filled";
            const isYellow = v.color === YELLOW;

            const btnBase =
              "rounded-full px-5 py-2.5 font-bold transition inline-flex items-center justify-center min-w-[132px]";
            const btnStyle = t.disabled
              ? { border: "1px solid #e5e7eb", color: "#9ca3af", background: "transparent", cursor: "not-allowed" }
              : isFilled
              ? { backgroundColor: v.color, color: isYellow ? "#000" : "#fff" }
              : { border: `1px solid ${v.color}`, color: v.color, backgroundColor: "transparent" };

            const Button = t.disabled ? (
              <span className={btnBase} style={btnStyle} aria-disabled="true">
                به‌زودی
              </span>
            ) : (
              <Link href={t.href} className={btnBase} style={btnStyle}>
                باز کردن ابزار
              </Link>
            );

            return (
              <article
                key={t.title}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white/80"
              >
                <h2 className="text-xl font-extrabold text-slate-800">{t.title}</h2>
                <p className="mt-2 text-slate-600">{t.desc}</p>
                <div className="mt-5">{Button}</div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}