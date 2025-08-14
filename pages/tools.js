// pages/tools.js
import React from "react";
import Link from "next/link";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

const TOOLS = [
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "#", // لینک واقعی ابزار را بعداً بگذار
    external: true,
  },
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "/tools/unity-midrangesizer", // ← داخل سایت خودت باز می‌شود
    external: false,
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "#",
    external: true,
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "#",
    external: true,
  },
];

// ترکیب‌های دکمه: براساس ایندکس کارت، یکی از چهار حالت را برمی‌گرداند
function variantForIndex(i) {
  const mod = i % 4;
  if (mod === 0) return { type: "filled", color: TEAL };
  if (mod === 1) return { type: "outlined", color: TEAL };
  if (mod === 2) return { type: "filled", color: YELLOW };
  return { type: "outlined", color: YELLOW };
}

export default function Tools() {
  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-8">ابزارها</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {TOOLS.map((t, i) => {
            const v = variantForIndex(i);
            const isFilled = v.type === "filled";
            const isYellow = v.color === YELLOW;

            // استایل مشترک دکمه
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
                ? (e) => {
                    // یک ته‌رنگ ملایم روی هاور برای حالت outlined
                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)";
                  }
                : undefined;
            const onLeave =
              !isFilled
                ? (e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                : undefined;

            // اگر لینک داخلی است، از Link استفاده می‌کنیم؛ اگر خارجی است، <a target=_blank>
            const Button = t.external ? (
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className={btnClass}
                style={btnStyle}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                باز کردن ابزار
              </a>
            ) : (
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

            return (
              <article
                key={t.title}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
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