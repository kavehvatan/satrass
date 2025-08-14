// pages/index.js
import Link from "next/link";
import { useState, useEffect } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const LOGO_COLORS = [TEAL, YELLOW];

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

// توضیحات ۲ پاراگرافی برای هر خدمت
const SERVICES = [
  {
    title: "نصب و راه‌اندازی",
    desc1:
      "اجرای استاندارد از پیش‌نیازها تا استیجینگ؛ کابل‌کشی، کانفیگ اولیه، ارتقای Firmware و هم‌ترازی با Best Practice هر برند. چک‌لیست تحویل، تست کارکرد و مستندسازی کامل.",
    desc2:
      "در صورت نیاز مهاجرت بدون وقفه انجام می‌شود (Cutover برنامه‌ریزی‌شده) و در پایان، پذیرش فنی (UAT) و تحویل رسمی پروژه انجام می‌گردد.",
  },
  {
    title: "پایش",
    desc1:
      "طراحی مانیتورینگ با آستانه‌های درست، داشبورد و هشدارهای عملیاتی. گزارش‌گیری دوره‌ای برای SLA، ظرفیت‌سنجی و تحلیل عملکرد.",
    desc2:
      "بازبینی سلامت، ارزیابی ریسک و پیشنهادهای بهینه‌سازی منظم تا زیرساخت همیشه در نقطهٔ امن و پایدار باقی بماند.",
  },
  {
    title: "آموزش",
    desc1:
      "انتقال دانش مبتنی بر سناریوهای واقعی: از اصول راهبری تا تِریبل‌شوتینگ. محتوای آموزشی اختصاصی برای تیم شما به همراه Lab/Runbook.",
    desc2:
      "پس از دوره، پشتیبانی پرسش‌وپاسخ و به‌روزرسانی جزوات را داریم تا دانش در تیم پایدار بماند.",
  },
  {
    title: "مشاوره و طراحی",
    desc1:
      "نیازسنجی دقیق، اندازه‌گذاری ظرفیت، High Availability و Disaster Recovery. انتخاب راهکار با توجه به هزینه کل مالکیت (TCO) و رشد آتی.",
    desc2:
      "طرح نهایی شامل دیاگرام، BOM و نقشهٔ مهاجرت است؛ چند گزینهٔ فنی/مالی ارائه می‌شود تا تصمیم‌گیری شفاف باشد.",
  },
  {
    title: "راهبری",
    desc1:
      "خدمت مدیریت‌شده (Managed Service): پچینگ، بکاپ‌وریفای، هاردنینگ، بررسی لاگ‌ها و رسیدگی به رخدادها طبق SLA.",
    desc2:
      "گزارش ماهانه سلامت، ظرفیت و ریسک‌ها + نشست مرور تغییرات (CAB) برای برنامه‌ریزی مطمئن و قابل پیش‌بینی.",
  },
];

const CARD_CLASS =
  "flex flex-col items-center justify-center gap-3 p-5 bg-white border rounded-lg " +
  "hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px]";

// ====== دکمه‌های هیرو: جابه‌جایی نوبتی + با کلیک (persist با localStorage)
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

// ====== کارت برندها
function BrandCard({ name, slug, href }) {
  const [border, setBorder] = useState("#e5e7eb");
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

// ====== کارت خدمات + پنل شیشه‌ای روی hover/click
function ServiceCard({ title, desc1, desc2 }) {
  const [border, setBorder] = useState("#e5e7eb");
  const [open, setOpen] = useState(false);
  const [accent, setAccent] = useState(TEAL);

  const handleEnter = () => {
    setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)]);
    const a = LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
    setAccent(a);
    setOpen(true);
  };
  const handleLeave = () => setOpen(false);
  const toggle = () => {
    const a = LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];
    setAccent(a);
    setOpen((v) => !v);
  };

  const other = accent === TEAL ? YELLOW : TEAL;

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        onClick={toggle}
        className={CARD_CLASS + " cursor-pointer select-none"}
        style={{ borderColor: border }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900">{title}</span>
      </div>

      {/* پنل شیشه‌ای */}
      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-20
                     rounded-xl border shadow-2xl bg-white/35 backdrop-blur-md
                     w-[min(92vw,560px)]"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={handleLeave}
        >
          {/* لهجه رنگی (گرادینت بار باریک بالا) */}
          <div
            className="h-1.5 w-full rounded-t-xl"
            style={{
              background: `linear-gradient(90deg, ${accent} 0%, ${other} 100%)`,
            }}
          />
          <div className="relative p-5">
            {/* حاشیه و هاله رنگی نرم */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: `inset 0 0 0 1px ${accent}40, 0 16px 40px -12px ${accent}44`,
              }}
            />
            <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-gray-800 leading-7">{desc1}</p>
            <p className="text-gray-700 leading-7 mt-3">{desc2}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
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
                  e.currentTarget.style.backgroundColor = `${secondary}1A`;
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((b) => (
            <BrandCard key={b.slug} name={b.name} slug={b.slug} href={b.href} />
          ))}
        </div>

        <h3 className="text-xl font-bold mb-4">خدمات</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {SERVICES.map((s, i) => (
            <ServiceCard key={i} title={s.title} desc1={s.desc1} desc2={s.desc2} />
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