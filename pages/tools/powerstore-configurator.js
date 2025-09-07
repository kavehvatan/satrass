// pages/tools/powerstore-configurator.js
import Head from "next/head";

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

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-6 text-center">
          PowerStore Configurator
        </h1>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-md">
          <iframe
            src="https://powerstoreconfigurator.onrender.com/"
            title="PowerStore Configurator"
            className="w-full"
            style={{ height: "calc(100vh - 200px)", border: 0 }}
          />
        </div>
      </section>
    </main>
  );
}