// pages/products/[vendor].js
import Head from "next/head";
import Link from "next/link";
import path from "path";
import fs from "fs";

export default function VendorPage({ vendor, items }) {
  // محافظت: اگر چیزی نباشد، پیام دوستانه بده
  if (!vendor) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">برند پیدا نشد</h1>
        <p className="text-gray-600 mb-6">
          برند درخواستی در دیتابیس ثبت نشده است.
        </p>
        <Link className="text-primary-600 hover:underline" href="/brands">
          بازگشت به برندها
        </Link>
      </div>
    );
  }

  const title = `${vendor} — تجهیزات`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="index,follow" />
      </Head>

      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">{vendor}</h1>
          <Link
            href="/"
            className="text-sm text-primary-600 hover:underline"
            aria-label="بازگشت به خانه"
          >
            بازگشت به خانه
          </Link>
        </div>

        {(!items || items.length === 0) ? (
          <div className="rounded-lg border p-6 text-gray-600">
            هنوز محصولی برای این برند ثبت نشده است.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <article
                key={p.id || `${vendor}-${i}`}
                className="flex flex-col h-full rounded-xl border bg-white p-5"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.model || p.title || vendor}
                    className="mb-4 h-28 w-full object-contain"
                    loading="lazy"
                  />
                )}

                <div className="mb-3">
                  <div className="text-xs text-gray-500">{p.brand || vendor}</div>
                  <h2 className="mt-1 text-lg font-bold">
                    {p.model || p.title || "بدون عنوان"}
                  </h2>
                </div>

                <p className="text-gray-700 text-sm leading-6 mb-4 line-clamp-4">
                  {p.desc || p.description || "—"}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  {p.pdf && (
                    <a
                      href={p.pdf}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Specsheet
                    </a>
                  )}
                  <Link
                    href="/#contact"
                    className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold hover:bg-amber-500"
                  >
                    درخواست مشاوره
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const file = path.join(process.cwd(), "data", "products.json");
  const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "{}";
  const data = JSON.parse(raw || "{}");

  // کلیدها را پایین‌حرفی کن تا با اسلاگ‌ها بخواند
  const slugs = Object.keys(data || {}).map((k) => k.toLowerCase());

  return {
    paths: slugs.map((slug) => ({ params: { vendor: slug } })),
    fallback: false, // فقط همین برندها
  };
}

export async function getStaticProps({ params }) {
  const file = path.join(process.cwd(), "data", "products.json");
  const raw = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "{}";
  const data = JSON.parse(raw || "{}");

  const slug = String(params.vendor || "").toLowerCase();

  // اجازه بده کلیدهای فایل هم پایین‌حرفی شوند
  const normalized = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k.toLowerCase(), v])
  );

  const items = Array.isArray(normalized[slug]) ? normalized[slug] : [];

  return {
    props: {
      vendor: items.length ? (items[0].brand || slug.toUpperCase()) : slug.toUpperCase(),
      items,
    },
  };
}