// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Section from "../components/Section";
import GlassModal from "../components/GlassModal";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";
const LOGO_COLORS = [TEAL, YELLOW];

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

function ServiceCard({ title, desc1, desc2 }) {
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
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900">{title}</span>
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        variant="neutral"
        paragraphs={[desc1, desc2]}
      />
    </>
  );
}

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
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
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
        variant="neutral" // الان خنثی؛ اگر بخوای رنگی شه: variant="tint" accent="#14b8a6"
        paragraphs={[p1, p2, p3]}
      />
    </>
  );
}

export default function Home() {
  const { primary, secondary, swap } = useAlternatingBrandPair();
  const primaryIsYellow = primary === YELLOW;

  return (
    <Layout title="Satrass — زیرساخت هوشمند">
      {/* Hero */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، کنار شماییم.</p>
            <div className="mt-6 flex gap-3">
              <a
                href="/contact"
                onClick={swap}
                className="rounded-full px-5 py-2.5 font-bold transition"
                style={{ backgroundColor: primary, color: primaryIsYellow ? "#000" : "#fff" }}
              >
                ارائه مشاوره
              </a>
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
            <img
              src="/satrass-hero.png"
              alt="آواتار ساتراس"
              className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <Section id="products" title="تجهیزات" className="py-10 border-t border-black/10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {EQUIPMENT.map((b) => (
            <BrandCard key={b.slug} {...b} />
          ))}
        </div>
      </Section>

      {/* راهکارها */}
      <Section id="solutions" title="راهکارها" className="pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-10">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.slug} {...s} />
          ))}
        </div>

        <h3 className="text-xl font-bold mb-4">خدمات</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {SERVICES.map((s, i) => (
            <ServiceCard key={i} {...s} />
          ))}
        </div>
      </Section>
    </Layout>
  );
}