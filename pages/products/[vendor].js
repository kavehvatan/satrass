// pages/products/[vendor].js
import fs from "fs";
import path from "path";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// --- خواندن JSON در زمان build
function readProducts() {
  const p = path.join(process.cwd(), "data", "products.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

// لوگوهای موجود در public/products/avatars/
// اگر برندی داخل این لیست نباشد، لوگو نشان داده نمی‌شود (یا می‌توانید default.png بگذارید)
const LOGO_FILES = {
  dell: "dell.png",
  hpe: "hpe.png",
  lenovo: "lenovo.png",
  juniper: "juniper.png",
  cisco: "cisco.png",
  fujitsu: "fujitsu.png",
  oracle: "oracle.png",
  quantum: "quantum.png",
  commvault: "commvault.png",
  netbackup: "netbackup.png",
};

export async function getStaticPaths() {
  const data = readProducts();
  const vendors = Object.keys(data || {});
  return {
    paths: vendors.map((v) => ({ params: { vendor: v } })),
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
  const intro =
    vendorData?.intro ||
    `استوریج و سرورهای ${title} برای بارکاری سازمانی با تمرکز بر کارایی، سادگی مدیریت و دسترس‌پذیری.`;
  const items = vendorData?.items || [];

  const logoFile = LOGO_FILES[slug] || null;
  const logoSrc = logoFile ? `/products/avatars/${logoFile}` : null;

  return (
    <>
      <Head>
        <title>{title} | تجهیزات</title>
        <meta name="robots" content="index,follow" />
        <meta name="description" content={`محصولات و تجهیزات ${title}`} />
      </Head>

      {/* هدر تیره با breadcrumb + تیتر و لوگو */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <nav className="text-sm text-slate-300 mb-3">
            <Link href="/" className="hover:text-white">
              خانه
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/products/dell" className="hover:text-white">
              تجهیزات
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">{title}</span>
          </nav>

          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {title}
            </h1>
            {logoSrc && (
              <Image
                src={logoSrc}
                alt={`${title} logo`}
                width={100}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            )}
          </div>

          {intro && (
            <p className="mt-3 text-slate-300 max-w-3xl leading-7">{intro}</p>
          )}
        </div>
      </section>

      {/* محتوای اصلی */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {!items.length ? (
          <div className="rounded-xl border border-gray-200 p-6 text-gray-600">
            هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-800">
              data/products.json
            </code>{" "}
            اضافه کن.
            <div className="mt-4">
              <Link
                href="/"
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, idx) => (
              <article
                key={`${slug}-${idx}`}
                className="h-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex h-full flex-col">
                  {/* تصویر محصول */}
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
                    {it.desc && (
                      <p className="mt-2 text-sm leading-7 text-gray-700">
                        {it.desc}
                      </p>
                    )}
                  </div>

                  {/* دکمه‌ها: هم‌تراز پایین کارت */}
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