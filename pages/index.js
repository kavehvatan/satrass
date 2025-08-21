// pages/index.js
import Link from "next/link";
import { useCallback } from "react";

// داده‌ها (بدون آلیاس)
import vendors from "../data/vendors";          // [{ slug,title,href,logo?,cover? }, ...]
import services from "../data/services.json";   // { items: [{ title, desc?, href? }, ...] }

const TEAL  = "#14b8a6";
const AMBER = "#f4c21f";

// رنگ یک‌درمیان برای کارت خدمات (تمام‌پُر)
const serviceBg = (i) => (i % 2 === 0 ? TEAL : AMBER);

// onError برای عکس‌ها تا به فالبک بروند
const useImgFallback = () =>
  useCallback((e, fallback) => {
    if (!e?.target) return;
    if (e.target.dataset.fallbackApplied) return;
    e.target.dataset.fallbackApplied = "1";
    e.target.src = fallback;
  }, []);

export default function HomePage() {
  const onLogoErr  = useImgFallback();
  const onCoverErr = useImgFallback();

  const VendorCard = ({ v }) => {
    // مسیرها: سعی می‌کنیم webp داشته باشیم؛ اگر نبود در onError به default می‌رویم
    const cover = v.cover || `/covers/${v.slug}.webp`;
    const logo  = v.logo  || `/avatars/${v.slug}.webp`;

    return (
      <Link
        href={v.href || `/products/${v.slug}`}
        className="group block"
        prefetch={false}
      >
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/60 hover:translate-y-1 hover:shadow-xl transition-all duration-300">
          {/* پس‌زمینهٔ سرور کم‌رنگ */}
          <img
            alt={`${v.title} cover`}
            src={cover}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            onError={(e) => onCoverErr(e, "/covers/fallback.webp")}
            draggable="false"
          />
          {/* واریانت شیشه‌ای خیلی ملایم بالای بک‌گراند */}
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{
            background: "radial-gradient(140% 120% at 10% 10%, rgba(20,184,166,.12) 0%, transparent 45%), radial-gradient(120% 140% at 90% 10%, rgba(244,194,31,.10) 0%, transparent 50%)"
          }}/>
          {/* محتوای کارت */}
          <div className="relative flex items-center justify-center px-6 py-14">
            {/* فقط لوگو داخل یک کپسول سفید */}
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/95 ring-1 ring-slate-900/5 shadow-sm flex items-center justify-center">
              <img
                alt={`${v.title} logo`}
                src={logo}
                className="max-h-10 max-w-12 object-contain"
                onError={(e) => onLogoErr(e, "/avatars/default.png")}
                draggable="false"
              />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const ServiceCard = ({ s, i }) => {
    const bg = serviceBg(i);
    return (
      <div
        className="rounded-2xl border border-slate-200/60 p-8 lg:p-10 shadow-sm hover:shadow-lg transition"
        style={{ background: bg }}
      >
        <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
          {s.title}
        </h3>
        {s.desc && (
          <p className="text-slate-900/90 leading-8">
            {s.desc}
          </p>
        )}
        {s.href && (
          <div className="mt-6">
            <Link
              href={s.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-slate-900 hover:bg-white transition"
              prefetch={false}
            >
              <span>ادامه</span>
              <span aria-hidden className="translate-y-[1px]">↗</span>
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      {/* هِرو */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14">
        <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
            {/* تصویر هِرو — اگر تصویر نداری، لوگو/پِلِیس‌هولدر */}
            <div className="flex items-center justify-center">
              <img
                src="/hero.webp"
                alt="تصویر هِرو ساتراس"
                className="max-h-40 sm:max-h-56 object-contain"
                onError={(e) => onCoverErr(e, "/logo.png")}
                draggable="false"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-snug">
                راهکارها و تجهیزات سازمانی با تمرکز بر کارایی و سادگی
              </h1>
              <p className="mt-4 text-slate-700">
                از مشاوره و طراحی تا اجرا، پایش و راهبری؛ همیشه کنار شما هستیم.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact#contact"
                  prefetch={false}
                  className="rounded-2xl bg-teal-500 hover:bg-teal-600 text-white px-5 py-3 transition"
                >
                  درخواست مشاوره
                </Link>
                <Link
                  href="/contact"
                  prefetch={false}
                  className="rounded-2xl border border-slate-300 hover:border-slate-400 text-slate-900 px-5 py-3 bg-white/80 transition"
                >
                  با ما تماس
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* تجهیزات */}
      <section id="vendors" className="container mx-auto max-w-6xl px-4 sm:px-6 mt-12 sm:mt-14">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">تجهیزات</h2>
          <Link href="/products" prefetch={false} className="text-teal-600 hover:text-teal-700">
            مشاهده همه
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {(vendors || []).slice(0, 5).map((v) => (
            <VendorCard key={v.slug || v.title} v={v} />
          ))}
        </div>
      </section>

      {/* خدمات */}
      <section id="services" className="container mx-auto max-w-6xl px-4 sm:px-6 mt-12 sm:mt-14 mb-16 sm:mb-24">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">خدمات</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {(services?.items || []).map((s, i) => (
            <ServiceCard key={s.id || s.title || i} s={s} i={i} />
          ))}
        </div>
      </section>
    </main>
  );
}