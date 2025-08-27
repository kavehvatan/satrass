// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";

import vendors from "../data/vendors";          // داده‌های تجهیزات
import services from "../data/services.json";   // داده‌های خدمات

// رنگ‌ها
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const LOGO_COLORS = [TEAL, YELLOW];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

// جابجایی نوبتی رنگ دکمه‌های هیرو
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

/** تیتر بخش با خط بالا/پایین و آیکون (از /public/icons/<name>.webp) */
function SectionTitle({ as: Tag = "h2", icon, children }) {
  return (
    <div className="mb-8">
      {/* خط بالا */}
      <span
        aria-hidden="true"
        className="block h-px w-full bg-gradient-to-r from-transparent via-teal-200 to-transparent"
      />
      {/* تیتر + آیکون */}
      <div className="flex items-center justify-center gap-2 py-3">
        {icon && (
          <img
            src={`/icons/${icon}.webp`}
            alt=""
            className="w-6 h-6 object-contain"
          />
        )}
        <Tag className="text-2xl font-extrabold tracking-tight text-slate-900">
          {children}
        </Tag>
      </div>
      {/* خط پایین */}
      <span
        aria-hidden="true"
        className="block h-px w-full bg-gradient-to-r from-transparent via-yellow-200 to-transparent"
      />
    </div>
  );
}

/** کارت برند «تجهیزات»: پس‌زمینه‌ی هنری + لوگوی سفیدِ کوچک سمت چپ */
function BrandCard({ title, slug, href, index, logo }) {
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
          p-4 transition duration-200
          hover:-translate-y-0.5 hover:shadow-xl
        "
        /* بدون مرز/باکس؛ پس‌زمینه فقط تصویر برند */
      >
        {/* تصویر پس‌زمینه برند */}
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={artWebp} type="image/webp" />
          <img
            src={artPng}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[.35] contrast-115 saturate-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        {/* هایلایت رنگی لطیف */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${colorOf(index)}33 0%, transparent 60%)`,
          }}
        />

        {/* لوگو — سمت چپ فیزیکی (در RTL=چپ) */}
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

/** کارت «خدمات»: پس‌زمینه‌ی ۷۰٪ رنگی + لینک به صفحه‌ی خودش */
function ServiceCard({ title, icon, index = 0, href }) {
  const isTeal = index % 2 === 0;
  const bg = isTeal ? "rgba(20,184,166,0.7)" : "rgba(244,194,31,0.7)"; // 70%
  const fg = isTeal ? "#fff" : "#000";

  return (
    <Link href={href || "#"} className="w-full max-w-[520px]">
      <div
        className="flex flex-col items-center justify-center gap-3 p-5 rounded-lg hover:shadow-md transition text-center mx-auto h-[120px] select-none"
        style={{ background: bg, color: fg }}
      >
        {icon ? (
          <img
            src={icon}
            onError={(e)=>{ e.currentTarget.style.display="none"; }}
            alt=""
            className="w-10 h-10 object-contain"
          />
        ) : null}
        <span className="font-semibold" style={{ color: fg }}>{title}</span>
      </div>
    </Link>
  );
}

/** کارت «محافظت از داده» (قبلاً راهکارها) */
const SOLUTIONS = [
  {
    name: "Veeam",
    slug: "veeam",
    p1: "پلتفرم انعطاف‌پذیر برای بکاپ و ریکاوری سریع در محیط‌های فیزیکی، مجازی و کلود.",
    p2: "مانیتورینگ و گزارش‌گیری قوی، حفاظت از M365/Endpoint و قابلیت‌های Instant Recovery.",
    p3: "سناریوها: VMware/Hyper-V، NAS، M365، Disaster Recovery و محافظت ترکیبی On-prem/Cloud.",
  },
  {
    name: "NetBackup",
    slug: "netbackup",
    p1: "پلتفرم بکاپ سازمانی با پوشش عمیق مجازی‌سازی/دیتابیس و Inline Dedup برای پنجرهٔ بکاپ کوچک.",
    p2: "اپلاینس‌های سری 52xx/Flex، مدیریت متمرکز، RBAC و گزارش‌گیری دقیق.",
    p3: "سناریوها: VMware/Hyper-V، Oracle/SQL، آرشیو نوار/کلود، بازیابی انتخابی سطح فایل.",
  },
  {
    name: "Commvault",
    slug: "commvault",
    p1: "راهکار یکپارچهٔ حفاظت از داده برای VM/DB/Files/SaaS/Cloud با Dedup و Policyهای منعطف.",
    p2: "Hyperscale X برای Scale-out و Metallic به‌صورت SaaS؛ گزارش‌گیری و خودکارسازی کامل.",
    p3: "سناریوهای متداول: M365/Endpoint، بکاپ ترکیبی On-prem/Cloud، RTO/RPO سخت‌گیرانه.",
  },
];

function SolutionCard({ name, slug }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px] select-none"
    >
      <img
        src={`/avatars/${slug}.webp`}
        onError={(e) => (e.currentTarget.src = `/avatars/${slug}.png`)}
        alt={name}
        className="w-12 h-12 object-contain"
      />
      <div className="font-bold text-gray-900">{name}</div>
    </div>
  );
}

/* ----------------------- صفحه اصلی ----------------------- */
export default function Home() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const serviceItems = Array.isArray(services?.items) ? services.items : [];

  return (
    <main className="min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، در کنار شما.</p>
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = `${secondary}1A`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
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
        <SectionTitle as="h2" icon="vendors">تجهیزات</SectionTitle>

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

      {/* محافظت از داده (راهکارها) */}
      <section id="solutions" className="max-w-6xl mx-auto px-4 pb-10">
        <SectionTitle as="h2" icon="solutions">محافظت از داده</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} {...s} />
          ))}
        </div>

        {/* خدمات */}
        <SectionTitle as="h3" icon="services">خدمات</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {serviceItems.map((s, i) => (
            <ServiceCard
              key={s.href || s.slug || s.title || i}
              title={s.title}
              icon={s.icon}                          // /icons/services/*.webp
              index={i}
              href={s.href || (s.slug ? `/services/${s.slug}` : "#")}
            />
          ))}
        </div>
      </section>
    </main>
  );
}