// pages/index.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import vendors from "../data/vendors";          // گرید تجهیزات
import services from "../data/services.json";   // لیست خدمات

/* رنگ‌های برند برای کارت خدمات (تمام‌سطح) */
const BRAND_TEAL  = "#14b8a6";
const BRAND_AMBER = "#f4c21f";
const serviceSolidBg = (i) => (i % 2 === 0 ? BRAND_TEAL : BRAND_AMBER);

export default function Home() {
  return (
    <>
      <Head>
        <title>ساتراس | راهکارها و تجهیزات سازمانی</title>
        <meta
          name="description"
          content="راهکارها و تجهیزات زیرساخت با تمرکز بر کارایی و سادگی. از مشاوره و طراحی تا اجرا، پایش و راهبری کنار شما هستیم."
        />
      </Head>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ——— Hero تیره ——— */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
            {/* پس‌زمینه‌ی تیره با گرادیان */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-slate-900 to-slate-800" />
            {/* کمی افکت نور */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />

            <div className="relative z-[1] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 text-white">
              {/* متن */}
              <div className="flex-1 text-center md:text-right">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2]">
                  راهکارها و تجهیزات سازمانی
                  <br className="hidden md:block" />
                  <span className="whitespace-nowrap"> با تمرکز بر کارایی و سادگی</span>
                </h1>
                <p className="mt-4 text-white/80">
                  از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همیشه کنار شما هستیم.
                </p>

                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                  <Link href="/contact" className="btn-brand">
                    درخواست مشاوره
                  </Link>
                  <Link href="/tools" className="btn-ghost">
                    ابزارها
                  </Link>
                </div>
              </div>

              {/* تصویر هرو (در صورت نبود فایل، آسیبی نمی‌زند) */}
              <div className="relative w-[260px] h-[200px] md:w-[320px] md:h-[240px] select-none">
                <Image
                  src="/hero-satrass.webp"
                  alt="تصویر هرو ساتراس"
                  fill
                  className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,.5)]"
                  sizes="(min-width: 768px) 320px, 260px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ——— تجهیزات ——— */}
        <section className="mb-14" id="vendors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">تجهیزات</h2>
            <Link
              href="/products"
              className="text-sm font-bold text-slate-700 hover:text-slate-900"
            >
              مشاهده همه
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {vendors?.map((v) => {
              const logoSrc =
                v.logo ||
                (v.slug ? `/avatars/${v.slug}.webp` : "/avatars/default.png");
              const cover = v.cover || `/covers/${v.slug || "default"}.webp`;

              return (
                <Link
                  key={v.slug || v.title}
                  href={v.href || `/products/${v.slug}`}
                  className="group relative block rounded-2xl overflow-hidden ring-1 ring-slate-200/70 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all"
                >
                  {/* پس‌زمینه‌ی کاور کم‌رنگ */}
                  <div className="absolute inset-0">
                    <Image
                      src={cover}
                      alt=""
                      fill
                      sizes="180px"
                      className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                  </div>

                  {/* فقط لوگو */}
                  <div className="relative flex h-28 items-center justify-center p-6">
                    <div className="relative w-16 h-10">
                      <Image
                        src={logoSrc}
                        alt={v.title || "brand"}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ——— خدمات (رنگ کامل، بدون آیکون) ——— */}
        <section className="mb-16" id="services">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">خدمات</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services?.items?.map((s, i) => {
              const bg = serviceSolidBg(i);                     // رنگ ثابت برای هر کارت
              const isLight = bg === BRAND_AMBER;               // روی آمبر متن تیره‌تر
              const titleColor = isLight ? "text-slate-900" : "text-white";
              const bodyColor  = isLight ? "text-slate-800/90" : "text-white/90";
              const ringColor  = isLight ? "ring-black/10" : "ring-white/20";

              return (
                <div
                  key={s.id || s.title || i}
                  className={`rounded-2xl p-6 md:p-7 ring-1 ${ringColor} transition-all`}
                  style={{ backgroundColor: bg }}
                >
                  <h3 className={`text-xl md:text-2xl font-extrabold mb-3 ${titleColor}`}>
                    {s.title}
                  </h3>

                  {s.desc && <p className={`leading-7 ${bodyColor}`}>{s.desc}</p>}

                  {s.href && (
                    <div className="mt-5">
                      <Link
                        href={s.href}
                        className={`inline-flex items-center gap-2 text-sm font-bold underline-offset-4 hover:underline ${
                          isLight ? "text-slate-900" : "text-white"
                        }`}
                      >
                        ادامه
                        <span aria-hidden>↗</span>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ——— CTA پایانی ——— */}
        <section className="mb-8">
          <div className="rounded-3xl bg-white/60 backdrop-blur-md ring-1 ring-slate-200/60 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
                برای انتخاب بهینه و استعلام، با ما در ارتباط باشید
              </h3>
              <p className="mt-2 text-slate-700/90">
                تیم ساتراس آمادهٔ ارائهٔ مشاوره و همراهی گام‌به‌گام است.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="btn-brand">
                تماس با ما
              </Link>
              <Link href="/warranty" className="btn-ghost">
                استعلام گارانتی
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}