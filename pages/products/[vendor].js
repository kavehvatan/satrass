// pages/products/[vendor].js
import fs from "fs";
import path from "path";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// اگر data/brands.js را داری، از همان استفاده می‌کنیم.
// ساختار انتظار: export const BRAND_ALIASES = { dell: {title:"Dell EMC", vendorKey:"Dell EMC", logo:"dell"}, ... }
let BRAND_ALIASES = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  BRAND_ALIASES = require("../../data/brands").BRAND_ALIASES || {};
} catch (_) {}

const norm = (s = "") =>
  String(s).toLowerCase().trim().replace(/[\u200c\s\-_]+/g, "-");

// لوگوها در public/avatars
const logoSrc = (logoKey) => `/avatars/${logoKey}.png`;

// خواندن محصولات از data/products.json
function readProducts() {
  try {
    const file = path.join(process.cwd(), "data", "products.json");
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function VendorPage({ vendorTitle, logoKey, products }) {
  return (
    <>
      <Head>
        <title>{vendorTitle} | تجهیزات</title>
        <meta name="description" content={`محصولات و راهکارهای ${vendorTitle}`} />
      </Head>

      {/* هدر: فقط لوگو، بدون نام برند کنار آن */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <nav className="mb-5 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">خانه</Link> /{" "}
            <Link href="/products" className="hover:text-white">تجهیزات</Link> /{" "}
            <span className="text-slate-100">{vendorTitle}</span>
          </nav>

          {/* فقط لوگو (وسط/متناظر با نمایی که دوست داری) */}
          <div className="flex items-center justify-center">
            {logoKey ? (
              <>
                <span className="sr-only">{vendorTitle}</span>
                <Image
                  src={logoSrc(logoKey)}
                  alt={`${vendorTitle} logo`}
                  width={220}
                  height={60}
                  className="h-[44px] w-auto object-contain sm:h-[56px]"
                  priority
                  unoptimized
                  onError={(e) => {
                    const el = e.currentTarget;
                    const img = document.createElement("img");
                    img.src = "/avatars/default.png";
                    img.alt = `${vendorTitle} logo`;
                    img.className = el.className;
                    el.replaceWith(img);
                  }}
                />
              </>
            ) : null}
          </div>

          <p className="mt-4 max-w-3xl text-center mx-auto text-slate-300">
            استوریج و سرورهای {vendorTitle} برای بارکاری سازمانی با تمرکز بر سادگی مدیریت،
            کارایی و دسترس‌پذیری.
          </p>
        </div>
      </div>

      {/* بدنه: شبکهٔ کارت‌ها (چیدمان استاندارد؛ متن‌های فنی انگلیسی چپ‌چین) */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-700">
            هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
            <code className="rounded bg-white px-2 py-1 text-slate-800 shadow">
              data/products.json
            </code>{" "}
            اضافه کن.
            <div className="mt-3">
              <Link
                href="/"
                className="text-emerald-600 underline-offset-4 hover:underline"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-start">
            {products.map((p, i) => (
              <div
                key={`${p.vendor}-${p.title || p.name}-${i}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative bg-slate-50">
                  <Image
                    src={p.image || "/products/images/placeholder.webp"}
                    alt={p.title || p.name || "product"}
                    width={1200}
                    height={400}
                    className="h-44 w-full object-contain p-6"
                    unoptimized
                  />
                </div>

                <div className="flex h-full flex-col p-5">
                  {p.vendor ? (
                    <div className="mb-1 text-xs text-slate-500">{p.vendor}</div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-slate-800">
                    {p.title || p.name}
                  </h3>

                  {/* توضیحات فنی (اغلب انگلیسی) را چپ‌چین می‌کنیم */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 text-left" dir="ltr">
                    {p.excerpt || p.description || "—"}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    {p.spec || p.specsheet || p.specSheet ? (
                      <a
                        href={p.spec || p.specsheet || p.specSheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        Specsheets
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-400">
                        Specsheets
                      </span>
                    )}

                    <Link
                      href="/contact"
                      className="ml-auto inline-flex items-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
                    >
                      درخواست مشاوره
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const items = readProducts();
  const vendorKeys = Array.from(
    new Set(items.map((p) => p.vendor).filter(Boolean))
  );

  const aliasRoutes = Object.keys(BRAND_ALIASES);
  const paths =
    aliasRoutes.length > 0
      ? aliasRoutes.map((v) => ({ params: { vendor: v } }))
      : vendorKeys.map((v) => ({ params: { vendor: norm(v) } }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const route = String(params?.vendor || "").toLowerCase();

  // نگاشت alias → vendorKey/logo
  const alias = BRAND_ALIASES[route] || null;
  const vendorKey = alias?.vendorKey || route; // آنچه در products.json در فیلد vendor می‌آید
  const vendorTitle = alias?.title || vendorKey;
  const logoKey = alias?.logo || route;

  // فیلتر محصولات بر اساس vendorKey (با نرمال‌سازی)
  const items = readProducts();
  const products = items.filter(
    (p) => norm(p.vendor || "") === norm(vendorKey)
  );

  return {
    props: { vendorTitle, logoKey, products },
    revalidate: 30,
  };
}