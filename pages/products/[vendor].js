// pages/products/[vendor].js
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

// اسلاگ‌ساز ساده
function slugify(x = "") {
  return String(x)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// برای هر کلید محصولات، چند اسلاگ هم‌معنی بساز:
// 1) خود اسلاگِ استاندارد، 2) اسلاگ بدون خط تیره، 3) کلمه‌ی اول
function variantsForKey(key = "") {
  const s = slugify(key);
  const noDash = s.replace(/-+/g, "");
  const first = s.split("-")[0] || s;
  return Array.from(new Set([s, noDash, first]));
}

// خواندن JSON محصولات
function readProducts() {
  const file = path.join(process.cwd(), "data", "products.json");
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw || "{}");
}

export async function getStaticPaths() {
  const data = readProducts();

  // دیکشنری اسلاگ -> کلید اصلی
  const map = new Map();
  Object.keys(data).forEach((key) => {
    variantsForKey(key).forEach((v) => {
      if (!map.has(v)) map.set(v, key);
    });
  });

  // همه‌ی اسلاگ‌ها به‌عنوان مسیرهای قابل ساخت
  const paths = Array.from(map.keys()).map((v) => ({ params: { vendor: v } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const data = readProducts();

  // دوباره همان نگاشت را بساز
  const map = new Map();
  Object.keys(data).forEach((key) => {
    variantsForKey(key).forEach((v) => {
      if (!map.has(v)) map.set(v, key);
    });
  });

  const key = map.get(slugify(params.vendor)) || null;
  const vendorData = key ? data[key] : null;

  return {
    props: {
      vendorTitle: key || params.vendor.toUpperCase(),
      vendorData: vendorData || { items: [] },
    },
  };
}

function ProductCard({ item }) {
  return (
    <article className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      {item.image && (
        <img
          src={item.image}
          alt={item.model || item.name}
          className="w-full h-36 object-contain mb-3"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
      {item.vendor && (
        <div className="text-sm text-gray-500">{item.vendor}</div>
      )}
      <h3 className="text-lg font-bold text-gray-900">
        {item.model || item.name || "Product"}
      </h3>
      {item.desc && <p className="mt-2 text-gray-700 leading-7">{item.desc}</p>}

      <div className="mt-4 flex flex-wrap gap-3">
        {item.specsheet && (
          <a
            href={item.specsheet}
            className="rounded-full px-4 py-2 text-sm font-semibold border border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Specsheet
          </a>
        )}
        <a
          href="/contact"
          className="rounded-full px-4 py-2 text-sm font-bold"
          style={{ backgroundColor: YELLOW, color: "#000" }}
        >
          درخواست مشاوره
        </a>
      </div>
    </article>
  );
}

export default function VendorPage({ vendorTitle, vendorData }) {
  const title = vendorData.title || vendorData.name || vendorTitle;

  return (
    <>
      <Head>
        <title>{title} — تجهیزات — ساتراس</title>
      </Head>

      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <nav className="text-sm text-white/70 mb-3">
              <Link href="/" className="hover:text-white/90">
                خانه
              </Link>
              <span className="mx-2">/</span>
              <a href="/#products" className="hover:text-white/90">
                تجهیزات
              </a>
              <span className="mx-2">/</span>
              <span className="text-white">{title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>

            {vendorData.intro && (
              <p className="mt-3 text-gray-300 max-w-3xl leading-7">
                {vendorData.intro}
              </p>
            )}
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          {!vendorData.items || vendorData.items.length === 0 ? (
            <div className="rounded-xl border p-6 text-gray-600">
              هنوز محصولی برای این برند ثبت نشده. از فایل{" "}
              <code className="bg-gray-100 px-1 mx-1 rounded">
                data/products.json
              </code>{" "}
              اضافه‌ش کن.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorData.items.map((it, idx) => (
                <ProductCard key={idx} item={it} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}