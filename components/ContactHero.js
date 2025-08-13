// components/ContactHero.js
export default function ContactHero() {
  return (
    <section
      id="contact"
      className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 items-center gap-10" dir="rtl">
        {/* آواتار با هدست (SVG اینلاین) */}
        <div className="flex justify-center md:justify-start">
          <svg
            width="360"
            height="360"
            viewBox="0 0 360 360"
            className="w-[260px] md:w-[320px] h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#13b8a6" />
                <stop offset="1" stopColor="#0ea5a2" />
              </linearGradient>
            </defs>

            {/* بدن */}
            <rect x="115" y="170" rx="28" ry="28" width="130" height="140" fill="url(#g)" />
            <rect x="95" y="210" rx="18" ry="18" width="40" height="80" fill="#0ea5a2" />
            <rect x="225" y="210" rx="18" ry="18" width="40" height="80" fill="#0ea5a2" />
            {/* بوت‌ها */}
            <rect x="90" y="290" rx="12" width="55" height="28" fill="#f4c21f" />
            <rect x="215" y="290" rx="12" width="55" height="28" fill="#f4c21f" />

            {/* کلاه فضایی */}
            <circle cx="180" cy="140" r="86" fill="#0ea5a2" />
            <circle cx="180" cy="140" r="74" fill="#fff" />
            <circle cx="180" cy="140" r="66" fill="#0ea5a2" />

            {/* ویزور */}
            <rect x="130" y="112" width="100" height="56" rx="16" fill="#fff6e6" />

            {/* چشم‌ها (سبک لوگو) */}
            <circle cx="158" cy="140" r="6" fill="#1f2937" />
            <circle cx="202" cy="140" r="6" fill="#1f2937" />

            {/* تریم زرد دور کلاه */}
            <circle cx="180" cy="140" r="74" fill="none" stroke="#f4c21f" strokeWidth="6" opacity=".85" />

            {/* هدست */}
            <circle cx="106" cy="140" r="18" fill="#f4c21f" stroke="#0d9488" strokeWidth="4" />
            <path d="M 118 145 C 140 170, 150 168, 164 158" stroke="#f4c21f" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="168" cy="155" r="6" fill="#f4c21f" />

            {/* نشانه‌ی S روی سینه */}
            <path
              d="M150 210 h60 a8 8 0 0 1 0 16 h-44 a8 8 0 0 0 0 16 h48"
              stroke="#f4c21f"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="156" cy="242" r="4" fill="#f4c21f" />
            <circle cx="172" cy="242" r="4" fill="#f4c21f" />
          </svg>
        </div>

        {/* مانیتور بزرگ با اطلاعات تماس */}
        <div className="flex justify-center md:justify-start">
          <div className="text-gray-200">
            {/* بدنه مانیتور */}
            <div
              className="relative w-[320px] md:w-[440px] h-[220px] md:h-[260px] rounded-xl border border-white/10
                         bg-gradient-to-b from-neutral-900 to-neutral-950
                         shadow-[inset_0_0_24px_rgba(255,255,255,0.06)]"
            >
              <div className="absolute inset-0 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">Satrass — تماس با ما</h3>

                <ul className="space-y-2 text-sm md:text-base leading-7">
                  <li>
                    📍 آدرس:
                    <span className="mr-1">
                      ونک، ملاصدرا، شیراز جنوبی، خیابان وحدت، پلاک ۲، طبقه ۴
                    </span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=%D9%88%D9%86%DA%A9%D8%8C%20%D9%85%D9%84%D8%A7%D8%B5%D8%AF%D8%B1%D8%A7%D8%8C%20%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2%20%D8%AC%D9%86%D9%88%D8%A8%DB%8C%D8%8C%20%D8%AE%DB%8C%D8%A7%D9%86%20%D9%88%D8%AD%D8%AF%D8%AA%D8%8C%20%D9%BE%D9%84%D8%A7%DA%A9%202%D8%8C%20%D8%B7%D8%A8%D9%82%D9%87%204"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline"
                      title="مشاهده روی نقشه"
                    >
                      (نقشه)
                    </a>
                  </li>

                  <li>
                    ☎️ تلفن:{" "}
                    <a href="tel:+982188066022" className="text-amber-400 hover:underline" dir="ltr">
                      +98(۲۱۸۸۰۶۶۰۲۲)
                    </a>
                  </li>

                  <li>
                    ✉️ ایمیل:{" "}
                    <a href="mailto:info@satrass.com" className="text-amber-400 hover:underline">
                      info@satrass.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* پایه مانیتور */}
            <div className="w-32 md:w-40 h-3 bg-neutral-800 rounded-b-xl mx-auto mt-2" />
            <div className="w-48 md:w-56 h-2 bg-neutral-700 rounded mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}