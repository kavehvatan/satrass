// pages/tools/unity-configurator.js
import Head from "next/head";

export default function UnityConfigurator() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>Unity Configurator | Satrass</title>
        <meta
          name="description"
          content="طراحی و انتخاب پیکربندی مناسب برای خانواده Unity XT"
        />
      </Head>

      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8 md:py-10">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-6 text-center">
          Unity Configurator
        </h1>

        {/* قاب ماشین‌حساب */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-md">
          {/* موبایل: با اسکرول افقی */}
          <div className="relative w-full md:hidden overflow-x-auto">
            <iframe
              src="https://unity-configurator.onrender.com/"
              title="Unity Configurator"
              className="min-w-[700px] h-[80vh]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* دسکتاپ/تبلت: ارتفاع داینامیک مثل قبل */}
          <iframe
            src="https://unity-configurator.onrender.com/"
            title="Unity Configurator"
            className="hidden md:block w-full"
            style={{ height: "calc(100vh - 200px)", border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
    </main>
  );
}