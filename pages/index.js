// pages/index.js
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import vendors from "../data/vendors";
import services from "../data/services.json";

/* ===== رنگ‌ها و کمک‌ها ===== */
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const LOGO_COLORS = [TEAL, YELLOW];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

/* ===== ابزار اسکرول ساده ===== */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* ===== SectionTitle ===== */
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

/* ===== تایپ‌نویس عنوان ===== */
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

/* ===== محوِ محتوای هیرو با اسکرول ===== */
function useHeroFade(max = 320) {
  const y = useScrollY();
  const ratio = Math.max(0, Math.min(1, 1 - y / max));
  const opacity = ratio;
  const translateY = (1 - ratio) * -12;
  return { opacity, transform: `translateY(${translateY}px)` };
}

/* ===== کارت‌ها ===== */
function BrandCard({ title, slug, href, index, logo }) {
  const [border, setBorder] = useState("#e5e7eb");
  const link = href || `/products/${slug || (title || "").toLowerCase()}`;
  const base =
    logo
      ? logo.replace(/^\/?avatars\//, "").replace(/\.(png|webp)$/i, "")
      : (slug || (title || "")).toLowerCase();

  const webp = `/avatars/${base}.webp`;
  const png = `/avatars/${base}.png`;
  const artWebp = `/brand-art/${base}.webp`;
  const artPng = `/brand-art/${base}.png`;

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
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={artWebp} type="image/webp" />
          <img
            src={artPng}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-[1.12] opacity-[.35] contrast-115 saturate-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${colorOf(index)}33 0%, transparent 60%)`,
          }}
        />

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

function ServiceCard({ title, icon, index = 0, href }) {
  const [border, setBorder] = useState("#e5e7eb");
  const bg = "rgba(20,184,166,0.6)";
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
    p2: "تمرکز روی Backup & Replication سریع و مطمئن با Instant Recovery و حفاظت از VM/DB و M365.",
    p3: "ویژگی‌ها: Dedup/Compression، پشتیبانی از چندین پلتفرم، و DR ساده.",
  },
];

function SolutionCard({ name, slug, p1, p2, p3 }) {
  const [border, setBorder] = useState("#e5e7eb");
  const [open, setOpen] = useState(false);
  const bg = "rgba(244,194,31,0.6)";
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

/* ===== صفحه اصلی ===== */
export default function Home() {
  const scrollY = useScrollY();
  const heroStyle = useHeroFade(320);

  const heroRef = useRef(null);
  const vendorsRef = useRef(null);

  // محاسبه‌ی فاز رنگی و مقدار جابجایی پارالاکس بر اساس ارتفاع هیرو
  const [phase, setPhase] = useState(0);
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    const heroH = heroRef.current ? heroRef.current.offsetHeight : 0;

    // پارالاکس: فقط تا ارتفاع هیرو حرکت کند (احساس «آمدن پشت تجهیزات»)
    const t = Math.min(Math.max(scrollY * 0.45, 0), heroH);
    setTranslate(t);

    // تغییر رنگ: 0 → 1 → 2 در بازه‌های مختلف هیرو
    if (scrollY < heroH * 0.35) setPhase(0);
    else if (scrollY < heroH * 0.8) setPhase(1);
    else setPhase(2);
  }, [scrollY]);

  // CTAهای هیرو
  const [isConsultFilled, setIsConsultFilled] = useState(() => {
    try { return (localStorage.getItem("cta_swap") || "consult") === "consult"; }
    catch { return true; }
  });
  const filledColor = isConsultFilled ? YELLOW : TEAL;
  const outlinedColor = isConsultFilled ? TEAL : YELLOW;
  const flipCtas = () => {
    setIsConsultFilled(v => {
      const nv = !v;
      try { localStorage.setItem("cta_swap", nv ? "consult" : "tools"); } catch {}
      return nv;
    });
  };

  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const serviceItems = Array.isArray(services?.items) ? services.items : [];

  // تم‌های گرادینت
  const themes = [
    "from-[#0a0a0a] via-[#101010] to-[#171717]", // مشکی شروع
    "from-[#0b1220] via-[#0e1a2b] to-[#122033]", // آبی تیره میانی
    "from-[#071b18] via-[#0a2421] to-[#0d2c29]", // سبز تیره؛ زیر «تجهیزات»
  ];

  return (
    <main className="min-h-screen font-sans relative z-0">
      {/* HERO با پس‌زمینه‌ی پارالاکس محدود */}
      <section
        ref={heroRef}
        className="relative text-white min-h-[420px] md:min-h-[520px] flex items-center overflow-hidden"
      >
        {/* لایه‌ی پارالاکس داخل سکشن */}
        <div
          className="absolute inset-0 -z-10 will-change-transform"
          style={{ transform: `translateY(${translate}px)` }}
          aria-hidden="true"
        >
          <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-[900ms] ${themes[phase]}`} />
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(255,255,255,.06),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_0%_100%,rgba(0,0,0,.12),transparent_60%)]" />
        </div>

        {/* محتوای هیرو */}
        <div
          className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10"
          style={heroStyle}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <AnimatedHeadline phrases={["زیرساخت هوشمند", "دقت مهندسی"]} typeSpeed={140} holdTime={1700} />
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، در کنار شما.</p>

            <div className="mt-6 flex gap-3">
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
      <section id="vendors" ref={vendorsRef} className="relative py-12 max-w-6xl mx-auto px-4">
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

      {/* محافظت از داده + خدمات */}
      <section id="solutions" className="max-w-6xl mx-auto px-4 pb-10">
        <SectionTitle as="h2" icon="solutions">محافظت از داده</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} {...s} />
          ))}
        </div>

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

      {/* Footer داخل صفحه خانه */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <h4 className="font-bold mb-3">میان‌بُر</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#vendors" className="hover:text-white">تجهیزات</a></li>
                <li><a href="/tools" className="hover:text-white">ابزارها</a></li>
                <li><a href="#solutions" className="hover:text-white">خدمات و راهکارها</a></li>
              </ul>
            </div>

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