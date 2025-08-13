import Link from "next/link";

const SERVICES = [
  { slug: "deployment",  title: "نصب و راه‌اندازی",        desc: "استقرار سریع و استاندارد تجهیزات" },
  { slug: "support",     title: "تضمین کیفیت و پشتیبانی",  desc: "مانیتورینگ، SLA و پاسخ‌گویی" },
  { slug: "training",    title: "آموزش نیروها",            desc: "دوره‌های تخصصی و انتقال دانش" },
  { slug: "procurement", title: "تأمین تجهیزات",           desc: "از برندهای معتبر با اصالت" },
  { slug: "consulting",  title: "مشاوره فنی",              desc: "طراحی راهکار متناسب نیاز" },
  { slug: "maintenance", title: "نگهداشت دوره‌ای",         desc: "PM، بهینه‌سازی و ظرفیت‌سنجی" },
];

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between" dir="rtl">
        {/* منو — راست */}
        <nav className="order-2 flex items-center gap-6 text-[15px] md:text-[18px] lg:text-[19px] font-semibold text-gray-900">
          <Link href="/">خانه</Link>

          {/* Dropdown شیشه‌ای «خدمات» — باریک و ظریف، لیست عمودی */}
          <div className="relative group">
            <Link href="/services" className="inline-flex items-center">
              خدمات
              <span className="mr-1.5 hidden md:inline-block rotate-180 group-hover:rotate-0 transition">▾</span>
            </Link>

            {/* پنل شیشه‌ای کوچک */}
            <div
              className="invisible opacity-0 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto
                         transition duration-150 ease-out
                         absolute right-0 top-full mt-2 w-[min(92vw,340px)] z-[60]
                         translate-y-1 group-hover:translate-y-0"
            >
              <div className="rounded-xl border border-black/10 bg-white/35 backdrop-blur-md shadow-xl p-2">
                <ul className="divide-y divide-white/50">
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services#${s.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/60 transition"
                      >
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-400 ring-2 ring-teal-400/30 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                          <div className="text-xs text-gray-600 mt-0.5 leading-5">{s.desc}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="px-3 pt-2">
                  <Link href="/services" className="text-[12px] text-amber-600 font-semibold hover:underline">
                    مشاهده همهٔ خدمات →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/brands">برندها</Link>
          <Link href="/contact">تماس با ما</Link>
          <Link
            href="/tools"
            className="rounded-full border border-black/20 px-5 py-2.5 hover:bg-black/5"
          >
            ورود به ابزارها
          </Link>
        </nav>

        {/* لوگو — چپ */}
        <Link href="/" className="order-1 shrink-0">
          <img
            src="/logo-satrass.png?v=4"
            alt="Satrass"
            className="h-16 lg:h-20 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}