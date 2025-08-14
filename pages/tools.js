// pages/tools.js
import Link from "next/link";
import { useEffect, useState } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// همون منطق دوحالته: نوبتی روی لود + سوئیچ با کلیک (Persist با localStorage)
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW);   // رنگ زمینه دکمه
  const [secondary, setSecondary] = useState(TEAL); // رنگ حاشیه/حالت دوم

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

const TOOLS = [
  {
    title: "Unity Calculator",
    href: "/tools/unity-calculator",
    desc: "برآورد ظرفیت/RAID/Overhead برای Dell EMC Unity.",
  },
  {
    title: "Cisco Tools",
    href: "/tools/cisco",
    desc: "جمع ابزارهای کاربردی سیسکو (SFP Matrix، PoE Budget، QoS cheatsheet…).",
  },
  {
    title: "RAID Capacity",
    href: "/tools/raid",
    desc: "محاسبه ظرفیت مؤثر و Fault Tolerance برای آرایه‌های RAID.",
  },
  {
    title: "Power & BTU",
    href: "/tools/power-btu",
    desc: "توان مصرفی و گرمای تولیدی تجهیزات دیتاسنتر.",
  },
];

export default function ToolsPage() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  return (
    <main className="min-h-screen font-sans">
      {/* فقط گرید ابزارها (هیرو حذف شد) */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6">ابزارها</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={swap} // کلیک روی هر کارت، رنگ دکمه‌ها رو جابه‌جا می‌کند
              className="group rounded-lg border bg-white p-5 hover:shadow-md transition flex flex-col"
            >
              <div className="text-lg font-bold text-gray-900 group-hover:opacity-90">
                {t.title}
              </div>

              <p className="mt-2 text-sm text-gray-600 leading-6">{t.desc}</p>

              {/* دکمه «ورود» — دوحالته مثل هیرو: زمینه = primary، حاشیه = secondary */}
              <span
                className="mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition"
                style={{
                  backgroundColor: primary,
                  color: primaryIsYellow ? "#000" : "#fff",
                  border: `1px solid ${secondary}`,
                }}
              >
                ورود
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="inline-block"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p>© {new Date().getFullYear()} ساتراس</p>
        </div>
      </footer>
    </main>
  );
}