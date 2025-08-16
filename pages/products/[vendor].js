// pages/products/[vendor].js

import fs from "fs";
import path from "path";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

/* ----------------------------- helpers ----------------------------- */

// نرمال‌سازی اسلاگ برند (حروف کوچک، حذف فاصله/نشانه‌ها)
function slugify(v = "") {
  return String(v)
    .toLowerCase()
    .trim()
    .replace(/[\u200c\s\-_]+/g, "-") // فاصله و نیم‌فاصله و '_' را با خط تیره جایگزین کن
    .replace(/[^a-z0-9\-]/g, "") // بقیه نشانه‌ها حذف
    .replace(/\-+/g, "-");
}

// نام نمایشی برندها (اگر در products.json نباشد)
const FRIENDLY_VENDOR_NAMES = {
  dell: "Dell EMC",
  hpe: "HPE",
  cisco: "Cisco",
  lenovo: "Lenovo",
  juniper: "Juniper",
  oracle: "Oracle",
  fujitsu: "Fujitsu",
  quantum: "Quantum",
  netbackup: "Veritas NetBackup",
  commvault: "Commvault",
};

// لوگوها از public/avatars
const AVATAR_BASE = "/avatars";

// ساخت مسیر لوگو؛ در صورت نبودن، default.png
function buildLogoSrc(vendorSlug) {
  const candidates = [
    `${AVATAR_BASE}/${vendorSlug}.png`,
    `${AVATAR_BASE}/${vendorSlug}.svg`,
    `${AVATAR_BASE}/default.png`,
  ];
  return candidates[0]; // Next/Image به محض خطا، onError ما را اجرا می‌کند تا fallback بدهیم
}

/* ------------------------ read data/products.json ------------------------ */

function readProductsFile() {
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

/* ------------------------------ UI chunks ------------------------------ */

function SectionHeading({ trail, title, logoSrc }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {/* breadcrumbs */}
        <nav className="mb-4 text-sm text-slate-300">
          <Link href="/" className="hover:text-white">
            خانه
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:text-white">
            تجهیزات
          </Link>{" "}
          / <span className="text-slate-100">{trail}</span>
        </nav>

        {/* heading + logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {trail}
          </h1>

          {logoSrc ? (
            <div className="relative h-7 w-auto">
              <Image
                src={logoSrc}
                alt={`${trail} logo`}
                width={100}
                height={28}
                className="h-7 w-auto object-contain"
                priority
                unoptimized
                onError={(e) => {
                  // fallback به default.png در صورت خطا
                  const el = e.currentTarget;
                  const img = document.createElement("img");
                  img.src = `${AVATAR_BASE}/default.png`;
                  img.alt = `${trail} logo`;
                  img.className = el.className;
                  el.replaceWith(img);
                }}
              />
            </div>
          ) : null}
        </div>

        <p className="mt-3 max-w-3xl text-slate-300">
          استوریج و سرورهای {trail} برای بارکاری سازمانی با تمرکز بر سادگی مدیریت،
          کارایی و دسترس‌پذیری.
        </p>
      </div>
    </div>
  );
}

function ProductCard({ p }) {
  const imageSrc =
    p.image ||
    "/products/images/placeholder.webp"; // اگر تصویری در داده‌ها نیست، یک تصویر پیش‌فرض خودتان بگذارید
  const specHref = p.spec || p.specsheet || p.specSheet || null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
      {/* تصویر */}
      <div className="relative bg-slate-50">
        <Image
          src={imageSrc}
          alt={p.title || p.name || "product"}
          width={1200}
          height={400}
          className="h-44 w-full object-contain p-6"
          unoptimized
        />
      </div>

      {/* متن + دکمه‌ها */}
      <div className="flex h-full flex-col p-5">
        {/* vendor label کوچک */}
        {p.vendor ? (
          <div className="mb-1 text-xs text-slate-500">
            {FRIENDLY_VENDOR_NAMES[slugify(p.vendor)] || p.vendor}
          </div>
        ) : null}

        <h3 className="text-lg font-semibold text-slate-800">
          {p.title || p.name}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {p.excerpt || p.description || "—"}
        </p>

        <div className="mt-4 flex items-center gap-3">
          {specHref ? (
            <a
              href={specHref}
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
  );
}

/* ------------------------------ PAGE ------------------------------ */

export default function VendorPage({ vendorSlug, vendorTitle, products }) {
  const pageTitle = `${vendorTitle} | تجهیزات`;
  const logoSrc = buildLogoSrc(vendorSlug);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`محصولات و راهکارهای ${vendorTitle}؛ تمرکز بر سادگی مدیریت، کارایی و دسترس‌پذیری.`}
        />
        <meta name="robots" content="index,follow" />
      </Head>

      <SectionHeading trail={vendorTitle} logoSrc={logoSrc} />

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={`${p.vendor}-${p.title || p.name}`} p={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

/* -------------------------- data fetching (SSG) -------------------------- */

export async function getStaticPaths() {
  // مسیرها را از products.json می‌سازیم. اگر فایل نبود/خالی بود، هیچ مسیری برنمی‌گردانیم.
  const products = readProductsFile();
  const vendors = Array.from(
    new Set(
      products
        .map((p) => (p.vendor ? slugify(p.vendor) : null))
        .filter(Boolean)
    )
  );

  // اجازه‌ی ساخت صفحه‌های جدید در زمان اجرا
  return {
    paths: vendors.map((v) => ({ params: { vendor: v } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const requested = slugify(params?.vendor || "");
  const products = readProductsFile();

  const filtered = products.filter(
    (p) => slugify(p.vendor || "") === requested
  );

  // عنوان نمایشی
  const vendorTitle =
    FRIENDLY_VENDOR_NAMES[requested] ||
    (filtered[0]?.vendor
      ? filtered[0].vendor
      : requested.toUpperCase());

  return {
    props: {
      vendorSlug: requested,
      vendorTitle,
      products: filtered,
    },
    // اگر می‌خواهی صفحه‌ها پس از تغییر فایل به‌روز شوند:
    revalidate: 30,
  };
}