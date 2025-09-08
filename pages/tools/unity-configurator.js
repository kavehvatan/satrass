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

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <h1 className="text-slate-800 text-2xl md:text-3xl font-extrabold mb-6 text-center">
          Unity Configurator
        </h1>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc] shadow-md">
          {/* موبایل: استفاده از نسبت ابعاد تا مچاله نشه */}
          <div
            className="relative w-full md:hidden"
            style={{ paddingBottom: "160%" }} /* اگر کم/زیاد بود 140% یا 180% کن */
          >
            <iframe
              src="https://unity-configurator.onrender.com/"
              title="Unity Configurator"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* تبلت/دسکتاپ: ارتفاع داینامیک مثل قبل */}
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