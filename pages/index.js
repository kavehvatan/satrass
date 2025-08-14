// pages/index.js
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ——— رنگ‌های برند ساتراس (سبز تِیل + زرد) ——— */
const BRAND = {
  teal: "#00a89a",
  yellow: "#f8b923",
};

/* ——— مودال شیشه‌ای (شفاف + خوانا) ——— */
function GlassModal({ open, onClose, title, paragraphs }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* پس‌زمینه نیمه‌تیره برای تمرکز */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      {/* باکس شیشه‌ای شفاف */}
      <article
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[min(92vw,760px)] mx-auto rounded-2xl overflow-hidden transform transition-all duration-200 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl bg-white/40 supports-[backdrop-filter]:bg-white/35 backdrop-blur-2xl ring-1 ring-white/25 shadow-[0_20px_60px_-15px_rgba(0,0,0,.45)]">
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

            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`leading-8 ${
                  i === 0 ? "mt-4" : "mt-3"
                } text-gray-900/95 drop-shadow-[0_1px_1px_rgba(255,255,255,.55)]`}
              >
                {p}
              </p>
            ))}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-black/10 bg-white/30 hover:bg-white/45 transition"
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

/* ——— داده‌های خدمات و راهکارها ——— */
const SERVICES = [
  {
    title: "نصب و راه‌اندازی",
    paragraphs: [
      "پیاده‌سازی استاندارد و اصولی تجهیزات دیتاسنتر (سرورها، استوریج‌ها، سوییچ‌ها) با بهترین پرکتیس‌ها برای اطمینان از کارایی و دسترس‌پذیری.",
      "مستندسازی، تحویل پیکربندی و انتقال دانش به تیم بهره‌بردار انجام می‌شود تا نگهداری آینده با کیفیت ادامه پیدا کند.",
    ],
  },
  {
    title: "پایش و نگهداری",
    paragraphs: [
      "راه‌اندازی مانیتورینگ سلامت، ظرفیت و عملکرد با داشبوردهای کاربردی و آستانه‌های هشداردهی.",
      "بازبینی دوره‌ای و تِیونینگ برای جلوگیری از گلوگاه‌ها و افزایش عمر مفید تجهیزات.",
    ],
  },
  {
    title: "آموزش تخصصی",
    paragraphs: [
      "برگزاری دوره‌های آموزشی کاربردی متناسب با تجهیزات و سناریوهای سازمان شما.",
      "رویکرد کاملاً عملیاتی است تا تیم داخلی سریع‌تر به خودکفایی برسد.",
    ],
  },
  {
    title: "مشاوره و طراحی",
    paragraphs: [
      "تحلیل نیاز، ظرفیت‌سنجی و طراحی راهکار با تمرکز روی قابلیت توسعه، امنیت و TCO مناسب.",
      "تهیه BoM و نقشه راه اجرایی با درنظر گرفتن محدودیت‌های زمانی/مالی پروژه.",
    ],
  },
  {
    title: "راهبری",
    paragraphs: [
      "ارائه سرویس‌های Managed برای به‌روزرسانی، پشتیبان‌گیری، Troubleshoot و بهینه‌سازی مستمر.",
      "SLA شفاف، گزارش‌های دوره‌ای و پاسخ‌گویی مستقیم کارشناسان ساتراس.",
    ],
  },
];

const SOLUTIONS = [
  {
    title: "پشتیبان‌گیری و بازیابی",
    paragraphs: [
      "طراحی و پیاده‌سازی راهکارهای بکاپ (On-Prem/Cloud) با Commvault، NetBackup و … شامل نگهداری نسخه‌ها، ایزوله‌سازی و Replication.",
      "تعریف RPO/RTO واقع‌بینانه، تست‌های بازیابی منظم و خودکارسازی Job ها برای اطمینان در بحران.",
    ],
  },
  {
    title: "مجازی‌سازی و VDI",
    paragraphs: [
      "طراحی زیرساخت VMware/Hyper-V با ذخیره‌ساز بهینه و شبکه پایدار برای بارکاری‌های ترکیبی.",
      "VDI ایمن و مقیاس‌پذیر برای تجربه کاربری روان و مدیریت متمرکز دسکتاپ‌ها.",
    ],
  },
  {
    title: "امنیت شبکه و دسترسی",
    paragraphs: [
      "فایروال، سگمنتیشن و کنترل دسترسی مبتنی بر نقش برای کاهش سطح حمله و افزایش دید.",
      "اتصال امن شعب/کاربران راه دور با سیاست‌های قابل مانیتورینگ و گزارش‌گیری.",
    ],
  },
];

/* ——— برندهای «تجهیزات» ——— */
const VENDORS = [
  { slug: "dell", name: "Dell EMC" },
  { slug: "hpe", name: "HPE" },
  { slug: "lenovo", name: "Lenovo" },
  { slug: "cisco", name: "Cisco" },
  { slug: "juniper", name: "Juniper" },
  { slug: "oracle", name: "Oracle" },
  { slug: "fujitsu", name: "Fujitsu" },
  { slug: "quantum", name: "Quantum" },
];

/* ——— دکمه‌های هِرو با تعویض رنگ ——— */
function HeroButtons() {
  const [primary, setPrimary] = useState("teal"); // teal یا yellow
  const main = primary === "teal" ? BRAND.teal : BRAND.yellow;
  const alt = primary === "teal" ? BRAND.yellow : BRAND.teal;

  const swap = () => setPrimary((p) => (p === "teal" ? "yellow" : "teal"));

  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      {/* ابزارها (پررنگ) */}
      <Link
        href="/tools"
        onClick={swap}
        className="px-6 py-3 rounded-2xl font-semibold transition shadow-sm"
        style={{
          backgroundColor: main,
          color: "#0b0f14",
          boxShadow: `0 8px 20px -10px ${main}AA`,
        }}
      >
        ابزارها
      </Link>

      {/* ارائه مشاوره (آوت‌لاین) */}
      <Link
        href="/contact"
        onClick={swap}
        className="px-6 py-3 rounded-2xl font-semibold transition border"
        style={{
          borderColor: alt,
          color: alt,
        }}
      >
        ارائه مشاوره
      </Link>
    </div>
  );
}

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", paragraphs: [] });

  const open = (entry) => {
    setModalContent(entry);
    setOpenModal(true);
  };

  return (
    <main dir="rtl" className="text-right font-sans">
      {/* ——— Hero ——— */}
      <section className="bg-[#0b0f14] text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* متن */}
            <div className="w-full md:w-7/12">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-snug">
                زیرساخت هوشمند، با دقت مهندسی
              </h1>
              <p className="mt-4 text-gray-300 leading-8">
                از مشاوره کنار شما تا پشتیبانی پایدار. طراحی، پیاده‌سازی و راهبری دیتاسنتر و شبکه با
                تمرکز بر کارایی، امنیت و دسترس‌پذیری.
              </p>
              <HeroButtons />
            </div>

            {/* تصویر آواتار (LCP بهینه) */}
            <div className="w-full md:w-5/12 flex justify-center md:justify-end">
              <Image
                src="/satrass-hero.webp" // یا /satrass-hero.svg یا /satrass-hero.png
                alt="آواتار ساتراس"
                width={400}
                height={400}
                priority
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 340px, 400px"
                className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— تجهیزات ——— */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">تجهیزات</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {VENDORS.map((v) => (
            <Link
              key={v.slug}
              href={`/products/${v.slug}`}
              className="rounded-2xl border border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition p-6 flex items-center justify-between"
            >
              <span className="font-bold text-lg text-slate-900">{v.name}</span>
              <span className="text-slate-400 text-sm">{v.slug.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ——— خدمات ——— */}
      <section className="container mx-auto px-4 py-10 md:py-14">
        <h3 className="text-xl md:text-2xl font-extrabold mb-5">خدمات</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <button
              key={s.title}
              onClick={() => open(s)}
              className="text-right rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{s.title}</span>
                <span className="text-slate-400">جزئیات</span>
              </div>
              <p className="mt-3 text-slate-600 line-clamp-2">
                {s.paragraphs[0]}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ——— راهکارها ——— */}
      <section className="container mx-auto px-4 pb-16">
        <h3 className="text-xl md:text-2xl font-extrabold mb-5">راهکارها</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((s) => (
            <button
              key={s.title}
              onClick={() => open(s)}
              className="text-right rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{s.title}</span>
                <span className="text-slate-400">جزئیات</span>
              </div>
              <p className="mt-3 text-slate-600 line-clamp-2">
                {s.paragraphs[0]}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* مودال مشترک خدمات/راهکارها */}
      <GlassModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalContent.title}
        paragraphs={modalContent.paragraphs || []}
      />
    </main>
  );
}