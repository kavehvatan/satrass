// pages/index.js
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import vendors from "../data/vendors";          // کارت‌های «تجهیزات»
import services from "../data/services.json";   // آیتم‌های «خدمات و راهکارها»

/* ===================== رنگ‌ها و کمک‌ها ===================== */
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const LOGO_COLORS = [TEAL, YELLOW];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

/* ===================== تیتر سکشن با آیکون ===================== */
function SectionTitle({ as: Tag = "h2", icon = "equipment", className = "", children }) {
  const [useFallback, setUseFallback] = useState(false);
  const map = { equipment: "vendors", solutions: "solutions", services: "services" };
  const src = `/icons/sections/${map[icon] || icon}.webp`;

  const FallbackIcon = ({ className = "" }) => {
    switch (icon) {
      case "solutions":
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M10 3a2 2 0 1 1 4 0h3a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2h-3a2 2 0 1 0-4 0H7a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V5a2 2 0 0 1 2-2h3z"/>
          </svg>
        );
      case "services":
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M21 14.35V19a2 2 0 0 1-2 2h-4.65a4.5 4.5 0 1 0-4.7 0H5a2 2 0 0 1-2-2v-4.65a4.5 4.5 0 1 0 0-4.7V5a2 2 0 0 1 2-2h4.65a4.5 4.5 0 1 0 4.7 0H19a2 2 0 0 1 2 2v4.65a4.5 4.5 0 1 0 0 4.7zM12 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM3 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm12 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0z"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5A2 2 0 0 1 3 8V5zm0 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3zm3-8h3v2H6V6zm0 9h3v2H6v-2zm10-9h2v2h-2V6zm0 9h2v2h-2v-2z"/>
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`} dir="rtl">
      <span className="inline-flex items-center justify-center w-6 h-6">
        {useFallback ? (
          <FallbackIcon className="w-5 h-5" />
        ) : (
          <img
            src={src}
            alt=""
            className="w-5 h-5"
            aria-hidden="true"
            onError={() => setUseFallback(true)}
          />
        )}
      </span>

      <Tag className="text-2xl font-extrabold tracking-tight text-slate-900">
        {children}
      </Tag>
      <span className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
    </div>
  );
}

/* ===================== مودال شیشه‌ای (برای راهکارها) ===================== */
function GlassModal({ open, onClose, title, paragraphs }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 200);
  };

  if (!open) return null;
  const paras = (paragraphs || []).filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <article
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[min(92vw,760px)] mx-auto rounded-2xl overflow-hidden transform transition-all duration-200 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl bg-white/45 supports-[backdrop-filter]:bg-white/40 backdrop-blur-2xl ring-1 ring-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,.45)]">
          <div className="p-6 md:p-8 text-gray-900">
            <div className="flex items-start justify-between gap-6">
              <h4 className="text-xl md:text-2xl font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,.6)]">
                {title}
              </h4>
              <button
                onClick={handleClose}
                aria-label="بستن"
                className="text-gray-800 hover:text-black transition text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {paras.map((tx, i) => (
              <p
                key={i}
                className={`leading-8 ${i === 0 ? "mt-4" : "mt-3"} text-gray-900/95 drop-shadow-[0_1px_1px_rgba(255,255,255,.55)]`}
              >
                {tx}
              </p>
            ))}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-black/10 bg-white/30 hover:bg-white/40 transition"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ===================== کارت برند (تجهیزات) ===================== */
function BrandCard({ title, slug, href, index, logo }) {
  const [border, setBorder] = useState("#e5e7eb");
  const link = href || `/products/${slug || (title || "").toLowerCase()}`;
  const base =
    logo
      ? logo.replace(/^\/?avatars\//, "").replace(/\.(png|webp)$/i, "")
      : (slug || (title || "")).toLowerCase();

  const webp = `/avatars/${base}.webp`;
  const png  = `/avatars/${base}.png`;
  const artWebp = `/brand-art/${base}.webp`;
  const artPng  = `/brand-art/${base}.png`;

  return (
    <Link href={link} className="group block">
      <div
        className="
          relative overflow-hidden rounded-2xl
          border bg-white/70 supports-[backdrop-filter]:bg-white/35
          backdrop-blur-xl p-5 transition duration-200
          hover:-translate-y-0.5 hover:shadow-xl
        "
        style={{ borderColor: border, borderWidth: 1 }}
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
      >
        {/* پس‌زمینه کارت برند */}
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={artWebp} type="image/webp" />
          <img
            src={artPng}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-[1.12] opacity-[.35] md:opacity-[.35] contrast-115 saturate-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        {/* هایلایت رنگی آرام */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${colorOf(index)}33 0%, transparent 60%)`,
          }}
        />

        {/* لوگو */}
        <div className="relative flex items-center ltr:justify-start rtl:justify-end">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-white ring-1 ring-black/5 shadow-sm grid place-items-center transition-transform duration-200 group-hover:scale-[1.03] overflow-hidden">
            <picture>
              <source srcSet={webp} type="image/webp" />
              <img
                src={png}
                alt={title}
                width={56}
                height={56}
                className="w-10 h-10 object-contain"
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
            </picture>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ===================== کارت خدمات (Teal) ===================== */
function ServiceCard({ title, icon, index = 0, href }) {
  const [border, setBorder] = useState("#e5e7eb");
  const bg = "rgba(20,184,166,0.6)"; // TEAL
  const fg = "#fff";

  return (
    <Link href={href} className="w-full max-w-[520px]">
      <div
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
        className="flex flex-col items-center justify-center gap-3 p-5 border rounded-lg hover:shadow-md transition text-center w-full mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: border, background: bg, color: fg }}
      >
        {icon ? (
          <img
            src={icon}
            alt=""
            className="w-10 h-10 object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : null}
        <span className="font-semibold" style={{ color: fg }}>
          {title}
        </span>
      </div>
    </Link>
  );
}

/* ===================== کارت راهکار (زرد) + مودال ===================== */
function SolutionCard({ name, slug, p1, p2, p3 }) {
  const [border, setBorder] = useState("#e5e7eb");
  const [open, setOpen] = useState(false);
  const bg = "rgba(244,194,31,0.6)"; // YELLOW
  const fg = "#000";

  return (
    <>
      <div
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
        onClick={() => setOpen(true)}
        className="group flex flex-col items-center justify-center gap-4 p-5 border rounded-2xl hover:shadow-lg transition text-center w-full max-w-[520px] mx-auto h-[140px] cursor-pointer select-none"
        style={{ borderColor: border, background: bg, color: fg }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <img
          src={`/avatars/${slug}.webp`}
          onError={(e) => (e.currentTarget.src = `/avatars/${slug}.png`)}
          alt={name}
          className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,.18)] transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-0.5"
          style={{ transform: "translateZ(0)" }}
        />
      </div>

      <GlassModal open={open} onClose={() => setOpen(false)} title={name} paragraphs={[p1, p2, p3]} />
    </>
  );
}

/* ===================== Banner پشت سکشن «محافظت از داده» ===================== */
function SolutionsBanner() {
  return (
    <div
      className="
        pointer-events-none absolute inset-x-0
        -top-4 md:-top-6
        h-[420px] md:h-[460px]
        -z-10
      "
      aria-hidden="true"
    >
      <div
        className="
          h-full rounded-[28px]
          bg-gradient-to-b from-[#F6F8FB] to-transparent
          ring-1 ring-black/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,.25)]
          overflow-hidden
        "
      >
        <div className="absolute inset-0 bg-white/30 supports-[backdrop-filter]:bg-white/20 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_35%_at_100%_0%,rgba(255,255,255,.20),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_0%_100%,rgba(0,0,0,.06),transparent_60%)]" />
      </div>
    </div>
  );
}

/* ===================== داده‌های «محافظت از داده» ===================== */
const SOLUTIONS = [
  {
    name: "Commvault",
    slug: "commvault",
    p1: "راهکار یکپارچهٔ حفاظت از داده برای VM/DB/Files/SaaS/Cloud با Dedup و Policyهای منعطف.",
    p2: "Hyperscale X برای Scale-out و Metallic به‌صورت SaaS؛ گزارش‌گیری و خودکارسازی کامل.",
    p3: "سناریوهای متداول: M365/Endpoint، بکاپ ترکیبی On-prem/Cloud، RTO/RPO سخت‌گیرانه.",
  },
  {
    name: "NetBackup",
    slug: "netbackup",
    p1: "پلتفرم بکاپ سازمانی با پوشش عمیق مجازی‌سازی/دیتابیس و Inline Dedup برای پنجرهٔ بکاپ کوچک.",
    p2: "اپلاینس‌های سری 52xx/Flex، مدیریت متمرکز، RBAC و گزارش‌گیری دقیق.",
    p3: "سناریوها: VMware/Hyper-V، Oracle/SQL، آرشیو نوار/کلود، بازیابی انتخابی سطح فایل.",
  },
  {
    name: "Veeam",
    slug: "Veeam",
    p1: "راهکار قدرتمند بکاپ و ریکاوری برای محیط‌های مجازی، فیزیکی و کلود.",
    p2: "تمرکز بر Backup & Replication سریع و مطمئن با Instant Recovery و حفاظت از VM/DB و M365.",
    p3: "ویژگی‌ها: Dedup/Compression، پشتیبانی از چندین پلتفرم، و DR ساده.",
  },
];

/* ===================== هدلاین تایپی هیرو ===================== */
function AnimatedHeadline({
  phrases = ["زیرساخت هوشمند", "دقت مهندسی"],
  typeSpeed = 140,
  holdTime = 1700,
}) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");

  useEffect(() => {
    let t;
    const target = phrases[idx];
    if (shown.length < target.length) {
      t = setTimeout(() => setShown(target.slice(0, shown.length + 1)), typeSpeed);
    } else {
      t = setTimeout(() => {
        setShown("");
        setIdx((i) => (i + 1) % phrases.length);
      }, holdTime);
    }
    return () => clearTimeout(t);
  }, [shown, idx, phrases, typeSpeed, holdTime]);

  return (
    <span className="inline-block">
      {shown}
      <span className="inline-block w-[0.6ch] animate-pulse">|</span>
    </span>
  );
}

/* ===================== صفحه اصلی ===================== */
export default function Home() {
  // دکمه‌های هیرو: یک Filled و یک Outlined (با جابجایی هنگام کلیک)
  const [isConsultFilled, setIsConsultFilled] = useState(() => {
    try {
      return (localStorage.getItem("cta_swap") || "consult") === "consult";
    } catch {
      return true;
    }
  });
  const filledColor   = isConsultFilled ? YELLOW : TEAL;
  const outlinedColor = isConsultFilled ? TEAL   : YELLOW;
  const flipCtas = () => {
    setIsConsultFilled((v) => {
      const nv = !v;
      try { localStorage.setItem("cta_swap", nv ? "consult" : "tools"); } catch {}
      return nv;
    });
  };

  const safeVendors = Array.isArray(vendors) ? vendors : [];

  // خدمات و راهکارها: از JSON اگر بود؛ وگرنه fallback کامل
  const jsonItems = Array.isArray(services?.items) ? services.items : [];
  const fallbackServices = [
    { title: "نصب و راه‌اندازی",  slug: "install",              icon: "/icons/services/install.webp",           href: "/services/install" },
    { title: "پایش",              slug: "monitoring",           icon: "/icons/services/monitoring.webp",        href: "/services/monitoring" },
    { title: "آموزش",             slug: "training",             icon: "/icons/services/training.webp",          href: "/services/training" },
    { title: "مشاوره و طراحی",    slug: "consulting-design",    icon: "/icons/services/consulting-design.webp", href: "/services/consulting-design" },
    { title: "راهبری",            slug: "operations",           icon: "/icons/services/operations.webp",        href: "/services/operations" },
    { title: "دسکتاپ مجازی",      slug: "virtual-desktop",      icon: "/icons/services/virtual-desktop.webp",   href: "/services/virtual-desktop" },
    { title: "رایانش کاربر نهایی",slug: "euc",                  icon: "/icons/services/euc.webp",               href: "/services/euc" },
    { title: "مجازی‌سازی و ابر",  slug: "virtualization-cloud", icon: "/icons/services/virtualization.webp",    href: "/services/virtualization-cloud" },
    { title: "تداوم کسب‌وکار",    slug: "business-continuity",  icon: "/icons/services/bc.webp",                href: "/services/business-continuity" },
    { title: "هوش مصنوعی",        slug: "ai",                   icon: "/icons/services/ai.webp",                href: "/services/ai" },
  ];
  const serviceItems = jsonItems.length ? jsonItems : fallbackServices;

  return (
    <main className="min-h-screen font-sans">
      {/* Hero (بنر مشکی بالا) */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <AnimatedHeadline phrases={["زیرساخت هوشمند", "دقت مهندسی"]} />
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، در کنار شما.</p>

            <div className="mt-6 flex gap-3">
              {/* ارائه مشاوره — Filled */}
              <a
                href="/contact"
                onClick={flipCtas}
                className="rounded-full px-5 py-2.5 font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400"
                style={{
                  backgroundColor: filledColor,
                  color: filledColor === YELLOW ? "#000" : "#fff",
                  border: "1px solid transparent",
                }}
              >
                ارائه مشاوره
              </a>

              {/* مشاهده ابزارها — Outlined */}
              <a
                href="/tools"
                onClick={flipCtas}
                className="rounded-full px-5 py-2.5 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                style={{
                  border: `1px solid ${outlinedColor}`,
                  color: outlinedColor,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${outlinedColor}1A`)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                مشاهده ابزارها
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="/satrass-hero.webp"
              alt="آواتار ساتراس"
              className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section id="vendors" className="relative py-12 max-w-6xl mx-auto px-4">
        <SectionTitle as="h2" icon="equipment">تجهیزات</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeVendors.map((v, i) => (
            <BrandCard
              key={v.href || v.slug || v.title || i}
              title={v.title}
              slug={v.slug}
              href={v.href}
              index={i}
              logo={v.logo}
            />
          ))}
        </div>
      </section>

      {/* محافظت از داده */}
      <section id="solutions" className="relative max-w-6xl mx-auto px-4 pb-10">
        {/* فقط این سکشن بنر دارد */}
        <SolutionsBanner />

        <SectionTitle as="h2" icon="solutions">محافظت از داده</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} {...s} />
          ))}
        </div>

        {/* خدمات و راهکارها (کامل) */}
        <SectionTitle as="h3" icon="services" className="mb-4">
          خدمات و راهکارها
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {serviceItems.map((s, i) => (
            <ServiceCard
              key={s.href || s.slug || s.title || i}
              title={s.title}
              icon={s.icon}
              index={i}
              href={s.href || `/services/${s.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Footer داخل صفحه‌ی خانه */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* میان‌بُر */}
            <div>
              <h4 className="font-bold mb-3">میان‌بُر</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#vendors" className="hover:text-white">تجهیزات</a></li>
                <li><a href="/tools" className="hover:text-white">ابزارها</a></li>
                <li><a href="#solutions" className="hover:text-white">خدمات و راهکارها</a></li>
              </ul>
            </div>

            {/* خدمات و راهکارها */}
            <div>
              <h4 className="font-bold mb-3">خدمات و راهکارها</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="/services/install" className="hover:text-white">نصب و راه‌اندازی</a></li>
                <li><a href="/services/monitoring" className="hover:text-white">پایش</a></li>
                <li><a href="/services/training" className="hover:text-white">آموزش</a></li>
                <li><a href="/services/consulting-design" className="hover:text-white">مشاوره و طراحی</a></li>
                <li><a href="/services/operations" className="hover:text-white">راهبری</a></li>
              </ul>
            </div>

            {/* صفحات */}
            <div>
              <h4 className="font-bold mb-3">صفحات</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="/contact" className="hover:text-white">تماس با ما</a></li>
                <li><a href="/about" className="hover:text-white">درباره ما</a></li>
                <li><a href="/warranty" className="hover:text-white">استعلام گارانتی</a></li>
                <li>
                  <a href="/news" className="hover:text-white">
                    تازه‌ها <span className="text-white/60">(اخبار و مقالات)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-white/10" />

          <p className="text-center text-white/80 text-sm">
            © {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است
          </p>
        </div>
      </footer>
    </main>
  );
}