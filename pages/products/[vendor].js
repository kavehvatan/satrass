// pages/products/[vendor].js
import { useRouter } from "next/router";

// تلاش برای لود JSON؛ اگر نبود، از fallback استفاده کن تا بیلد نخوابه
let vendorsData = {};
try {
  // مسیر صحیح برای pages/products/[vendor].js → ../../data/...
  vendorsData = require("../../data/vendors-detail.json");
} catch (e) {
  vendorsData = {
    // یک نمونه‌ی مینیمال تا صفحه‌ها بالا بیاد
    dell: {
      title: "Dell EMC",
      intro: "استوریج و سرورهای Dell EMC برای بارکاری‌ سازمانی.",
      items: []
    }
  };
}

export default function VendorPage() {
  const router = useRouter();
  const { vendor } = router.query;
  if (!vendor) return null;

  const data = vendorsData[vendor?.toLowerCase()];
  if (!data) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">برند پیدا نشد</h1>
      </div>
    );
  }

  const { title: pageTitle, intro, items } = data;

  return (
    <div dir="rtl" className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-center">
          <div className="flex justify-center">
            <picture>
              <source srcSet={`/avatars/${vendor}.webp`} type="image/webp" />
              <img
                src={`/avatars/${vendor}.png`}
                alt={`${pageTitle} logo`}
                width={130}
                height={40}
                className="h-10 w-auto object-contain"
                onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
              />
            </picture>
          </div>

          {intro ? (
            <p className="mt-6 mx-auto max-w-3xl text-slate-300 leading-8">
              {intro}
            </p>
          ) : null}
        </div>
      </header>

      {/* محصولات */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-8">{pageTitle}</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items?.map((p, idx) => (
            <div
              key={idx}
              className="border rounded-2xl p-6 hover:shadow-lg transition bg-white/80 backdrop-blur-sm flex flex-col"
            >
              <img
                src={p.image}
                alt={p.model}
                className="w-full h-40 object-contain mb-4"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h3 className="text-lg font-bold mb-2">{p.model}</h3>
              <p className="text-gray-700 text-sm flex-1">{p.desc}</p>

              <div className="mt-6 flex items-center justify-center gap-6">
                {/* Datasheet / Specsheet */}
                {p.specsheet && (
                  <a
                    href={p.specsheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Specsheet
                  </a>
                )}

                {/* مشاوره */}
                <a href="/contact" className="btn btn-primary">
                  درخواست مشاوره
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}