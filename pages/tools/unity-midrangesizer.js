// pages/tools/unity-midrangesizer.js
import Head from "next/head";

export default function UnityMidrangeSizer() {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-right">
      <Head>
        <title>Unity MidrangeSizer | Satrass</title>
        <meta
          name="description"
          content="محاسبه ظرفیت و پیکربندی بهینه Unity"
        />
      </Head>

      <section className="max-w-5xl mx-auto px-4 py-8 md:py-10">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-4">
          Unity MidrangeSizer
        </h1>

        {/* قاب برای iFrame */}
        <div className="rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white">
          <iframe
            src="https://unitycalculator.onrender.com/"
            title="Unity MidrangeSizer"
            className="w-full"
            style={{ height: "calc(100vh - 220px)", border: 0 }}
          />
        </div>

        <p className="text-slate-600 text-sm mt-4">
          اگر ابزار در اینجا نمایش داده نشد،{" "}
          <a
            href="https://unitycalculator.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-800"
          >
            این لینک
          </a>{" "}
          را باز کنید.
        </p>
      </section>
    </main>
  );
}