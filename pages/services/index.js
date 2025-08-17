// pages/services/index.js
import Head from "next/head";
import Link from "next/link";
import FrameCard from "@/components/FrameCard";
import solutions from "@/data/solutions.json"; // دیتای قبلی «راهکارها» را همینجا نگه‌دار

export default function Services() {
  const items = Array.isArray(solutions?.items) ? solutions.items :
                Array.isArray(solutions) ? solutions : [];

  return (
    <>
      <Head>
        <title>راهکارها و نرم‌افزارها | ساتراس</title>
        <meta name="description" content="مجموعه راهکارها و نرم‌افزارهای سازمانی ساتراس" />
      </Head>

      <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold">راهکارها و نرم‌افزارها</h1>
          <p className="mt-4 text-slate-300">
            مجموعه‌ای از راهکارهای سازمانی و نرم‌افزارها با تمرکز بر پایداری، مقیاس‌پذیری و پشتیبانی.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <FrameCard key={i} className="p-6">
              <div className="flex items-start gap-4">
                {it.logo ? (
                  <img src={it.logo} alt={it.title || "logo"} className="h-10 w-auto object-contain mt-1" />
                ) : null}
                <div className="flex-1">
                  <h3 className="font-extrabold text-lg mb-1">{it.title || it.name}</h3>
                  {it.subtitle ? <p className="text-slate-500 text-sm mb-2">{it.subtitle}</p> : null}
                </div>
              </div>

              {it.description ? <p className="text-slate-600 leading-7 mt-4">{it.description}</p> : null}

              <div className="mt-5 flex gap-3">
                <Link href="/contact#contact" className="btn btn-primary">درخواست مشاوره</Link>
                {it.link ? <Link href={it.link} className="btn btn-outline">جزئیات</Link> : null}
              </div>
            </FrameCard>
          ))}
        </div>
      </main>
    </>
  );
}