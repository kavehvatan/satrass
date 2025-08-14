// pages/tools.js
import React from "react";
import Link from "next/link";

const TEAL = "#14b8a6";    // سبز لوگو
const YELLOW = "#f4c21f";  // زرد لوگو

const TOOLS = [
  {
    slug: "raid-capacity",
    title: "RAID Capacity",
    desc: "محاسبه ظرفیت مؤثر و Fault Tolerance برای آرایه‌های RAID.",
    href: "/tools/raid-capacity",
    external: false,
  },
  {
    slug: "cisco-tools",
    title: "Cisco Tools",
    desc: "SFP Matrix، PoE Budget، QoS cheatsheet و ابزارهای کاربردی سیسکو.",
    href: "/tools/cisco-tools",
    external: false,
  },
  {
    slug: "unity-midrangesizer",
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity (نسخهٔ میزبانی‌شده داخل سایت).",
    href: "/tools/unity-midrangesizer", // ← حالا داخلی است
    external: false,
  },
  {
    slug: "power-btu",
    title: "Power & BTU",
    desc: "توان مصرفی و گرمای تولیدی تجهیزات دیتاسنتر.",
    href: "/tools/power-btu",
    external: false,
  },
];

// الگوی چرخشی: پر/خطی × سبز/زرد
function variantForIndex(i) {
  const mod = i % 4;
  if (mod === 0) return { type: "filled", color: TEAL };
  if (mod === 1) return { type: "outlined", color: TEAL };
  if (mod === 2) return { type: "filled", color: YELLOW };
  return { type: "outlined", color: YELLOW };
}

function ToolButton({ href, external, className, style, children }) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

export default function Tools() {
  return (
    <main dir="rtl" className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">ابزارها</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {TOOLS.map((t, i) => {
            const v = variantForIndex(i);
            const isFilled = v.type === "filled";
            const isYellow = v.color === YELLOW;

            return (
              <article
                key={t.slug}
                className="rounded-3xl p-6 md:p-7 bg-white/90 backdrop-blur ring-1 ring-black/10 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                      {t.title}
                    </h2>
                    <p className="mt-3 text-slate-600 leading-7">{t.desc}</p>
                  </div>

                  <div className="shrink-0">
                    <ToolButton
                      href={t.href}
                      external={t.external}
                      className="rounded-full px-6 py-3 text-[15px] font-bold transition inline-flex items-center"
                      style={
                        isFilled
                          ? {
                              backgroundColor: v.color,
                              color: isYellow ? "#000" : "#fff",
                              border: "1px solid transparent",
                            }
                          : {
                              border: `1px solid ${v.color}`,
                              color: v.color,
                              backgroundColor: "transparent",
                            }
                      }
                    >
                      باز کردن ابزار
                    </ToolButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}