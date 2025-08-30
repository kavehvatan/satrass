// pages/products/[vendor].js
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import vendors from "../../data/vendors"; // از همین آرایه‌ای که داری استفاده می‌کنیم

export default function VendorPage() {
  const router = useRouter();
  const { vendor: param } = router.query;

  // تا وقتی Router آماده نشده، چیزی رندر نکن که توی build ارور نخوره
  if (!router.isReady) return null;

  // پیدا کردن وندور بر اساس slug (با گارد کامل)
  const key = (param || "").toString().toLowerCase();
  const data = (Array.isArray(vendors) ? vendors : []).find((v) => {
    const s = (v?.slug || "").toString().toLowerCase();
    return s === key;
  });

  // اگر وندور پیدا نشد:
  if (!data) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-extrabold mb-4">برند پیدا نشد</h1>
        <p className="text-gray-600 mb-6">
          متأسفانه برند مورد نظر در لیست تجهیزات موجود نیست.
        </p>
        <Link href="/#vendors" className="btn btn-primary">بازگشت به تجهیزات</Link>
      </main>
    );
  }

  const slug = (data.slug || "").toLowerCase();
  const title = data.title || slug.toUpperCase();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* هدر برند با لوگو (webp → png → default) */}
      <div className="flex items-center gap-4 mb-8">
        <picture className="inline-block">
          <source srcSet={`/avatars/${slug}.webp`} type="image/webp" />
          <img
            src={`/avatars/${slug}.png`}
            alt={title}
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.src = "/avatars/default.png";
            }}
          />
        </picture>
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
      </div>

      {/* معرفی کوتاه اگر داشتی (اختیاری) */}
      {data.intro ? (
        <p className="text-gray-700 leading-8 mb-8 text-justify">{data.intro}</p>
      ) : null}

      {/* محصولات */}
      <div className="grid md:grid-cols-2 gap-6">
        {(data.products || []).map((p, idx) => (
          <article
            key={`${p.title || p.model || idx}`}
            className="border bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.title || p.model || ""}
                  width={120}
                  height={80}
                  className="rounded-lg object-contain bg-white"
                />
              ) : null}

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {p.title || p.model}
                </h2>
                {p.brand ? (
                  <div className="mt-1 text-sm text-gray-500">{p.brand}</div>
                ) : null}
              </div>
            </div>

            {p.desc ? (
              <p className="mt-4 text-gray-700 leading-7 text-justify">{p.desc}</p>
            ) : null}

            {/* دکمه‌ها – دقیقا همان استایل‌های قبلی */}
            <div className="mt-6 flex items-center justify-center gap-6">
              {/* Specsheet (اختیاری) */}
              {p.spec || p.specsheet ? (
                <a
                  href={p.spec || p.specsheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Specsheet
                </a>
              ) : null}

              {/* درخواست مشاوره */}
              <a href="/contact" className="btn btn-primary">
                درخواست مشاوره
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* برگشت به تجهیزات */}
      <div className="mt-10">
        <Link href="/#vendors" className="text-brand-600 hover:underline">
          ← بازگشت به تجهیزات
        </Link>
      </div>
    </main>
  );
}