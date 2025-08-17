// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// فایل JSON محتوا
import solutionsData from "../data/solutions.json";

// اگر Header / ContactHero داری همین‌ها را نگه دار
import Header from "../components/Header";
import ContactHero from "../components/ContactHero";

/* ------------------------- دکمه‌های یکتای پروژه ------------------------- */
function PrimaryBtn({ href, children, className = "" }) {
  // استایل مشابه هدر/خانه (فیروزه‌ای)
  return (
    <Link
      href={href}
      prefetch={false}
      className={`inline-flex items-center rounded-2xl px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white transition ${className}`}
    >
      {children}
    </Link>
  );
}

function OutlineBtn({ href, children, className = "" }) {
  // استایل outline با قاب طلایی، مثل دکمه‌های صفحه‌ی اول
  return (
    <Link
      href={href}
      prefetch={false}
      className={`inline-flex items-center rounded-2xl px-5 py-3 border-2 border-amber-400 text-amber-400 hover:bg-amber-50/10 transition ${className}`}
    >
      {children}
    </Link>
  );
}

/* ------------------------------- مودال شیشه‌ای ------------------------------- */
function GlassModal({ open, onClose, title, paragraphs = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-3xl rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            aria-label="بستن"
            onClick={onClose}
            className="rounded-lg px-3 py-1 bg-white/20 hover:bg-white/30 transition"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 leading-8 text-slate-100">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryBtn href="/contact#contact">درخواست مشاوره</PrimaryBtn>
          <OutlineBtn href="/tools">مشاهده ابزارها</OutlineBtn>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- کارت کلیک‌پذیر ------------------------------- */
function ClickableInfoCard({ title, logo = "", paragraphs = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        onClick={() => setOpen(true)}
        className="w-full max-w-[420px] cursor-pointer select-none rounded-3xl border border-white/15 bg-white/5 shadow-sm backdrop-blur-lg
                   hover:shadow-lg transition p-5"
      >
        <div className="flex items-center gap-4">
          {logo ? (
            // از <img> استفاده می‌کنیم؛ در next.config تصاویر Unoptimized است.
            <img
              src={logo}
              alt={title}
              className="w-12 h-12 object-contain"
              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-700/60" />
          )}
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-200">
          <div className="line-clamp-3">
            {/* خلاصه‌ی کوتاه از پاراگراف اول برای نمایش در کارت */}
            {paragraphs?.[0] || "برای مشاهده جزئیات کلیک کنید."}
          </div>
        </div>

        <div className="mt-4 text-left">
          <OutlineBtn href="#" className="pointer-events-none">
            بیشتر
          </OutlineBtn>
        </div>
      </div>

      <GlassModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        paragraphs={paragraphs}
      />
    </>
  );
}

/* -------------------------------- صفحه اصلی -------------------------------- */
export default function HomePage() {
  const { solutions = [], services = [] } = solutionsData || {};

  return (
    <>
      <Head>
        <title>ساتراس | زیرساخت هوشمند با دقت مهندسی</title>
        <meta
          name="description"
          content="ساتراس: طراحی و پیاده‌سازی زیرساخت، پشتیبانی، و راهکارهای بکاپ/بازیابی با دقت مهندسی."
        />
      </Head>

      <Header />

      {/* سکشن هیرو/تماس (اگر داری) */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <ContactHero />
          <div className="mt-6 flex gap-3">
            <PrimaryBtn href="/contact#contact">ارائه مشاوره</PrimaryBtn>
            <OutlineBtn href="/tools">مشاهده ابزارها</OutlineBtn>
          </div>
        </div>
      </section>

      {/* راهکارها */}
      <section className="py-12 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            راهکارها
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {solutions.map((item) => (
              <ClickableInfoCard
                key={item.title}
                title={item.title}
                logo={item.logo}
                paragraphs={item.paragraphs}
              />
            ))}
          </div>
        </div>
      </section>

      {/* خدمات و نرم‌افزارها */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            خدمات و نرم‌افزارها
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {services.map((item) => (
              <ClickableInfoCard
                key={item.title}
                title={item.title}
                logo={item.logo}
                paragraphs={item.paragraphs}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}