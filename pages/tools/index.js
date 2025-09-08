// pages/tools/index.js
import React, { useMemo } from "react";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// پس‌زمینه‌های کاملاً اوپک (بدون شفافیت)
const BG_TEAL = ["#ccfbf1", "#99f6e4"];     // teal-100/200
const BG_YELLOW = ["#fef3c7", "#fde68a"];  // amber-100/200

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
    href: "#",
    disabled: true,
  },
];

// رنگ پایدار ولی متنوع برای هر کارت
function useCardColors(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const isTeal = i % 2 === 0; // تناوب Teal/Yellow
        const palette = isTeal ? BG_TEAL : BG_YELLOW;
        const bg = palette[i % palette.length];
        return { bg, tone: isTeal ? "teal" : "yellow" };
      }),
    [count]
  );
}

export default function ToolsIndex() {
  const colors = useCardColors(TOOLS.length);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc]">
      {/* بنر */}
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

      {/* کارت‌ها */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map((t, i) => {
            const { bg, tone } = colors[i];
            const ring =
              tone === "teal"
                ? "ring-[rgba(20,184,166,.28)]"
                : "ring-[rgba(244,194,31,.32)]";

            const Card = (
              <article
                className={`rounded-3xl ring-1 ${ring} shadow-[0_10px_30px_-12px_rgba(15,23,42,.18)]
                            hover:shadow-xl hover:-translate-y-0.5 transition
                            h-full min-h-[230px] flex flex-col items-center justify-center text-center p-8`}
                style={{ background: bg, color: "#0f172a" }}
                aria-label={t.title}
              >
                <h2 className="text-2xl font-extrabold">{t.title}</h2>
                <p className="mt-3 text-slate-700">{t.desc}</p>

                {t.disabled && (
                  <span className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-300 bg-white text-slate-600 text-sm select-none">
                    به‌زودی
                  </span>
                )}
              </article>
            );

            return t.disabled ? (
              <div key={t.title} className="h-full cursor-not-allowed select-none">
                {Card}
              </div>
            ) : (
              <Link
                key={t.title}
                href={t.href}
                className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 rounded-3xl"
              >
                {Card}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}