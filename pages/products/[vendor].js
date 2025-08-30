// pages/products/[vendor].js
import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";

const cx = (...a) => a.filter(Boolean).join(" ");

/** دکمه «درخواست مشاوره» (استایل از globals.css) */
function ConsultBtn({ className = "" }) {
  return (
    <Link
      href="/contact#contact"
      prefetch={false}
      className={cx("btn btn-primary", className)}
    >
      درخواست مشاوره
    </Link>
  );
}

export default function VendorPage({ vendor, title, intro, items, theme }) {
  const pageTitle = title || vendor?.toUpperCase();
  const avatarSrc = `/avatars/${vendor}.png`;

  // نام تم: اول از JSON اگر باشد، وگرنه از خود vendor (dell/hpe/...)
  const themeName = theme || vendor;

  return (
    <div data-theme={themeName} className={`theme-${themeName}`}>
      <Head>
        <title>{pageTitle} | تجهیزات</title>
        <meta
          name="description"
          content={intro || `محصولات ${pageTitle} در ساتراس`}
        />
      </Head>

      {/* Hero */}
    <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
  <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-center">
    {/* ... breadcrumb همین بالا ... */}

    {/* فقط لوگو - وسط‌چین */}
    <div className="flex justify-center">
      <img
        src={avatarSrc}
        alt={`${pageTitle} logo`}
        width={130}
        height={40}
        className="h-10 w-auto object-contain"
        onError={(e) => { e.currentTarget.src = "/avatars/default.png"; }}
      />
    </div>

    {intro ? (
      <p className="mt-6 mx-auto max-w-3xl text-slate-300 leading-8">
        {intro}
      </p>
    ) : null}
  </div>
</header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {items && items.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => (
              <article
                key={`${vendor}-${i}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* تصویر محصول */}
                  {p.image ? (
                    <div className="mb-6 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.model || ""}
                        className="h-28 w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  {/* برند کوچک */}
                  <div className="text-xs text-slate-400">
                    {p.vendor || pageTitle}
                  </div>

                  {/* عنوان محصول */}
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {p.model}
                  </h3>

                  {/* توضیح */}
                  {p.desc ? (
                    <p className="mt-3 text-slate-600 leading-7">{p.desc}</p>
                  ) : null}

                  <div className="mt-auto" />

                  {/* دکمه‌ها */}
                  <div className="mt-6 flex items-center gap-3">
                    <ConsultBtn />
                    {p.specsheet ? (
                      <a
                        href={p.specsheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        Specsheet
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-slate-700">
              هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
              <code className="rounded bg-white px-2 py-1 text-slate-800">
                data/products.json
              </code>{" "}
              اضافه کن.
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------- SSG data layer ---------- */
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function getStaticPaths() {
  const all = readProducts();
  const vendors = Object.keys(all || {});
  const paths = vendors.map((v) => ({ params: { vendor: v } }));
  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  const vendor = String(ctx.params?.vendor || "").toLowerCase();
  const all = readProducts();
  const block = all[vendor] || {};

  const title = block.title || vendor.toUpperCase();
  const intro = block.intro || "";
  const items = Array.isArray(block.items) ? block.items : [];

  // تم از JSON (theme یا themeVendor) اگر ست شده؛ وگرنه از نام vendor
  const theme = block.theme || block.themeVendor || vendor;

  return { props: { vendor, title, intro, items, theme } };
}