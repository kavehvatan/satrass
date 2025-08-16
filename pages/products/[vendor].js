// pages/products/[vendor].js
import fs from "fs";
import path from "path";
import Head from "next/head";
import Link from "next/link";

// ---------- helpers ----------
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

// «نرمالایز» برای تطبیق کلیدها
const normalize = (s = "") =>
  String(s).toLowerCase().replace(/[\s_-]+/g, "");

// نگاشت نام‌های مرسوم به کلید JSON
const ALIASES = {
  dellemc: "dell",
  "dell-emc": "dell",
  dell: "dell",
  hpe: "hpe",
  hp: "hpe",
  "hewlettpackard": "hpe",
  lenovo: "lenovo",
  cisco: "cisco",
  juniper: "juniper",
  oracle: "oracle",
  fujitsu: "fujitsu",
  quantum: "quantum",
};

// پیدا کردن کلید معتبر در JSON
function resolveKey(vendorSlug, keys) {
  const n = normalize(vendorSlug);
  // 1) اگر در ALIASES باشد
  if (ALIASES[vendorSlug]) return ALIASES[vendorSlug];
  if (ALIASES[n]) return ALIASES[n];

  // 2) تطبیق مستقیم
  let k = keys.find((k) => normalize(k) === n);
  if (k) return k;

  // 3) تطبیق حذف خط‌تیره/اسپیس
  k = keys.find((k) => normalize(k) === n);
  if (k) return k;

  // 4) برگرداندن همان اسلاگ (اگر هیچ نبود)
  return vendorSlug;
}

// ---------- page ----------
export default function VendorPage({ title, logoKey, items }) {
  const heroLogo = `/avatars/${logoKey}.png`;

  return (
    <>
      <Head>
        <title>{title} | محصولات</title>
        <meta
          name="description"
          content={`لیست محصولات و تجهیزات ${title} در ساتراس`}
        />
      </Head>

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          {/* فقط لوگو (بدون متن کنار لوگو) */}
          <img
            src={heroLogo}
            alt={`${title} logo`}
            className="mx-auto h-12 w-auto object-contain"
            loading="eager"
            decoding="async"
          />
          <p className="mt-6 text-slate-300">
            استوریج و سرورهای {title} برای بارکاری‌ سازمانی با تمرکز بر
            کارایی، سادگی مدیریت و دسترس‌پذیری.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-6 text-center text-slate-600">
            هنوز محصولی برای این برند ثبت نشده است. از فایل{" "}
            <code className="rounded bg-white px-2 py-0.5">data/products.json</code>{" "}
            اضافه کن.
            <div className="mt-3">
              <Link href="/" className="text-emerald-600 hover:underline">
                بازگشت به خانه
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, idx) => (
              <article
                key={idx}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-4">
                  <img
                    src={p.image}
                    alt={p.model}
                    className="mx-auto h-36 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="px-6 pb-6">
                  <div className="text-xs text-slate-500">{p.vendor}</div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {p.model}
                  </h3>

                  {/* توضیحات با ارتفاع ثابت تا دکمه‌ها هم‌راستا بمانند */}
                  <p className="mt-3 min-h-[84px] text-sm leading-6 text-slate-600">
                    {p.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <a
                      href={p.specsheet}
                      className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      target="_blank"
                      rel="noopener"
                    >
                      Specsheet
                    </a>
                    <Link
                      href="/#contact"
                      className="rounded-full bg-amber-500 px-4 py-1.5 text-sm text-white hover:bg-amber-600"
                    >
                      درخواست مشاوره
                    </Link>
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

// ---------- SSG ----------
export async function getStaticPaths() {
  const json = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const keys = Object.keys(json);

  // علاوه بر کلیدهای JSON، چند اسلاگ رایج را هم اضافه می‌کنیم
  const extra = ["dell-emc"];
  const all = Array.from(new Set([...keys, ...extra]));

  return {
    paths: all.map((k) => ({ params: { vendor: k } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));

  // تعیین کلید معتبر
  const vendorSlug = params.vendor || "";
  const keys = Object.keys(data);
  const resolved = resolveKey(vendorSlug, keys);

  // بخش مربوط به برند
  const section = data[resolved] || { title: resolved, items: [] };

  // کلید لوگو (برای public/avatars/<key>.png)
  const logoKey = resolveKey(resolved, keys);

  return {
    props: {
      title: section.title || resolved,
      logoKey,
      items: Array.isArray(section.items) ? section.items : [],
    },
  };
}