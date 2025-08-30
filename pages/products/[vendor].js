// pages/products/[vendor].js
import { useRouter } from "next/router";
import vendors from "../../data/vendors";
import products from "../../data/products.json";
import Head from "next/head";

export default function VendorPage() {
  const router = useRouter();
  const { vendor } = router.query;

  const vendorInfo = vendors.find(
    (v) => v.slug.toLowerCase() === (vendor || "").toLowerCase()
  );

  const prods = products[vendorInfo?.slug] || [];

  if (!vendorInfo) {
    return <p className="p-6 text-center">Vendor not found</p>;
  }

  return (
    <>
      <Head>
        <title>{vendorInfo.title} | Satrass</title>
      </Head>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8">
          {vendorInfo.title}
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prods.map((p, i) => (
            <div
              key={i}
              className="border rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col"
            >
              <h2 className="text-xl font-bold mb-2">{p.name}</h2>
              <p className="text-gray-600 mb-4 flex-1">{p.desc}</p>

              {/* دکمه‌ها */}
              <div className="mt-6 flex items-center justify-center gap-6">
                {/* Datasheet / Specsheet */}
                {p.specsheet && (
                  <a
                    href={p.specsheet}
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
            </div>
          ))}
        </div>
      </main>
    </>
  );
}