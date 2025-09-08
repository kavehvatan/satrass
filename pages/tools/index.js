// pages/tools/index.js
import React, { useMemo } from "react";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// پالت‌های روشن برای بک‌گراند کارت‌ها (خوانایی خوب با متن تیره)
const BG_TEAL = ["#f0fdfa", "#ccfbf1", "#99f6e4"];    // teal-50/100/200
const BG_YELLOW = ["#fffbeb", "#fef3c7", "#fde68a"]; // amber/yellow-50/100/200

// لیست ابزارها
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

// انتخاب رنگ تصادفی پایدار در هر رندر (بر اساس ایندکس)
function useCardColors(count) {
  return useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // به تناوب teal/yellow و درون هرکدام یکی از طیف‌های روشن
      const isTeal = i % 2 === 0 ? Math.random() > 0.4 : Math.random() > 0.6; // کمی تنوع
      const palette = isTeal ? BG_TEAL : BG_YELLOW;
      const bg = palette[Math.floor(Math.random() * palette.length)];
      const tone = isTeal ? "teal" : "yellow";
      return { bg, tone };
    });
  }, [count]);
}

export default function ToolsIndex() {
  const colors = useCardColors(TOOLS.length);

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

      <section className="max-w-7xl mx-auto px-4 pt-8 pb-10">
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((t, i) => {
            const { bg, tone } = colors[i] || {};
            const textColor = "#0f172a"; // slate-900 برای خوانایی روی پس‌زمینه روشن
            const ringColor = tone === "teal" ? "ring-[rgba(20,184,166,.25)]" : "ring-[rgba(244,194,31,.28)]";
            const shadowGlow =
              tone === "teal"
                ? "shadow-[0_10px_30px_-12px_rgba(20,184,166,.35)]"
                : "shadow-[0_10px_30px_-12px_rgba(244,194,31,.35)]";

            const CardInner = (
              <article
                className={`rounded-3xl ${shadowGlow} hover:shadow-xl hover:-translate-y-0.5 transition
                            ring-1 ${ringColor} p-8 text-center`}
                style={{ background: bg, color: textColor }}
                aria-label={t.title}
              >
                <h2 className="text-xl md:text-2xl font-extrabold">{t.title}</h2>
                <p className="mt-3 text-slate-700">{t.desc}</p>

                {t.disabled && (
                  <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-300 bg-white/70 text-slate-600 text-sm select-none cursor-not-allowed">
                    به‌زودی
                  </div>
                )}
              </article>
            );

            // کل کارت لینک باشد (اگر غیرفعال نیست)
            return t.disabled ? (
              <div key={t.title} className="cursor-not-allowed select-none">{CardInner}</div>
            ) : (
              <Link key={t.title} href={t.href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 rounded-3xl">
                {CardInner}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}