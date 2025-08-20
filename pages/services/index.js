// pages/services/index.js
import Head from "next/head";
import Link from "next/link";
import solutions from "../../data/solutions.json";

function Card({ item, idx }) {
  const palettes = [
    "from-emerald-500/20 via-emerald-400/10 to-emerald-300/10",
    "from-sky-500/20 via-sky-400/10 to-sky-300/10",
    "from-fuchsia-500/20 via-fuchsia-400/10 to-fuchsia-300/10",
    "from-amber-500/20 via-amber-400/10 to-amber-300/10",
    "from-teal-500/20 via-teal-400/10 to-teal-300/10"
  ];
  const bg = palettes[idx % palettes.length];
  const href = item.url && item.url.trim() ? item.url : "/contact";
  const isInternal = href.startsWith("/");

  const Inner = (
    <article
      className={`
        group relative overflow-hidden rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-md
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
      `}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bg}`} />
      <div className="relative p-6 flex items-center gap-4">
        {item.logo && (
          <img
            src={item.logo}
            alt={item.title}
            className="h-12 w-12 object-contain rounded-lg ring-1 ring-white/10 bg-white/10"
          />
        )}
        <div>
          <h3 className="text-lg font-bold text-white/90 group-hover:text-white">
            {item.title}
          </h3>
          {item.desc && (
            <p className="mt-1 text-sm text-white/70 leading-6">
              {item.desc}
            </p>
          )}
        </div>
      </div>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-80 transition">
        <svg width="28" height="28" viewBox="0 0 24 24" className="text-white/70">
          <path fill="currentColor" d="M9 18l6-6l-6-6" />
        </svg>
      </div>
    </article>
  );

  return isInternal ? (
    <Link href={href} className="block">{Inner}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {Inner}
    </a>
  );
}

export default function ServicesIndex() {
  const items = Array.isArray(solutions?.items) ? solutions.items : [];

  return (
    <>
      <Head><title>راهکارها و نرم‌افزارها — ساتراس</title></Head>

      <section className="bg-[linear-gradient(135deg,#0b0f14_0%,#0e1217_60%,#11161d_100%)] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            راهکارها و نرم‌افزارها
          </h1>
          <p className="mt-3 text-white/80 max-w-3xl leading-7">
            مجموعه‌ای از محصولات نرم‌افزاری و راهکارهای منتخب ساتراس.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 text-white/80 p-6">
            هنوز آیتمی ثبت نشده. فایل
            <code className="mx-2 px-2 py-1 rounded bg-white/10">data/solutions.json</code>
            را پر کنید.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it, i) => <Card item={it} idx={i} key={i} />)}
          </div>
        )}
      </main>
    </>
  );
}