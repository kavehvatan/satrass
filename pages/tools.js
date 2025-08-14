// pages/tools.js
import Link from "next/link";
import { useEffect, useState } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// همون منطق دوحالته: نوبتی روی لود + سوئیچ با کلیک (Persist با localStorage)
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
      {/* Hero کوچک ابزارها با دو دکمه متغیر مثل صفحه اول */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-extrabold">ابزارها</h1>
          <p className="mt-3 text-gray-300">
            مجموعه‌ای از ابزارهای محاسباتی و چک‌لیست‌ها برای طراحی و راهبری زیرساخت.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* دکمه Filled */}
            <Link
              href="/tools/unity-calculator"
              onClick={swap}
              className="rounded-full px-5 py-2.5 font-bold transition"
              style={{
                backgroundColor: primary,
                color: primaryIsYellow ? "#000" : "#fff",
              }}
            >
              Unity Calculator
            </Link>

            {/* دکمه Outlined */}
            <Link
              href="/tools/cisco"
              onClick={swap}
              className="rounded-full px-5 py-2.5 font-semibold transition"
              style={{
                border: `1px solid ${secondary}`,
                color: secondary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${secondary}1A`)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              ابزارهای سیسکو
            </Link>
          </div>
        </div>
      </section>

      {/* لیست ابزارها */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-lg border bg-white p-5 hover:shadow-md transition flex flex-col"
            >
              <div className="text-lg font-bold text-gray-900 group-hover:opacity-90">
                {t.title}
              </div>
              <p className="mt-2 text-sm text-gray-600 leading-6">{t.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-gray-900/80 group-hover:text-gray-900">
                ورود
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="ml-1 inline-block"
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