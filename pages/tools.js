// pages/tools.js
import React from "react";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

const TOOLS = [
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "https://powerstoreconfigurator.onrender.com",
    external: true,
  },
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "/tools/unity-midrangesizer",
    external: false,
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "", // فعلاً نداریم → دکمه غیرفعال می‌شود
    external: true,
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "https://unity-configurator.onrender.com",
    external: true,
  },
];

// دکمه‌ها: پر/سیونۀ زرد-فیروزه‌ای طبق ایندکس کارت
function variantForIndex(i) {
  const mod = i % 4;
  if (mod === 0) return { type: "filled", color: TEAL };
  if (mod === 1) return { type: "outlined", color: TEAL };
  if (mod === 2) return { type: "filled", color: YELLOW };
  return { type: "outlined", color: YELLOW };
}

export default function Tools() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl font-extrabold mb-6">ابزارها</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((t, i) => {
            const v = variantForIndex(i);
            const isFilled = v.type === "filled";
            const isYellow = v.color === YELLOW;

            const btnClass =
              "rounded-full px-5 py-2.5 font-bold transition inline-flex items-center";
            const btnStyle = isFilled
              ? { backgroundColor: v.color, color: isYellow ? "#000" : "#fff" }
              : {
                  border: `1px solid ${v.color}`,
                  color: v.color,
                  backgroundColor: "transparent",
                };

            const onEnter =
              !isFilled
                ? (e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)")
                : undefined;
            const onLeave =
              !isFilled
                ? (e) => (e.currentTarget.style.backgroundColor = "transparent")
                : undefined;

            const isDisabled = !t.href || t.href === "#";

            let Button;
            if (isDisabled) {
              Button = (
                <span
                  className={`${btnClass} opacity-50 cursor-not-allowed select-none`}
                  style={btnStyle}
                  aria-disabled="true"
                  title="به‌زودی"
                >
                  به‌زودی
                </span>
              );
            } else if (t.external) {
              Button = (
                <a
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnClass}
                  style={btnStyle}
                  onMouseEnter={onEnter}
                  onMouseLeave={onLeave}
                >
                  باز کردن ابزار
                </a>
              );
            } else {
              Button = (
                <Link
                  href={t.href}
                  className={btnClass}
                  style={btnStyle}
                  onMouseEnter={onEnter}
                  onMouseLeave={onLeave}
                >
                  باز کردن ابزار
                </Link>
              );
            }

            return (
              <article
                key={t.title}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
              >
                <h2 className="text-xl font-bold">{t.title}</h2>
                <p className="mt-2 text-gray-600">{t.desc}</p>
                <div className="mt-5">{Button}</div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}