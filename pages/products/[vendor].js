// pages/products/[vendor].js
import { useRouter } from "next/router";
import vendors from "../../data/vendors";
import products from "../../data/products.json";
import Link from "next/link";

// دکمه مشاوره
function ConsultBtn() {
  return (
    <Link href="/contact" className="btn btn-primary">
      درخواست مشاوره
    </Link>
  );
}

export default function VendorPage() {
  const router = useRouter();
  const { vendor } = router.query;

  // پیدا کردن vendor در لیست
  const v = vendors.find(
    (x) => (x.slug || x.title || "").toLowerCase() === (vendor || "").toLowerCase()
  );

  if (!v) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-6">یافت نشد</h1>
        <p className="text-gray-600">برندی با این نام در سیستم موجود نیست.</p>
      </div>
    );
  }

  // محصولات مرتبط با این vendor
  const vendorProducts = products[v.slug] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8 text-center">{v.title}</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendorProducts.map((p, i) => (
          <div
            key={i}
            className="border rounded-2xl p-6 bg-white/70 backdrop-blur-sm shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-3">{p.name}</h2>
              {p.desc && <p className="text-gray-700 mb-4 text-sm">{p.desc}</p>}
            </div>

            {/* دکمه‌ها */}
            <div className="mt-6 flex items-center justify-center gap-6">
              {/* Specsheet اول */}
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

              {/* دکمه مشاوره */}
              <ConsultBtn />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}