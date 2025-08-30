// pages/products/[vendor].js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import vendorsData from "../../data/vendors";

// --- helpers
const lower = (s) => (typeof s === "string" ? s.toLowerCase() : "");
// اسلاگ یکدست: فقط حروف/اعداد؛ بقیه حذف می‌شوند (فاصله، خط تیره، ...)
const norm = (s) => lower(s).replace(/[^a-z0-9]+/g, "");

// --- SSG paths
export async function getStaticPaths() {
  const list = Array.isArray(vendorsData) ? vendorsData : [];
  const paths = list
    .map((v) => norm(v?.slug || v?.title || v?.name || ""))
    .filter(Boolean)
    .map((slug) => ({ params: { vendor: slug } }));

  return { paths, fallback: false };
}

// --- SSG props
export async function getStaticProps({ params }) {
  const all = Array.isArray(vendorsData) ? vendorsData : [];
  const req = norm(params?.vendor);

  const vendor = all.find(
    (v) => norm(v?.slug || v?.title || v?.name || "") === req
  );

  if (!vendor) return { notFound: true };

  return {
    props: {
      vendor: {
        title: vendor.title || vendor.name || vendor.slug || "",
        slug: norm(vendor.slug || vendor.title || vendor.name || ""),
        href: vendor.href || null,
        desc: vendor.desc || vendor.description || "",
        products: Array.isArray(vendor.products) ? vendor.products : [],
        artBase: norm(vendor.slug || vendor.title || vendor.name || ""),
      },
    },
  };
}

export default function VendorPage({ vendor }) {
  const { title, slug, desc, products, artBase } = vendor || {};

  // تصاویر (در صورت وجود)
  const logoPng = `/avatars/${slug}.png`;
  const logoWebp = `/avatars/${slug}.webp`;
  const artPng = `/brand-art/${artBase}.png`;
  const artWebp = `/brand-art/${artBase}.webp`;

  const items = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  return (
    <>
      <Head>
        <title>{title ? `${title} | Satrass` : "Vendor | Satrass"}</title>
        <meta name="description" content={desc || `${title} products`} />
      </Head>

      <main dir="rtl" className="min-h-screen">
        {/* هدر برند */}
        <section className="relative">
          <picture className="pointer-events-none select-none absolute inset-0">
            <source srcSet={artWebp} type="image/webp" />
            <img
              src={artPng}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-[.08]"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </picture>

          <div className="relative max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center gap-4">
              <picture>
                <source srcSet={logoWebp} type="image/webp" />
                <img
                  src={logoPng}
                  alt={title}
                  className="w-14 h-14 object-contain drop-shadow"
                  onError={(e) =>
                    (e.currentTarget.src = "/avatars/default.png")
                  }
                />
              </picture>

              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {title}
                </h1>
                {desc ? (
                  <p className="mt-1 text-slate-600">{desc}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* لیست محصولات */}
        <section className="max-w-6xl mx-auto px-4 pb-14">
          {items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-black/10 bg-white p-6 text-slate-700">
              محصولی برای این برند ثبت نشده است.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {items.map((p, idx) => {
                const title = p?.title || p?.name || `محصول ${idx + 1}`;
                const spec = p?.spec || p?.datasheet || p?.sheet || null;

                return (
                  <article
                    key={title + idx}
                    className="border bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>

                    {p?.brief ? (
                      <p className="mt-2 text-sm text-gray-600 leading-7">
                        {p.brief}
                      </p>
                    ) : null}

                    <div className="mt-6 flex items-center justify-center gap-6">
                      {/* Datasheet / Specsheet */}
                      {spec && (
                        <a
                          href={spec}
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
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-block text-brand-600 hover:opacity-90"
            >
              ← بازگشت به صفحهٔ اصلی
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}