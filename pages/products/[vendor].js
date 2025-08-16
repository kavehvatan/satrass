// pages/products/[vendor].js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import products from "../../data/products.json";

function prettyVendor(v) {
  const k = String(v || "").toLowerCase();
  const map = { dell: "DELL EMC", hpe: "HPE", lenovo: "Lenovo", cisco: "Cisco", fujitsu: "Fujitsu", juniper: "Juniper", oracle: "Oracle", quantum: "Quantum" };
  return map[k] || k.toUpperCase();
}

function ProductCard({ title, subtitle, img, excerpt, specUrl }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* تصویر */}
      <div className="h-40 w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt={title || "محصول"}
            className="h-full object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* عنوان و زیرعنوان */}
      <div className="mt-4">
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        <h3 className="font-bold text-gray-900 text-lg mt-1">{title}</h3>
      </div>

      {/* توضیحات: ارتفاع یکنواخت */}
      <p className="mt-3 text-sm leading-7 text-gray-700 min-h-[72px] md:min-h-[88px]">
        {excerpt}
      </p>

      {/* نوار دکمه‌ها: همیشه پایین کارت */}
      <div className="mt-auto pt-4 flex items-center gap-3">
        <Link
          href="/#contact"
          className="inline-flex h-10 items-center rounded-full bg-amber-400 px-4 font-semibold text-black hover:bg-amber-300 transition"
        >
          ارائه مشاوره
        </Link>

        {specUrl && (
          <a
            href={specUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full border border-gray-300 px-4 text-gray-700 hover:bg-gray-50 transition"
          >
            Specsheet
          </a>
        )}
      </div>
    </div>
  );
}

export default function VendorPage() {
  const { query } = useRouter();
  const vendor = (query.vendor || "").toString().toLowerCase();
  const items = (products && products[vendor]) || [];

  return (
    <main className="min-h-screen" dir="rtl">
      <Head>
        <title>{prettyVendor(vendor)} | تجهیزات</title>
        <meta name="description" content={`محصولات و تجهیزات ${prettyVendor(vendor)} در ساتراس`} />
        <link rel="canonical" href={`https://satrass.onrender.com/products/${vendor}`} />
        <meta property="og:title" content={`${prettyVendor(vendor)} | تجهیزات`} />
        <meta property="og:description" content={`محصولات و تجهیزات ${prettyVendor(vendor)} در ساتراس`} />
      </Head>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">{prettyVendor(vendor)}</h1>
          <Link href="/products" className="text-sm text-teal-600 hover:text-teal-700">
            بازگشت
          </Link>
        </div>

        {/* گرید: همه سلول‌ها هم‌ارتفاع و کارت‌ها یکدست */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch [grid-auto-rows:1fr]">
          {items.map((it, idx) => (
            <ProductCard key={idx} {...it} />
          ))}
        </div>

        {!items.length && (
          <div className="mt-10 rounded-xl border border-dashed p-6 text-gray-500">
            هنوز محصولی برای این برند ثبت نشده. از
            <code className="mx-1 rounded bg-gray-100 px-2 py-1">data/products.json</code>
            اضافه کن.
          </div>
        )}
      </section>
    </main>
  );
}