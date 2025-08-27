// pages/index.js
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import vendors from "../data/vendors";            // داده‌های تجهیزات
import services from "../data/services.json";     // داده‌های خدمات (با آیکون و توضیحات)

/* ===================== SectionTitle =====================
 * تیتر سکشن با آیکون و خط تزئینی
 * آیکون از /public/icons/sections/*.webp خوانده می‌شود:
 *    equipment -> vendors.webp
 *    solutions -> solutions.webp
 *    services  -> services.webp
 * اگر لود نشد، SVG داخلی نمایش داده می‌شود.
 * ======================================================= */
function SectionTitle({ as: Tag = "h2", icon = "equipment", className = "", children }) {
  const map = { equipment: "vendors", solutions: "solutions", services: "services" };
  const src = `/icons/sections/${map[icon] || icon}.webp`;

  // اگر تصویر لود نشد، فقط SVG را نشان بده
  const [useFallback, setUseFallback] = useState(false);

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
      default: // equipment
        return (
          <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
            <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5A2 2 0 0 1 3 8V5zm0 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3zm3-8h3v2H6V6zm0 9h3v2H6v-2zm10-9h2v2h-2V6zm0 9h2v2h-2v-2z"/>
          </svg>
        );
    }
  };

 function SectionTitle({ as: Tag = "h2", icon, children }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* خط سمت راست */}
      <span className="flex-1 h-px bg-gradient-to-r from-yellow-200 via-teal-200 to-transparent" />

      {/* تیتر */}
      <Tag className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
        {icon && (
          <img
            src={`/icons/${icon}.webp`}
            alt=""
            className="w-6 h-6 object-contain inline-block"
          />
        )}
        {children}
      </Tag>

      {/* خط سمت چپ */}
      <span className="flex-1 h-px bg-gradient-to-l from-teal-200 via-yellow-200 to-transparent" />
    </div>
  );
}
// --- رنگ‌ها و کمک‌تابع‌ها
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const LOGO_COLORS = [TEAL, YELLOW];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

// --- دکمه‌های هیرو با جابجایی نوبتی رنگ‌ها
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW);   // Filled
  const [secondary, setSecondary] = useState(TEAL); // Outlined
  useEffect(() => {
    try {
      const lastIsTeal = localStorage.getItem("satrass_btn_pair") === "1";
      const nextIsTeal = !lastIsTeal;
      localStorage.setItem("satrass_btn_pair", nextIsTeal ? "1" : "0");
      if (nextIsTeal) { setPrimary(TEAL); setSecondary(YELLOW); }
      else { setPrimary(YELLOW); setSecondary(TEAL); }
    } catch {}
  }, []);
  const swap = () => {
    setPrimary((p) => {
      const np = p === TEAL ? YELLOW : TEAL;
      setSecondary(np === TEAL ? YELLOW : TEAL);
      try { localStorage.setItem("satrass_btn_pair", np === TEAL ? "1" : "0"); } catch {}
      return np;
    });
  };
  return { primary, secondary, swap };
}

// --- مودال شیشه‌ای
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

// --- کارت برند «تجهیزات» (لوگو سمت چپ کارت)
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
          backdrop-blur-xl
          p-5 transition duration-200
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

        {/* لوگو — سمت چپ فیزیکی */}
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

// --- کارت «خدمات» با پس‌زمینهٔ ۷۰٪ از دو رنگ برند + توضیحات در مودال
// قبلی ServiceCard را با این نسخه جایگزین کن
function ServiceCard({ title, icon, index = 0, href }) {
  const isTeal = index % 2 === 0;
  const bg = isTeal ? "rgba(20,184,166,0.7)" : "rgba(244,194,31,0.7)"; // 70%
  const fg = isTeal ? "#fff" : "#000";
  const to = href || "#";

  return (
    <Link href={to} className="group block w-full max-w-[520px] mx-auto">
      <div
        className="flex flex-col items-center justify-center gap-3 p-5 border rounded-lg hover:shadow-md transition text-center h-[120px] cursor-pointer select-none"
        style={{ borderColor: "#e5e7eb", background: bg, color: fg }}
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
// --- راهکارها
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
    p2: "تمرکز اصلی روی Backup & Replication سریع، انعطاف‌پذیر و مطمئن با امکان Instant Recovery و حفاظت از ماشین‌های مجازی، دیتابیس‌ها و سرویس‌های ابری مثل M365.",
    p3: "ویژگی‌ها: Dedup/Compression، پشتیبانی از چندین پلتفرم، و قابلیت Disaster Recovery آسان.",
  },
];

// --- کارت راهکار
function SolutionCard({ name, slug, p1, p2, p3 }) {
  const [border, setBorder] = useState("#e5e7eb");
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 p-5 bg-white border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: border }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <img
          src={`/avatars/${slug}.webp`}
          onError={(e) => (e.currentTarget.src = `/avatars/${slug}.png`)}
          alt={name}
          className="w-12 h-12 object-contain"
        />
        <div className="font-bold text-gray-900">{name}</div>
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={name}
        paragraphs={[p1, p2, p3]}
      />
    </>
  );
}

// --- صفحه
export default function Home() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const serviceItems = Array.isArray(services?.items) ? services.items : [];

  return (
    <main className="min-h-screen font-sans">
      {/* Hero (بنر مشکی بالا) */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند     
دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، درکنار شما.</p>
            <div className="mt-6 flex gap-3">
              {/* ارائه مشاوره — Filled */}
              <a
                href="/contact"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-bold transition"
                style={{ backgroundColor: primary, color: primaryIsYellow ? "#000" : "#fff" }}
              >
                ارائه مشاوره
              </a>
              {/* مشاهده ابزارها — Outlined */}
              <a
                href="/tools"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-semibold transition"
                style={{ border: `1px solid ${secondary}`, color: secondary, backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${secondary}1A`)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                مشاهده ابزارها
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/satrass-hero.webp" alt="آواتار ساتراس" className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section id="vendors" className="relative py-12 max-w-6xl mx-auto px-4">
        <SectionTitle as="h2" icon="equipment">تجهیزات</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeVendors.map((v, i) => (
            <BrandCard key={v.href || v.slug || v.title || i} title={v.title} slug={v.slug} href={v.href} index={i} logo={v.logo} />
          ))}
        </div>
      </section>

      {/* راهکارها + خدمات */}
      <section id="solutions" className="max-w-6xl mx-auto px-4 pb-10">
        <SectionTitle as="h2" icon="solutions">محافظت از داده</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((s) => (<SolutionCard key={s.slug} {...s} />))}
        </div>

    {/* بخش خدمات در صفحه اصلی */}
<SectionTitle as="h3" icon="services" className="mb-4">خدمات</SectionTitle>
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
  {serviceItems.map((s, i) => (
    <ServiceCard
      key={s.href || s.slug || s.title || i}
      title={s.title}
      icon={s.icon}                     // مثل /icons/services/install.webp
      index={i}
      href={s.href || `/services/${s.slug}`}  // ← این خط مهم است
    />
  ))}
</div>
      </section>

      {/* Footer + Sitemap (وسط‌چین) */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center text-center sm:text-right">
            <div>
  <h4 className="font-bold mb-3">میان‌بُر</h4>
  <ul className="space-y-3 text-white/80">
    <li><a href="#vendors" className="hover:text-white">تجهیزات</a></li>
    <li><a href="/tools" className="hover:text-white">ابزارها</a></li>
    <li><a href="#solutions" className="hover:text-white">محافظت از داده</a></li>
  </ul>
</div>
<div>
  <h4 className="font-bold mb-3">خدمات</h4>
  <ul className="space-y-3 text-white/80">
    <li><a href="/services/install" className="hover:text-white">نصب و راه‌اندازی</a></li>
    <li><a href="/services/monitoring" className="hover:text-white">پایش</a></li>
    <li><a href="/services/training" className="hover:text-white">آموزش</a></li>
    <li><a href="/services/consulting-design" className="hover:text-white">مشاوره و طراحی</a></li>
    <li><a href="/services/operations" className="hover:text-white">راهبری</a></li>
  </ul>
</div>
<div>
  <h4 className="font-bold mb-3">صفحات</h4>
  <ul className="space-y-3 text-white/80">
    <li><a href="/contact" className="hover:text-white">تماس با ما</a></li>
    <li><a href="/about" className="hover:text-white">درباره ما</a></li>
    <li><a href="/warranty" className="hover:text-white">استعلام گارانتی</a></li>
    <li><a href="/news" className="hover:text-white">تازه‌ها <span className="text-white/60">(اخبار و مقالات)</span></a></li>
  </ul>
</div>
          </div>

          <hr className="border-white/10 my-6" />
          <p className="text-center text-white/80 text-sm">
            © {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است
          </p>
        </div>
      </footer>
    </main>
  );
}