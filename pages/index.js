// pages/index.js
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

/* -------------------- تنظیم رنگ‌ها -------------------- */
const BRAND_TEAL = "#14b8a6";   // فیروزه‌ای
const BRAND_AMBER = "#f4c21f";  // کهربایی
const LOGO_COLORS = ["#14b8a6", "#2d5bff"]; // برای هاله‌ی خیلی ملایم کارت تجهیزات

// 70% شفافیت به‌صورت هگز 8 رقمی (#RRGGBBAA) => AA = B3
const with70 = (hex) => `${hex}B3`;
const pickServiceColor = (i) => (i % 2 === 0 ? BRAND_TEAL : BRAND_AMBER);

/* -------------------- داده‌های وندورها -------------------- */
/** آرت‌ها و لوگوها را در:
 *  /public/brand-art/<slug>.webp | .png  (پس‌زمینه‌ی کارت)
 *  /public/avatars/<slug>.webp | .png   (لوگو)
 */
const VENDORS = [
  { title: "Dell EMC", slug: "dell", logo: "dell", art: "dell" },
  { title: "Cisco", slug: "cisco", logo: "cisco", art: "cisco" },
  { title: "HPE", slug: "hpe", logo: "hpe", art: "hpe" },
  { title: "Lenovo", slug: "lenovo", logo: "lenovo", art: "lenovo" },
  { title: "Quantum", slug: "quantum", logo: "quantum", art: "quantum" },
  { title: "Juniper", slug: "juniper", logo: "juniper", art: "juniper" },
];

/* -------------------- خواندن خدمات -------------------- */
// data/services.json باید ساختار { "items":[{ id,title,desc,href? }, ...] } داشته باشد.
import services from "../data/services.json";

/* ======================================================= */
/*                     کارت برند (تجهیزات)                */
/*  لوگو فقط سمت چپ؛ عنوان روی کارت نمایش داده نمی‌شود.   */
/* ======================================================= */
function BrandCard({ title, slug, index, logo = slug, art = slug }) {
  const webpLogo = `/avatars/${logo}.webp`;
  const pngLogo = `/avatars/${logo}.png`;
  const webpArt = `/brand-art/${art}.webp`;
  const pngArt = `/brand-art/${art}.png`;

  return (
    <Link href={`/products/${slug}`} className="group block">
      <div
        className="
          relative overflow-hidden rounded-2xl
          border border-slate-200 bg-white/70 supports-[backdrop-filter]:bg-white/35
          backdrop-blur-xl p-5 transition duration-200
          hover:-translate-y-0.5 hover:shadow-xl
          h-[152px]  // ارتفاع ثابت کارت (مثل قبل)
        "
      >
        {/* بک‌گراند کارتونی بسیار کم‌رنگ */}
        <picture className="pointer-events-none select-none absolute inset-0">
          <source srcSet={webpArt} type="image/webp" />
          <img
            src={pngArt}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-[1.12] opacity-[.12] md:opacity-[.14] contrast-110 saturate-110"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </picture>

        {/* هاله‌ی رنگی خیلی ملایم برای حس عمق (دلخواه) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(140% 120% at -10% -10%, ${
              LOGO_COLORS[index % LOGO_COLORS.length]
            }33 0%, transparent 60%)`,
          }}
        />

        {/* محتوا — فقط لوگو؛ LTR تا در RTL هم «چپ» بماند */}
        <div className="relative flex items-center gap-4" dir="ltr">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-white ring-1 ring-black/5 shadow-sm grid place-items-center transition-transform duration-200 group-hover:scale-[1.03] overflow-hidden">
            <picture>
              <source srcSet={webpLogo} type="image/webp" />
              <img
                src={pngLogo}
                alt={title}
                width={56}
                height={56}
                className="w-10 h-10 object-contain"
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
            </picture>
          </div>

          {/* عنوان را روی کارت نمایش نمی‌دهیم؛ فقط برای دسترس‌پذیری */}
          <span className="sr-only">{title}</span>
        </div>
      </div>
    </Link>
  );
}

/* ======================================================= */
/*                        کارت خدمات                      */
/*     پس‌زمینه‌ی کامل با رنگ برند (70% transparency)     */
/* ======================================================= */
function ServiceCard({ title, desc, href, index }) {
  const bg = with70(pickServiceColor(index));
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper {...wrapperProps} className="block">
      <div
        className="
          rounded-2xl p-6 md:p-8 transition hover:-translate-y-0.5 hover:shadow-xl
          text-slate-900
        "
        style={{ backgroundColor: bg }}
      >
        <h3 className="text-2xl font-extrabold mb-3">{title}</h3>
        {desc && <p className="leading-8 text-slate-900/80">{desc}</p>}
      </div>
    </Wrapper>
  );
}

/* ======================================================= */
/*                         صفحه اصلی                       */
/* ======================================================= */
export default function Home() {
  return (
    <>
      <Head>
        <title>ساتراس — راهکارها و تجهیزات</title>
        <meta
          name="description"
          content="از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همیشه کنار شما هستیم."
        />
      </Head>

      {/* Hero مشکی با دکمه‌ها */}
      <section className="bg-[linear-gradient(135deg,#000,#0a0a0f_60%,#111_100%)] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* متن */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15]">
                راهکارها و تجهیزات سازمانی با تمرکز بر کارایی و سادگی
              </h1>
              <p className="mt-4 text-slate-300">
                از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همیشه کنار شما هستیم.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact#contact"
                  className="
                    rounded-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold
                  "
                >
                  ارائه مشاوره
                </Link>
                <Link
                  href="/tools"
                  className="
                    rounded-full px-6 py-3 border border-teal-400/60 text-teal-300 hover:bg-teal-500/10
                  "
                >
                  مشاهده ابزارها
                </Link>
              </div>
            </div>

            {/* جای تصویر (اختیاری) */}
            <div className="text-slate-400/70 text-lg md:text-right">
              {/* اگر می‌خواهی تصویر بگذاری اینجا قرار بده */}
              تصویر هیرو ساتراس
            </div>
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
          تجهیزات
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VENDORS.map((v, i) => (
            <BrandCard key={v.slug} {...v} index={i} />
          ))}
        </div>
      </section>

      {/* خدمات */}
      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
          خدمات
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {Array.isArray(services?.items) &&
            services.items.map((s, i) => (
              <ServiceCard
                key={s.id || s.title || i}
                title={s.title}
                desc={s.desc}
                href={s.href}
                index={i}
              />
            ))}
        </div>
      </section>
    </>
  );
}