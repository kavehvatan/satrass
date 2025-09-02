// pages/tools/unity-midrangesizer.js
import Head from "next/head";

export default function UnityMidrangeSizer() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[linear-gradient(180deg,#0b0b0b_0%,#111_100%)] text-right"
    >
      <Head>
        <title>Unity MidrangeSizer | Satrass</title>
        <meta
          name="description"
          content="محاسبه ظرفیت و پیکربندی بهینه Unity"
        />
      </Head>

      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        {/* عنوان صفحه ابزار */}
        <h1 className="text-white/90 text-2xl md:text-3xl font-extrabold mb-5">
          Unity Midrange Sizer
        </h1>

        {/* قاب/کانتینر واسط برای iFrame */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* نوار بالایی شبیه اپ دسکتاپ */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 bg-slate-100">
            <span
              className="w-3 h-3 rounded-full bg-red-400"
              aria-hidden="true"
            />
            <span
              className="w-3 h-3 rounded-full bg-amber-400"
              aria-hidden="true"
            />
            <span
              className="w-3 h-3 rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            <span className="ms-3 text-[13px] text-slate-700 select-none">
              Midrange Sizer
            </span>
          </div>

          {/* بدنه پنل + iFrame */}
          <div className="p-2 md:p-4 bg-white">
            <iframe
              src="https://unitycalculator.onrender.com/"
              title="Unity Midrange Sizer"
              className="w-full rounded-xl bg-white"
              style={{ height: "calc(100vh - 240px)", border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* راهنمای لود شدن یا باز کردن در تب جدید */}
        <p className="text-slate-300 text-sm mt-4">
          اگر ابزار در اینجا نمایش داده نشد،{" "}
          <a
            href="https://unitycalculator.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            این لینک
          </a>{" "}
          را باز کنید.
        </p>
      </section>
    </main>
  );
}