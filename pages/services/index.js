// pages/services/index.js
const SERVICES = [
  { slug: "deployment",  title: "نصب و راه‌اندازی",        desc: "استقرار سریع و استاندارد تجهیزات و سرویس‌ها" },
  { slug: "support",     title: "تضمین کیفیت و پشتیبانی",  desc: "SLA، مانیتورینگ، پاسخ‌گویی و عیب‌یابی" },
  { slug: "training",    title: "آموزش نیروها",            desc: "دوره‌های تخصصی و انتقال تجربه‌ی عملی" },
  { slug: "procurement", title: "تأمین تجهیزات",           desc: "تهیه از برندهای معتبر با اصالت و گارانتی" },
  { slug: "consulting",  title: "مشاوره فنی",              desc: "طراحی معماری، ظرفیت‌سنجی و مستندسازی" },
  { slug: "maintenance", title: "نگهداشت دوره‌ای",         desc: "PM منظم، به‌روزرسانی و بهینه‌سازی دوره‌ای" },
];

export default function Services() {
  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">خدمات ساتراس</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <a
              key={s.slug}
              id={s.slug}
              href={`#${s.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition
                         hover:-translate-y-[1px] relative overflow-hidden"
            >
              {/* نوار جانبی رنگی (کمی متفاوت از محصولات) */}
              <span
                className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 to-teal-400 rounded-r"
                aria-hidden="true"
              />
              <div className="pl-3">
                <h2 className="font-bold text-lg">{s.title}</h2>
                <p className="text-gray-600 text-sm leading-6 mt-2">{s.desc}</p>

                {/* چیپ‌های نمونه (اختیاری) */}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {["مشاوره", "پیاده‌سازی", "مستندسازی"].slice(0, (i % 3) + 1).map((t) => (
                    <span key={t} className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-6">
          برای هر خدمت، می‌تونیم صفحهٔ جزئیات و نمونه پروژه هم اضافه کنیم.
        </p>
      </section>
    </main>
  );
}