// pages/tools.js
import React from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

const TOOLS = [
  {
    title: "PowerStore Configurator",
    desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
    href: "#", // لینک واقعی ابزار را بگذار
  },
  {
    title: "Unity MidrangeSizer",
    desc: "محاسبه ظرفیت و پیکربندی بهینه Unity",
    href: "#",
  },
  {
    title: "PowerStore RAID Calculator",
    desc: "محاسبه ظرفیت و افزونگی آرایه‌های RAID در PowerStore",
    href: "#",
  },
  {
    title: "Unity Configurator",
    desc: "طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT",
    href: "#",
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

            return (
              <article
                key={t.title}
                className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold">{t.title}</h2>
                <p className="mt-2 text-gray-600">{t.desc}</p>

                <div className="mt-5">
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full px-5 py-2.5 font-bold transition inline-flex items-center"
                    style={
                      isFilled
                        ? {
                            backgroundColor: v.color,
                            color: isYellow ? "#000" : "#fff",
                          }
                        : {
                            border: `1px solid ${v.color}`,
                            color: v.color,
                            backgroundColor: "transparent",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isFilled) {
                        e.currentTarget.style.backgroundColor = `${v.color}1A`; // 10% tint
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFilled) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    باز کردن ابزار
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}