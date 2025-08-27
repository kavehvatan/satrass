// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import vendors from "../data/vendors";
import services from "../data/services.json";

// رنگ‌ها
const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const BRAND_COLORS = ["#00E5FF", "#2D5BFF"];
const LOGO_COLORS = [TEAL, YELLOW];
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

// دکمه‌های هیرو با جابجایی رنگ
function useAlternatingBrandPair() {
  const [primary, setPrimary] = useState(YELLOW);
  const [secondary, setSecondary] = useState(TEAL);
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

// کارت تجهیزات
function BrandCard({ title, slug, href, index, logo }) {
  const [border, setBorder] = useState("#e5e7eb");
  const link = href || `/products/${slug || (title || "").toLowerCase()}`;
  const base = logo
    ? logo.replace(/^\/?avatars\//, "").replace(/\.(png|webp)$/i, "")
    : (slug || (title || "")).toLowerCase();

  const webp = `/avatars/${base}.webp`;
  const png = `/avatars/${base}.png`;
  const artWebp = `/brand-art/${base}.webp`;
  const artPng = `/brand-art/${base}.png`;

  return (
    <Link href={link} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur-xl p-5 transition hover:-translate-y-0.5 hover:shadow-xl"
        style={{ borderColor: border, borderWidth: 1 }}
        onMouseEnter={() =>
          setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
        }
        onMouseLeave={() => setBorder("#e5e7eb")}
      >
        {/* بک‌گراند برند */}
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={artWebp} type="image/webp" />
          <img
            src={artPng}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-[1.12] opacity-[.35]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        {/* هایلایت رنگی */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${colorOf(index)}33 0%, transparent 60%)`,
          }}
        />

        {/* لوگو سمت چپ */}
        <div className="relative flex items-center ltr:justify-start rtl:justify-end">
          <div className="w-14 h-14 rounded-xl bg-white ring-1 ring-black/5 shadow-sm grid place-items-center overflow-hidden">
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

// کارت خدمات (لینک به صفحه خودش)
function ServiceCard({ title, icon, index = 0, href }) {
  const isTeal = index % 2 === 0;
  const bg = isTeal ? "rgba(20,184,166,0.7)" : "rgba(244,194,31,0.7)";
  const fg = isTeal ? "#fff" : "#000";

  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-3 p-5 rounded-lg transition text-center w-full max-w-[520px] mx-auto h-[120px] cursor-pointer select-none hover:shadow-md"
      style={{ background: bg, color: fg }}
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
    </Link>
  );
}

// کارت راهکارها
function SolutionCard({ name, slug, p1, p2, p3 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 bg-white border rounded-lg text-center w-full max-w-[520px] mx-auto h-[120px] hover:shadow-md transition">
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

const SOLUTIONS = [
  {
    name: "Commvault",
    slug: "commvault",
    p1: "راهکار یکپارچه حفاظت از داده برای VM/DB/Files/SaaS/Cloud.",
    p2: "Hyperscale X و Metallic SaaS؛ گزارش‌گیری و خودکارسازی کامل.",
    p3: "سناریوها: M365/Endpoint، بکاپ ترکیبی، RTO/RPO سخت‌گیرانه.",
  },
  {
    name: "NetBackup",
    slug: "netbackup",
    p1: "پلتفرم بکاپ سازمانی با پوشش کامل مجازی‌سازی/دیتابیس.",
    p2: "اپلاینس‌های Flex/52xx؛ مدیریت متمرکز و RBAC.",
    p3: "سناریوها: VMware، Oracle، Tape/Cloud، بازیابی سطح فایل.",
  },
  {
    name: "Veeam",
    slug: "veeam",
    p1: "راهکار محبوب بکاپ‌گیری مخصوص محیط‌های مجازی و Cloud.",
    p2: "پشتیبانی از VMware/Hyper-V، Microsoft 365 و Kubernetes.",
    p3: "امکان بازیابی سریع، مانیتورینگ و اتوماسیون انعطاف‌پذیر.",
  },
];

export default function Home() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;
  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const serviceItems = Array.isArray(services?.items) ? services.items : [];

  return (
    <main className="min-h-screen font-sans">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#000,#0a0a0a_60%,#111)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، درکنار شما.</p>
            <div className="mt-6 flex gap-3">
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
              <a
                href="/tools"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-semibold transition"
                style={{
                  border: `1px solid ${secondary}`,
                  color: secondary,
                }}
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
      <section id="vendors" className="py-12 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-extrabold mb-6">تجهیزات</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeVendors.map((v, i) => (
            <BrandCard key={v.slug || i} {...v} index={i} />
          ))}
        </div>
      </section>

      {/* محافظت از داده */}
      <section id="solutions" className="max-w-6xl mx-auto px-4 pb-10 text-center">
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mb-6"></div>
        <h2 className="text-2xl font-bold mb-6">محافظت از داده</h2>
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mb-10"></div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} {...s} />
          ))}
        </div>
      </section>

      {/* خدمات */}
      <section id="services" className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-xl font-bold mb-4">خدمات</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {serviceItems.map((s, i) => (
            <ServiceCard
              key={s.slug || i}
              title={s.title}
              icon={s.icon}
              index={i}
              href={s.href || `/services/${s.slug}`}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6">
        <p>© {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است</p>
      </footer>
    </main>
  );
}