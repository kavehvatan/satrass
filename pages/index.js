// pages/index.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import vendors from "../data/vendors";          // تجهیزات
import services from "../data/services.json";   // خدمات

/* === رنگ‌های برند (ثابت) === */
const BRAND_TEAL  = "#14b8a6";
const BRAND_AMBER = "#f4c21f";

/** رنگ یکنواخت کارت خدمات بر اساس ایندکس (پایدار و قابل‌پیش‌بینی) */
const serviceSolidBg = (i) => (i % 2 === 0 ? BRAND_TEAL : BRAND_AMBER);

export default function Home() {
  return (
    <>
      <Head>
        <title>ساتراس | راهکارها و تجهیزات زیرساخت</title>
        <meta
          name="description"
          content="ارائهٔ خدمات تخصصی زیرساخت، از مشاوره و طراحی تا نصب، پایش و راهبری؛ به‌همراه معرفی تجهیزات سازمانی."
        />
      </Head>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* هدر/هِرو */}
        <section className="mb-10">
          <div className="rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md ring-1 ring-slate-200/60 dark:ring-slate-700/50 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
                راهکارها و تجهیزات سازمانی با تمرکز بر کارایی و سادگی
              </h1>
              <p className="mt-4 text-slate-700/90 dark:text-slate-300">
                از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همراه شما هستیم.
              </p>

              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                <Link href="/tools" className="btn-brand">
                  ابزارها
                </Link>
                <Link href="/contact" className="btn-ghost">
                  ارائه مشاوره
                </Link>
              </div>
            </div>

            <div className="w-40 h-40 relative select-none">
              <Image
                alt="لوگو ساتراس"
                src="/logo-satrass.png"
                fill
                className="object-contain"
                sizes="160px"
                priority
              />
            </div>
          </div>
        </section>

        {/* تجهیزات */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              تجهیزات
            </h2>
            <Link
              href="/products"
              className="text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              مشاهده همه
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {vendors?.map((v) => {
              const logoSrc =
                v.logo ||
                (v.slug ? `/avatars/${v.slug}.webp` : "/avatars/default.png");
              const coverSrc = v.cover || `/covers/${v.slug || "default"}.webp`;

              return (
                <Link
                  key={v.slug || v.title}
                  href={v.href || `/products/${v.slug}`}
                  className="group relative block rounded-2xl overflow-hidden ring-1 ring-slate-200/70 dark:ring-slate-700/50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md hover:shadow-lg transition-all"
                >
                  {/* کاور کم‌رنگ */}
                  <div className="absolute inset-0">
                    <Image
                      src={coverSrc}
                      alt=""
                      fill
                      sizes="180px"
                      className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                  </div>

                  {/* لوگو */}
                  <div className="relative flex flex-col items-center justify-center p-6 h-28">
                    <div className="w-16 h-10 relative">
                      <Image
                        src={logoSrc}
                        alt={v.title || "brand"}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    {/* عنوان برند را نمایش نمی‌دهیم */}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* خدمات */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
            خدمات
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services?.items?.map((s, i) => {
              const bg = serviceSolidBg(i);
              const isLight = bg === BRAND_AMBER; // روی کهربایی متن تیره‌تر
              const titleColor = isLight ? "text-slate-900" : "text-white";
              const bodyColor = isLight ? "text-slate-800/90" : "text-white/90";
              const ringColor = isLight ? "ring-black/10" : "ring-white/20";

              return (
                <div
                  key={s.id || s.title || i}
                  className={`rounded-2xl p-6 md:p-7 ring-1 ${ringColor} transition-all`}
                  style={{ backgroundColor: bg }}
                >
                  {/* فقط عنوان — آیکون/دکمه حذف شد */}
                  <h3 className={`text-xl md:text-2xl font-extrabold mb-3 ${titleColor}`}>
                    {s.title}
                  </h3>

                  {/* توضیح سرویس */}
                  {s.desc && <p className={`leading-7 ${bodyColor}`}>{s.desc}</p>}

                  {/* لینک ادامه (اختیاری) */}
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

        {/* CTA پایانی */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-md ring-1 ring-slate-200/60 dark:ring-slate-700/50 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                برای انتخاب بهینه و استعلام، با ما در ارتباط باشید
              </h3>
              <p className="mt-2 text-slate-700/90 dark:text-slate-300">
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