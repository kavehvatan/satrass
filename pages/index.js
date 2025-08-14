// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const LOGO_COLORS = [TEAL, YELLOW];

// ——— تجهیزات
const EQUIPMENT = [
  { name: "Dell EMC", slug: "dell", href: "/products/dell" },
  { name: "Cisco", slug: "cisco", href: "/products/cisco" },
  { name: "HPE", slug: "hpe", href: "/products/hpe" },
  { name: "Lenovo", slug: "lenovo", href: "/products/lenovo" },
  { name: "Quantum", slug: "quantum", href: "/products/quantum" },
  { name: "Juniper", slug: "juniper", href: "/products/juniper" },
  { name: "Oracle", slug: "oracle", href: "/products/oracle" },
  { name: "Fujitsu", slug: "fujitsu", href: "/products/fujitsu" },
];

// ——— راهکارها (مودال خنثی)
const SOLUTIONS = [
  {
    name: "Commvault",
    slug: "commvault",
    p1: "کام‌والت راهکار یکپارچهٔ حفاظت از داده است که پشتیبانی گسترده‌ای از بارکاری‌ها (VM، دیتابیس، فایل‌سرور، SaaS و کلود) دارد. Deduplication کارآمد، Policyهای انعطاف‌پذیر و Cloud Tiering باعث کاهش هزینهٔ ذخیره‌سازی و کوتاه‌شدن زمان بازیابی می‌شود.",
    p2: "با Hyperscale X می‌توان حفاظت را به‌صورت Scale-out اجرا کرد و با Metallic سرویس‌های بکاپ را به‌صورت SaaS دریافت نمود. گزارش‌گیری جامع، خودکارسازی فرایندها، و رصد سلامت، تیم IT را از کارهای دستی رها می‌کند.",
    p3: "سناریوهای متداول: محافظت سراسری Microsoft 365 و Endpointها، بکاپ ترکیبی On-prem/Cloud، و بازیابی سریع برای RTO/RPOهای سخت‌گیرانه.",
  },
  {
    name: "NetBackup",
    slug: "netbackup",
    p1: "نت‌بکاپ از قدیمی‌ترین و قابل‌اعتمادترین پلتفرم‌های بکاپ سازمانی است. تمرکز آن روی کارایی، مقیاس‌پذیری و پوشش عمیق برای مجازی‌سازی و دیتابیس‌هاست. با Inline Dedup و شتاب‌دهی انتقال، پنجرهٔ بکاپ کوچک می‌شود.",
    p2: "اپلاینس‌های سری 52xx و Flex زیرساخت آماده برای استقرار سریع ارائه می‌کنند؛ مدیریت متمرکز، نقش‌ها/مجوزها، و گزارش‌گیری دقیق، نگهداری روزمره را ساده می‌کند.",
    p3: "سناریوهای متداول: حفاظت از VMware/Hyper-V، دیتابیس‌های Oracle/SQL، آرشیو بلندمدت روی نوار یا کلود، و بازیابی انتخابی در سطح فایل/آبجکت.",
  },
];

// ——— خدمات (با slug برای مسیر صفحهٔ جدا)
const SERVICES = [
  { slug: "install",           title: "نصب و راه‌اندازی" },
  { slug: "monitoring",        title: "پایش" },
  { slug: "training",          title: "آموزش" },
  { slug: "consulting-design", title: "مشاوره و طراحی" },
  { slug: "operations",        title: "راهبری" },
];

// ——— دکمه‌های هیرو (دوحالته مثل قبل)
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

// ——— کارت برند
function BrandCard({ name, slug, href }) {
  const [border, setBorder] = useState("#e5e7eb");
  return (
    <Link
      href={href}
      onMouseEnter={() => setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])}
      onMouseLeave={() => setBorder("#e5e7eb")}
      className="flex flex-col items-center justify-center gap-3 p-5 bg-white border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px]"
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

// ——— مودال شیشه‌ای خنثی (برای راهکارها)
function GlassModal({ open, onClose, title, paragraphs }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);
  const handleClose = () => { setClosing(true); setTimeout(() => { setClosing(false); onClose?.(); }, 200); };
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={handleClose} />
      <article
        role="dialog" aria-modal="true"
        className={`relative z-10 w-[min(92vw,760px)] mx-auto rounded-2xl overflow-hidden transform transition-all duration-200 ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl border border-black/10 bg-white/85 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,.5)]">
          <div className="p-6 md:p-8 text-gray-900">
            <div className="flex items-start justify-between gap-6">
              <h4 className="text-xl md:text-2xl font-extrabold">{title}</h4>
              <button onClick={handleClose} aria-label="بستن" className="text-gray-700 hover:text-black transition text-2xl leading-none">×</button>
            </div>
            {paragraphs.map((tx, i) => (
              <p key={i} className={`leading-8 ${i === 0 ? "mt-4" : "mt-3"} text-gray-800`}>{tx}</p>
            ))}
            <div className="mt-6 flex justify-end">
              <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/[0.03] transition">
                بستن
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// ——— کارت خدمت (الان لینک میره به صفحهٔ جدا)
function ServiceCard({ slug, title }) {
  const [border, setBorder] = useState("#e5e7eb");
  return (
    <Link
      href={`/services/${slug}`}
      onMouseEnter={() => setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])}
      onMouseLeave={() => setBorder("#e5e7eb")}
      className="flex flex-col items-center justify-center gap-2 p-5 bg-white border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px]"
      style={{ borderColor: border }}
    >
      <span className="font-semibold text-gray-900">{title}</span>
      <span className="text-xs text-gray-500">جزئیات، Specsheet و عکس</span>
    </Link>
  );
}

// ——— کارت راهکار (مودال خنثی)
function SolutionCard({ name, slug, p1, p2, p3 }) {
  const [border, setBorder] = useState("#e5e7eb");
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onMouseEnter={() => setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])}
        onMouseLeave={() => setBorder("#e5e7eb")}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 p-5 bg-white border rounded-lg hover:shadow-md transition text-center w-full max-w-[520px] mx-auto h-[120px] cursor-pointer select-none"
        style={{ borderColor: border }}
        role="button" tabIndex={0} aria-haspopup="dialog" aria-expanded={open}
      >
        <img
          src={`/avatars/${slug}.png`}
          alt={name}
          className="w-12 h-12 object-contain"
          onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
        />
        <div className="font-bold text-gray-900">{name}</div>
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={`${name} — راهکارها`}
        paragraphs={[p1, p2, p3]}
      />
    </>
  );
}

export default function Home() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

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

          {/* آواتار هِرو */}
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
            <BrandCard key={b.slug} {...b} />
          ))}
        </div>
      </section>

      {/* راهکارها + خدمات */}
      <section id="solutions" className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold mb-6">راهکارها</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} {...s} />
          ))}
        </div>

        <h3 className="text-xl font-bold mb-4">خدمات</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {SERVICES.map((s) => (
            <ServiceCard key={s.slug} {...s} />
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