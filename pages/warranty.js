// pages/index.js
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

/* رنگ‌های برند (زرد و سبزِ ساتراس) */
const BRAND = {
  yellow: "bg-brand-yellow text-black border-brand-yellow",
  yellowOutline:
    "border-2 border-brand-yellow/90 text-brand-yellow hover:bg-brand-yellow hover:text-black",
  teal: "bg-brand-teal text-white border-brand-teal",
  tealOutline:
    "border-2 border-brand-teal/80 text-brand-teal hover:bg-brand-teal hover:text-white",
};

/* کلیدهای هیرو: هر بار صفحه رفرش بشه یکی‌شون زرد و اون یکی سبز می‌شه.
   روی کلیک هم جابه‌جا می‌شن (برای حال و هوای داینامیک ولی بدون چشمک‌زدن). */
function useAltBrand() {
  const [alt, setAlt] = useState(false);
  useEffect(() => {
    setAlt(Math.random() > 0.5);
  }, []);
  const toggle = () => setAlt((p) => !p);
  return { alt, toggle };
}

/* مودال شیشه‌ای برای «راهکارها» */
function GlassModal({ open, onClose, title, body, tone = "yellow" }) {
  if (!open) return null;
  const toneBg =
    tone === "yellow"
      ? "bg-brand-yellow/10 ring-brand-yellow/30"
      : "bg-brand-teal/10 ring-brand-teal/30";
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`mx-auto mt-24 w-[92%] max-w-2xl rounded-2xl ${toneBg} ring-1 shadow-xl backdrop-blur-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full px-3 py-1 text-sm text-gray-600 hover:bg-black/10"
            >
              بستن
            </button>
          </div>
          <div className="mt-4 leading-7 text-gray-800/90">{body}</div>
        </div>
      </div>
    </div>
  );
}

/* داده‌های تجهیزات (برندها) — لوگوها را در public/avatars بگذار */
const EQUIP_VENDORS = [
  { title: "Dell EMC", slug: "dell", logo: "/avatars/dell.png" },
  { title: "Cisco", slug: "cisco", logo: "/avatars/cisco.png" },
  { title: "HPE", slug: "hpe", logo: "/avatars/hpe.png" },
  { title: "Lenovo", slug: "lenovo", logo: "/avatars/lenovo.png" },
  { title: "Juniper", slug: "juniper", logo: "/avatars/juniper.png" },
  { title: "Oracle", slug: "oracle", logo: "/avatars/oracle.png" },
  { title: "Fujitsu", slug: "fujitsu", logo: "/avatars/fujitsu.png" },
  { title: "Quantum", slug: "quantum", logo: "/avatars/quantum.png" },
];

/* داده‌های راهکارها (با متن‌های نمایشی برای مودال) */
const SOLUTIONS = [
  {
    key: "commvault",
    title: "Commvault",
    tone: "teal",
    body: (
      <>
        <p>
          راهکارهای Commvault برای بک‌آپ، ریکاوری و حفاظت از داده‌ها در مقیاس
          سازمانی استفاده می‌شوند. تمرکز بر اتوماسیون، سیاست‌گذاری و نگهداشت
          طولانی مدت داده‌هاست.
        </p>
        <p className="mt-3">
          در پیاده‌سازی، روی طراحی سیاست‌های بک‌آپ، زمان‌بندی، کاهش زمان
          ریکاوری (RTO/RPO) و یکپارچگی با پلتفرم‌های مجازی/ابری تمرکز می‌کنیم.
        </p>
      </>
    ),
  },
  {
    key: "netbackup",
    title: "NetBackup",
    tone: "yellow",
    body: (
      <>
        <p>
          Veritas NetBackup یکی از قدیمی‌ترین و پرقدرت‌ترین سوئیت‌های پشتیبان‌گیری
          و بازیابی در دیتاسنترهاست. از بارهای کاری فیزیکی، مجازی و ابری پشتیبانی
          می‌کند.
        </p>
        <p className="mt-3">
          هدف ما طراحی ساده، مانیتورینگ شفاف و پیاده‌سازی سیاست‌های نگهداشت و
          تکثیر نسخه‌هاست تا در لحظات بحرانی، ریکاوری سریع و مطمئن داشته باشید.
        </p>
      </>
    ),
  },
];

export default function Home() {
  const { alt, toggle } = useAltBrand();
  const [openModal, setOpenModal] = useState(null); // key یا null

  // کلاس‌های کلیدها بر اساس حالت
  const primaryBtn = alt ? BRAND.yellow : BRAND.teal;
  const secondaryBtn = alt ? BRAND.tealOutline : BRAND.yellowOutline;

  return (
    <>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          {/* متن */}
          <div>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">
              از مشاوره تا اجرا، پشتیبانی کنار شماییم.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className={`rounded-full px-7 py-3 text-base font-semibold transition ${primaryBtn}`}
                onClick={toggle}
              >
                ارائه مشاوره
              </Link>

              <Link
                href="/tools"
                className={`rounded-full px-7 py-3 text-base font-semibold transition ${secondaryBtn}`}
                onClick={toggle}
              >
                مشاهده ابزارها
              </Link>
            </div>
          </div>

          {/* آواتار */}
          <div className="mx-auto w-full max-w-sm">
            <Image
              src="/satrass-hero.png"
              alt="آواتار ساتراس"
              width={700}
              height={700}
              className="h-auto w-full select-none"
              priority
            />
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section id="products" className="container mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-extrabold">تجهیزات</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {EQUIP_VENDORS.map((v) => (
            <Link
              key={v.slug}
              href={`/products/${v.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">{v.title}</div>
                {!!v.logo && (
                  <Image
                    src={v.logo}
                    alt={v.title}
                    width={64}
                    height={28}
                    className="h-7 w-auto opacity-90 group-hover:opacity-100"
                  />
                )}
              </div>
              <div className="pointer-events-none mt-12 text-sm text-gray-500">
                ورود
                <span className="mr-1 inline-block align-middle">›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* راهکارها */}
      <section id="solutions" className="container mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-extrabold">راهکارها</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setOpenModal(s.key)}
              className="rounded-2xl border border-gray-200 bg-white/70 p-5 text-right shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-gray-900">{s.title}</div>
                <div className="text-sm text-gray-500">جزئیات</div>
              </div>
              <p className="mt-2 line-clamp-2 text-gray-600">
                برای مشاهده توضیحات بیشتر کلیک کنید.
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* مودال‌های راهکارها */}
      {SOLUTIONS.map((s) => (
        <GlassModal
          key={s.key}
          open={openModal === s.key}
          onClose={() => setOpenModal(null)}
          title={s.title}
          tone={s.tone}
          body={s.body}
        />
      ))}
    </>
  );
}