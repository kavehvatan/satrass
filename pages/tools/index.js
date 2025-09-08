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

export default function ToolsIndex() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc]">
      {/* بنر */}
      <section className="bg-slate-900 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            <span style={{ color: TEAL }}>ابزار</span>
            <span className="mx-1" style={{ color: YELLOW }}>ها</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            مجموعه ابزارهای کمکی ساتراس برای برآورد، پیکربندی و محاسبه
          </p>
        </div>
      </section>

      {/* کارت‌ها */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((t, i) => {
            // رنگ‌های کامل (بدون شفافیت)
            const bgClass = i % 2 === 0 ? "bg-teal-100" : "bg-amber-100";

            return (
              <Link
                key={t.title}
                href={t.disabled ? "#" : t.href}
                className={`${bgClass} rounded-xl shadow hover:shadow-md hover:-translate-y-0.5 transition
                            h-[100px] md:h-[110px] flex flex-col items-center justify-center text-center px-4`}
              >
                <h2 className="text-lg md:text-xl font-extrabold">{t.title}</h2>
                <p className="mt-1 text-slate-700 text-sm md:text-base">{t.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}