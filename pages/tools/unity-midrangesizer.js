// pages/tools/unity-midrangesizer.js
import Head from "next/head";

export default function UnityMidrangeSizer() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>Unity MidrangeSizer | Satrass</title>
        <meta
          name="description"
          content="محاسبه ظرفیت و پیکربندی بهینه Unity"
        />
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        {/* تیتر وسط */}
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-6 text-center">
          Unity MidrangeSizer
        </h1>

        {/* قاب ماشین حساب */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-md">
          <iframe
            src="https://unitycalculator.onrender.com/"
            title="Unity MidrangeSizer"
            className="w-full"
            style={{ height: "calc(100vh - 200px)", border: 0 }}
          />
        </div>
      </section>
    </main>
  );
}