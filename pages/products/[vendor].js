import fs from "fs";
import path from "path";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// خواندن JSON در build-time
function readProducts() {
  const p = path.join(process.cwd(), "data", "products.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

export async function getStaticPaths() {
  const data = readProducts();
  const vendors = Object.keys(data || {});
  return {
    paths: vendors.map((v) => ({ params: { vendor: v } })), // مثل /products/dell
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = readProducts();
  const slug = decodeURIComponent((params?.vendor || "").toLowerCase());
  const vendorData = data[slug] || null;

  return {
    props: {
      slug,
      vendorData, // { title, intro?, items: [] }
    },
  };
}

export default function VendorPage({ slug, vendorData }) {
  const title = vendorData?.title || slug.toUpperCase();
  const intro = vendorData?.intro || "";
  const items = vendorData?.items || [];

  return (
    <>
      <Head>
        <title>{title} | تجهیزات</title>
        <meta name="robots" content="index,follow" />
        <meta name="description" content={`محصولات و تجهیزات ${title}`} />
      </Head>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            بازگشت به خانه
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        {intro ? (
          <p className="text-gray-600 mb-8">{intro}</p>
        ) : (
          <div className="mb-6" />
        )}

        {!items.length ? (
          <div className="rounded-xl border border-gray-200 p-6 text-gray-600">
            هنوز محصولی برای این برند ثبت نشده است.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, idx) => (
              <article
                key={`${slug}-${idx}`}
                className="h-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col h-full">
                  {/* تصویر */}
                  {it.image && (
                    <div className="relative w-full h-40 sm:h-44 rounded-lg overflow-hidden bg-gray-50 ring-1 ring-gray-100">
                      <Image
                        src={it.image}
                        alt={it.model || ""}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={idx < 2}
                      />
                    </div>
                  )}

                  {/* متن */}
                  <div className="mt-4">
                    <div className="text-xs text-gray-500">{it.vendor}</div>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      {it.model}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-gray-700">
                      {it.desc}
                    </p>
                  </div>

                  {/* دکمه‌ها – هم‌تراز در یک خط پایین کارت */}
                  <div className="mt-auto flex items-center gap-3 pt-4">
                    <Link
                      href="/#contact"
                      className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 active:scale-[.98] transition"
                    >
                      درخواست مشاوره
                    </Link>

                    {it.specsheet && (
                      <Link
                        href={it.specsheet}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        Specsheet
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}