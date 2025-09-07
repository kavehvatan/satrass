// pages/tools/unity-configurator.js
import Head from "next/head";

export default function UnityConfigurator() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#f8fafc] text-right">
      <Head>
        <title>Unity Configurator | Satrass</title>
        <meta
          name="description"
          content="ابزار محاسبه و پیکربندی Dell EMC Unity"
        />
      </Head>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-6 text-center">
          Unity Configurator
        </h1>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-md">
          <iframe
            src="https://unity-configurator.onrender.com/"
            title="Unity Configurator"
            className="w-full"
            style={{ height: "calc(100vh - 200px)", border: 0 }}
          />
        </div>
      </section>
    </main>
  );
}