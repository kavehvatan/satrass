// pages/tools.js
import { useEffect, useState } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// نوبتی روی لود + سوئیچ با کلیک (Persist با localStorage مثل صفحهٔ اول)
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW);   // Filled
  const [secondary, setSecondary] = useState(TEAL); // Outlined

  useEffect(() => {
    try {
      const lastIsTealPrimary = localStorage.getItem("satrass_btn_pair") === "1";
      const nextIsTealPrimary = !lastIsTealPrimary;
      localStorage.setItem("satrass_btn_pair", nextIsTealPrimary ? "1" : "0");
      if (nextIsTealPrimary) {
        setPrimary(TEAL);
        setSecondary(YELLOW);
      } else {
        setPrimary(YELLOW);
        setSecondary(TEAL);
      }
    } catch {}
  }, []);

  const swap = () => {
    setPrimary((prev) => {
      const newPrimary = prev === TEAL ? YELLOW : TEAL;
      const newSecondary = newPrimary === TEAL ? YELLOW : TEAL;
      setSecondary(newSecondary);
      try {
        localStorage.setItem("satrass_btn_pair", newPrimary === TEAL ? "1" : "0");
      } catch {}
      return newPrimary;
    });
  };

  return { primary, secondary, swap };
}

export default function Tools() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  const tools = [
    {
      title: "PowerStore Configurator",
      desc: "انتخاب و پیکربندی کامل مدل‌های PowerStore",
      href: "#", // ← لینک واقعی ابزار رو بذار
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

  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-8">ابزارها</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((t, i) => (
            <article
              key={i}
              className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold">{t.title}</h2>
              <p className="mt-2 text-gray-600">{t.desc}</p>

              <div className="mt-5 flex flex-wrap gap-3">
                {/* دکمهٔ اصلی — Filled (مثل هیرو) */}
                <a
                  href={t.href}
                  onClick={swap}
                  className="rounded-full px-5 py-2.5 font-bold transition"
                  style={{
                    backgroundColor: primary,
                    color: primaryIsYellow ? "#000" : "#fff",
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  باز کردن ابزار
                </a>

                {/* دکمهٔ دوم — Outlined (اختیاری، همون لینک یا توضیحات) */}
                <a
                  href={t.href}
                  onClick={swap}
                  className="rounded-full px-5 py-2.5 font-semibold transition"
                  style={{
                    border: `1px solid ${secondary}`,
                    color: secondary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = `${secondary}1A`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  جزئیات
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}