// pages/index.js
import { useState } from "react";

const LOGO_COLORS = ["var(--logo-teal)", "var(--logo-yellow)"];

function ServiceCard({ title, desc }) {
  const [border, setBorder] = useState("#e5e7eb"); // gray-200

  return (
    <div
      onMouseEnter={() =>
        setBorder(LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)])
      }
      onMouseLeave={() => setBorder("#e5e7eb")}
      className="p-5 bg-white border rounded-lg transition hover:shadow-md hover:-translate-y-[1px]"
      style={{ borderColor: border }}
    >
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-6">{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              زیرساخت هوشمند، با دقت مهندسی
            </h1>
            <p className="mt-4 text-gray-300">از مشاوره تا پشتیبانی، کنار شماییم.</p>

            <div className="mt-6 flex gap-3">
              <a
                href="/contact"
                className="rounded-full px-5 py-2.5 font-bold bg-amber-400 text-black hover:bg-amber-300 transition"
              >
                مشاوره رایگان
              </a>
              <a
                href="/tools"
                className="rounded-full px-5 py-2.5 font-semibold border border-amber-400 text-amber-400 hover:bg-amber-400/10 transition"
              >
                مشاهده ابزارها
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="/satrass-hero.png"
              alt="آواتار ساتراس"
              className="w-[280px] md:w-[340px] lg:w-[400px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-6xl mx-auto px-4 py-10 border-t border-black/10">
        <h2 className="text-2xl font-bold mb-6">خدمات ما</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "نصب و راه‌اندازی", desc: "استقرار سریع و بهینه‌ی تجهیزات با استانداردهای بین‌المللی" },
            { title: "تضمین کیفیت و پشتیبانی", desc: "پایش مداوم و SLA برای حفظ کارایی زیرساخت" },
            { title: "آموزش نیروها", desc: "کوچ به معماری‌های جدید با انتقال دانش واقعی" },
            { title: "تأمین تجهیزات", desc: "از برندهای معتبر با گارانتی معتبر" },
            { title: "مشاوره فنی", desc: "طراحی راهکار متناسب با بارکاری و بودجه" },
            { title: "نگهداشت دوره‌ای", desc: "PM، به‌روزرسانی، بهینه‌سازی و ظرفیت‌سنجی" },
          ].map((s, i) => (
            <ServiceCard key={i} title={s.title} desc={s.desc} />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">تماس با ما</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <form className="space-y-4">
            <input type="text" placeholder="نام" className="w-full p-2 border rounded" />
            <input type="email" placeholder="ایمیل" className="w-full p-2 border rounded" />
            <textarea placeholder="پیام شما" className="w-full p-2 border rounded h-28"></textarea>
            <button className="rounded px-4 py-2 font-semibold bg-amber-400 text-black hover:bg-amber-300 transition">
              ارسال پیام
            </button>
          </form>
          <div className="text-gray-700">
            <p>آدرس: تهران، میدان فاطمی، خیابان گلها، پلاک ۲۵</p>
            <p>تلفن: ۰۲۱-۸۸۰۶۶۲۲۱</p>
            <p>ایمیل: info@satrass.com</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p>© {new Date().getFullYear()} ساتراس، همه حقوق محفوظ است</p>
        </div>
      </footer>
    </main>
  );
}