// pages/products/[vendor].js
import Head from "next/head";
import Link from "next/link";
import fs from "fs";
import path from "path";

const TEAL = "#14b8a6";
const YELLOW = "#f4c21f";

export async function getStaticPaths() {
  const file = path.join(process.cwd(), "data", "products.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const paths = Object.keys(data).map((vendor) => ({ params: { vendor } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const file = path.join(process.cwd(), "data", "products.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const vendorData = data[params.vendor] || null;
  return { props: { vendor: params.vendor, vendorData } };
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
      <div className="text-sm text-gray-500">{item.vendor}</div>
      <h3 className="text-lg font-bold text-gray-900">{item.model || item.name}</h3>
      {item.desc && <p className="mt-2 text-gray-700 leading-7">{item.desc}</p>}
      <div className="mt-4 flex gap-3">
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

export default function VendorPage({ vendor, vendorData }) {
  if (!vendorData) return null;
  const title = vendorData.title || vendorData.name || vendor.toUpperCase();

  return (
    <>
      <Head><title>{title} — تجهیزات — ساتراس</title></Head>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[linear-gradient(135deg,#000_0%,#0a0a0a_60%,#111_100%)] text-white">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <nav className="text-sm text-white/70 mb-3">
              <Link href="/" className="hover:text-white/90">خانه</Link>
              <span className="mx-2">/</span>
              <a href="/#products" className="hover:text-white/90">تجهیزات</a>
              <span className="mx-2">/</span>
              <span className="text-white">{title}</span>
            </nav>

            <div className="flex items-center gap-4">
              <img
                src={`/avatars/${vendor}.png`}
                alt={title}
                className="w-12 h-12 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
            </div>

            {vendorData.intro && (
              <p className="mt-3 text-gray-300 max-w-3xl leading-7">{vendorData.intro}</p>
            )}
          </div>
        </section>

        {/* Grid محصولات */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          {(!vendorData.items || vendorData.items.length === 0) ? (
            <div className="rounded-xl border p-6 text-gray-600">
              هنوز محصولی برای این برند ثبت نشده. از فایل
              <code className="bg-gray-100 px-1 mx-1 rounded">data/products.json</code>
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