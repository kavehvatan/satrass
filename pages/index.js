// pages/index.js
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// دادهٔ وندورها از همان فایلی که خودت داری
import vendors from "../data/vendors"; // [{ slug:"dell", title:"Dell EMC" }, ...]
// دادهٔ خدمات/راهکارها از فایل JSON موجود
import services from "../data/services.json"; // { items: [{ slug,title,description,logo }, ...] }

const BRAND_COLORS = ["#00E5FF", "#2D5BFF"]; // رنگ‌های لوگوی ساتراس
const colorOf = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

// —————— کارت وندور (تجهیزات) ——————
function VendorCard({ slug, i = 0 }) {
  const logoSrc = `/avatars/${slug}.webp`;                 // لوگوی وندور
  const bgSrc = `/products/bg/${slug}.webp`;               // پس‌زمینه کارت (کارتونی/عکس)
  const tintA = "0.28";                                    // شدت رنگ‌ها (کمی پررنگ‌تر از قبل)
  const overlay = `linear-gradient(135deg, rgba(0,229,255,${tintA}), rgba(45,91,255,${tintA}))`;

  return (
    <Link
      href={`/products/${slug}`}
      className="group relative block rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
      style={{
        backgroundImage: `${overlay}, url('${bgSrc}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <div className="relative flex items-center justify-center h-40 sm:h-44 md:h-48 lg:h-52 p-4">
        {/* فقط لوگو، بدون اسم برند */}
        <Image
          src={logoSrc}
          alt={slug}
          width={200}
          height={90}
          className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,.35)]"
          priority={false}
        />
      </div>
    </Link>
  );
}

// —————— کارت فلیپ خدمات/راهکارها ——————
function ServiceFlipCard({ item, i }) {
  const [flipped, setFlipped] = useState(false);
  const frontTint = `linear-gradient(135deg, rgba(0,229,255,.14), rgba(45,91,255,.14))`;

  const handleToggle = () => setFlipped((v) => !v);

  return (
    <div
      className="flip-card cursor-pointer select-none"
      onClick={handleToggle} // موبایل/تاچ
    >
      <div
        className="flip-card-3d rounded-2xl border border-white/10 overflow-hidden shadow-sm"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front */}
        <div
          className="flip-front bg-white/5 backdrop-blur-sm p-5 flex flex-col items-start justify-between"
          style={{ backgroundImage: frontTint }}
        >
          <div className="flex items-center gap-3">
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.title}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : null}
            <h3 className="text-base md:text-lg font-semibold">{item.title}</h3>
          </div>
          <p className="mt-3 text-sm text-white/80 line-clamp-3">{item.description}</p>
          <div className="mt-4 text-xs text-white/60">(برای توضیحات بیشتر روی کارت بزنید)</div>
        </div>

        {/* Back */}
        <div className="flip-back bg-black/50 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-2">{item.title}</h4>
            <p className="text-sm leading-6 text-white/85">
              {item.long || item.description}
            </p>
          </div>

          <div className="mt-4">
            <Link
              href={item.href || `/services/${item.slug || ""}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              ادامهٔ مطلب
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// —————— صفحه اصلی ——————
export default function Home() {
  // دکمه‌های هیرو با تعویض رنگ
  const [swap, setSwap] = useState(false);
  const c1 = swap ? BRAND_COLORS[1] : BRAND_COLORS[0];
  const c2 = swap ? BRAND_COLORS[0] : BRAND_COLORS[1];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-10">
            راهکارهای زیرساخت، پشتیبان‌گیری و مرکز داده
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/80 leading-8">
            ساتراس در کنار شما برای طراحی، پیاده‌سازی و راهبری تجهیزات دیتاسنتر،
            استوریج، شبکه و نرم‌افزارهای پشتیبان‌گیری و بازیابی.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl font-semibold"
              style={{ backgroundColor: c1, color: "#00111A" }}
              onClick={() => setSwap((v) => !v)}
            >
              درخواست مشاوره
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl font-semibold"
              style={{ backgroundColor: c2, color: "#00111A" }}
              onClick={() => setSwap((v) => !v)}
            >
              تماس با ما
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2 flex items-center justify-center">
          <Image
            src="/satrass-hero.png"
            alt="Satrass Hero"
            width={520}
            height={520}
            className="w-72 sm:w-80 md:w-[420px] h-auto"
            priority
          />
        </div>
      </section>

      {/* تجهیزات */}
      <section className="mt-12 md:mt-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold">تجهیزات</h2>
          {/* اگر دکمه یا لینک خاصی نیاز بود، اینجا اضافه کن */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(vendors) &&
            vendors.map((v, i) => (
              <VendorCard key={v.slug || i} slug={v.slug} i={i} />
            ))}
        </div>
      </section>

      {/* راهکارها و نرم‌افزارها */}
      <section className="mt-14 md:mt-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold">راهکارها و نرم‌افزارها</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(services?.items) &&
            services.items.map((item, i) => (
              <ServiceFlipCard key={item.slug || item.title || i} item={item} i={i} />
            ))}
        </div>
      </section>
    </main>
  );
}