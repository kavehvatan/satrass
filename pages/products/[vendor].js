// pages/products/[vendor].js

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import productsData from "../../data/products.json";

// ---------- Helpers ----------
const toSlug = (s = "") =>
  String(s).trim().toLowerCase().replace(/\s+/g, "-");

const logoOf = (slug) => `/products/avatars/${slug}.png`;

const titleCase = (s = "") =>
  s
    .toString()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// ---------- Brand meta / copy ----------
const vendorExtras = {
  dell: {
    display: "Dell EMC",
    heroNote:
      "استوریج و سرورهای Dell EMC برای بارکاری سازمانی با تمرکز بر کارایی، سادگی مدیریت و دسترس‌پذیری.",
    logo: logoOf("dell"),
  },
  hpe: {
    display: "HPE",
    heroNote: "راهکارهای HPE برای دیتاسنترهای مقیاس‌پذیر و منعطف.",
    logo: logoOf("hpe"),
  },
  cisco: {
    display: "Cisco",
    heroNote: "شبکه و سوییچ/روترهای سازمانی سیسکو.",
    logo: logoOf("cisco"),
  },
  lenovo: {
    display: "Lenovo",
    heroNote: "زیرساخت‌های پایدار و اقتصادی لنوو برای سازمان‌ها.",
    logo: logoOf("lenovo"),
  },
  juniper: {
    display: "Juniper",
    heroNote: "شبکه‌های پرکارایی با محصول‌های Juniper.",
    logo: logoOf("juniper"),
  },
  oracle: {
    display: "Oracle",
    heroNote: "سرورها و راهکارهای اوراکل.",
    logo: logoOf("oracle"),
  },
  fujitsu: {
    display: "Fujitsu",
    heroNote: "زیرساخت‌های سازمانی فوجیتسو.",
    logo: logoOf("fujitsu"),
  },
  quantum: {
    display: "Quantum",
    heroNote: "بکاپ/آرشیو و ذخیره‌سازی کوانتوم.",
    logo: logoOf("quantum"),
  },
};

// ---------- Page component ----------
export default function VendorPage({ vendorSlug, meta, items }) {
  const pageTitle = `${meta.display} | تجهیزات`;
  const [logoSrc, setLogoSrc] = useState(
    meta.logo || "/products/avatars/default.png"
  );

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`محصولات و تجهیزات ${meta.display} — ساتراس`}
        />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* Hero / Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-4 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              خانه
            </Link>{" "}
            /{" "}
            <Link href="/products" className="hover:text-white">
              تجهیزات
            </Link>{" "}
            / <span className="text-white">{meta.display}</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold">
                {meta.display}
                <span className="inline-block">
                  <Image
                    src={logoSrc}
                    width={96}
                    height={30}
                    alt={meta.display}
                    className="object-contain"
                    onError={() =>
                      setLogoSrc("/products/avatars/default.png")
                    }
                    priority
                  />
                </span>
              </h1>
              {meta.heroNote && (
                <p className="mt-4 max-w-3xl leading-8 text-slate-300">
                  {meta.heroNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 p-6 text-center text-slate-600">
            هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
            <code className="mx-1 rounded bg-slate-100 px-2 py-1 text-slate-800">
              data/products.json
            </code>{" "}
            اضافه کن.
            <div className="mt-6">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <article
                key={p.id || `${p.vendor}-${p.model}`}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* product image */}
                <div className="relative mb-4 w-full overflow-hidden rounded-xl">
                  <Image
                    src={
                      p.image ||
                      "/products/images/default-product.png"
                    }
                    alt={p.title || p.model}
                    width={1200}
                    height={360}
                    className="h-40 w-full object-contain"
                  />
                </div>

                {/* brand small */}
                <div className="text-xs text-slate-500">{meta.display}</div>

                {/* title */}
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {p.title || p.model}
                </h3>

                {/* description */}
                {p.desc && (
                  <p className="mt-3 grow leading-7 text-slate-600">
                    {p.desc}
                  </p>
                )}

                {/* actions */}
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href="#contact"
                    className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                  >
                    درخواست مشاوره
                  </Link>

                  {p.pdf ? (
                    <Link
                      href={p.pdf}
                      target="_blank"
                      className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                    >
                      Specsheet
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed rounded-full px-4 py-2 text-sm text-slate-400 ring-1 ring-slate-200">
                      Specsheet
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// ---------- SSG ----------
export async function getStaticPaths() {
  // استخراج vendor های موجود از فایل داده‌ها
  const vendors = Array.from(
    new Set(
      (productsData || [])
        .map((p) => toSlug(p.vendor || ""))
        .filter(Boolean)
    )
  );

  const paths = vendors.map((v) => ({ params: { vendor: v } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const raw = params?.vendor || "";
  const vendorSlug = toSlug(raw);

  // فهرست محصولات این vendor
  const items =
    (productsData || []).filter(
      (p) => toSlug(p.vendor) === vendorSlug
    ) || [];

  // متای برند
  const metaBase = vendorExtras[vendorSlug] || {
    display: titleCase(vendorSlug),
    heroNote: "",
    logo: logoOf(vendorSlug),
  };

  return {
    props: {
      vendorSlug,
      meta: metaBase,
      items,
    },
    revalidate: 60, // ISR: هر ۶۰ ثانیه ریجنریت
  };
}