// pages/index.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

/* رنگ‌های برند برای فالبک‌ها */
const BRAND_TEAL  = "#14b8a6";
const BRAND_AMBER = "#f4c21f";

/* -------------------- Vendors (Equipment) -------------------- */
const VENDORS = [
  {
    name: "Dell EMC",
    slug: "dell",
    logo: "/avatars/dell.png",
    cover:"/covers/dell.webp",
    href: "/products/dell"
  },
  {
    name: "Cisco",
    slug: "cisco",
    logo: "/avatars/cisco.png",
    cover:"/covers/cisco.webp",
    href: "/products/cisco"
  },
  {
    name: "HPE",
    slug: "hpe",
    logo: "/avatars/hpe.png",
    cover:"/covers/hpe.webp",
    href: "/products/hpe"
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    logo: "/avatars/lenovo.png",
    cover:"/covers/lenovo.webp",
    href: "/products/lenovo"
  },
  {
    name: "Quantum",
    slug: "quantum",
    logo: "/avatars/quantum.png",
    cover:"/covers/quantum.webp",
    href: "/products/quantum"
  },
  {
    name: "Juniper",
    slug: "juniper",
    logo: "/avatars/juniper.png",
    cover:"/covers/juniper.webp",
    href: "/products/juniper"
  },
];

/* -------------------- Services (Hand-drawn Cards) -------------------- */
const SERVICES = [
  {
    id: "install",
    title: "نصب و راه‌اندازی",
    desc:
      "پیاده‌سازی، تنظیم و تحویل زیرساخت با بهترین پرکتیس، مستندسازی و آموزش انتقال دانش.",
    icon: "/illustrations/services/install.webp",
    href: "/services/install"
  },
  {
    id: "monitor",
    title: "پایش",
    desc:
      "طراحی و پیاده‌سازی مانیتورینگ رویدادها و ظرفیت، آلارمینگ هوشمند، داشبوردهای مدیریتی.",
    icon: "/illustrations/services/monitor.webp",
    href: "/services/monitor"
  },
  {
    id: "training",
    title: "آموزش",
    desc: "برگزاری ورکشاپ و دوره‌های کاربردی برای تیم‌های عملیات و توسعه.",
    icon: "/illustrations/services/training.webp",
    href: "/services/training"
  },
  {
    id: "advisory",
    title: "مشاوره و طراحی",
    desc:
      "بازطراحی معماری، انتخاب تکنولوژی مناسب، طرح توسعه و بهینه‌سازی هزینه و کارایی.",
    icon: "/illustrations/services/advisory.webp",
    href: "/services/advisory"
  },
];

/* رنگ 70٪ برای هر کارت خدمات (پایدار بر اساس ایندکس) */
const serviceTint = (i) =>
  i % 2 === 0 ? BRAND_TEAL : BRAND_AMBER;

/* -------------------- components -------------------- */

function VendorCard({ v }) {
  return (
    <Link
      href={v.href}
      className="group relative block rounded-3xl border border-slate-200/70 overflow-hidden hover:shadow-xl transition-all"
    >
      {/* کاور محو پشت زمینه */}
      <div className="absolute inset-0 opacity-[.22]">
        <Image
          src={v.cover}
          alt={`${v.name} cover`}
          fill
          sizes="(min-width:1024px) 33vw, 100vw"
          style={{ objectFit: "cover" }}
          priority={false}
        />
      </div>

      {/* لوگو سمت چپ کارت */}
      <div className="relative z-10 p-6 lg:p-8 flex items-center h-[136px]">
        <div className="relative w-[86px] h-[86px] rounded-2xl bg-white border border-slate-200/70 shadow-md mr-4">
          <Image
            src={v.logo}
            alt={`${v.name} logo`}
            fill
            sizes="120px"
            style={{ objectFit: "contain", padding: "14px" }}
          />
        </div>
      </div>
    </Link>
  );
}

function ServiceCard({ s, i }) {
  return (
    <div className="relative scribble-card p-6 lg:p-8">
      {/* پوشش رنگی 70% از رنگ برند */}
      <div
        className="scribble-tint"
        style={{ ["--scribble-color"]: serviceTint(i) }}
      />

      <div className="relative z-10 flex items-center gap-5">
        {/* آیکن (اختیاری) */}
        {s.icon ? (
          <div className="scribble-icon shrink-0">
            <Image
              src={s.icon}
              alt={s.title}
              width={56}
              height={56}
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : null}

        <h3 className="scribble-title text-xl sm:text-2xl text-slate-900">
          {s.title}
        </h3>
      </div>

      {s.desc ? (
        <p className="scribble-lead mt-4 text-[15px] sm:text-[16px]">
          {s.desc}
        </p>
      ) : null}

      {s.href ? (
        <div className="mt-6">
          <Link href={s.href} className="scribble-cta">
            <span>ادامه</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------- Page -------------------- */

export default function Home() {
  return (
    <>
      <Head>
        <title>ساتراس — زیرساخت، پشتیبانی و راهبری</title>
        <meta
          name="description"
          content="از مشاوره و طراحی تا اجرا، پایش و راهبریِ زیرساخت — کنار شما هستیم."
        />
      </Head>

      {/* Hero (بنر اصلی) */}
      <section className="relative bg-[#0B0D0F] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,.08),transparent_60%)]" />
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.15]">
            راهکارها و تجهیزات سازمانی با تمرکز بر کارایی و سادگی
          </h1>
          <p className="mt-6 text-slate-300 max-w-2xl">
            از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همیشه کنار شما هستیم.
          </p>

          <div className="mt-10 flex gap-4 flex-wrap">
            <Link
              href="/contact"
              className="rounded-full bg-amber-400 text-slate-900 px-6 py-3 font-extrabold hover:brightness-110 transition"
            >
              ارائه مشاوره
            </Link>
            <Link
              href="/tools"
              className="rounded-full border border-slate-600/50 px-6 py-3 hover:bg-white/5 transition"
            >
              مشاهده ابزارها
            </Link>
          </div>
        </div>
      </section>

      {/* Vendors / تجهیزات */}
      <section className="container mx-auto px-6 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900">
            تجهیزات
          </h2>
          <Link
            href="/products"
            className="text-sm text-slate-600 hover:text-slate-900 transition"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {VENDORS.map((v) => (
            <VendorCard key={v.slug} v={v} />
          ))}
        </div>
      </section>

      {/* Services / خدمات (Scribble) */}
      <section className="container mx-auto px-6 pb-16 lg:pb-24">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-6">
          خدمات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id || s.title} s={s} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}