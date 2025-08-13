// pages/products/[brand].js
import Link from "next/link";
import { useRouter } from "next/router";

const CATALOG = {
  dell: {
    name: "Dell EMC",
    logo: "/avatars/dell.png",
    products: [
      { title: "PowerStore T", img: "/products/dell/powerstore-t.png", desc: "ذخیره‌ساز NVMe مدرن برای بارکاری‌های ترکیبی و مجازی‌سازی." },
      { title: "PowerStore X", img: "/products/dell/powerstore-x.png", desc: "مدل اپلاینس با AppsON برای اجرای VMها روی خود استوریج." },
      { title: "Unity XT 480/680", img: "/products/dell/unity-xt.png", desc: "میان‌رده چابک با فشرده‌سازی داده و Snapshot کارآمد." },
    ],
  },
  cisco: {
    name: "Cisco",
    logo: "/avatars/cisco.png",
    products: [
      { title: "Catalyst 9300", img: "/products/cisco/c9300.png", desc: "سوییچ لایه Access با امنیت پیشرفته و UPOE+." },
      { title: "Nexus 9000", img: "/products/cisco/n9k.png", desc: "هسته دیتا‌سنتر برای شبکه‌های Leaf-Spine با قابلیت‌های ACI." },
    ],
  },
  commvault: {
    name: "Commvault",
    logo: "/avatars/commvault.png",
    products: [
      { title: "Complete Backup & Recovery", img: "/products/commvault/complete.png", desc: "پلتفرم بکاپ و ریکاوری سازمانی با Dedup و Cloud Tiering." },
      { title: "Hyperscale X", img: "/products/commvault/hsx.png", desc: "راهکار Scale-out برای حفاظت مدرن از داده." },
    ],
  },
  netbackup: {
    name: "NetBackup",
    logo: "/avatars/netbackup.png",
    products: [
      { title: "NetBackup Appliance 5250", img: "/products/netbackup/5250.png", desc: "اپلاینس بکاپ یکپارچه با Dedup کارآمد." },
      { title: "NetBackup Flex", img: "/products/netbackup/flex.png", desc: "زیرساخت ماژولار برای سرویس‌دهی چندسازمانی." },
    ],
  },
  // hpe: { ... }  // هر وقت لوگو/محصولاتش رو داشتی اضافه کن
};

export default function BrandProducts() {
  const { query } = useRouter();
  const slug = String(query.brand || "");
  const brand = CATALOG[slug];

  if (!brand) {
    return (
      <main className="min-h-screen max-w-6xl mx-auto px-4 py-12">
        <p className="text-red-600 font-semibold mb-4">برندی با این نام پیدا نشد.</p>
        <Link href="/" className="text-amber-500 underline">بازگشت به صفحهٔ اصلی</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-4 py-10">
      {/* Header brand */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={brand.logo}
          alt={brand.name}
          className="w-12 h-12 object-contain"
          onError={(e)=>e.currentTarget.src="/avatars/default.png"}
        />
        <h1 className="text-3xl font-extrabold">{brand.name} — محصولات</h1>
      </div>

      {/* Product list */}
      <div className="space-y-6">
        {brand.products.map((p, i) => (
          <article key={i} className="flex items-center gap-5 border rounded-2xl p-5 bg-white hover:shadow-md transition">
            <img
              src={p.img}
              alt={p.title}
              className="w-24 h-24 object-contain shrink-0"
              onError={(e)=>e.currentTarget.src="/avatars/default.png"}
            />
            <div className="grow">
              <h2 className="text-xl font-bold">{p.title}</h2>
              <p className="text-gray-600 mt-1 leading-7">{p.desc}</p>
              {/* لینک محصول/کاتالوگ اگر داشتی */}
              {/* <a href="#" className="inline-block mt-3 text-amber-600 font-semibold">مشاهده بیشتر →</a> */}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/#products" className="inline-block text-amber-600 font-semibold">← بازگشت به محصولات</Link>
      </div>
    </main>
  );
}