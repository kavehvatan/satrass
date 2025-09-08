// pages/tools/powerstore-configurator.js
import Head from "next/head";

const MOBILE_IFRAME_WIDTH = 1280; // در صورت نیاز 1400 یا 1500 کن

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

      <section className="max-w-7xl mx-auto px-2 sm:px-4 py-8 md:py-10">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-6 text-center">
          PowerStore Configurator
        </h1>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-md">
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

          {/* دسکتاپ/تبلت */}
          <iframe
            src="https://powerstoreconfigurator.onrender.com/"
            title="PowerStore Configurator"
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