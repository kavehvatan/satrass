// pages/index.js
import Link from "next/link";
import { useState, useEffect } from "react";

const SERVICES = [
  { title: "نصب و راه‌اندازی" },
  { title: "پایش" },
  { title: "آموزش" },
  { title: "مشاوره و طراحی" },
  { title: "راهبری" },
];

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const LOGO_COLORS = [TEAL, YELLOW]; // فیروزه‌ای و زرد

const CARD_CLASS =
  "flex flex-col items-center justify-center gap-3 p-5 bg-white border rounded-lg " +
  "hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px]";

function BrandCard({ name, slug, href }) {
  const [border, setBorder] = useState("#e5e7eb"); // gray-200
  return (
    <Link
      href={href}
      onMouseEnter={() =>
        setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
      }
      onMouseLeave={() => setBorder("#e5e7eb")}
      className={CARD_CLASS}
      style={{ borderColor: border }}
    >
      <img
        src={`/avatars/${slug}.png`}
        alt={name}
        className="w-12 h-12 object-contain"
        onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
      />
      <div className="font-bold text-gray-900">{name}</div>
    </Link>
  );
}

function ServiceCard({ title }) {
  const [border, setBorder] = useState("#e5e7eb");
  return (
    <div
      onMouseEnter={() =>
        setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
      }
      onMouseLeave={() => setBorder("#e5e7eb")}
      className={CARD_CLASS}
      style={{ borderColor: border }}
    >
      <span className="font-semibold text-gray-900">{title}</span>
    </div>
  );
}

// جابجایی نوبتی + با کلیک؛ وضعیت در localStorage می‌ماند
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW);   // پر (Filled)
  const [secondary, setSecondary] = useState(TEAL); // خطی (Outlined)

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
    } catch {
      /* no-op */
    }
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

export default function Home() {
  const EQUIPMENT = [
    { name: "Dell EMC", slug: "dell", href: "/products/dell" },
    { name: "Cisco", slug: "cisco", href: "/products/cisco" },
    { name: "HPE", slug: "hpe", href: "/products/hpe" },
    { name: "Lenovo", slug: "lenovo", href: "/products/lenovo" },
  ];

  const SOLUTIONS = [
    { name: "Commvault", slug: "commvault", href: "/solutions/commvault" },
    { name: "NetBackup", slug: "netbackup", href: "/solutions/netbackup" },
  ];

  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary.toLowerCase() === YELLOW;

  return (
    <main className="min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، کنار شماییم.</p>

            {/* دکمه‌ها: یکی پر با primary و یکی خطی با secondary */}
            <div className="mt-6 flex gap-3">
              {/* ارائه مشاوره — Filled */}
              <a
                href="/contact"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-bold transition"
                style={{
                  backgroundColor: primary,
                  color: primaryIsYellow ? "#000" : "#fff",
                }}
              >
                ارائه مشاوره
              </a>

              {/* مشاهده ابزارها — Outlined */}
              <a
                href="/tools"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-semibold transition"
                style={{
                  border: `1px solid ${secondary}`,
                  color: secondary,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${secondary}1A`; // ~10% opacity
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                مشاهده ابزارها
              </a>
            </div>
          </div>

          {/* آواتار */}
          <div className="flex justify-center">
            <img
              src="/satrass-hero.png"
              alt="آواتار ساتراس"
              className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-10 border-t border-black/10">
        <h2 className="text-2xl font-bold mb-6">تجهیزات</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {EQUIPMENT.map((b) => (
            <BrandCard key={b.slug} name={b.name} slug={b.slug} href={b.href} />
          ))}
        </div>
      </section>

      {/* راهکارها + خدمات */}
      <section id="solutions" className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold mb-6">راهکارها</h2>

        {/* وندورها */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((b) => (
            <BrandCard key={b.slug} name={b.name} slug={b.slug} href={b.href} />
          ))}
        </div>

        {/* خدمات زیر راهکارها */}
        <h3 className="text-xl font-bold mb-4">خدمات</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {SERVICES.map((s, i) => (
            <ServiceCard key={i} title={s.title} />
          ))}
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p>© {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است</p>
        </div>
      </footer>
    </main>
  );
}