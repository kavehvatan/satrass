// pages/products/[vendor].js
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import productsJSON from "../../data/products.json";

function prettyVendor(v) {
  const k = String(v || "").toLowerCase();
  const map = {
    dell: "DELL EMC",
    "dell emc": "DELL EMC",
    hpe: "HPE",
    lenovo: "Lenovo",
    cisco: "Cisco",
    fujitsu: "Fujitsu",
    juniper: "Juniper",
    oracle: "Oracle",
    quantum: "Quantum",
  };
  return map[k] || (k ? k.toUpperCase() : "");
}

function ProductCard({ title, subtitle, img, excerpt, specUrl }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* تصویر */}
      <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50">
        {img ? (
          <img
            src={img}
            alt={title || "محصول"}
            className="h-full object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="text-sm text-gray-400">No Image</div>
        )}
      </div>

      {/* عنوان و زیرعنوان */}
      <div className="mt-4">
        {subtitle ? (
          <div className="text-xs text-gray-500">{subtitle}</div>
        ) : null}
        <h3 className="mt-1 text-lg font-bold text-gray-900">
          {title || "—"}
        </h3>
      </div>

      {/* توضیحات با ارتفاع یکنواخت */}
      <p className="mt-3 min-h-[72px] md:min-h-[88px] text-sm leading-7 text-gray-700">
        {excerpt || ""}
      </p>

      {/* دکمه‌ها کف کارت */}
      <div className="mt-auto flex items-center gap-3 pt-4">
        <Link
          href="/#contact"
          className="inline-flex h-10 items-center rounded-full bg-amber-400 px-4 font-semibold text-black transition hover:bg-amber-300"
        >
          ارائه مشاوره
        </Link>

        {specUrl ? (
          <a
            href={specUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-full border border-gray-300 px-4 text-gray-700 transition hover:bg-gray-50"
          >
            Specsheet
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function VendorPage() {
  const { query } = useRouter();
  const vendor = (query.vendor || "").toString().toLowerCase();

  // خواندن ایمن از JSON
  const raw = productsJSON ? productsJSON[vendor] : null;
  const items = Array.isArray(raw) ? raw : [];

  return (
    <main className="min-h-screen" dir="rtl">
      <Head>
        <title>{prettyVendor(vendor)} | تجهیزات</title>
        <meta
          name="description"
          content={`محصولات و تجهیزات ${prettyVendor(
            vendor
          )} در ساتراس`}
        />
        <link
          rel="canonical"
          href={`https://satrass.onrender.com/products/${vendor}`}
        />
        <meta
          property="og:title"
          content={`${prettyVendor(vendor)} | تجهیزات`}
        />
        <meta
          property="og:description"
          content={`محصولات و تجهیزات ${prettyVendor(
            vendor
          )} در ساتراس`}
        />
      </Head>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">{prettyVendor(vendor)}</h1>
          <Link href="/products" className="text-sm text-teal-600 hover:text-teal-700">
            بازگشت
          </Link>
        </div>

        {/* گرید هم‌قد */}
        <div className="mt-6 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, idx) => (
            <ProductCard
              key={idx}
              title={it?.title || it?.name || ""}
              subtitle={it?.subtitle || it?.brand || ""}
              img={it?.img || it?.image || ""}
              excerpt={it?.excerpt || it?.desc || ""}
              specUrl={it?.specUrl || it?.spec || ""}
            />
          ))}
        </div>

        {!items.length && (
          <div className="mt-10 rounded-xl border border-dashed p-6 text-gray-500">
            هنوز محصولی برای این برند ثبت نشده. از
            <code className="mx-1 rounded bg-gray-100 px-2 py-1">
              data/products.json
            </code>
            اضافه کن.
          </div>
        )}
      </section>
    </main>
  );
}