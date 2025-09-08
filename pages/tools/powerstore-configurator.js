// pages/tools/powerstore-configurator.js
import Head from "next/head";

const MOBILE_IFRAME_WIDTH = 1280;

export default function PowerStoreConfigurator() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>PowerStore Configurator | Satrass</title>
        <meta
          name="description"
          content="انتخاب و پیکربندی کامل مدل‌های PowerStore"
        />
      </Head>

      {/* 🔹 بنر سرمه‌ای تیره */}
      <section className="bg-slate-900 text-white py-8 shadow-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            PowerStore Configurator
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            انتخاب و پیکربندی کامل مدل‌های PowerStore
          </p>
        </div>
      </section>

      {/* 🔹 iFrame فقط (بدون قاب سفید) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 md:py-10">
        {/* موبایل: اسکرول افقی */}
        <div
          className="relative w-full md:hidden overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="inline-block" style={{ width: MOBILE_IFRAME_WIDTH }}>
            <iframe
              src="https://powerstoreconfigurator.onrender.com/"
              title="PowerStore Configurator"
              className="block"
              style={{
                width: MOBILE_IFRAME_WIDTH,
                height: "80vh",
                border: 0,
              }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* دسکتاپ */}
        <iframe
          src="https://powerstoreconfigurator.onrender.com/"
          title="PowerStore Configurator"
          className="hidden md:block w-full"
          style={{ height: "calc(100vh - 200px)", border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </section>
    </main>
  );
}