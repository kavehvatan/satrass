// pages/index.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// داده‌ها
import vendors from "../data/vendors";          // تجهیزات
import services from "../data/services.json";   // خدمات + (راهکارها ادغام شده)

const BRAND_TEAL  = "#14b8a6";
const BRAND_AMBER = "#f4c21f";

// رنگ پایدار کارت‌ها بر اساس ایندکس
const colorOf = (i) => (i % 2 === 0 ? BRAND_TEAL : BRAND_AMBER);

// تصویر پس‌زمینه‌ی واترمارک هر برند (اختیاری)
// (اگر فایل نبود، img لود نمی‌شود ولی کارت سالم می‌ماند)
const brandBg = (slug) => `/brand-bg/${slug}.webp`;

function BrandCard({ v, i }) {
  const slug =
    v.slug ||
    (v.id ? String(v.id).toLowerCase() : (v.name || v.title || "").toLowerCase());
  const href = v.href || `/products/${slug}`;

  return (
    <Link href={href} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur
                   transition-all hover:shadow-xl"
        style={{ boxShadow: "0 8px 24px rgba(2,6,23,.06)" }}
      >
        {/* واترمارک پس‌زمینه (کارتونی/محوشده) */}
        <picture aria-hidden className="pointer-events-none select-none">
          <source srcSet={brandBg(slug)} type="image/webp" />
          <img
            src={brandBg(slug).replace(".webp", ".png")}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25 group-hover:opacity-30
                       transition-opacity duration-300"
          />
        </picture>

        {/* گرادینت لطیف با یکی از رنگ‌های برند برای عمق بصری */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colorOf(i)}20, transparent 60%)`,
          }}
        />

        {/* محتوای کارت: فقط لوگو و آن هم سمت چپ */}
        <div className="relative flex items-center justify-start px-5 py-4 sm:px-6 sm:py-5">
          <picture>
            <source srcSet={`/avatars/${slug}.webp`} type="image/webp" />
            <img
              src={`/avatars/${slug}.png`}
              alt={v.name || v.title || slug}
              className="h-8 sm:h-9 w-auto"
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.12))" }}
            />
          </picture>
        </div>

        {/* حاشیه‌ی اکتیو با یکی از رنگ‌ها */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl border opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderColor: colorOf(i) }}
        />
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>ساتراس | زیرساخت، تجهیزات، راهکارها</title>
        <meta
          name="description"
          content="طراحی و پیاده‌سازی زیرساخت، فروش و تامین تجهیزات سازمانی، راهکارهای پشتیبان‌گیری و امنیت داده."
        />
      </Head>

      {/* بنر مشکی بالا */}
      <div className="bg-slate-900 text-slate-100 text-sm sm:text-base py-2 px-4 text-center">
        برای مشاوره رایگان با ما تماس بگیرید —{" "}
        <Link href="/contact" className="underline underline-offset-4">
          تماس با ما
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* هدر قهرمان */}
        <section className="py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900">
                طراحی و تامین زیرساخت‌های سازمانی
              </h1>
              <p className="text-slate-700/90 leading-8">
                از انتخاب تجهیزات تا پیاده‌سازی، پایش، آموزش و راهبری در کنار شما هستیم.
              </p>
              <div className="flex gap-3">
                <Link href="/tools" className="btn-brand">ابزارها</Link>
                <Link href="/contact" className="btn-ghost">ارائه مشاوره</Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/hero/infra.webp"
                alt=""
                width={960}
                height={640}
                className="w-full rounded-2xl shadow-lg"
                priority
              />
            </div>
          </div>
        </section>

        {/* تجهیزات (برندها) */}
        <section className="py-10 sm:py-12">
          <div className="mb-6 sm:mb-8 flex items-end justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">تجهیزات</h2>
            <Link href="/products" className="text-sm sm:text-base text-slate-600 hover:text-slate-900">
              مشاهده همه
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {(vendors || []).map((v, i) => (
              <BrandCard key={v.slug || v.id || v.title || i} v={v} i={i} />
            ))}
          </div>
        </section>

        {/* خدمات (ادغامِ راهکارها) */}
        <section className="py-10 sm:py-12">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">خدمات</h2>
            <p className="text-slate-700/80 mt-2">
              نصب و راه‌اندازی • پایش • آموزش • مشاوره و طراحی • راهبری — به‌همراه راهکارها و نرم‌افزارها
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(services?.items || []).map((s, i) => (
              <div
                key={s.id || s.title || i}
                className="rounded-2xl p-6 sm:p-7 text-slate-900 ring-1 ring-slate-200 shadow-sm hover:shadow-md transition-shadow"
                style={{
                  backgroundColor: colorOf(i), // زمینهٔ تک‌رنگ (درخواست شما)
                  color: "#0f172a",
                  backgroundImage: "none",
                }}
              >
                <h3 className="text-xl sm:text-2xl font-extrabold mb-3">{s.title}</h3>
                {s.description && (
                  <p className="leading-8 text-slate-900/90">{s.description}</p>
                )}
                {(s.href || s.link) && (
                  <div className="mt-5">
                    <Link
                      href={s.href || s.link}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-white/20"
                    >
                      جزئیات بیشتر <span aria-hidden>›</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* کالبک تماس پایین صفحه */}
        <section className="py-12 sm:py-16">
          <div className="rounded-2xl border border-slate-200 p-6 sm:p-10 text-center bg-white/70 backdrop-blur">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">سوالی دارید؟</h3>
            <p className="mt-3 text-slate-700/90">
              برای انتخاب راهکار مناسب، همین حالا با ما در تماس باشید.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/contact" className="btn-brand">تماس با ما</Link>
              <Link href="/warranty" className="btn-ghost">استعلام گارانتی</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}